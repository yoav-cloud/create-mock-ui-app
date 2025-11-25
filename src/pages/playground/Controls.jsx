import React, { useMemo } from 'react'
import './Controls.css'
import { GOOGLE_FONTS, GRAVITY_VALUES } from './constants'
import { extractLayers, isTextLayer, isImageLayer } from '../../utils/layerUtils'
import { getAllFieldNames } from '../../utils/fieldMetadataUtils'

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
  wouldPropertyBeInherited,
  layerMap
}) {
  // Get all field names dynamically
  const fieldNames = useMemo(() => {
    return getAllFieldNames()
  }, [])

  // Get text layers for layer styles section
  const textLayers = useMemo(() => {
    if (!layerMap) return []
    const rules = editableRules[selectedDesign.id] || editableRules['parent'] || {}
    const layers = extractLayers(rules)
    return Object.entries(layers)
      .filter(([key, data]) => isTextLayer(data))
      .map(([key, data]) => ({
        layerKey: key,
        displayName: layerMap[key]?.displayName || key,
        layerData: data
      }))
  }, [layerMap, editableRules, selectedDesign.id])

  // Get image layers (with publicId) for image layer controls
  const imageLayers = useMemo(() => {
    if (!layerMap) return []
    const rules = editableRules[selectedDesign.id] || editableRules['parent'] || {}
    const layers = extractLayers(rules)
    return Object.entries(layers)
      .filter(([key, data]) => isImageLayer(data) && data.publicId)
      .map(([key, data]) => ({
        layerKey: key,
        displayName: layerMap[key]?.displayName || key,
        layerData: data
      }))
  }, [layerMap, editableRules, selectedDesign.id])

  // Helper to render inheritance icon
  const renderInheritanceIcon = (layerName, propertyKey) => {
    const isInherited = isPropertyInherited('Layers', layerName, propertyKey)
    const isOverridden = isPropertyOverriddenForDisplay('Layers', layerName, propertyKey)
    const wouldBeInherited = wouldPropertyBeInherited('Layers', layerName, propertyKey)
    const showIcon = isInherited || (isOverridden && wouldBeInherited)
    
    if (!showIcon) return null
    
    return (
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
    )
  }

  // Helper to render reset button
  const renderResetButton = (layerName, propertyKey) => {
    if (!isPropertyOverriddenForDisplay('Layers', layerName, propertyKey)) return null
    
    return (
      <button
        className="reset-property-btn"
        onClick={() => handleResetProperty('Layers', layerName, propertyKey)}
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
    )
  }

  // Helper to render property control (generic for any layer property)
  const renderPropertyControl = (category, layerKey, propertyKey, label, type, options = []) => {
    const layerName = layerMap[layerKey]?.displayName || layerKey
    const isInherited = isPropertyInherited(category, layerName, propertyKey)
    const isOverridden = isPropertyOverriddenForDisplay(category, layerName, propertyKey)
    const wouldBeInherited = wouldPropertyBeInherited(category, layerName, propertyKey)
    const showIcon = isInherited || (isOverridden && wouldBeInherited)

    const getPropertyValue = (designId, lKey, pKey) => {
      if (category === 'General') {
        return editableRules[designId]?.[pKey]
      }
      return editableRules[designId]?.[lKey]?.[pKey]
    }

    let value = getPropertyValue(selectedDesign.id, layerKey, propertyKey)
    let defaultValue = getPropertyValue('parent', layerKey, propertyKey)

    // Handle boolean values for toggles
    if (type === 'boolean') {
      value = value !== false // Default to true if undefined
      defaultValue = defaultValue !== false
    }

    return (
      <div className="control-group" key={propertyKey}>
        <div className="label-row">
          <label>{label}</label>
          {showIcon && (
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
          )}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          {type === 'boolean' ? (
            <div className="toggle-wrapper" onClick={() => handleRuleUpdate(category, layerName, propertyKey, !value)}>
              <div className={`toggle-track ${value ? 'active' : ''}`}>
                <div className="toggle-thumb"></div>
              </div>
            </div>
          ) : type === 'select' ? (
            <select
              value={value || ''}
              onChange={(e) => handleRuleUpdate(category, layerName, propertyKey, e.target.value)}
              style={{ flex: 1 }}
            >
              {options.map(opt => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          ) : (
            <input
              type={type === 'number' ? 'number' : type === 'color' ? 'color' : 'text'}
              value={value || ''}
              onChange={(e) => handleRuleUpdate(category, layerName, propertyKey, e.target.value)}
              style={{ flex: 1 }}
            />
          )}
          {isOverridden && (
            <button
              className="reset-property-btn"
              onClick={() => handleResetProperty(category, layerName, propertyKey)}
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
    )
  }

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

      </div>

      {/* Fields Section */}
      <div className="control-section">
        <h4 className="section-title">Fields</h4>
        
        {fieldNames.map(fieldName => {
          // Skip backgroundColor as it's handled in General section
          if (fieldName === 'backgroundColor') return null
          
          // Get display name from layerMap by finding the layer that has this fieldName
          let displayName = fieldName.charAt(0).toUpperCase() + fieldName.slice(1)
          if (layerMap) {
            const rules = editableRules[selectedDesign.id] || editableRules['parent'] || {}
            const layers = extractLayers(rules)
            // Find layer key that matches this fieldName
            const matchingLayerKey = Object.keys(layers).find(key => {
              const layerData = layers[key]
              if (isTextLayer(layerData)) {
                const layerFieldName = layerData.fieldName || key
                return layerFieldName === fieldName
              }
              return false
            })
            if (matchingLayerKey && layerMap[matchingLayerKey]) {
              displayName = layerMap[matchingLayerKey].displayName
            }
          }
          
          return (
            <div key={fieldName} className="control-group">
              <div className="label-row">
                <label>{displayName}</label>
                <div className="toggle-wrapper" onClick={() => handleToggleChange(fieldName)}>
                  <div className={`toggle-track ${useMetadata[fieldName] ? 'active' : ''}`}>
                    <div className="toggle-thumb"></div>
                  </div>
                  <span className="toggle-label">Use Metadata</span>
                </div>
              </div>
              <input 
                type="text" 
                name={fieldName}
                value={formValues[fieldName] || ''}
                onChange={handleInputChange}
              />
            </div>
          )
        })}
      </div>

      {/* Image Layers Section */}
      {imageLayers.length > 0 && (
        <div className="control-section">
          <h4 className="section-title">Image Layers</h4>

          {imageLayers.map(({ layerKey, displayName }) => (
            <div key={layerKey} className="control-subsection">
              <h5 className="subsection-title">{displayName}</h5>
              {renderPropertyControl('Layers', layerKey, 'show', 'Show', 'boolean')}
              {renderPropertyControl('Layers', layerKey, 'publicId', 'Public ID', 'text')}
              {renderPropertyControl('Layers', layerKey, 'width', 'Width', 'number')}
              {renderPropertyControl('Layers', layerKey, 'height', 'Height', 'number')}
              {renderPropertyControl('Layers', layerKey, 'x', 'X Position', 'number')}
              {renderPropertyControl('Layers', layerKey, 'y', 'Y Position', 'number')}
              {renderPropertyControl('Layers', layerKey, 'gravity', 'Gravity', 'select', Object.entries(GRAVITY_VALUES).map(([key, value]) => ({ label: key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1').trim(), value: value })))}
            </div>
          ))}
        </div>
      )}

      {/* Layer Styles Section */}
      <div className="control-section">
        <h4 className="section-title">Layer Styles</h4>
        
        {textLayers.map(({ layerKey, displayName }) => {
          const layerRules = editableRules[selectedDesign.id]?.[layerKey] || {}
          
          return (
            <div key={layerKey} className="control-subsection">
              <h5 className="subsection-title">{displayName}</h5>
              
              {/* Font */}
              <div className="control-group">
                <div className="label-row">
                  <label>Font</label>
                  {renderInheritanceIcon(displayName, 'font')}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <select 
                    value={layerRules.font || 'Arial'}
                    onChange={(e) => handleRuleUpdate('Layers', displayName, 'font', e.target.value)}
                    style={{ flex: 1 }}
                  >
                    {GOOGLE_FONTS.map(font => (
                      <option key={font.value} value={font.value}>
                        {font.name}
                      </option>
                    ))}
                  </select>
                  {renderResetButton(displayName, 'font')}
                </div>
              </div>
              
              {/* Text Flags */}
              <div className="control-group">
                <div className="label-row">
                  <label>No Overflow</label>
                  {renderInheritanceIcon(displayName, 'flNoOverflow')}
                </div>
                <div className="toggle-wrapper" onClick={() => handleRuleUpdate('Layers', displayName, 'flNoOverflow', !(layerRules.flNoOverflow || false))}>
                  <div className={`toggle-track ${layerRules.flNoOverflow ? 'active' : ''}`}>
                    <div className="toggle-thumb"></div>
                  </div>
                </div>
              </div>
              
              <div className="control-group">
                <div className="label-row">
                  <label>Disallow Overflow</label>
                  {renderInheritanceIcon(displayName, 'flTextDisallowOverflow')}
                </div>
                <div className="toggle-wrapper" onClick={() => handleRuleUpdate('Layers', displayName, 'flTextDisallowOverflow', !(layerRules.flTextDisallowOverflow || false))}>
                  <div className={`toggle-track ${layerRules.flTextDisallowOverflow ? 'active' : ''}`}>
                    <div className="toggle-thumb"></div>
                  </div>
                </div>
              </div>
              
              <div className="control-group">
                <div className="label-row">
                  <label>Text Wrap</label>
                  {renderInheritanceIcon(displayName, 'textWrap')}
                </div>
                <div className="toggle-wrapper" onClick={() => handleRuleUpdate('Layers', displayName, 'textWrap', !(layerRules.textWrap !== false))}>
                  <div className={`toggle-track ${layerRules.textWrap !== false ? 'active' : ''}`}>
                    <div className="toggle-thumb"></div>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
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
