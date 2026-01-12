import './BannerSizeButtons.css'

const BANNER_SIZES = [
  { id: 'leaderboard', name: 'Leaderboard', width: 728, height: 90 },
  { id: 'medium-rect', name: 'Medium Rectangle', width: 300, height: 250 },
  { id: 'skyscraper', name: 'Wide Skyscraper', width: 160, height: 600 },
  { id: 'large-rect', name: 'Large Rectangle', width: 336, height: 280 },
  { id: 'half-page', name: 'Half Page', width: 300, height: 600 }
]

const BannerSizeButtons = ({ onSizeSelect, activeSizeId, isOriginal, onResetOriginal, onSaveAsSubDesign, currentBannerSize }) => {
  return (
    <div className="banner-size-controls">
      <div className="banner-size-header">
        <span className="banner-size-label">Reflow to Banner Size:</span>
        <div className="banner-size-actions">
          {!isOriginal && (
            <>
              <button
                type="button"
                className="save-design-btn"
                onClick={onSaveAsSubDesign}
                title="Save this reflowed layout as a new sub-design"
              >
                💾 Save as Sub-Design
              </button>
              <button
                type="button"
                className="reset-size-btn"
                onClick={onResetOriginal}
                title="Reset to original size"
              >
                ↻ Reset
              </button>
            </>
          )}
        </div>
      </div>
      <div className="banner-size-buttons">
        {BANNER_SIZES.map(size => (
          <button
            key={size.id}
            type="button"
            className={`banner-size-btn ${activeSizeId === size.id ? 'active' : ''}`}
            onClick={() => onSizeSelect(size)}
            title={`${size.width}×${size.height}`}
          >
            <span className="banner-size-name">{size.name}</span>
            <span className="banner-size-dims">{size.width}×{size.height}</span>
          </button>
        ))}
      </div>
    </div>
  )
}

export default BannerSizeButtons
