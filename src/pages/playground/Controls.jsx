import React from 'react'
import './Controls.css'
import { GOOGLE_FONTS } from './constants'

export default function Controls({
  canvasDimensions,
  setCanvasDimensions,
  formValues,
  useMetadata,
  editableRules,
  selectedDesign,
  copySuccess,
  handleInputChange,
  handleToggleChange,
  handleRuleUpdate,
  handleResetProperty,
  handleCopy,
  getTransformedUrl,
  isPropertyInherited,
  isPropertyOverriddenForDisplay,
  wouldPropertyBeInherited
}) {
  return (
    <div className="controls-panel">
      <h3>Customize</h3>
      
      {/* General Section */}
      <div className="control-section">
        <h4 className="section-title">General</h4>
        
        <div className="control-group">
          <div className="label-row">
            <label>Width</label>
          </div>
          <input
            type="number"
            name="width"
            value={canvasDimensions.width}
            onChange={(e) => {
              const value = parseInt(e.target.value) || 0
              setCanvasDimensions(prev => ({ ...prev, width: value }))
            }}
            min="1"
            style={{
              width: '100%',
              padding: '0.5rem',
              border: '1px solid #444',
              borderRadius: '4px',
              backgroundColor: '#2a2a2a',
              color: '#fff'
            }}
          />
        </div>

        <div className="control-group">
          <div className="label-row">
            <label>Height</label>
          </div>
          <input
            type="number"
            name="height"
            value={canvasDimensions.height}
            onChange={(e) => {
              const value = parseInt(e.target.value) || 0
              setCanvasDimensions(prev => ({ ...prev, height: value }))
            }}
            min="1"
            style={{
              width: '100%',
              padding: '0.5rem',
              border: '1px solid #444',
              borderRadius: '4px',
              backgroundColor: '#2a2a2a',
              color: '#fff'
            }}
          />
        </div>

        <div className="control-group">
          <div className="label-row">
            <label>Background Color</label>
            <div className="toggle-wrapper" onClick={() => handleToggleChange('backgroundColor')}>
              <div className={`toggle-track ${useMetadata.backgroundColor ? 'active' : ''}`}>
                <div className="toggle-thumb"></div>
              </div>
              <span className="toggle-label">Use Metadata</span>
            </div>
          </div>
          <input 
            type="color" 
            name="backgroundColor"
            value={useMetadata.backgroundColor ? '#888888' : (formValues.backgroundColor || '#000428')}
            onChange={handleInputChange}
            disabled={useMetadata.backgroundColor}
            style={{ 
              width: '100%', 
              height: '40px', 
              border: '1px solid #444', 
              borderRadius: '4px',
              cursor: useMetadata.backgroundColor ? 'not-allowed' : 'pointer',
              opacity: useMetadata.backgroundColor ? 0.5 : 1
            }}
            title={useMetadata.backgroundColor ? 'Using metadata value (pbackgroundcolor)' : 'Background color'}
          />
        </div>

        <div className="control-group">
          <div className="label-row">
            <label>Show Logo</label>
            {(() => {
              const isInherited = isPropertyInherited('General', null, 'showLogo')
              const isOverridden = isPropertyOverriddenForDisplay('General', null, 'showLogo')
              const wouldBeInherited = wouldPropertyBeInherited('General', null, 'showLogo')
              const showIcon = isInherited || (isOverridden && wouldBeInherited)
              return showIcon ? (
                <svg 
                  width="14" 
                  height="14" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke={isInherited ? "var(--active-color)" : "#888"} 
                  strokeWidth="2" 
                  style={{ opacity: isInherited ? 0.7 : 0.4 }} 
                  title={isInherited ? "Inherited from parent" : "Would inherit from parent (currently overridden)"}
                >
                  <path d="M12 2L2 7l10 5 10-5-10-5z"></path>
                  <path d="M2 17l10 5 10-5"></path>
                  <path d="M2 12l10 5 10-5"></path>
                </svg>
              ) : null
            })()}
          </div>
          <div className="toggle-wrapper" onClick={() => {
            const currentValue = editableRules[selectedDesign.id]?.showLogo !== false
            handleRuleUpdate('General', null, 'showLogo', !currentValue)
          }}>
            <div className={`toggle-track ${(editableRules[selectedDesign.id]?.showLogo !== false) ? 'active' : ''}`}>
              <div className="toggle-thumb"></div>
            </div>
          </div>
          {isPropertyOverriddenForDisplay('General', null, 'showLogo') && (
            <button
              className="reset-property-btn"
              onClick={() => handleResetProperty('General', null, 'showLogo')}
              title="Reset to inherited value"
              style={{
                marginTop: '0.5rem',
                padding: '0.25rem 0.5rem',
                fontSize: '0.75rem',
                backgroundColor: 'transparent',
                border: '1px solid #555',
                borderRadius: '4px',
                color: '#aaa',
                cursor: 'pointer',
                transition: 'all 0.2s',
                whiteSpace: 'nowrap'
              }}
              onMouseEnter={(e) => {
                e.target.style.borderColor = 'var(--active-color)'
                e.target.style.color = 'var(--active-color)'
              }}
              onMouseLeave={(e) => {
                e.target.style.borderColor = '#555'
                e.target.style.color = '#aaa'
              }}
            >
              Reset
            </button>
          )}
        </div>

        <div className="control-group">
          <div className="label-row">
            <label>Logo Public ID</label>
            {(() => {
              const isInherited = isPropertyInherited('General', null, 'logoPublicId')
              const isOverridden = isPropertyOverriddenForDisplay('General', null, 'logoPublicId')
              const wouldBeInherited = wouldPropertyBeInherited('General', null, 'logoPublicId')
              const showIcon = isInherited || (isOverridden && wouldBeInherited)
              return showIcon ? (
                <svg 
                  width="14" 
                  height="14" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke={isInherited ? "var(--active-color)" : "#888"} 
                  strokeWidth="2" 
                  style={{ opacity: isInherited ? 0.7 : 0.4 }} 
                  title={isInherited ? "Inherited from parent" : "Would inherit from parent (currently overridden)"}
                >
                  <path d="M12 2L2 7l10 5 10-5-10-5z"></path>
                  <path d="M2 17l10 5 10-5"></path>
                  <path d="M2 12l10 5 10-5"></path>
                </svg>
              ) : null
            })()}
          </div>
          <input
            type="text"
            value={editableRules[selectedDesign.id]?.logoPublicId || 'create/shoes/shoe-logo-small'}
            onChange={(e) => handleRuleUpdate('General', null, 'logoPublicId', e.target.value)}
            style={{
              width: '100%',
              padding: '0.5rem',
              border: '1px solid #444',
              borderRadius: '4px',
              backgroundColor: '#2a2a2a',
              color: '#fff'
            }}
          />
          {isPropertyOverriddenForDisplay('General', null, 'logoPublicId') && (
            <button
              className="reset-property-btn"
              onClick={() => handleResetProperty('General', null, 'logoPublicId')}
              title="Reset to inherited value"
              style={{
                marginTop: '0.5rem',
                padding: '0.25rem 0.5rem',
                fontSize: '0.75rem',
                backgroundColor: 'transparent',
                border: '1px solid #555',
                borderRadius: '4px',
                color: '#aaa',
                cursor: 'pointer',
                transition: 'all 0.2s',
                whiteSpace: 'nowrap'
              }}
              onMouseEnter={(e) => {
                e.target.style.borderColor = 'var(--active-color)'
                e.target.style.color = 'var(--active-color)'
              }}
              onMouseLeave={(e) => {
                e.target.style.borderColor = '#555'
                e.target.style.color = '#aaa'
              }}
            >
              Reset
            </button>
          )}
        </div>
      </div>

      {/* Fields Section */}
      <div className="control-section">
        <h4 className="section-title">Fields</h4>
        
        <div className="control-group">
          <div className="label-row">
            <label>Title</label>
            <div className="toggle-wrapper" onClick={() => handleToggleChange('title')}>
               <div className={`toggle-track ${useMetadata.title ? 'active' : ''}`}>
                 <div className="toggle-thumb"></div>
               </div>
              <span className="toggle-label">Use Metadata</span>
            </div>
          </div>
          <input 
            type="text" 
            name="title"
            value={formValues.title}
            onChange={handleInputChange}
          />
        </div>

        <div className="control-group">
          <div className="label-row">
            <label>Tagline</label>
            <div className="toggle-wrapper" onClick={() => handleToggleChange('tagline')}>
               <div className={`toggle-track ${useMetadata.tagline ? 'active' : ''}`}>
                 <div className="toggle-thumb"></div>
               </div>
              <span className="toggle-label">Use Metadata</span>
            </div>
          </div>
          <input 
            type="text" 
            name="tagline"
            value={formValues.tagline}
            onChange={handleInputChange}
          />
        </div>

        <div className="control-group">
           <div className="label-row">
            <label>Price ($)</label>
            <div className="toggle-wrapper" onClick={() => handleToggleChange('price')}>
               <div className={`toggle-track ${useMetadata.price ? 'active' : ''}`}>
                 <div className="toggle-thumb"></div>
               </div>
              <span className="toggle-label">Use Metadata</span>
            </div>
          </div>
          <input 
            type="text" 
            name="price"
            value={formValues.price}
            onChange={handleInputChange}
          />
        </div>

      </div>

      {/* Layer Styles Section */}
      <div className="control-section">
        <h4 className="section-title">Layer Styles</h4>
        
        {/* Title Font */}
        <div className="control-subsection">
          <h5 className="subsection-title">Title</h5>
          <div className="control-group">
            <div className="label-row">
              <label>Font</label>
              {(() => {
                const isInherited = isPropertyInherited('Layers', 'Title', 'font')
                const isOverridden = isPropertyOverriddenForDisplay('Layers', 'Title', 'font')
                const wouldBeInherited = wouldPropertyBeInherited('Layers', 'Title', 'font')
                const showIcon = isInherited || (isOverridden && wouldBeInherited)
                return showIcon ? (
                  <svg 
                    width="14" 
                    height="14" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke={isInherited ? "var(--active-color)" : "#888"} 
                    strokeWidth="2" 
                    style={{ opacity: isInherited ? 0.7 : 0.4 }} 
                    title={isInherited ? "Inherited from parent" : "Would inherit from parent (currently overridden)"}
                  >
                    <path d="M12 2L2 7l10 5 10-5-10-5z"></path>
                    <path d="M2 17l10 5 10-5"></path>
                    <path d="M2 12l10 5 10-5"></path>
                  </svg>
                ) : null
              })()}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <select 
                value={editableRules[selectedDesign.id]?.title?.font || 'Arial'}
                onChange={(e) => handleRuleUpdate('Layers', 'Title', 'font', e.target.value)}
                style={{ flex: 1 }}
              >
                {GOOGLE_FONTS.map(font => (
                  <option key={font.value} value={font.value}>
                    {font.name}
                  </option>
                ))}
              </select>
              {isPropertyOverriddenForDisplay('Layers', 'Title', 'font') && (
                <button
                  className="reset-property-btn"
                  onClick={() => handleResetProperty('Layers', 'Title', 'font')}
                  title="Reset to inherited value"
                  style={{
                    padding: '0.25rem 0.5rem',
                    fontSize: '0.75rem',
                    backgroundColor: 'transparent',
                    border: '1px solid #555',
                    borderRadius: '4px',
                    color: '#aaa',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    whiteSpace: 'nowrap'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.borderColor = 'var(--active-color)'
                    e.target.style.color = 'var(--active-color)'
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.borderColor = '#555'
                    e.target.style.color = '#aaa'
                  }}
                >
                  Reset
                </button>
              )}
            </div>
          </div>
          
          {/* Text Flags */}
          <div className="control-group">
            <div className="label-row">
              <label>No Overflow</label>
              {(() => {
                const isInherited = isPropertyInherited('Layers', 'Title', 'flNoOverflow')
                const isOverridden = isPropertyOverriddenForDisplay('Layers', 'Title', 'flNoOverflow')
                const wouldBeInherited = wouldPropertyBeInherited('Layers', 'Title', 'flNoOverflow')
                const showIcon = isInherited || (isOverridden && wouldBeInherited)
                return showIcon ? (
                  <svg 
                    width="14" 
                    height="14" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke={isInherited ? "var(--active-color)" : "#888"} 
                    strokeWidth="2" 
                    style={{ opacity: isInherited ? 0.7 : 0.4 }} 
                    title={isInherited ? "Inherited from parent" : "Would inherit from parent (currently overridden)"}
                  >
                    <path d="M12 2L2 7l10 5 10-5-10-5z"></path>
                    <path d="M2 17l10 5 10-5"></path>
                    <path d="M2 12l10 5 10-5"></path>
                  </svg>
                ) : null
              })()}
            </div>
            <div className="toggle-wrapper" onClick={() => handleRuleUpdate('Layers', 'Title', 'flNoOverflow', !(editableRules[selectedDesign.id]?.title?.flNoOverflow || false))}>
              <div className={`toggle-track ${editableRules[selectedDesign.id]?.title?.flNoOverflow ? 'active' : ''}`}>
                <div className="toggle-thumb"></div>
              </div>
            </div>
          </div>
          
          <div className="control-group">
            <div className="label-row">
              <label>Disallow Overflow</label>
              {(() => {
                const isInherited = isPropertyInherited('Layers', 'Title', 'flTextDisallowOverflow')
                const isOverridden = isPropertyOverriddenForDisplay('Layers', 'Title', 'flTextDisallowOverflow')
                const wouldBeInherited = wouldPropertyBeInherited('Layers', 'Title', 'flTextDisallowOverflow')
                const showIcon = isInherited || (isOverridden && wouldBeInherited)
                return showIcon ? (
                  <svg 
                    width="14" 
                    height="14" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke={isInherited ? "var(--active-color)" : "#888"} 
                    strokeWidth="2" 
                    style={{ opacity: isInherited ? 0.7 : 0.4 }} 
                    title={isInherited ? "Inherited from parent" : "Would inherit from parent (currently overridden)"}
                  >
                    <path d="M12 2L2 7l10 5 10-5-10-5z"></path>
                    <path d="M2 17l10 5 10-5"></path>
                    <path d="M2 12l10 5 10-5"></path>
                  </svg>
                ) : null
              })()}
            </div>
            <div className="toggle-wrapper" onClick={() => handleRuleUpdate('Layers', 'Title', 'flTextDisallowOverflow', !(editableRules[selectedDesign.id]?.title?.flTextDisallowOverflow || false))}>
              <div className={`toggle-track ${editableRules[selectedDesign.id]?.title?.flTextDisallowOverflow ? 'active' : ''}`}>
                <div className="toggle-thumb"></div>
              </div>
            </div>
          </div>
          
          <div className="control-group">
            <div className="label-row">
              <label>Text Wrap</label>
              {(() => {
                const isInherited = isPropertyInherited('Layers', 'Title', 'textWrap')
                const isOverridden = isPropertyOverriddenForDisplay('Layers', 'Title', 'textWrap')
                const wouldBeInherited = wouldPropertyBeInherited('Layers', 'Title', 'textWrap')
                const showIcon = isInherited || (isOverridden && wouldBeInherited)
                return showIcon ? (
                  <svg 
                    width="14" 
                    height="14" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke={isInherited ? "var(--active-color)" : "#888"} 
                    strokeWidth="2" 
                    style={{ opacity: isInherited ? 0.7 : 0.4 }} 
                    title={isInherited ? "Inherited from parent" : "Would inherit from parent (currently overridden)"}
                  >
                    <path d="M12 2L2 7l10 5 10-5-10-5z"></path>
                    <path d="M2 17l10 5 10-5"></path>
                    <path d="M2 12l10 5 10-5"></path>
                  </svg>
                ) : null
              })()}
            </div>
            <div className="toggle-wrapper" onClick={() => handleRuleUpdate('Layers', 'Title', 'textWrap', !(editableRules[selectedDesign.id]?.title?.textWrap !== false))}>
              <div className={`toggle-track ${editableRules[selectedDesign.id]?.title?.textWrap !== false ? 'active' : ''}`}>
                <div className="toggle-thumb"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Tagline Font */}
        <div className="control-subsection">
          <h5 className="subsection-title">Tagline</h5>
          <div className="control-group">
            <div className="label-row">
              <label>Font</label>
              {(() => {
                const isInherited = isPropertyInherited('Layers', 'Tagline', 'font')
                const isOverridden = isPropertyOverriddenForDisplay('Layers', 'Tagline', 'font')
                const wouldBeInherited = wouldPropertyBeInherited('Layers', 'Tagline', 'font')
                const showIcon = isInherited || (isOverridden && wouldBeInherited)
                return showIcon ? (
                  <svg 
                    width="14" 
                    height="14" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke={isInherited ? "var(--active-color)" : "#888"} 
                    strokeWidth="2" 
                    style={{ opacity: isInherited ? 0.7 : 0.4 }} 
                    title={isInherited ? "Inherited from parent" : "Would inherit from parent (currently overridden)"}
                  >
                    <path d="M12 2L2 7l10 5 10-5-10-5z"></path>
                    <path d="M2 17l10 5 10-5"></path>
                    <path d="M2 12l10 5 10-5"></path>
                  </svg>
                ) : null
              })()}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <select 
                value={editableRules[selectedDesign.id]?.tagline?.font || 'Arial'}
                onChange={(e) => handleRuleUpdate('Layers', 'Tagline', 'font', e.target.value)}
                style={{ flex: 1 }}
              >
                {GOOGLE_FONTS.map(font => (
                  <option key={font.value} value={font.value}>
                    {font.name}
                  </option>
                ))}
              </select>
              {isPropertyOverriddenForDisplay('Layers', 'Tagline', 'font') && (
                <button
                  className="reset-property-btn"
                  onClick={() => handleResetProperty('Layers', 'Tagline', 'font')}
                  title="Reset to inherited value"
                  style={{
                    padding: '0.25rem 0.5rem',
                    fontSize: '0.75rem',
                    backgroundColor: 'transparent',
                    border: '1px solid #555',
                    borderRadius: '4px',
                    color: '#aaa',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    whiteSpace: 'nowrap'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.borderColor = 'var(--active-color)'
                    e.target.style.color = 'var(--active-color)'
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.borderColor = '#555'
                    e.target.style.color = '#aaa'
                  }}
                >
                  Reset
                </button>
              )}
            </div>
          </div>
          
          {/* Text Flags */}
          <div className="control-group">
            <div className="label-row">
              <label>No Overflow</label>
              {(() => {
                const isInherited = isPropertyInherited('Layers', 'Tagline', 'flNoOverflow')
                const isOverridden = isPropertyOverriddenForDisplay('Layers', 'Tagline', 'flNoOverflow')
                const wouldBeInherited = wouldPropertyBeInherited('Layers', 'Tagline', 'flNoOverflow')
                const showIcon = isInherited || (isOverridden && wouldBeInherited)
                return showIcon ? (
                  <svg 
                    width="14" 
                    height="14" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke={isInherited ? "var(--active-color)" : "#888"} 
                    strokeWidth="2" 
                    style={{ opacity: isInherited ? 0.7 : 0.4 }} 
                    title={isInherited ? "Inherited from parent" : "Would inherit from parent (currently overridden)"}
                  >
                    <path d="M12 2L2 7l10 5 10-5-10-5z"></path>
                    <path d="M2 17l10 5 10-5"></path>
                    <path d="M2 12l10 5 10-5"></path>
                  </svg>
                ) : null
              })()}
            </div>
            <div className="toggle-wrapper" onClick={() => handleRuleUpdate('Layers', 'Tagline', 'flNoOverflow', !(editableRules[selectedDesign.id]?.tagline?.flNoOverflow || false))}>
              <div className={`toggle-track ${editableRules[selectedDesign.id]?.tagline?.flNoOverflow ? 'active' : ''}`}>
                <div className="toggle-thumb"></div>
              </div>
            </div>
          </div>
          
          <div className="control-group">
            <div className="label-row">
              <label>Disallow Overflow</label>
              {(() => {
                const isInherited = isPropertyInherited('Layers', 'Tagline', 'flTextDisallowOverflow')
                const isOverridden = isPropertyOverriddenForDisplay('Layers', 'Tagline', 'flTextDisallowOverflow')
                const wouldBeInherited = wouldPropertyBeInherited('Layers', 'Tagline', 'flTextDisallowOverflow')
                const showIcon = isInherited || (isOverridden && wouldBeInherited)
                return showIcon ? (
                  <svg 
                    width="14" 
                    height="14" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke={isInherited ? "var(--active-color)" : "#888"} 
                    strokeWidth="2" 
                    style={{ opacity: isInherited ? 0.7 : 0.4 }} 
                    title={isInherited ? "Inherited from parent" : "Would inherit from parent (currently overridden)"}
                  >
                    <path d="M12 2L2 7l10 5 10-5-10-5z"></path>
                    <path d="M2 17l10 5 10-5"></path>
                    <path d="M2 12l10 5 10-5"></path>
                  </svg>
                ) : null
              })()}
            </div>
            <div className="toggle-wrapper" onClick={() => handleRuleUpdate('Layers', 'Tagline', 'flTextDisallowOverflow', !(editableRules[selectedDesign.id]?.tagline?.flTextDisallowOverflow || false))}>
              <div className={`toggle-track ${editableRules[selectedDesign.id]?.tagline?.flTextDisallowOverflow ? 'active' : ''}`}>
                <div className="toggle-thumb"></div>
              </div>
            </div>
          </div>
          
          <div className="control-group">
            <div className="label-row">
              <label>Text Wrap</label>
              {(() => {
                const isInherited = isPropertyInherited('Layers', 'Tagline', 'textWrap')
                const isOverridden = isPropertyOverriddenForDisplay('Layers', 'Tagline', 'textWrap')
                const wouldBeInherited = wouldPropertyBeInherited('Layers', 'Tagline', 'textWrap')
                const showIcon = isInherited || (isOverridden && wouldBeInherited)
                return showIcon ? (
                  <svg 
                    width="14" 
                    height="14" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke={isInherited ? "var(--active-color)" : "#888"} 
                    strokeWidth="2" 
                    style={{ opacity: isInherited ? 0.7 : 0.4 }} 
                    title={isInherited ? "Inherited from parent" : "Would inherit from parent (currently overridden)"}
                  >
                    <path d="M12 2L2 7l10 5 10-5-10-5z"></path>
                    <path d="M2 17l10 5 10-5"></path>
                    <path d="M2 12l10 5 10-5"></path>
                  </svg>
                ) : null
              })()}
            </div>
            <div className="toggle-wrapper" onClick={() => handleRuleUpdate('Layers', 'Tagline', 'textWrap', !(editableRules[selectedDesign.id]?.tagline?.textWrap !== false))}>
              <div className={`toggle-track ${editableRules[selectedDesign.id]?.tagline?.textWrap !== false ? 'active' : ''}`}>
                <div className="toggle-thumb"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Price Font */}
        <div className="control-subsection">
          <h5 className="subsection-title">Price</h5>
          <div className="control-group">
            <div className="label-row">
              <label>Font</label>
              {(() => {
                const isInherited = isPropertyInherited('Layers', 'Price', 'font')
                const isOverridden = isPropertyOverriddenForDisplay('Layers', 'Price', 'font')
                const wouldBeInherited = wouldPropertyBeInherited('Layers', 'Price', 'font')
                const showIcon = isInherited || (isOverridden && wouldBeInherited)
                return showIcon ? (
                  <svg 
                    width="14" 
                    height="14" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke={isInherited ? "var(--active-color)" : "#888"} 
                    strokeWidth="2" 
                    style={{ opacity: isInherited ? 0.7 : 0.4 }} 
                    title={isInherited ? "Inherited from parent" : "Would inherit from parent (currently overridden)"}
                  >
                    <path d="M12 2L2 7l10 5 10-5-10-5z"></path>
                    <path d="M2 17l10 5 10-5"></path>
                    <path d="M2 12l10 5 10-5"></path>
                  </svg>
                ) : null
              })()}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <select 
                value={editableRules[selectedDesign.id]?.price?.font || 'Arial'}
                onChange={(e) => handleRuleUpdate('Layers', 'Price', 'font', e.target.value)}
                style={{ flex: 1 }}
              >
                {GOOGLE_FONTS.map(font => (
                  <option key={font.value} value={font.value}>
                    {font.name}
                  </option>
                ))}
              </select>
              {isPropertyOverriddenForDisplay('Layers', 'Price', 'font') && (
                <button
                  className="reset-property-btn"
                  onClick={() => handleResetProperty('Layers', 'Price', 'font')}
                  title="Reset to inherited value"
                  style={{
                    padding: '0.25rem 0.5rem',
                    fontSize: '0.75rem',
                    backgroundColor: 'transparent',
                    border: '1px solid #555',
                    borderRadius: '4px',
                    color: '#aaa',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    whiteSpace: 'nowrap'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.borderColor = 'var(--active-color)'
                    e.target.style.color = 'var(--active-color)'
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.borderColor = '#555'
                    e.target.style.color = '#aaa'
                  }}
                >
                  Reset
                </button>
              )}
            </div>
          </div>
          
          {/* Text Flags */}
          <div className="control-group">
            <div className="label-row">
              <label>No Overflow</label>
              {(() => {
                const isInherited = isPropertyInherited('Layers', 'Price', 'flNoOverflow')
                const isOverridden = isPropertyOverriddenForDisplay('Layers', 'Price', 'flNoOverflow')
                const wouldBeInherited = wouldPropertyBeInherited('Layers', 'Price', 'flNoOverflow')
                const showIcon = isInherited || (isOverridden && wouldBeInherited)
                return showIcon ? (
                  <svg 
                    width="14" 
                    height="14" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke={isInherited ? "var(--active-color)" : "#888"} 
                    strokeWidth="2" 
                    style={{ opacity: isInherited ? 0.7 : 0.4 }} 
                    title={isInherited ? "Inherited from parent" : "Would inherit from parent (currently overridden)"}
                  >
                    <path d="M12 2L2 7l10 5 10-5-10-5z"></path>
                    <path d="M2 17l10 5 10-5"></path>
                    <path d="M2 12l10 5 10-5"></path>
                  </svg>
                ) : null
              })()}
            </div>
            <div className="toggle-wrapper" onClick={() => handleRuleUpdate('Layers', 'Price', 'flNoOverflow', !(editableRules[selectedDesign.id]?.price?.flNoOverflow || false))}>
              <div className={`toggle-track ${editableRules[selectedDesign.id]?.price?.flNoOverflow ? 'active' : ''}`}>
                <div className="toggle-thumb"></div>
              </div>
            </div>
          </div>
          
          <div className="control-group">
            <div className="label-row">
              <label>Disallow Overflow</label>
              {(() => {
                const isInherited = isPropertyInherited('Layers', 'Price', 'flTextDisallowOverflow')
                const isOverridden = isPropertyOverriddenForDisplay('Layers', 'Price', 'flTextDisallowOverflow')
                const wouldBeInherited = wouldPropertyBeInherited('Layers', 'Price', 'flTextDisallowOverflow')
                const showIcon = isInherited || (isOverridden && wouldBeInherited)
                return showIcon ? (
                  <svg 
                    width="14" 
                    height="14" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke={isInherited ? "var(--active-color)" : "#888"} 
                    strokeWidth="2" 
                    style={{ opacity: isInherited ? 0.7 : 0.4 }} 
                    title={isInherited ? "Inherited from parent" : "Would inherit from parent (currently overridden)"}
                  >
                    <path d="M12 2L2 7l10 5 10-5-10-5z"></path>
                    <path d="M2 17l10 5 10-5"></path>
                    <path d="M2 12l10 5 10-5"></path>
                  </svg>
                ) : null
              })()}
            </div>
            <div className="toggle-wrapper" onClick={() => handleRuleUpdate('Layers', 'Price', 'flTextDisallowOverflow', !(editableRules[selectedDesign.id]?.price?.flTextDisallowOverflow || false))}>
              <div className={`toggle-track ${editableRules[selectedDesign.id]?.price?.flTextDisallowOverflow ? 'active' : ''}`}>
                <div className="toggle-thumb"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Original Price Font */}
        <div className="control-subsection">
          <h5 className="subsection-title">Original Price</h5>
          <div className="control-group">
            <div className="label-row">
              <label>Font</label>
              {(() => {
                const isInherited = isPropertyInherited('Layers', 'Original Price', 'font')
                const isOverridden = isPropertyOverriddenForDisplay('Layers', 'Original Price', 'font')
                const wouldBeInherited = wouldPropertyBeInherited('Layers', 'Original Price', 'font')
                const showIcon = isInherited || (isOverridden && wouldBeInherited)
                return showIcon ? (
                  <svg 
                    width="14" 
                    height="14" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke={isInherited ? "var(--active-color)" : "#888"} 
                    strokeWidth="2" 
                    style={{ opacity: isInherited ? 0.7 : 0.4 }} 
                    title={isInherited ? "Inherited from parent" : "Would inherit from parent (currently overridden)"}
                  >
                    <path d="M12 2L2 7l10 5 10-5-10-5z"></path>
                    <path d="M2 17l10 5 10-5"></path>
                    <path d="M2 12l10 5 10-5"></path>
                  </svg>
                ) : null
              })()}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <select 
                value={editableRules[selectedDesign.id]?.origPrice?.font || 'Arial'}
                onChange={(e) => handleRuleUpdate('Layers', 'Original Price', 'font', e.target.value)}
                style={{ flex: 1 }}
              >
                {GOOGLE_FONTS.map(font => (
                  <option key={font.value} value={font.value}>
                    {font.name}
                  </option>
                ))}
              </select>
              {isPropertyOverriddenForDisplay('Layers', 'Original Price', 'font') && (
                <button
                  className="reset-property-btn"
                  onClick={() => handleResetProperty('Layers', 'Original Price', 'font')}
                  title="Reset to inherited value"
                  style={{
                    padding: '0.25rem 0.5rem',
                    fontSize: '0.75rem',
                    backgroundColor: 'transparent',
                    border: '1px solid #555',
                    borderRadius: '4px',
                    color: '#aaa',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    whiteSpace: 'nowrap'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.borderColor = 'var(--active-color)'
                    e.target.style.color = 'var(--active-color)'
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.borderColor = '#555'
                    e.target.style.color = '#aaa'
                  }}
                >
                  Reset
                </button>
              )}
            </div>
          </div>
          
          {/* Text Flags */}
          <div className="control-group">
            <div className="label-row">
              <label>No Overflow</label>
              {(() => {
                const isInherited = isPropertyInherited('Layers', 'Original Price', 'flNoOverflow')
                const isOverridden = isPropertyOverriddenForDisplay('Layers', 'Original Price', 'flNoOverflow')
                const wouldBeInherited = wouldPropertyBeInherited('Layers', 'Original Price', 'flNoOverflow')
                const showIcon = isInherited || (isOverridden && wouldBeInherited)
                return showIcon ? (
                  <svg 
                    width="14" 
                    height="14" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke={isInherited ? "var(--active-color)" : "#888"} 
                    strokeWidth="2" 
                    style={{ opacity: isInherited ? 0.7 : 0.4 }} 
                    title={isInherited ? "Inherited from parent" : "Would inherit from parent (currently overridden)"}
                  >
                    <path d="M12 2L2 7l10 5 10-5-10-5z"></path>
                    <path d="M2 17l10 5 10-5"></path>
                    <path d="M2 12l10 5 10-5"></path>
                  </svg>
                ) : null
              })()}
            </div>
            <div className="toggle-wrapper" onClick={() => handleRuleUpdate('Layers', 'Original Price', 'flNoOverflow', !(editableRules[selectedDesign.id]?.origPrice?.flNoOverflow || false))}>
              <div className={`toggle-track ${editableRules[selectedDesign.id]?.origPrice?.flNoOverflow ? 'active' : ''}`}>
                <div className="toggle-thumb"></div>
              </div>
            </div>
          </div>
          
          <div className="control-group">
            <div className="label-row">
              <label>Disallow Overflow</label>
              {(() => {
                const isInherited = isPropertyInherited('Layers', 'Original Price', 'flTextDisallowOverflow')
                const isOverridden = isPropertyOverriddenForDisplay('Layers', 'Original Price', 'flTextDisallowOverflow')
                const wouldBeInherited = wouldPropertyBeInherited('Layers', 'Original Price', 'flTextDisallowOverflow')
                const showIcon = isInherited || (isOverridden && wouldBeInherited)
                return showIcon ? (
                  <svg 
                    width="14" 
                    height="14" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke={isInherited ? "var(--active-color)" : "#888"} 
                    strokeWidth="2" 
                    style={{ opacity: isInherited ? 0.7 : 0.4 }} 
                    title={isInherited ? "Inherited from parent" : "Would inherit from parent (currently overridden)"}
                  >
                    <path d="M12 2L2 7l10 5 10-5-10-5z"></path>
                    <path d="M2 17l10 5 10-5"></path>
                    <path d="M2 12l10 5 10-5"></path>
                  </svg>
                ) : null
              })()}
            </div>
            <div className="toggle-wrapper" onClick={() => handleRuleUpdate('Layers', 'Original Price', 'flTextDisallowOverflow', !(editableRules[selectedDesign.id]?.origPrice?.flTextDisallowOverflow || false))}>
              <div className={`toggle-track ${editableRules[selectedDesign.id]?.origPrice?.flTextDisallowOverflow ? 'active' : ''}`}>
                <div className="toggle-thumb"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="generated-url">
        <div className="url-header">
          <label>Generated URL</label>
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <button 
              className="copy-btn"
              onClick={handleCopy}
            >
              {copySuccess || 'Copy'}
            </button>
          </div>
        </div>
        <div className="url-display">
          {getTransformedUrl()}
        </div>
      </div>
    </div>
  )
}
