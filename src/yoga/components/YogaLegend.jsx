const LegendItem = ({ type, label }) => (
  <div className="yoga-legend-item">
    <div className={`yoga-legend-swatch ${type}`}></div>
    <span>{label}</span>
  </div>
)

const YogaLegend = () => {
  return (
    <div className="yoga-legend">
      <LegendItem type="text" label="Text Layer" />
      <LegendItem type="image" label="Image Layer" />
      <LegendItem type="background" label="Background" />
    </div>
  )
}

export default YogaLegend
