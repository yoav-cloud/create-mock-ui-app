import { useState, useEffect } from 'react'
import { Stage, Layer, Text, Rect, Circle } from 'react-konva'
import './Generation.css'
import { useDesign } from '../../context/DesignContext'
import designsData from '../../data/designs.json'
import projectsData from '../../data/projects.json'
import Button from '../../components/Button'

function OneOffGeneration({ designId }) {
  const { getDesign } = useDesign()
  const [design, setDesign] = useState(null)
  const [textValues, setTextValues] = useState({})
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedResult, setGeneratedResult] = useState(null)

  useEffect(() => {
    // Load design data
    const savedDesign = getDesign(designId)
    
    if (savedDesign) {
      setDesign(savedDesign)
      // Initialize text values from saved design
      const initialValues = {}
      if (savedDesign.layers) {
        savedDesign.layers
          .filter((layer) => layer.type === 'text')
          .forEach((layer) => {
            initialValues[layer.id] = layer.text || ''
          })
      }
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
  }, [designId, getDesign])

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

  // Get text layers from design
  const textLayers = design.layers
    ? design.layers.filter((layer) => layer.type === 'text')
    : []

  // If no text layers in saved design, create some for the preview
  const displayLayers = design.layers || []
  const hasTextLayers = textLayers.length > 0

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
            <div className="one-off-preview-container">
              <div className="one-off-preview-label">Design Preview</div>
              <div className="one-off-canvas-wrapper">
                <Stage
                  width={design.canvasSize?.width || 800}
                  height={design.canvasSize?.height || 600}
                  className="one-off-preview-stage"
                >
                  <Layer>
                    {displayLayers.map((layer) => {
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
                                textValues[layer.id] !== undefined
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
                        value={textValues[layer.id] || layer.text || ''}
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

