import { useState, useEffect } from 'react'
import { Stage, Layer, Text, Rect, Circle } from 'react-konva'
import './Generation.css'
import { useDesign } from '../../context/DesignContext'
import designsData from '../../data/designs.json'
import projectsData from '../../data/projects.json'
import Button from '../../components/Button'

function OneOffGeneration({ designId }) {
  const { getDesign, getEffectiveLayers, getSubDesigns } = useDesign()
  const [design, setDesign] = useState(null)
  const [parentDesign, setParentDesign] = useState(null)
  const [subDesigns, setSubDesigns] = useState([])
  const [selectedPreviewId, setSelectedPreviewId] = useState(designId)
  const [textValues, setTextValues] = useState({})
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedResult, setGeneratedResult] = useState(null)

  useEffect(() => {
    // Load design data
    const savedDesign = getDesign(designId)
    
    if (savedDesign) {
      setDesign(savedDesign)
      
      // Check if this is a sub-design and load parent/sub-designs
      if (savedDesign.parentId) {
        const parent = getDesign(savedDesign.parentId)
        setParentDesign(parent)
        if (parent) {
          const subs = getSubDesigns(savedDesign.parentId)
          setSubDesigns(subs)
        }
      } else {
        // This is a parent design
        setParentDesign(null)
        const subs = getSubDesigns(designId)
        setSubDesigns(subs)
      }
      
      // Use effective layers for text detection
      const effectiveLayers = getEffectiveLayers(designId)
      
      // Initialize text values from effective layers
      const initialValues = {}
      effectiveLayers
        .filter((layer) => layer.type === 'text')
        .forEach((layer) => {
          initialValues[layer.id] = layer.text || ''
        })
      setTextValues(initialValues)
      return
    }

    // Fallback to static designs data
    let foundDesign = null
    for (const [projectId, designs] of Object.entries(designsData)) {
      const d = designs.find((d) => d.id === designId)
      if (d) {
        foundDesign = d
        break
      }
    }

    if (foundDesign) {
      // For static designs, create mock design structure with text layers
      const mockDesign = {
        ...foundDesign,
        layers: [
          {
            id: 'text-1',
            type: 'text',
            x: 100,
            y: 100,
            text: 'Sample Text 1',
            fontSize: 24,
            fill: '#000000',
          },
          {
            id: 'text-2',
            type: 'text',
            x: 100,
            y: 150,
            text: 'Sample Text 2',
            fontSize: 20,
            fill: '#333333',
          },
        ],
        canvasSize: { width: 800, height: 600 },
      }
      setDesign(mockDesign)
      // Initialize text values from mock layers
      const initialValues = {}
      mockDesign.layers
        .filter((layer) => layer.type === 'text')
        .forEach((layer) => {
          initialValues[layer.id] = layer.text || ''
        })
      setTextValues(initialValues)
    }
  }, [designId, getDesign, getEffectiveLayers, getSubDesigns])

  // Update text values when selected preview changes
  useEffect(() => {
    if (selectedPreviewId && getEffectiveLayers) {
      const effectiveLayers = getEffectiveLayers(selectedPreviewId)
      const initialValues = {}
      effectiveLayers
        .filter((layer) => layer.type === 'text')
        .forEach((layer) => {
          initialValues[layer.id] = layer.text || ''
        })
      setTextValues(initialValues)
    }
  }, [selectedPreviewId, getEffectiveLayers])

  const handleTextChange = (layerId, value) => {
    setTextValues((prev) => ({
      ...prev,
      [layerId]: value,
    }))
  }

  const handleGenerate = () => {
    setIsGenerating(true)
    
    // Mock generation delay
    setTimeout(() => {
      setIsGenerating(false)
      setGeneratedResult(true)
    }, 2000)
  }

  const handleReset = () => {
    setGeneratedResult(null)
  }

  if (!design) {
    return (
      <div className="generation-page">
        <div className="generation-loading">Loading design...</div>
      </div>
    )
  }

  // Get effective layers (handles sub-designs properly)
  const effectiveLayers = design ? getEffectiveLayers(selectedPreviewId) : []
  
  // Get text layers from effective layers
  const textLayers = effectiveLayers.filter((layer) => layer.type === 'text')
  const hasTextLayers = textLayers.length > 0
  
  // Get the design to display (parent or selected sub-design)
  const displayDesign = selectedPreviewId === designId 
    ? design 
    : (selectedPreviewId === design?.parentId ? parentDesign : getDesign(selectedPreviewId))
  
  // Get display layers for the selected preview
  const displayLayers = displayDesign ? getEffectiveLayers(selectedPreviewId) : []

  return (
    <div className="generation-page">
      <div className="generation-header">
        <h2 className="generation-title">One-off Generation</h2>
        <p className="generation-subtitle">
          Customize text values and generate a variation of your design
        </p>
      </div>

      <div className="one-off-generation-content">
        <div className="one-off-generation-preview">
          {isGenerating ? (
            <div className="generation-loading-state">
              <div className="generation-spinner"></div>
              <p>Generating your design...</p>
            </div>
          ) : generatedResult ? (
            <div className="generation-result">
              <div
                className="generation-result-preview"
                style={{
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                }}
              >
                <div className="generation-result-content">
                  <h3>Generated Design</h3>
                  <p>Your design has been generated successfully!</p>
                </div>
              </div>
              <div className="generation-result-actions">
                <Button variant="secondary" onClick={handleReset}>
                  Generate Another
                </Button>
                <Button variant="primary">Download</Button>
              </div>
            </div>
          ) : (
            <div className="one-off-previews-container">
              <div className="one-off-previews-scroll">
                {(() => {
                  // Helper function to render a preview
                  const renderPreview = (previewDesign, previewId, label, isActive) => {
                    const previewLayers = getEffectiveLayers(previewId)
                    const canvasWidth = previewDesign.canvasSize?.width || 800
                    const canvasHeight = previewDesign.canvasSize?.height || 600
                    const maxWidth = 400
                    const needsScaling = canvasWidth > maxWidth
                    const scale = needsScaling ? maxWidth / canvasWidth : 1
                    
                    return (
                      <div 
                        key={previewId}
                        className={`one-off-preview-item ${isActive ? 'active' : ''}`}
                        onClick={() => setSelectedPreviewId(previewId)}
                      >
                        <div className="one-off-preview-label">{label}</div>
                        <div className="one-off-canvas-wrapper">
                          <div style={{
                            width: needsScaling ? `${maxWidth}px` : `${canvasWidth}px`,
                            maxWidth: '100%',
                            margin: '0 auto'
                          }}>
                            <div style={{
                              width: canvasWidth,
                              height: canvasHeight,
                              transform: needsScaling ? `scale(${scale})` : 'none',
                              transformOrigin: 'top center'
                            }}>
                              <Stage
                                width={canvasWidth}
                                height={canvasHeight}
                                className="one-off-preview-stage"
                              >
                                <Layer>
                                  {previewLayers.map((layer) => {
                                    const commonProps = {
                                      key: layer.id,
                                      x: layer.x,
                                      y: layer.y,
                                      draggable: false,
                                    }

                                    switch (layer.type) {
                                      case 'text':
                                        return (
                                          <Text
                                            {...commonProps}
                                            text={
                                              isActive && textValues[layer.id] !== undefined
                                                ? textValues[layer.id]
                                                : layer.text
                                            }
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
                        </div>
                      </div>
                    )
                  }
                  
                  // Determine which designs to show
                  const designsToShow = []
                  
                  // If viewing a sub-design, show parent first
                  if (design?.parentId && parentDesign) {
                    designsToShow.push({
                      design: parentDesign,
                      id: design.parentId,
                      label: `Parent: ${parentDesign.name}`
                    })
                  }
                  
                  // Show current design (parent or sub-design)
                  if (design) {
                    designsToShow.push({
                      design: design,
                      id: designId,
                      label: design.name
                    })
                  }
                  
                  // Show sub-designs (if viewing a parent)
                  if (!design?.parentId && subDesigns.length > 0) {
                    subDesigns.forEach(sub => {
                      designsToShow.push({
                        design: sub,
                        id: sub.id,
                        label: sub.name
                      })
                    })
                  }
                  
                  return designsToShow.map(({ design: previewDesign, id: previewId, label }) =>
                    renderPreview(previewDesign, previewId, label, selectedPreviewId === previewId)
                  )
                })()}
              </div>
            </div>
          )}
        </div>

        {!generatedResult && (
          <div className="one-off-generation-form">
            <div className="generation-form-section">
              <label className="generation-label">Text Placeholders</label>
              {hasTextLayers && textLayers.length > 0 ? (
                <div className="one-off-text-inputs">
                  {textLayers.map((layer) => (
                    <div key={layer.id} className="generation-input-group">
                      <label>Text Layer {layer.id.split('-')[1] || '1'}</label>
                      <input
                        type="text"
                        value={textValues[layer.id] !== undefined ? textValues[layer.id] : (layer.text || '')}
                        onChange={(e) =>
                          handleTextChange(layer.id, e.target.value)
                        }
                        className="generation-input"
                        placeholder="Enter text value"
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="one-off-no-text-layers">
                  <p>No text layers found in this design.</p>
                  <p className="one-off-hint">
                    Add text layers in the editor to customize them here.
                  </p>
                </div>
              )}
            </div>

            <div className="generation-actions">
              <Button
                variant="primary"
                onClick={handleGenerate}
                disabled={isGenerating}
              >
                {isGenerating ? 'Generating...' : 'Generate'}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default OneOffGeneration

