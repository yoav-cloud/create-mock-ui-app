import React, { useState } from 'react'
import './DesignSelector.css'

export default function DesignSelector({ 
  selectedDesign, 
  onDesignChange, 
  designTypes,
  onAddChildDesign,
  canvasDimensions,
  inheritanceToggles,
  onInheritanceToggleChange,
  getRulesForDesign
}) {
  const [isParentHovered, setIsParentHovered] = useState(false)
  const types = Array.isArray(designTypes) && designTypes.length ? designTypes : []

  return (
    <div className="design-selector">
      <h3>Channels</h3>
      <div className="design-tree">
        {/* Parent Design */}
        {types.filter(d => d.id === 'parent').map(design => {
          const rules = getRulesForDesign ? getRulesForDesign(design.id) : {}
          const isSelected = selectedDesign.id === design.id
          const displayWidth = isSelected ? canvasDimensions.width : (rules.width || design.width)
          const displayHeight = isSelected ? canvasDimensions.height : (rules.height || design.height)
          return (
            <div key={design.id}>
              <div 
                className={`design-option parent ${isSelected ? 'active' : ''} ${isParentHovered ? 'hovered' : ''}`}
                onClick={() => onDesignChange(design)}
                onMouseEnter={() => setIsParentHovered(true)}
                onMouseLeave={() => setIsParentHovered(false)}
              >
                <div className="design-card-content">
                  <div className="design-name">{design.name}</div>
                  <div className="design-dims">{displayWidth} x {displayHeight}</div>
                  <div className="design-icon-wrapper">
                    <svg className="design-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                      <line x1="9" y1="3" x2="9" y2="21"></line>
                      <line x1="3" y1="9" x2="21" y2="9"></line>
                    </svg>
                  </div>
                </div>
                {/* Inheritance toggles - shown on hover, inside card */}
                {isParentHovered && (
                  <div className="inheritance-toggles" onMouseEnter={() => setIsParentHovered(true)}>
                    <div className="inheritance-toggle-item">
                      <label>Inherit Styles</label>
                      <div className="toggle-wrapper" onClick={(e) => e.stopPropagation()}>
                        <div className={`toggle-track active`} style={{ opacity: 0.5, cursor: 'not-allowed' }}>
                          <div className="toggle-thumb"></div>
                        </div>
                      </div>
                    </div>
                    <div className="inheritance-toggle-item">
                      <label>Inherit All</label>
                      <div className="toggle-wrapper" onClick={(e) => {
                        e.stopPropagation()
                        onInheritanceToggleChange({ ...inheritanceToggles, inheritAll: !inheritanceToggles.inheritAll })
                      }}>
                        <div className={`toggle-track ${inheritanceToggles.inheritAll ? 'active' : ''}`}>
                          <div className="toggle-thumb"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              {/* Tree connector line */}
              <div className="tree-connector">
                <div className="tree-line-vertical"></div>
                <div className="tree-line-horizontal"></div>
              </div>
            </div>
          )
        })}
        {/* Sub-designs */}
        <div className="sub-designs-container">
          {types.filter(d => d.id !== 'parent').map((design) => {
            const rules = getRulesForDesign ? getRulesForDesign(design.id) : {}
            const isSelected = selectedDesign.id === design.id
            const displayWidth = isSelected ? canvasDimensions.width : (rules.width || design.width)
            const displayHeight = isSelected ? canvasDimensions.height : (rules.height || design.height)
            return (
              <div key={design.id} className="sub-design-wrapper">
                <div 
                  className={`design-option sub ${isSelected ? 'active' : ''}`}
                  onClick={() => onDesignChange(design)}
                >
                  <div className="design-name">{design.name}</div>
                  <div className="design-dims">{displayWidth} x {displayHeight}</div>
                  <div className="design-icon-wrapper">
                    {design.id === 'ig-ad' ? (
                      <svg className="design-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                        <circle cx="12" cy="12" r="4"></circle>
                        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                      </svg>
                    ) : design.id === 'fb-mobile' ? (
                      <svg className="design-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                      </svg>
                    ) : null}
                  </div>
                </div>
              </div>
            )
          })}
          {typeof onAddChildDesign === 'function' && (
            <div className="sub-design-wrapper">
              <button
                type="button"
                className="design-option sub"
                onClick={onAddChildDesign}
                title="Create a new child design from the parent using AI"
                style={{ cursor: 'pointer' }}
              >
                <div className="design-name">+ Add child design</div>
                <div className="design-dims">AI</div>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

