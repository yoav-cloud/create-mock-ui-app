import React from 'react'
import './PlaygroundReview.css'

export default function ReviewCopyPanel({
  isOpen,
  onToggle,
  textLayers,
  formValues,
  onValueChange,
  onJumpToDesign
}) {
  return (
    <div className={`review-copy-panel ${isOpen ? 'open' : ''}`}>
      <button
        type="button"
        className="copy-panel-toggle"
        onClick={onToggle}
        aria-label={isOpen ? 'Collapse copy panel' : 'Expand copy panel'}
      >
        <svg
          className="copy-panel-icon"
          width="18"
          height="18"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            d="M4 7h16M4 12h12M4 17h9"
            stroke="currentColor"
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      <div className="copy-panel-content" aria-hidden={!isOpen}>
        <div className="copy-panel-header">
          <h3>Copy Overrides</h3>
          <p>Edit the text that feeds every design.</p>
        </div>

        <div className="copy-panel-body">
          {textLayers.length === 0 ? (
            <p className="copy-panel-empty">No editable text layers found.</p>
          ) : (
            textLayers.map(layer => {
              const fieldName = layer.fieldName
              const value = formValues[fieldName] ?? ''
              return (
                <div key={layer.layerKey} className="copy-panel-item">
                  <div className="copy-panel-item-header">
                    <div>
                      <h4>{layer.displayName}</h4>
                      <span>{fieldName}</span>
                    </div>
                    <button
                      type="button"
                      className="copy-panel-jump"
                      onClick={() => onJumpToDesign(fieldName)}
                      aria-label={`Edit ${layer.displayName} styles in Design tab`}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
                        <path d="M5 12h14M13 5l7 7-7 7" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </button>
                  </div>
                  <input
                    type="text"
                    value={value}
                    onChange={e => onValueChange(fieldName, e.target.value)}
                    placeholder={`Enter ${layer.displayName}`}
                    autoComplete="off"
                  />
                </div>
              )
            })
          )}
        </div>
      </div>
    </div>
  )
}

