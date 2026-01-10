const YogaInfoItem = ({ label, value }) => (
  <div className="yoga-info">
    <span className="yoga-info-label">{label}:</span>
    <span className="yoga-info-value">{value}</span>
  </div>
)

const YogaPreviewHeader = ({ designId, containerWidth, containerHeight, layerCount, scale }) => {
  return (
    <div className="yoga-preview-header">
      <YogaInfoItem label="Design" value={designId} />
      <YogaInfoItem label="Container" value={`${containerWidth}×${containerHeight}`} />
      <YogaInfoItem label="Layers" value={layerCount} />
      <YogaInfoItem label="Scale" value={`${(scale * 100).toFixed(0)}%`} />
    </div>
  )
}

export default YogaPreviewHeader
