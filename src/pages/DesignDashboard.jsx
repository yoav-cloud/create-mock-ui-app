import { useState, useEffect, useRef } from 'react'
import { Stage, Layer, Text, Rect, Circle } from 'react-konva'
import { useParams, useNavigate, useLocation, Routes, Route } from 'react-router-dom'
import toast from 'react-hot-toast'
import './DesignDashboard.css'
import designsData from '../data/designs.json'
import projectsData from '../data/projects.json'
import channelsData from '../data/channels.json'
import brandKitsData from '../data/brandKits.json'
import Button from '../components/Button'
import BackButton from '../components/BackButton'
import Modal from '../components/Modal'
import { useDesign } from '../context/DesignContext'
import { useProject } from '../context/ProjectContext'
import OneOffGeneration from './generation/OneOffGeneration'
import Generation from './generation/Generation'
import GenerationResults from './generation/GenerationResults'

function SubDesignItem({ subDesign, onUpdate, onNavigate }) {
  const { saveDesign } = useDesign()
  const [isEditingSubName, setIsEditingSubName] = useState(false)
  const [editedSubName, setEditedSubName] = useState(subDesign.name)

  useEffect(() => {
    setEditedSubName(subDesign.name)
  }, [subDesign.name])

  const handleSave = () => {
    if (editedSubName.trim() && editedSubName.trim() !== subDesign.name) {
      saveDesign(subDesign.id, {
        ...subDesign,
        name: editedSubName.trim(),
      })
      onUpdate()
    }
    setIsEditingSubName(false)
  }

  const handleCancel = () => {
    setEditedSubName(subDesign.name)
    setIsEditingSubName(false)
  }

  return (
    <div className="design-dashboard-subdesign-item">
      {isEditingSubName ? (
        <input
          type="text"
          className="design-dashboard-subdesign-name-input"
          value={editedSubName}
          onChange={(e) => setEditedSubName(e.target.value)}
          onBlur={handleSave}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              handleSave()
            } else if (e.key === 'Escape') {
              handleCancel()
            }
          }}
          autoFocus
          onClick={(e) => e.stopPropagation()}
        />
      ) : (
        <span
          className="design-dashboard-subdesign-name design-dashboard-subdesign-name-editable"
          onClick={(e) => {
            e.stopPropagation()
            setIsEditingSubName(true)
          }}
          title="Click to edit name"
        >
          {subDesign.name}
        </span>
      )}
      {subDesign.channelId && (
        <span className="design-dashboard-subdesign-channel">
          {channelsData.find((c) => c.id === subDesign.channelId)?.name || subDesign.channelId}
        </span>
      )}
      <div className="design-dashboard-subdesign-actions">
        <button
          className="design-dashboard-subdesign-action"
          onClick={(e) => {
            e.stopPropagation()
            onNavigate(`/designs/${subDesign.id}`)
          }}
          title="View dashboard"
        >
          📊
        </button>
        <button
          className="design-dashboard-subdesign-action"
          onClick={(e) => {
            e.stopPropagation()
            onNavigate(`/editor/${subDesign.id}`)
          }}
          title="Edit"
        >
          ✏️
        </button>
      </div>
    </div>
  )
}

function DesignDashboard() {
  const { designId } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const { getDesign, saveDesign, getSubDesigns, createSubDesign, getEffectiveLayers, designs } = useDesign()
  const { getProject } = useProject()
  const [design, setDesign] = useState(null)
  const [project, setProject] = useState(null)
  const [parentDesign, setParentDesign] = useState(null)
  const [isEditingName, setIsEditingName] = useState(false)
  const [editedName, setEditedName] = useState('')
  const [isCreateSubDesignModalOpen, setIsCreateSubDesignModalOpen] = useState(false)
  const [subDesignName, setSubDesignName] = useState('')
  const [selectedChannel, setSelectedChannel] = useState(null)
  const [userEnteredName, setUserEnteredName] = useState(false)
  const [subDesigns, setSubDesigns] = useState([])
  const [showParentInPreview, setShowParentInPreview] = useState(() => {
    // Load from sessionStorage or default to true
    const stored = sessionStorage.getItem(`include_parent_generation_${designId}`)
    return stored !== null ? stored === 'true' : true
  })
  const nameInputRef = useRef(null)
  
  // Save toggle state to sessionStorage when it changes
  useEffect(() => {
    if (designId) {
      sessionStorage.setItem(`include_parent_generation_${designId}`, showParentInPreview.toString())
    }
  }, [showParentInPreview, designId])

  useEffect(() => {
    // Check if we should open sub-design modal from navigation state
    if (location.state?.openSubDesignModal) {
      setIsCreateSubDesignModalOpen(true)
      setSubDesignName('')
      setSelectedChannel(null)
      setUserEnteredName(false)
      // Clear the state
      navigate(location.pathname, { replace: true })
    }
  }, [location.state, navigate])

  useEffect(() => {
    // First check saved designs in memory
    const savedDesign = getDesign(designId)
    
    if (savedDesign) {
      setDesign(savedDesign)
      setEditedName(savedDesign.name)
      if (savedDesign.projectId) {
        const foundProject = getProject(savedDesign.projectId) || 
          projectsData.find((p) => p.id === savedDesign.projectId)
        setProject(foundProject)
      }
      
      // Load sub-designs if this is a parent design
      if (!savedDesign.parentId) {
        const subs = getSubDesigns(designId)
        setSubDesigns(subs)
        setParentDesign(null)
      } else {
        // Load parent design if this is a sub-design
        const parent = getDesign(savedDesign.parentId)
        setParentDesign(parent)
        // Also load sibling sub-designs
        if (parent) {
          const siblings = getSubDesigns(savedDesign.parentId)
          setSubDesigns(siblings)
        }
      }
      return
    }

    // Fallback to static designs data
    let foundDesign = null
    let foundProject = null

    for (const [projectId, designs] of Object.entries(designsData)) {
      const d = designs.find((d) => d.id === designId)
      if (d) {
        foundDesign = d
        setEditedName(d.name)
        foundProject = getProject(projectId) || 
          projectsData.find((p) => p.id === projectId)
        break
      }
    }

    setDesign(foundDesign)
    setProject(foundProject)
    
    // Load sub-designs if this is a parent design
    if (foundDesign && !foundDesign.parentId) {
      const subs = getSubDesigns(designId)
      setSubDesigns(subs)
    }
    
    // Load parent design if this is a sub-design
    if (foundDesign && foundDesign.parentId) {
      const parent = getDesign(foundDesign.parentId)
      setParentDesign(parent)
      // Also load sibling sub-designs
      if (parent) {
        const siblings = getSubDesigns(foundDesign.parentId)
        setSubDesigns(siblings)
      }
    } else {
      setParentDesign(null)
    }
  }, [designId, getDesign, getProject, getSubDesigns, designs])

  const handleCreateSubDesign = () => {
    setIsCreateSubDesignModalOpen(true)
    setSubDesignName('')
    setSelectedChannel(null)
    setUserEnteredName(false)
  }

  const handleCloseSubDesignModal = () => {
    setIsCreateSubDesignModalOpen(false)
    setSubDesignName('')
    setSelectedChannel(null)
    setUserEnteredName(false)
  }

  const handleChannelChange = (channelId) => {
    setSelectedChannel(channelId)
    // Auto-fill name with channel name unless user has manually entered their own
    if (channelId) {
      const channel = channelsData.find((c) => c.id === channelId)
      if (channel) {
        // If user hasn't entered a custom name, or if current name matches a previous channel name, update it
        if (!userEnteredName) {
          setSubDesignName(channel.name)
        } else {
          // Check if current name matches any channel name - if so, user might want auto-update
          const matchesAnyChannel = channelsData.some((c) => c.name === subDesignName.trim())
          if (matchesAnyChannel) {
            // User's name matches a channel, so they probably want it to update
            setSubDesignName(channel.name)
            setUserEnteredName(false)
          }
        }
      }
    }
  }

  const handleNameChange = (e) => {
    const newValue = e.target.value
    setSubDesignName(newValue)
    // Mark that user has entered their own name if they type something different
    // Reset flag if they clear the field
    if (newValue.trim() === '') {
      setUserEnteredName(false)
    } else {
      // Check if current value matches any channel name
      const currentChannel = selectedChannel 
        ? channelsData.find((c) => c.id === selectedChannel)
        : null
      if (currentChannel && newValue.trim() !== currentChannel.name) {
        setUserEnteredName(true)
      }
    }
  }

  const handleSubmitSubDesign = (e) => {
    e.preventDefault()
    if (!subDesignName.trim()) return

    const newSubDesignId = createSubDesign(
      designId,
      subDesignName.trim(),
      selectedChannel || null
    )

    if (newSubDesignId) {
      toast.success(`Sub-design "${subDesignName.trim()}" created!`, { duration: 2000 })
      handleCloseSubDesignModal()
      // Refresh sub-designs list
      const subs = getSubDesigns(designId)
      setSubDesigns(subs)
      // Navigate to editor for the new sub-design
      navigate(`/editor/${newSubDesignId}`)
    }
  }

  const handleSubDesignClick = (subDesignId) => {
    navigate(`/designs/${subDesignId}`)
  }

  const handleNameEdit = () => {
    setIsEditingName(true)
    setEditedName(design.name)
    // Auto-select text after a brief delay to ensure input is focused
    setTimeout(() => {
      if (nameInputRef.current) {
        nameInputRef.current.select()
      }
    }, 0)
  }

  const handleNameSave = () => {
    if (editedName.trim() && editedName.trim() !== design.name) {
      const updatedDesign = {
        ...design,
        name: editedName.trim(),
      }
      saveDesign(designId, updatedDesign)
      setDesign(updatedDesign)
      toast.success('Design name updated!', { duration: 2000 })
    }
    setIsEditingName(false)
  }

  const handleNameCancel = () => {
    setEditedName(design.name)
    setIsEditingName(false)
  }

  const handleNameKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleNameSave()
    } else if (e.key === 'Escape') {
      handleNameCancel()
    }
  }

  if (!design) {
    return (
      <div className="design-dashboard">
        <div className="design-dashboard-error">
          <p>Design not found</p>
          <Button onClick={() => navigate('/')}>Back to Projects</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="design-dashboard">
      <div className="design-dashboard-header">
        <div>
          <BackButton to={project ? `/projects/${project.id}` : '/'} />
          {isEditingName ? (
            <input
              ref={nameInputRef}
              type="text"
              className="design-dashboard-title-input"
              value={editedName}
              onChange={(e) => setEditedName(e.target.value)}
              onBlur={handleNameSave}
              onKeyDown={handleNameKeyDown}
              autoFocus
            />
          ) : (
            <h1
              className="design-dashboard-title design-dashboard-title-editable"
              onClick={handleNameEdit}
              title="Click to edit name"
            >
              {design.name}
            </h1>
          )}
          {design.description && (
            <p className="design-dashboard-description">{design.description}</p>
          )}
        </div>
        <div className="design-dashboard-actions">
          {!design.parentId && (
            <Button variant="secondary" onClick={handleCreateSubDesign}>
              Create Sub-Design
            </Button>
          )}
          <Button
            variant="primary"
            onClick={() =>
              navigate(`/editor/${designId}`, {
                state: { projectId: design.projectId },
              })
            }
          >
            Edit Design
          </Button>
        </div>
      </div>

      <div className="design-dashboard-nav">
        <button
          className={`design-dashboard-nav-item ${
            !location.pathname.includes('/one-off') &&
            !location.pathname.includes('/generation') &&
            !location.pathname.includes('/results')
              ? 'active'
              : ''
          }`}
          onClick={() => navigate(`/designs/${designId}`)}
        >
          Overview
        </button>
        <button
          className={`design-dashboard-nav-item ${
            location.pathname.includes('/one-off') ? 'active' : ''
          }`}
          onClick={() => navigate(`/designs/${designId}/one-off`)}
        >
          One-off Generation
        </button>
        <button
          className={`design-dashboard-nav-item ${
            location.pathname.includes('/generation') &&
            !location.pathname.includes('/results') &&
            !location.pathname.includes('/one-off')
              ? 'active'
              : ''
          }`}
          onClick={() => navigate(`/designs/${designId}/generation`)}
        >
          Generation
        </button>
        <button
          className={`design-dashboard-nav-item ${
            location.pathname.includes('/results') ? 'active' : ''
          } ${!sessionStorage.getItem(`generation_started_${designId}`) ? 'disabled' : ''}`}
          onClick={() => {
            if (sessionStorage.getItem(`generation_started_${designId}`)) {
              navigate(`/designs/${designId}/generation/results`)
            }
          }}
          disabled={!sessionStorage.getItem(`generation_started_${designId}`)}
        >
          Generation Results
        </button>
      </div>

      <Routes>
        <Route
          path=""
          element={
            <div className="design-dashboard-content">
              <div className="design-dashboard-main">
                {(() => {
                  // Determine which design to show - always show parent if viewing a sub-design
                  const previewDesign = design.parentId ? parentDesign : design
                  const previewDesignId = design.parentId ? design.parentId : designId
                  
                  // Get sub-designs for the preview design (parent)
                  const previewSubDesigns = previewDesign && !previewDesign.parentId
                    ? getSubDesigns(previewDesignId)
                    : []
                  
                  const shouldShowNav = (!design.parentId && subDesigns.length > 0) || (design.parentId && previewSubDesigns.length > 0)
                  
                  if (!shouldShowNav) {
                    // No navigation needed, show regular preview
                    const displayLayers = design.parentId
                      ? getEffectiveLayers(designId)
                      : design.layers || []
                    const canvasWidth = design.canvasSize?.width || 800
                    const canvasHeight = design.canvasSize?.height || 600
                    
                    return (
                      <div className="design-preview">
                        {(() => {
                          const maxPreviewWidth = 800
                          const needsScaling = canvasWidth > maxPreviewWidth
                          const scale = needsScaling ? maxPreviewWidth / canvasWidth : 1
                          
                          return displayLayers.length > 0 ? (
                            <div className="design-preview-wrapper" style={{
                              width: needsScaling ? `${maxPreviewWidth}px` : '100%',
                              maxWidth: '100%'
                            }}>
                              <div style={{
                                width: canvasWidth,
                                height: canvasHeight,
                                transform: needsScaling ? `scale(${scale})` : 'none',
                                transformOrigin: 'top center',
                                margin: '0 auto'
                              }}>
                                <Stage
                                  width={canvasWidth}
                                  height={canvasHeight}
                                  className="design-preview-stage"
                                >
                                  <Layer>
                                    {displayLayers.map((layer) => {
                                      const commonProps = {
                                        key: layer.id,
                                        x: layer.x,
                                        y: layer.y,
                                      }
                                      
                                      switch (layer.type) {
                                        case 'text':
                                          return (
                                            <Text
                                              {...commonProps}
                                              text={layer.text}
                                              fontSize={layer.fontSize}
                                              fill={layer.fill}
                                            />
                                          )
                                        case 'rect':
                                          return (
                                            <Rect
                                              {...commonProps}
                                              width={layer.width}
                                              height={layer.height}
                                              fill={layer.fill}
                                              stroke={layer.stroke}
                                              strokeWidth={layer.strokeWidth}
                                            />
                                          )
                                        case 'circle':
                                          return (
                                            <Circle
                                              {...commonProps}
                                              radius={layer.radius}
                                              fill={layer.fill}
                                              stroke={layer.stroke}
                                              strokeWidth={layer.strokeWidth}
                                            />
                                          )
                                        default:
                                          return null
                                      }
                                    })}
                                  </Layer>
                                </Stage>
                              </div>
                            </div>
                          ) : (
                            <div className="design-preview-placeholder">
                              <p>Design Preview</p>
                              <span className="design-preview-hint">
                                {displayLayers.length === 0
                                  ? 'This design has no elements yet. Click Edit to add content.'
                                  : 'Design canvas will appear here'}
                              </span>
                            </div>
                          )
                        })()}
                      </div>
                    )
                  }
                  
                  // Show navigation and parent preview
                  const displayLayers = previewDesign?.layers || []
                  const canvasWidth = previewDesign?.canvasSize?.width || 800
                  const canvasHeight = previewDesign?.canvasSize?.height || 600
                  
                  return (
                    <>
                      <div className="design-dashboard-subnav">
                        {(() => {
                          if (!design.parentId && subDesigns.length > 0) {
                            // Viewing parent - show parent first (if toggle is on), then sub-designs
                            return (
                              <>
                                <button
                                  className="design-dashboard-subnav-item active"
                                  title={design.name}
                                >
                                  {design.name}
                                </button>
                                <div className="design-dashboard-subnav-siblings">
                                  {subDesigns.map((sub) => (
                                    <button
                                      key={sub.id}
                                      className="design-dashboard-subnav-item"
                                      onClick={() => navigate(`/designs/${sub.id}`)}
                                      title={sub.name}
                                    >
                                      {sub.name}
                                    </button>
                                  ))}
                                </div>
                              </>
                            )
                          } else if (design.parentId && previewDesign) {
                            // Viewing sub-design - show parent first, then all siblings
                            return (
                              <>
                                <button
                                  className="design-dashboard-subnav-item active"
                                  onClick={() => navigate(`/designs/${design.parentId}`)}
                                  title={`Parent: ${previewDesign.name}`}
                                >
                                  {previewDesign.name}
                                </button>
                                {previewSubDesigns.length > 0 && (
                                  <div className="design-dashboard-subnav-siblings">
                                    {previewSubDesigns.map((sub) => (
                                      <button
                                        key={sub.id}
                                        className={`design-dashboard-subnav-item ${
                                          sub.id === designId ? 'active' : ''
                                        }`}
                                        onClick={() => navigate(`/designs/${sub.id}`)}
                                        title={sub.name}
                                      >
                                        {sub.name}
                                      </button>
                                    ))}
                                  </div>
                                )}
                              </>
                            )
                          }
                          return null
                        })()}
                      </div>
                      <div className="design-preview">
                        {(() => {
                          const maxPreviewWidth = 800
                          const needsScaling = canvasWidth > maxPreviewWidth
                          const scale = needsScaling ? maxPreviewWidth / canvasWidth : 1
                          
                          return displayLayers.length > 0 ? (
                            <div className="design-preview-wrapper" style={{
                              width: needsScaling ? `${maxPreviewWidth}px` : '100%',
                              maxWidth: '100%'
                            }}>
                              <div style={{
                                width: canvasWidth,
                                height: canvasHeight,
                                transform: needsScaling ? `scale(${scale})` : 'none',
                                transformOrigin: 'top center',
                                margin: '0 auto'
                              }}>
                                <Stage
                                  width={canvasWidth}
                                  height={canvasHeight}
                                  className="design-preview-stage"
                                >
                                  <Layer>
                                    {displayLayers.map((layer) => {
                                      const commonProps = {
                                        key: layer.id,
                                        x: layer.x,
                                        y: layer.y,
                                      }
                                      
                                      switch (layer.type) {
                                        case 'text':
                                          return (
                                            <Text
                                              {...commonProps}
                                              text={layer.text}
                                              fontSize={layer.fontSize}
                                              fill={layer.fill}
                                            />
                                          )
                                        case 'rect':
                                          return (
                                            <Rect
                                              {...commonProps}
                                              width={layer.width}
                                              height={layer.height}
                                              fill={layer.fill}
                                              stroke={layer.stroke}
                                              strokeWidth={layer.strokeWidth}
                                            />
                                          )
                                        case 'circle':
                                          return (
                                            <Circle
                                              {...commonProps}
                                              radius={layer.radius}
                                              fill={layer.fill}
                                              stroke={layer.stroke}
                                              strokeWidth={layer.strokeWidth}
                                            />
                                          )
                                        default:
                                          return null
                                      }
                                    })}
                                  </Layer>
                                </Stage>
                              </div>
                            </div>
                          ) : (
                            <div className="design-preview-placeholder">
                              <p>Design Preview</p>
                              <span className="design-preview-hint">
                                {displayLayers.length === 0
                                  ? 'This design has no elements yet. Click Edit to add content.'
                                  : 'Design canvas will appear here'}
                              </span>
                            </div>
                          )
                        })()}
                      </div>
                    </>
                  )
                })()}
              </div>

              <div className="design-dashboard-sidebar">
                <div className="design-dashboard-section">
                  <h3 className="design-dashboard-section-title">Details</h3>
                  <div className="design-dashboard-info">
                    {project && (
                      <div className="design-dashboard-info-item">
                        <span className="design-dashboard-info-label">
                          Project
                        </span>
                        <span className="design-dashboard-info-value">
                          {project.name}
                        </span>
                      </div>
                    )}
                    {!design.parentId && (
                      <div className="design-dashboard-info-item">
                        <span className="design-dashboard-info-label">
                          Sub-Designs
                        </span>
                        <span className="design-dashboard-info-value">
                          {subDesigns.length}
                        </span>
                      </div>
                    )}
                    {design.parentId && (
                      <div className="design-dashboard-info-item">
                        <span className="design-dashboard-info-label">
                          Parent Design
                        </span>
                        <span className="design-dashboard-info-value">
                          <button
                            className="design-dashboard-link"
                            onClick={() => navigate(`/designs/${design.parentId}`)}
                          >
                            {parentDesign?.name || 'View Parent'}
                          </button>
                        </span>
                      </div>
                    )}
                    <div className="design-dashboard-info-item">
                      <span className="design-dashboard-info-label">Created</span>
                      <span className="design-dashboard-info-value">
                        {design.createdAt
                          ? new Date(design.createdAt).toLocaleDateString()
                          : 'N/A'}
                      </span>
                    </div>
                    <div className="design-dashboard-info-item">
                      <span className="design-dashboard-info-label">Updated</span>
                      <span className="design-dashboard-info-value">
                        {design.updatedAt || 'N/A'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="design-dashboard-section">
                  <h3 className="design-dashboard-section-title">Settings</h3>
                  
                  {!design.parentId && subDesigns.length > 0 && (
                    <div className="design-dashboard-toggle">
                      <label className="design-dashboard-toggle-label">
                        <input
                          type="checkbox"
                          checked={showParentInPreview}
                          onChange={(e) => setShowParentInPreview(e.target.checked)}
                          className="design-dashboard-toggle-input"
                        />
                        <span className="design-dashboard-toggle-text">
                          Include parent in generation
                        </span>
                      </label>
                      <p className="design-dashboard-toggle-hint">
                        {showParentInPreview
                          ? 'Parent design will be included when generating assets'
                          : 'Only sub-designs will be used for generation'}
                      </p>
                    </div>
                  )}

                  <div className="design-dashboard-brandkit">
                    <label className="design-dashboard-brandkit-label">
                      Brand Kit
                    </label>
                    <select
                      className="design-dashboard-brandkit-select"
                      value={design.brandKitId || ''}
                      onChange={(e) => {
                        const brandKitId = e.target.value || null
                        const updatedDesign = {
                          ...design,
                          brandKitId,
                        }
                        saveDesign(designId, updatedDesign)
                        setDesign(updatedDesign)
                        toast.success('Brand kit assigned!', { duration: 2000 })
                      }}
                    >
                      <option value="">None</option>
                      {brandKitsData.map((kit) => (
                        <option key={kit.id} value={kit.id}>
                          {kit.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {!design.parentId && subDesigns.length > 0 && (
                  <div className="design-dashboard-section">
                    <h3 className="design-dashboard-section-title">
                      Sub-Designs ({subDesigns.length})
                    </h3>
                    <div className="design-dashboard-subdesigns">
                      {subDesigns.map((subDesign) => (
                        <SubDesignItem
                          key={subDesign.id}
                          subDesign={subDesign}
                          onUpdate={() => {
                            const subs = getSubDesigns(designId)
                            setSubDesigns(subs)
                          }}
                          onNavigate={navigate}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          }
        />
        <Route path="one-off" element={<OneOffGeneration designId={designId} />} />
        <Route path="generation" element={<Generation designId={designId} />} />
        <Route
          path="generation/results"
          element={<GenerationResults designId={designId} />}
        />
      </Routes>

      <Modal
        isOpen={isCreateSubDesignModalOpen}
        onClose={handleCloseSubDesignModal}
        title="Create Sub-Design"
      >
        <form onSubmit={handleSubmitSubDesign}>
          <div className="modal-form-group">
            <label htmlFor="subdesign-name" className="modal-label">
              Sub-Design Name <span className="modal-required">*</span>
            </label>
            <input
              id="subdesign-name"
              type="text"
              className="modal-input"
              value={subDesignName}
              onChange={handleNameChange}
              placeholder="Enter sub-design name"
              required
              autoFocus
            />
          </div>
          <div className="modal-form-group">
            <label className="modal-label">Create From</label>
            <div className="modal-radio-group">
              <label className="modal-radio">
                <input
                  type="radio"
                  name="create-from"
                  value="scratch"
                  checked={selectedChannel === null}
                  onChange={() => setSelectedChannel(null)}
                />
                <span>From Scratch (inherit parent as-is)</span>
              </label>
              <label className="modal-radio">
                <input
                  type="radio"
                  name="create-from"
                  value="channel"
                  checked={selectedChannel !== null}
                  onChange={() => handleChannelChange('ch1')}
                />
                <span>Using Channel</span>
              </label>
            </div>
          </div>
          {selectedChannel !== null && (
            <div className="modal-form-group">
              <label htmlFor="subdesign-channel" className="modal-label">
                Channel
              </label>
              <select
                id="subdesign-channel"
                className="modal-input"
                value={selectedChannel}
                onChange={(e) => handleChannelChange(e.target.value)}
              >
                {channelsData.map((channel) => (
                  <option key={channel.id} value={channel.id}>
                    {channel.name} ({channel.transformation_string})
                  </option>
                ))}
              </select>
            </div>
          )}
          <div className="modal-actions">
            <Button
              type="button"
              variant="secondary"
              onClick={handleCloseSubDesignModal}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary" disabled={!subDesignName.trim()}>
              Create Sub-Design
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}

export default DesignDashboard

