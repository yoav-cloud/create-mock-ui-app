import { useState, useRef, useEffect } from 'react'
import { Stage, Layer, Text, Rect, Circle, Group } from 'react-konva'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import './Editor.css'
import Button from '../components/Button'
import BackButton from '../components/BackButton'
import { useDesign } from '../context/DesignContext'

function Editor() {
  const location = useLocation()
  const navigate = useNavigate()
  const { designId: urlDesignId } = useParams()
  const projectIdFromState = location.state?.projectId
  const stageRef = useRef(null)
  const {
    saveDesign,
    getDesign,
    createNewDesign,
    getEffectiveLayers,
    setLayerOverride,
    resetLayerOverride,
    removeLayerFromParent,
    getSubDesigns,
  } = useDesign()

  const [designId, setDesignId] = useState(urlDesignId || null)
  const [designName, setDesignName] = useState('Untitled Design')
  const [layers, setLayers] = useState([])
  const [selectedLayer, setSelectedLayer] = useState(null)
  const [canvasSize, setCanvasSize] = useState({ width: 800, height: 600 })
  const [saved, setSaved] = useState(false)
  const [projectId, setProjectId] = useState(projectIdFromState || null)
  const [isSubDesign, setIsSubDesign] = useState(false)
  const [parentDesign, setParentDesign] = useState(null)
  const [subDesigns, setSubDesigns] = useState([])

  useEffect(() => {
    if (urlDesignId) {
      const existingDesign = getDesign(urlDesignId)
      if (existingDesign) {
        setDesignName(existingDesign.name || 'Untitled Design')
        setCanvasSize(existingDesign.canvasSize || { width: 800, height: 600 })
        setDesignId(urlDesignId)
        
        // Check if this is a sub-design
        if (existingDesign.parentId) {
          setIsSubDesign(true)
          const parent = getDesign(existingDesign.parentId)
          setParentDesign(parent)
          // Use effective layers (inherited + overridden)
          const effectiveLayers = getEffectiveLayers(urlDesignId)
          setLayers(effectiveLayers)
          // Load sibling sub-designs
          if (parent) {
            const siblings = getSubDesigns(existingDesign.parentId)
            setSubDesigns(siblings)
          }
        } else {
          setIsSubDesign(false)
          setParentDesign(null)
          setLayers(existingDesign.layers || [])
          // Load sub-designs if this is a parent
          const subs = getSubDesigns(urlDesignId)
          setSubDesigns(subs)
        }
        
        // Use projectId from design if not in location state
        if (!projectIdFromState && existingDesign.projectId) {
          setProjectId(existingDesign.projectId)
        }
      }
    } else if (!designId && projectIdFromState) {
      // Create new design when starting from scratch
      const newId = createNewDesign(projectIdFromState, 'Untitled Design')
      setDesignId(newId)
      setProjectId(projectIdFromState)
      setIsSubDesign(false)
    }
  }, [
    urlDesignId,
    projectIdFromState,
    designId,
    getDesign,
    createNewDesign,
    getEffectiveLayers,
  ])

  const handleSave = () => {
    let currentDesignId = designId
    
    if (!currentDesignId) {
      currentDesignId = createNewDesign(projectId, designName)
      setDesignId(currentDesignId)
    }

    const existingDesign = getDesign(currentDesignId)
    const saveData = {
      name: designName,
      projectId,
      canvasSize,
      status: 'draft',
      // Preserve existing properties
      parentId: existingDesign?.parentId,
      channelId: existingDesign?.channelId,
    }

    if (isSubDesign) {
      // For sub-designs, only save local layers (not inherited ones)
      const parentLayers = parentDesign?.layers || []
      const localLayers = layers.filter(
        (layer) => !parentLayers.some((pl) => pl.id === layer.id)
      )
      saveData.layers = localLayers
      // Keep existing overrides
      saveData.overrides = existingDesign?.overrides || {}
    } else {
      // Regular design, save all layers
      saveData.layers = layers
    }

    saveDesign(currentDesignId, saveData)

    setSaved(true)
    setTimeout(() => setSaved(false), 2000)

    // Don't navigate away - let user continue editing
    // navigate(`/designs/${currentDesignId}`)
  }

  const addTextLayer = () => {
    const newLayer = {
      id: `text-${Date.now()}`,
      type: 'text',
      x: 100,
      y: 100,
      text: 'Double click to edit',
      fontSize: 24,
      fill: '#000000',
    }
    setLayers([...layers, newLayer])
    setSelectedLayer(newLayer.id)
    // For sub-designs, new layers are automatically local (not inherited)
  }

  const addRectLayer = () => {
    const newLayer = {
      id: `rect-${Date.now()}`,
      type: 'rect',
      x: 150,
      y: 150,
      width: 200,
      height: 100,
      fill: '#3b82f6',
      stroke: '#1e40af',
      strokeWidth: 2,
    }
    setLayers([...layers, newLayer])
    setSelectedLayer(newLayer.id)
  }

  const addCircleLayer = () => {
    const newLayer = {
      id: `circle-${Date.now()}`,
      type: 'circle',
      x: 250,
      y: 250,
      radius: 50,
      fill: '#ef4444',
      stroke: '#991b1b',
      strokeWidth: 2,
    }
    setLayers([...layers, newLayer])
    setSelectedLayer(newLayer.id)
  }

  const updateLayer = (id, updates) => {
    if (isSubDesign) {
      // For sub-designs, check if this layer is inherited from parent
      const parentLayers = parentDesign?.layers || []
      const isInherited = parentLayers.some((pl) => pl.id === id)
      
      if (isInherited) {
        // Break inheritance by setting override
        setLayerOverride(designId, id, updates)
        // Refresh effective layers to show updated version
        setTimeout(() => {
          const effectiveLayers = getEffectiveLayers(designId)
          setLayers(effectiveLayers)
        }, 0)
      } else {
        // Local layer, update normally
        setLayers(
          layers.map((layer) =>
            layer.id === id ? { ...layer, ...updates } : layer
          )
        )
      }
    } else {
      // Regular design, update normally
      setLayers(
        layers.map((layer) =>
          layer.id === id ? { ...layer, ...updates } : layer
        )
      )
    }
  }

  const deleteLayer = (id) => {
    if (isSubDesign) {
      // For sub-designs, check if this layer is inherited
      const parentLayers = parentDesign?.layers || []
      const isInherited = parentLayers.some((pl) => pl.id === id)
      
      if (isInherited) {
        // Check if it has an override
        const design = getDesign(designId)
        const hasOverride = design?.overrides && design.overrides[id]
        
        if (hasOverride) {
          // Has override - remove the override and the layer from view
          // This effectively removes it since it's now treated as a local layer with override
          resetLayerOverride(designId, id)
          // Remove from local layers if it exists there
          const design = getDesign(designId)
          const updatedLayers = (design.layers || []).filter((l) => l.id !== id)
          saveDesign(designId, {
            ...design,
            layers: updatedLayers,
          })
          // Refresh effective layers
          const effectiveLayers = getEffectiveLayers(designId)
          setLayers(effectiveLayers)
        } else {
          // No override, can't delete inherited layer
          // Could show a message here
          return
        }
      } else {
        // Local layer, delete normally
        const design = getDesign(designId)
        const updatedLayers = (design.layers || []).filter((l) => l.id !== id)
        saveDesign(designId, {
          ...design,
          layers: updatedLayers,
        })
        setLayers(layers.filter((layer) => layer.id !== id))
      }
    } else {
      // Parent design - remove from parent and all sub-designs without overrides
      removeLayerFromParent(designId, id)
      setLayers(layers.filter((layer) => layer.id !== id))
    }
    
    if (selectedLayer === id) {
      setSelectedLayer(null)
    }
  }

  const handleResetOverride = (layerId) => {
    if (isSubDesign) {
      resetLayerOverride(designId, layerId)
      // Refresh layers to show inherited version
      const effectiveLayers = getEffectiveLayers(designId)
      setLayers(effectiveLayers)
    }
  }

  const isLayerInherited = (layerId) => {
    if (!isSubDesign || !parentDesign) return false
    return (parentDesign.layers || []).some((pl) => pl.id === layerId)
  }

  const hasLayerOverride = (layerId) => {
    if (!isSubDesign) return false
    const design = getDesign(designId)
    return design?.overrides && design.overrides[layerId]
  }

  const handleTextDoubleClick = (e) => {
    const textNode = e.target
    const stage = textNode.getStage()
    const layer = textNode.getLayer()

    const textPosition = textNode.absolutePosition()
    const stageBox = stage.container().getBoundingClientRect()

    const areaPosition = {
      x: stageBox.left + textPosition.x,
      y: stageBox.top + textPosition.y,
    }

    const textarea = document.createElement('textarea')
    document.body.appendChild(textarea)

    textarea.value = textNode.text()
    textarea.style.position = 'absolute'
    textarea.style.top = areaPosition.y + 'px'
    textarea.style.left = areaPosition.x + 'px'
    textarea.style.width = textNode.width() + 'px'
    textarea.style.height = textNode.height() + 'px'
    textarea.style.fontSize = textNode.fontSize() + 'px'
    textarea.style.border = 'none'
    textarea.style.padding = '0px'
    textarea.style.margin = '0px'
    textarea.style.overflow = 'hidden'
    textarea.style.background = 'transparent'
    textarea.style.outline = 'none'
    textarea.style.resize = 'none'
    textarea.style.fontFamily = textNode.fontFamily()
    textarea.style.transformOrigin = 'left top'
    textarea.style.textAlign = textNode.align()
    textarea.style.color = textNode.fill()

    textarea.focus()

    const removeTextarea = () => {
      textarea.parentNode?.removeChild(textarea)
    }

    textarea.onkeydown = (e) => {
      if (e.keyCode === 13 && !e.shiftKey) {
        textNode.text(textarea.value)
        removeTextarea()
      }
      if (e.keyCode === 27) {
        removeTextarea()
      }
    }

    textarea.onblur = () => {
      textNode.text(textarea.value)
      removeTextarea()
    }
  }

  const renderLayer = (layer) => {
    const isSelected = selectedLayer === layer.id
    const commonProps = {
      key: layer.id,
      draggable: true,
      onClick: () => setSelectedLayer(layer.id),
      onDragEnd: (e) => {
        updateLayer(layer.id, {
          x: e.target.x(),
          y: e.target.y(),
        })
      },
    }

    switch (layer.type) {
      case 'text':
        return (
          <Text
            {...commonProps}
            x={layer.x}
            y={layer.y}
            text={layer.text}
            fontSize={layer.fontSize}
            fill={layer.fill}
            onDblClick={handleTextDoubleClick}
            onDblTap={handleTextDoubleClick}
            stroke={isSelected ? '#0066cc' : undefined}
            strokeWidth={isSelected ? 2 : 0}
          />
        )
      case 'rect':
        return (
          <Rect
            {...commonProps}
            x={layer.x}
            y={layer.y}
            width={layer.width}
            height={layer.height}
            fill={layer.fill}
            stroke={isSelected ? '#0066cc' : layer.stroke}
            strokeWidth={layer.strokeWidth}
          />
        )
      case 'circle':
        return (
          <Circle
            {...commonProps}
            x={layer.x}
            y={layer.y}
            radius={layer.radius}
            fill={layer.fill}
            stroke={isSelected ? '#0066cc' : layer.stroke}
            strokeWidth={layer.strokeWidth}
          />
        )
      default:
        return null
    }
  }

  return (
    <div className="editor">
      <div className="editor-header">
        <div className="editor-header-left">
          <BackButton
            to={
              designId
                ? (() => {
                    const existingDesign = getDesign(designId)
                    // If it's a sub-design, go to parent dashboard, otherwise go to its own dashboard
                    if (existingDesign?.parentId) {
                      return `/designs/${existingDesign.parentId}`
                    }
                    return existingDesign?.projectId
                      ? `/projects/${existingDesign.projectId}`
                      : `/designs/${designId}`
                  })()
                : projectId
                ? `/projects/${projectId}`
                : '/'
            }
          />
          <div className="editor-title-section">
            <input
              type="text"
              value={designName}
              onChange={(e) => setDesignName(e.target.value)}
              className="editor-title-input"
              placeholder="Design Name"
            />
            {saved && <span className="editor-saved-indicator">Saved!</span>}
          </div>
        </div>
        <div className="editor-header-actions">
          {!isSubDesign && (
            <Button variant="secondary" onClick={() => {
              // Open create sub-design modal - we'll need to navigate to dashboard or show modal
              navigate(`/designs/${designId}`, { state: { openSubDesignModal: true } })
            }}>
              Create Sub-Design
            </Button>
          )}
          <Button variant="primary" onClick={handleSave}>
            {saved ? 'Saved!' : 'Save'}
          </Button>
        </div>
      </div>

      {(parentDesign || subDesigns.length > 0) && (
        <div className="editor-subnav">
          {parentDesign && designId && (() => {
            const currentDesign = getDesign(designId)
            return currentDesign?.parentId ? (
              <button
                className="editor-subnav-item"
                onClick={() => navigate(`/editor/${currentDesign.parentId}`)}
                title={`Go to parent: ${parentDesign.name}`}
              >
                ← {parentDesign.name}
              </button>
            ) : null
          })()}
          {subDesigns.length > 0 && (
            <div className="editor-subnav-siblings">
              {subDesigns.map((sub) => (
                <button
                  key={sub.id}
                  className={`editor-subnav-item ${
                    sub.id === designId ? 'active' : ''
                  }`}
                  onClick={() => navigate(`/editor/${sub.id}`)}
                  title={sub.name}
                >
                  {sub.name}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      <div className="editor-content">
        <div className="editor-toolbar">
          <div className="editor-toolbar-section">
            <h3 className="editor-toolbar-title">Add Elements</h3>
            <div className="editor-toolbar-buttons">
              <Button variant="secondary" onClick={addTextLayer}>
                Add Text
              </Button>
              <Button variant="secondary" onClick={addRectLayer}>
                Add Rectangle
              </Button>
              <Button variant="secondary" onClick={addCircleLayer}>
                Add Circle
              </Button>
            </div>
          </div>

          <div className="editor-toolbar-section">
            <h3 className="editor-toolbar-title">Canvas Size</h3>
            <div className="editor-canvas-size">
              <input
                type="number"
                value={canvasSize.width}
                onChange={(e) =>
                  setCanvasSize({ ...canvasSize, width: parseInt(e.target.value) || 800 })
                }
                className="editor-input"
              />
              <span>×</span>
              <input
                type="number"
                value={canvasSize.height}
                onChange={(e) =>
                  setCanvasSize({ ...canvasSize, height: parseInt(e.target.value) || 600 })
                }
                className="editor-input"
              />
            </div>
          </div>
        </div>

        <div className="editor-main">
          <div className="editor-canvas-container">
            <Stage
              width={canvasSize.width}
              height={canvasSize.height}
              ref={stageRef}
              className="editor-stage"
            >
              <Layer>
                {layers.map((layer) => renderLayer(layer))}
              </Layer>
            </Stage>
          </div>

          <div className="editor-sidebar">
            <div className="editor-sidebar-section">
              <h3 className="editor-sidebar-title">Layers</h3>
              {layers.length === 0 ? (
                <p className="editor-sidebar-empty">
                  No layers yet. Add elements to get started.
                </p>
              ) : (
                <div className="editor-layers-list">
                  {layers.map((layer) => {
                    const inherited = isLayerInherited(layer.id)
                    const overridden = hasLayerOverride(layer.id)
                    
                    return (
                      <div
                        key={layer.id}
                        className={`editor-layer-item ${
                          selectedLayer === layer.id ? 'selected' : ''
                        } ${inherited ? 'inherited' : ''} ${overridden ? 'overridden' : ''}`}
                        onClick={() => setSelectedLayer(layer.id)}
                      >
                        <span className="editor-layer-icon">
                          {layer.type === 'text' && 'T'}
                          {layer.type === 'rect' && '▭'}
                          {layer.type === 'circle' && '○'}
                        </span>
                        <span className="editor-layer-name">
                          {layer.type === 'text' ? layer.text : layer.type}
                          {inherited && (
                            <span className="editor-layer-badge" title="Inherited from parent">
                              ↱
                            </span>
                          )}
                          {overridden && (
                            <span className="editor-layer-badge overridden" title="Overridden">
                              ⚡
                            </span>
                          )}
                        </span>
                        <div className="editor-layer-actions">
                          {overridden && (
                            <button
                              className="editor-layer-reset"
                              onClick={(e) => {
                                e.stopPropagation()
                                handleResetOverride(layer.id)
                              }}
                              title="Reset to inherit from parent"
                            >
                              ↺
                            </button>
                          )}
                          <button
                            className="editor-layer-delete"
                            onClick={(e) => {
                              e.stopPropagation()
                              deleteLayer(layer.id)
                            }}
                            disabled={inherited && !overridden}
                            title={inherited && !overridden ? "Cannot delete inherited layer" : "Delete layer"}
                          >
                            ×
                          </button>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>

            {selectedLayer && (
              <div className="editor-sidebar-section">
                <h3 className="editor-sidebar-title">Properties</h3>
                <div className="editor-properties">
                  {layers
                    .find((l) => l.id === selectedLayer)
                    ?.type === 'text' && (
                    <div className="editor-property">
                      <label>Text</label>
                      <input
                        type="text"
                        value={
                          layers.find((l) => l.id === selectedLayer)?.text || ''
                        }
                        onChange={(e) =>
                          updateLayer(selectedLayer, { text: e.target.value })
                        }
                        className="editor-input"
                      />
                    </div>
                  )}
                  <div className="editor-property">
                    <label>X Position</label>
                    <input
                      type="number"
                      value={
                        layers.find((l) => l.id === selectedLayer)?.x || 0
                      }
                      onChange={(e) =>
                        updateLayer(selectedLayer, {
                          x: parseInt(e.target.value) || 0,
                        })
                      }
                      className="editor-input"
                    />
                  </div>
                  <div className="editor-property">
                    <label>Y Position</label>
                    <input
                      type="number"
                      value={
                        layers.find((l) => l.id === selectedLayer)?.y || 0
                      }
                      onChange={(e) =>
                        updateLayer(selectedLayer, {
                          y: parseInt(e.target.value) || 0,
                        })
                      }
                      className="editor-input"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Editor

