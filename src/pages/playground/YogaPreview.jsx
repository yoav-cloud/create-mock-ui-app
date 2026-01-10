import { useMemo } from 'react'
import './YogaPreview.css'

const YogaPreview = ({ yogaLayout, designId }) => {
  const containerScale = useMemo(() => {
    if (!yogaLayout?.container) return 1
    const maxViewportWidth = 800
    const maxViewportHeight = 600
    const containerWidth = yogaLayout.container.width || 500
    const containerHeight = yogaLayout.container.height || 900
    
    const scaleX = maxViewportWidth / containerWidth
    const scaleY = maxViewportHeight / containerHeight
    return Math.min(scaleX, scaleY, 1)
  }, [yogaLayout])

  if (!yogaLayout) {
    return (
      <div className="yoga-preview-empty">
        <div className="yoga-empty-icon">🧘</div>
        <p>No Yoga Layout available for this design</p>
        <p className="yoga-empty-hint">Import a design from Figma to see the Yoga representation</p>
      </div>
    )
  }

  const { container, children = [], backgroundImage } = yogaLayout
  const containerWidth = container.width || 500
  const containerHeight = container.height || 900

  return (
    <div className="yoga-preview">
      <div className="yoga-preview-header">
        <div className="yoga-info">
          <span className="yoga-info-label">Design:</span>
          <span className="yoga-info-value">{designId}</span>
        </div>
        <div className="yoga-info">
          <span className="yoga-info-label">Container:</span>
          <span className="yoga-info-value">{containerWidth}×{containerHeight}</span>
        </div>
        <div className="yoga-info">
          <span className="yoga-info-label">Layers:</span>
          <span className="yoga-info-value">{children.length}</span>
        </div>
        <div className="yoga-info">
          <span className="yoga-info-label">Scale:</span>
          <span className="yoga-info-value">{(containerScale * 100).toFixed(0)}%</span>
        </div>
      </div>

      <div className="yoga-preview-viewport">
        <div
          className="yoga-container"
          style={{
            width: containerWidth,
            height: containerHeight,
            backgroundColor: container.backgroundColor || '#ffffff',
            transform: `scale(${containerScale})`,
            transformOrigin: 'top center'
          }}
        >
          {backgroundImage && (
            <div
              className="yoga-layer yoga-background"
              style={{
                position: 'absolute',
                left: backgroundImage.x || 0,
                top: backgroundImage.y || 0,
                width: backgroundImage.width,
                height: backgroundImage.height
              }}
              title="Background Image"
            >
              <div className="yoga-layer-content">
                <span className="yoga-layer-icon">🖼️</span>
                <span className="yoga-layer-label">Background</span>
              </div>
            </div>
          )}

          {children.map((child, index) => {
            const isText = child.type === 'text'
            const isImage = child.type === 'image'
            
            return (
              <div
                key={child.key || index}
                className={`yoga-layer ${child.type}`}
                style={{
                  position: child.layout.position || 'absolute',
                  left: child.layout.left,
                  top: child.layout.top,
                  width: child.layout.width || 'auto',
                  height: child.layout.height || 'auto'
                }}
                title={`${child.displayName} (${child.type})`}
              >
                <div className="yoga-layer-content">
                  {isText && (
                    <>
                      <span className="yoga-layer-icon">T</span>
                      <span className="yoga-layer-label">{child.displayName}</span>
                      {child.text && (
                        <div className="yoga-layer-details">
                          <div className="yoga-detail-line">
                            {child.text.fontSize}px {child.text.fontFamily}
                          </div>
                          {child.text.content && (
                            <div className="yoga-detail-line text-preview">
                              "{child.text.content.substring(0, 30)}{child.text.content.length > 30 ? '...' : ''}"
                            </div>
                          )}
                        </div>
                      )}
                    </>
                  )}
                  {isImage && (
                    <>
                      <span className="yoga-layer-icon">🖼️</span>
                      <span className="yoga-layer-label">{child.displayName}</span>
                      {child.image && (
                        <div className="yoga-layer-details">
                          {child.image.isMainProduct && (
                            <div className="yoga-badge">Main Product</div>
                          )}
                          {child.image.publicId && (
                            <div className="yoga-detail-line">
                              {child.image.publicId.split('/').pop()}
                            </div>
                          )}
                        </div>
                      )}
                    </>
                  )}
                </div>
                
                <div className="yoga-layer-dimensions">
                  {child.layout.width}×{child.layout.height}
                </div>
                
                <div className="yoga-layer-position">
                  ({child.layout.left}, {child.layout.top})
                </div>
              </div>
            )
          })}
        </div>
      </div>

      <div className="yoga-legend">
        <div className="yoga-legend-item">
          <div className="yoga-legend-swatch text"></div>
          <span>Text Layer</span>
        </div>
        <div className="yoga-legend-item">
          <div className="yoga-legend-swatch image"></div>
          <span>Image Layer</span>
        </div>
        <div className="yoga-legend-item">
          <div className="yoga-legend-swatch background"></div>
          <span>Background</span>
        </div>
      </div>
    </div>
  )
}

export default YogaPreview
