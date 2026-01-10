const YogaEmptyState = () => {
  return (
    <div className="yoga-preview-empty">
      <div className="yoga-empty-icon">🧘</div>
      <p>No Yoga Layout available for this design</p>
      <p className="yoga-empty-hint">Import a design from Figma to see the Yoga representation</p>
    </div>
  )
}

export default YogaEmptyState
