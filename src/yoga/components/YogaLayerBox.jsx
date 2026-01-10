import { isTextLayer, isImageLayer, getLayerIcon, getLayerClassName, formatTextPreview, extractImageFilename, getLayerTitle } from '../utils/layerHelpers'

const TextLayerDetails = ({ text }) => {
  if (!text) return null
  
  return (
    <>
      <div className="yoga-detail-line">
        {text.fontSize}px {text.fontFamily}
      </div>
      {text.content && (
        <div className="yoga-detail-line text-preview">
          {formatTextPreview(text.content)}
        </div>
      )}
    </>
  )
}

const ImageLayerDetails = ({ image }) => {
  if (!image) return null
  
  return (
    <>
      {image.isMainProduct && (
        <div className="yoga-badge">Main Product</div>
      )}
      {image.publicId && (
        <div className="yoga-detail-line">
          {extractImageFilename(image.publicId)}
        </div>
      )}
    </>
  )
}

const YogaLayerBox = ({ layer, index }) => {
  const className = getLayerClassName(layer)
  const icon = getLayerIcon(layer)
  const title = getLayerTitle(layer)
  
  const style = {
    position: layer.layout.position || 'absolute',
    left: layer.layout.left,
    top: layer.layout.top,
    width: layer.layout.width || 'auto',
    height: layer.layout.height || 'auto'
  }

  return (
    <div
      key={layer.key || index}
      className={className}
      style={style}
      title={title}
    >
      {/* Layer name in top-left corner - always visible */}
      <div className="yoga-layer-name">
        <span className="yoga-layer-icon">{icon}</span>
        <span className="yoga-layer-label">{layer.displayName}</span>
      </div>
      
      {/* Details - only visible on hover */}
      <div className="yoga-layer-hover-details">
        <div className="yoga-layer-dimensions">
          {layer.layout.width}×{layer.layout.height}
        </div>
        
        <div className="yoga-layer-position">
          ({layer.layout.left}, {layer.layout.top})
        </div>
        
        {isTextLayer(layer) && (
          <div className="yoga-layer-details">
            <TextLayerDetails text={layer.text} />
          </div>
        )}
        
        {isImageLayer(layer) && (
          <div className="yoga-layer-details">
            <ImageLayerDetails image={layer.image} />
          </div>
        )}
      </div>
    </div>
  )
}

export default YogaLayerBox
