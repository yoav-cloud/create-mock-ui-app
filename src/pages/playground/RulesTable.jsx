import React, { useRef, useEffect, useMemo } from 'react'
import './RulesTable.css'
import { GRAVITY_VALUES, GOOGLE_FONTS } from './constants'
import { extractLayersFromRules } from '../../utils/urlParser'

// Configuration for General fields
const GENERAL_FIELDS_CONFIG = [
  {
    key: 'Width',
    displayName: 'Width',
    rowKey: 'canvas-dimensions',
    getValue: (canvasDimensions) => canvasDimensions.width,
    getValueKey: () => 'width',
    isSpecial: true // Special handling for canvas dimensions
  },
  {
    key: 'Height',
    displayName: 'Height',
    rowKey: 'canvas-dimensions',
    getValue: (canvasDimensions) => canvasDimensions.height,
    getValueKey: () => 'height',
    isSpecial: true
  },
  {
    key: 'Background Color',
    displayName: 'Background Color',
    rowKey: 'background-color',
    getValue: (formValues, useMetadata) => {
      if (useMetadata?.backgroundColor) {
        return '#888888' // Placeholder when using metadata
      }
      return formValues.backgroundColor || '#000428'
    },
    getValueKey: () => 'backgroundColor',
    isSpecial: true, // Uses formValues instead of editableRules
    requiresMetadata: true // Needs useMetadata prop
  },
]

export default function RulesTable({
  editableRules,
  selectedDesign,
  canvasDimensions,
  formValues,
  useMetadata,
  highlightedRow,
  handleRuleUpdate,
  handleResetProperty,
  isPropertyInherited,
  isPropertyOverriddenForDisplay,
  wouldPropertyBeInherited,
  getFieldType,
  getGravityOptions,
  getFontOptions,
  handleFontSizeValidation
}) {
  const fontSizePreviousValues = useRef({})

  // Helper to get field type
  const getFieldTypeLocal = (key, layerName) => {
    if (key === 'color') return 'color'
    if (key === 'gravity') return 'gravity'
    if (key === 'font') return 'font'
    if (key === 'flNoOverflow' || key === 'flTextDisallowOverflow' || key === 'textWrap') return 'boolean'
    if (key === 'fontSize') return 'fontSize' // Special type for fontSize (text input with validation)
    if (key === 'textWidth' || key === 'width' || key === 'height' || key === 'x' || key === 'y') return 'number'
    return 'text'
  }

  // Helper to get gravity options
  const getGravityOptionsLocal = () => {
    return Object.entries(GRAVITY_VALUES).map(([key, value]) => ({
      label: key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1').trim(),
      value: value
    }))
  }

  // Helper to get font options
  const getFontOptionsLocal = () => {
    return GOOGLE_FONTS
  }

  // Use provided helpers or fallback to local ones
  const fieldTypeHelper = getFieldType || getFieldTypeLocal
  const gravityOptionsHelper = getGravityOptions || getGravityOptionsLocal
  const fontOptionsHelper = getFontOptions || getFontOptionsLocal

  // Get available layers dynamically from rules
  const availableLayers = useMemo(() => {
    const rules = editableRules[selectedDesign.id] || editableRules['parent'] || {}
    const layerMap = extractLayersFromRules(rules)
    
    return Object.entries(layerMap)
      .filter(([layerKey]) => rules[layerKey] && typeof rules[layerKey] === 'object')
      .map(([layerKey, layerInfo]) => ({
        key: layerKey,
        displayName: layerInfo.displayName,
        rowKey: layerInfo.rowKey,
        data: rules[layerKey]
      }))
  }, [editableRules, selectedDesign.id])

  // Highlight rows when highlightedRow changes
  useEffect(() => {
    if (highlightedRow) {
      document.querySelectorAll(`[data-row-key="${highlightedRow}"]`).forEach(el => {
        el.classList.add('highlighted')
      })
      return () => {
        document.querySelectorAll(`[data-row-key="${highlightedRow}"]`).forEach(el => {
          el.classList.remove('highlighted')
        })
      }
    }
  }, [highlightedRow])

  // Render inheritance icon
  const renderInheritanceIcon = (category, layerName, key) => {
    const isInherited = isPropertyInherited(category, layerName, key)
    const isOverridden = isPropertyOverriddenForDisplay(category, layerName, key)
    const wouldBeInherited = wouldPropertyBeInherited(category, layerName, key)
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

  // Render reset button
  const renderResetButton = (category, layerName, key) => {
    if (!isPropertyOverriddenForDisplay(category, layerName, key)) return null
    
    return (
      <button
        className="reset-property-btn"
        onClick={() => handleResetProperty(category, layerName, key)}
        title="Reset to inherited value"
        style={{
          padding: '0.25rem 0.5rem',
          fontSize: '0.75rem',
          backgroundColor: 'transparent',
          border: '1px solid #555',
          borderRadius: '4px',
          color: '#aaa',
          cursor: 'pointer',
          transition: 'all 0.2s'
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

  // Render input element based on field type
  const renderInputElement = (fieldType, currentValue, category, layerName, key, layerKey) => {
    if (fieldType === 'color') {
      const isDisabled = category === 'General' && key === 'Background Color' && useMetadata.backgroundColor
      const displayValue = isDisabled ? '#888888' : (currentValue || '#ffffff')
      return (
        <input
          type="color"
          value={displayValue}
          onChange={(e) => handleRuleUpdate(category, layerName, key, e.target.value)}
          className="rule-input rule-input-color"
          disabled={isDisabled}
          readOnly={isDisabled}
          title={isDisabled ? 'Using metadata value (pbackgroundcolor)' : 'Color'}
        />
      )
    } else if (fieldType === 'gravity') {
      return (
        <select
          value={currentValue}
          onChange={(e) => handleRuleUpdate(category, layerName, key, e.target.value)}
          className="rule-input rule-input-select"
        >
          {gravityOptionsHelper().map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      )
    } else if (fieldType === 'font') {
      return (
        <select
          value={currentValue || 'Arial'}
          onChange={(e) => handleRuleUpdate(category, layerName, key, e.target.value)}
          className="rule-input rule-input-select"
        >
          {fontOptionsHelper().map(font => (
            <option key={font.value} value={font.value}>{font.name}</option>
          ))}
        </select>
      )
    } else if (fieldType === 'fontSize') {
      const inputKey = `${selectedDesign.id}-${layerName || 'general'}-${key}`
      return (
        <input
          type="text"
          value={String(currentValue || '')}
          onFocus={(e) => {
            fontSizePreviousValues.current[inputKey] = currentValue
          }}
          onChange={(e) => {
            handleRuleUpdate(category, layerName, key, e.target.value)
          }}
          onBlur={(e) => {
            const previousValue = fontSizePreviousValues.current[inputKey]
            if (handleFontSizeValidation) {
              handleFontSizeValidation(category, layerName, key, e.target.value, previousValue)
            }
            delete fontSizePreviousValues.current[inputKey]
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault()
              const previousValue = fontSizePreviousValues.current[inputKey]
              if (handleFontSizeValidation) {
                handleFontSizeValidation(category, layerName, key, e.target.value, previousValue)
              }
              delete fontSizePreviousValues.current[inputKey]
              e.target.blur()
            }
          }}
          className="rule-input rule-input-text"
        />
      )
    } else if (fieldType === 'number') {
      return (
        <input
          type="number"
          value={currentValue}
          onChange={(e) => handleRuleUpdate(category, layerName, key, e.target.value)}
          className="rule-input rule-input-number"
          min={key === 'Width' || key === 'Height' ? '1' : undefined}
          step={key === 'fontSize' ? '0.1' : '1'}
        />
      )
    } else if (fieldType === 'boolean') {
      return (
        <div className="toggle-wrapper" onClick={() => handleRuleUpdate(category, layerName, key, !currentValue)}>
          <div className={`toggle-track ${currentValue ? 'active' : ''}`}>
            <div className="toggle-thumb"></div>
          </div>
        </div>
      )
    } else {
      return (
        <input
          type="text"
          value={String(currentValue || '')}
          onChange={(e) => handleRuleUpdate(category, layerName, key, e.target.value)}
          className="rule-input rule-input-text"
        />
      )
    }
  }

  // Render a property row
  const renderPropertyRow = (category, layerName, key, displayName, rowKey, currentValue, fieldType, layerKey = null) => {
    return (
      <tr key={`${category}-${layerName || 'general'}-${key}`} data-row-key={rowKey}>
        <td>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            {displayName}
            {renderInheritanceIcon(category, layerName, key)}
          </div>
        </td>
        <td>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            {renderInputElement(fieldType, currentValue, category, layerName, key, layerKey)}
            {renderResetButton(category, layerName, key)}
          </div>
        </td>
      </tr>
    )
  }

  // Render General section rows
  const renderGeneralRows = () => {
    return GENERAL_FIELDS_CONFIG.map(fieldConfig => {
      let currentValue
      let fieldType
      
      if (fieldConfig.isSpecial) {
        if (fieldConfig.key === 'Width' || fieldConfig.key === 'Height') {
          currentValue = fieldConfig.getValue(canvasDimensions)
          fieldType = 'number'
        } else if (fieldConfig.key === 'Background Color') {
          currentValue = fieldConfig.getValue(formValues, useMetadata)
          fieldType = 'color'
        }
      } else {
        currentValue = fieldConfig.getValue(editableRules, selectedDesign.id)
        fieldType = fieldTypeHelper(fieldConfig.key, null)
      }
      
      return renderPropertyRow(
        'General',
        null,
        fieldConfig.key,
        fieldConfig.displayName,
        fieldConfig.rowKey,
        currentValue,
        fieldType
      )
    })
  }

  // Render Layer section rows
  const renderLayerRows = () => {
    return availableLayers.flatMap(layer => {
      const rows = []
      
      // Add sub-category row for the layer
      rows.push(
        <tr key={`${layer.key}-header`} className="sub-category-row" data-row-key={layer.rowKey}>
          <td colSpan="2"><strong>{layer.displayName}</strong></td>
        </tr>
      )
      
      // Skip if layer data is missing
      if (!layer.data || typeof layer.data !== 'object') {
        return rows
      }
      
      // Render property rows for each property in the layer
      Object.entries(layer.data).forEach(([key, defaultValue]) => {
        const fieldType = fieldTypeHelper(key, layer.displayName)
        const currentValue = editableRules[selectedDesign.id]?.[layer.key]?.[key] ?? 
                           editableRules['parent']?.[layer.key]?.[key] ?? 
                           defaultValue
        
        rows.push(
          renderPropertyRow(
            'Layers',
            layer.displayName,
            key,
            key,
            layer.rowKey,
            currentValue,
            fieldType,
            layer.key
          )
        )
      })
      
      return rows
    })
  }

  return (
    <table className="rules-table">
      <thead>
        <tr>
          <th>Property</th>
          <th>Value</th>
        </tr>
      </thead>
      <tbody>
        {/* General Rules */}
        <tr className="category-row">
          <td colSpan="2"><strong>General</strong></td>
        </tr>
        {renderGeneralRows()}
        
        {/* Layer Rules */}
        <tr className="category-row">
          <td colSpan="2"><strong>Layers</strong></td>
        </tr>
        {renderLayerRows()}
      </tbody>
    </table>
  )
}
