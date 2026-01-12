const YogaBackgroundLayer = ({ backgroundImage }) => {
  if (!backgroundImage) return null

  const style = {
    position: 'absolute',
    left: backgroundImage.x || 0,
    top: backgroundImage.y || 0,
    width: backgroundImage.width,
    height: backgroundImage.height,
    zIndex: 0
  }

  return (
    <div
      className="yoga-layer yoga-background"
      style={style}
      title="Background Image"
    >
      <div className="yoga-layer-content">
        <span className="yoga-layer-icon">🖼️</span>
        <span className="yoga-layer-label">Background</span>
      </div>
    </div>
  )
}

export default YogaBackgroundLayer
