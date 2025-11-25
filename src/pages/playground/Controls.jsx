import React, { useMemo, useEffect, useState } from 'react'
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
  layerMap,
  highlightedField,
  expandedLayers,
  setExpandedLayers,
  highlightedLayer
}) {
  // Get all layers in order from design_rules
  const allLayers = useMemo(() => {
    if (!layerMap) return []
    const rules = editableRules[selectedDesign.id] || editableRules['parent'] || {}
    const layers = extractLayers(rules)
    
    // Get layer keys in the order they appear in design_rules (object key order)
    // We need to match against the original design_rules structure
    const layerKeys = Object.keys(layerMap) // layerMap keys are in design_rules order
    
    return layerKeys
      .filter(key => layers[key]) // Only include layers that exist in current rules
      .map(key => ({
        layerKey: key,
        displayName: layerMap[key]?.displayName || key,
        layerData: layers[key]
      }))
  }, [layerMap, editableRules, selectedDesign.id])

  // Initialize expanded layers state
  const [localExpandedLayers, setLocalExpandedLayers] = useState(() => {
    // Initialize with all layers expanded by default, or use prop if provided
    if (expandedLayers !== undefined) {
      return expandedLayers
    }
    return new Set(allLayers.map(l => l.layerKey))
  })

  // Sync with prop if provided
  useEffect(() => {
    if (expandedLayers !== undefined) {
      setLocalExpandedLayers(expandedLayers)
    }
  }, [expandedLayers])

  // Toggle layer expansion
  const toggleLayer = (layerKey) => {
    const newExpanded = new Set(localExpandedLayers)
    if (newExpanded.has(layerKey)) {
      newExpanded.delete(layerKey)
    } else {
      newExpanded.add(layerKey)
    }
    setLocalExpandedLayers(newExpanded)
    if (setExpandedLayers) {
      setExpandedLayers(newExpanded)
    }
  }

  // Expand a specific layer when highlightedField changes (called from parent when layer indicator is clicked)
  useEffect(() => {
    if (highlightedField) {
      // Find the layer that corresponds to this field
      const layer = allLayers.find(l => {
        if (isTextLayer(l.layerData)) {
          const fieldName = l.layerData.fieldName || l.layerKey
          return fieldName === highlightedField
        }
        return false
      })
      
      if (layer) {
        setLocalExpandedLayers(prev => {
          const newExpanded = new Set(prev)
          newExpanded.add(layer.layerKey)
          if (setExpandedLayers) {
            setExpandedLayers(newExpanded)
          }
          return newExpanded
        })
      }
    }
  }, [highlightedField, allLayers, setExpandedLayers])

  // Apply/remove highlighted class to control groups and accordions, and scroll to accordion
  useEffect(() => {
    // Remove all highlights first
    document.querySelectorAll('.control-group.highlighted').forEach(el => {
      el.classList.remove('highlighted')
    })
    document.querySelectorAll('.layer-accordion.highlighted').forEach(el => {
      el.classList.remove('highlighted')
    })

    // Add highlight to matching accordion and scroll
    if (highlightedLayer) {
      // Small delay to ensure accordion is expanded before scrolling
      setTimeout(() => {
        const accordionElement = document.querySelector(`[data-layer-key="${highlightedLayer}"]`)
        if (accordionElement) {
          accordionElement.classList.add('highlighted')
          // Scroll to the accordion, showing as much of it as possible
          // Use 'nearest' block to show as much as possible without cutting off
          accordionElement.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
        }
      }, 100) // Wait for accordion expansion animation
    }

    // Add highlight to matching field
    if (highlightedField) {
      const fieldElement = document.querySelector(`[data-field-name="${highlightedField}"]`)
      if (fieldElement) {
        fieldElement.classList.add('highlighted')
      }
    }
  }, [highlightedField, highlightedLayer])

  // Helper to render inheritance icon and reset button together
  const renderInheritanceIcon = (layerName, propertyKey) => {
    const isInherited = isPropertyInherited('Layers', layerName, propertyKey)
    const isOverridden = isPropertyOverriddenForDisplay('Layers', layerName, propertyKey)
    const wouldBeInherited = wouldPropertyBeInherited('Layers', layerName, propertyKey)
    const showIcon = isInherited || (isOverridden && wouldBeInherited)
    
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
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
        {isOverridden && (
          <button
            className="reset-property-btn-icon"
            onClick={(e) => {
              e.stopPropagation()
              handleResetProperty('Layers', layerName, propertyKey)
            }}
            title="Reset to inherited value"
            style={{
              padding: '0.125rem',
              backgroundColor: 'transparent',
              border: 'none',
              borderRadius: '4px',
              color: '#888',
              cursor: 'pointer',
              transition: 'all 0.2s',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '18px',
              height: '18px'
            }}
            onMouseEnter={(e) => {
              e.target.style.color = 'var(--active-color)'
              e.target.style.backgroundColor = 'rgba(3, 169, 244, 0.1)'
            }}
            onMouseLeave={(e) => {
              e.target.style.color = '#888'
              e.target.style.backgroundColor = 'transparent'
            }}
          >
            <svg 
              width="12" 
              height="12" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2"
            >
              <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"></path>
              <path d="M21 3v5h-5"></path>
              <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"></path>
              <path d="M3 21v-5h5"></path>
            </svg>
          </button>
        )}
      </div>
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
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
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
            {isOverridden && (
              <button
                className="reset-property-btn-icon"
                onClick={(e) => {
                  e.stopPropagation()
                  handleResetProperty(category, layerName, propertyKey)
                }}
                title="Reset to inherited value"
                style={{
                  padding: '0.125rem',
                  backgroundColor: 'transparent',
                  border: 'none',
                  borderRadius: '4px',
                  color: '#888',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '18px',
                  height: '18px'
                }}
                onMouseEnter={(e) => {
                  e.target.style.color = 'var(--active-color)'
                  e.target.style.backgroundColor = 'rgba(3, 169, 244, 0.1)'
                }}
                onMouseLeave={(e) => {
                  e.target.style.color = '#888'
                  e.target.style.backgroundColor = 'transparent'
                }}
              >
                <svg 
                  width="12" 
                  height="12" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2"
                >
                  <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"></path>
                  <path d="M21 3v5h-5"></path>
                  <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"></path>
                  <path d="M3 21v-5h5"></path>
                </svg>
              </button>
            )}
          </div>
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

      {/* Layers Section - Accordion Style */}
      <div className="control-section">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
          <h4 className="section-title" style={{ margin: 0, paddingBottom: 0, borderBottom: 'none' }}>Layers</h4>
          <button
            onClick={() => {
              const allExpanded = allLayers.length > 0 && allLayers.every(l => localExpandedLayers.has(l.layerKey))
              if (allExpanded) {
                // Collapse all
                setLocalExpandedLayers(new Set())
                if (setExpandedLayers) {
                  setExpandedLayers(new Set())
                }
              } else {
                // Expand all
                const allKeys = new Set(allLayers.map(l => l.layerKey))
                setLocalExpandedLayers(allKeys)
                if (setExpandedLayers) {
                  setExpandedLayers(allKeys)
                }
              }
            }}
            title={allLayers.length > 0 && allLayers.every(l => localExpandedLayers.has(l.layerKey)) ? 'Collapse all' : 'Expand all'}
            style={{
              padding: '0.25rem 0.5rem',
              fontSize: '0.75rem',
              backgroundColor: 'transparent',
              border: '1px solid #444',
              borderRadius: '4px',
              color: '#aaa',
              cursor: 'pointer',
              transition: 'all 0.2s',
              display: 'flex',
              alignItems: 'center',
              gap: '0.25rem'
            }}
            onMouseEnter={(e) => {
              e.target.style.borderColor = 'var(--active-color)'
              e.target.style.color = 'var(--active-color)'
            }}
            onMouseLeave={(e) => {
              e.target.style.borderColor = '#444'
              e.target.style.color = '#aaa'
            }}
          >
            {allLayers.length > 0 && allLayers.every(l => localExpandedLayers.has(l.layerKey)) ? (
              <>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 6L6 18"></path>
                  <path d="M6 6l12 12"></path>
                </svg>
                Collapse All
              </>
            ) : (
              <>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 5v14"></path>
                  <path d="M5 12h14"></path>
                </svg>
                Expand All
              </>
            )}
          </button>
        </div>
        
        {allLayers.map(({ layerKey, displayName, layerData }) => {
          const isExpanded = localExpandedLayers.has(layerKey)
          const isText = isTextLayer(layerData)
          const isImage = isImageLayer(layerData)
          const layerRules = editableRules[selectedDesign.id]?.[layerKey] || {}
          
          // Get field name for text layers
          const fieldName = isText ? (layerData.fieldName || layerKey) : null
          const isComputed = isText && layerData.calculation
          const formula = isComputed ? (layerRules.calculation?.formula || layerData.calculation?.formula || '') : ''
          const dependsOn = isComputed ? (layerData.calculation?.dependsOn || '') : ''
          
          return (
            <div 
              key={layerKey} 
              className={`layer-accordion ${highlightedLayer === layerKey ? 'highlighted' : ''}`}
              data-layer-key={layerKey}
            >
              {/* Accordion Header */}
              <div 
                className="layer-accordion-header"
                onClick={() => toggleLayer(layerKey)}
              >
                <div className="layer-accordion-title">
                  <svg 
                    className={`accordion-chevron ${isExpanded ? 'expanded' : ''}`}
                    width="16" 
                    height="16" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="2"
                  >
                    <polyline points="6 9 12 15 18 9"></polyline>
                  </svg>
                  <span>{displayName}</span>
                </div>
              </div>
              
              {/* Accordion Content */}
              {isExpanded && (
                <div className="layer-accordion-content">
                  {/* Text Value Input (first for text layers) */}
                  {isText && (
                    <div 
                      className={`control-group ${highlightedField === fieldName ? 'highlighted' : ''}`}
                      data-field-name={fieldName}
                    >
                      <div className="label-row">
                        <label>Text Value</label>
                        {!isComputed && (
                          <div className="toggle-wrapper" onClick={() => handleToggleChange(fieldName)}>
                            <div className={`toggle-track ${useMetadata[fieldName] ? 'active' : ''}`}>
                              <div className="toggle-thumb"></div>
                            </div>
                            <span className="toggle-label">Use Metadata</span>
                          </div>
                        )}
                        {isComputed && (
                          <span className="computed-badge" style={{ fontSize: '0.75rem', color: '#888', fontStyle: 'italic' }}>
                            Computed
                          </span>
                        )}
                      </div>
                      {isComputed ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <label style={{ fontSize: '0.75rem', color: '#888', minWidth: '80px' }}>Formula:</label>
                            <input 
                              type="text" 
                              value={formula}
                              onChange={(e) => {
                                const currentRules = editableRules[selectedDesign.id] || editableRules['parent'] || {}
                                const updatedRules = JSON.parse(JSON.stringify(currentRules))
                                if (updatedRules[layerKey] && updatedRules[layerKey].calculation) {
                                  updatedRules[layerKey].calculation.formula = e.target.value
                                  handleRuleUpdate('Layers', displayName, 'calculation', updatedRules[layerKey].calculation)
                                }
                              }}
                              placeholder="e.g., mul_1.25"
                              style={{
                                flex: 1,
                                padding: '0.5rem',
                                border: '1px solid #444',
                                borderRadius: '4px',
                                backgroundColor: '#2a2a2a',
                                color: '#fff'
                              }}
                            />
                          </div>
                          {dependsOn && (
                            <div style={{ fontSize: '0.75rem', color: '#888', fontStyle: 'italic' }}>
                              Depends on: {dependsOn}
                            </div>
                          )}
                        </div>
                      ) : (
                        <input 
                          type="text" 
                          name={fieldName}
                          value={formValues[fieldName] || ''}
                          onChange={handleInputChange}
                        />
                      )}
                    </div>
                  )}
                  
                  {/* Text Layer Styling Properties */}
                  {isText && (
                    <>
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
                        </div>
                      </div>
                      
                      {/* Font Size */}
                      {renderPropertyControl('Layers', layerKey, 'fontSize', 'Font Size', 'text')}
                      
                      {/* Color */}
                      {renderPropertyControl('Layers', layerKey, 'color', 'Color', 'color')}
                      
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
                      
                      {/* Text Width */}
                      {renderPropertyControl('Layers', layerKey, 'textWidth', 'Text Width', 'number')}
                      
                      {/* Position and Gravity */}
                      {renderPropertyControl('Layers', layerKey, 'x', 'X Position', 'number')}
                      {renderPropertyControl('Layers', layerKey, 'y', 'Y Position', 'number')}
                      {renderPropertyControl('Layers', layerKey, 'gravity', 'Gravity', 'select', Object.entries(GRAVITY_VALUES).map(([key, value]) => ({ label: key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1').trim(), value: value })))}
                    </>
                  )}
                  
                  {/* Image Layer Properties */}
                  {isImage && (
                    <>
                      {/* Show toggle only for overlay images (with publicId), not for main image */}
                      {layerData.publicId && renderPropertyControl('Layers', layerKey, 'show', 'Show', 'boolean')}
                      {/* Public ID only for overlay images */}
                      {layerData.publicId && renderPropertyControl('Layers', layerKey, 'publicId', 'Public ID', 'text')}
                      {/* Common image layer properties */}
                      {renderPropertyControl('Layers', layerKey, 'width', 'Width', 'number')}
                      {renderPropertyControl('Layers', layerKey, 'height', 'Height', 'number')}
                      {renderPropertyControl('Layers', layerKey, 'x', 'X Position', 'number')}
                      {renderPropertyControl('Layers', layerKey, 'y', 'Y Position', 'number')}
                      {renderPropertyControl('Layers', layerKey, 'gravity', 'Gravity', 'select', Object.entries(GRAVITY_VALUES).map(([key, value]) => ({ label: key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1').trim(), value: value })))}
                    </>
                  )}
                </div>
              )}
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
