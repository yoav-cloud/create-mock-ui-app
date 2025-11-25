import React from 'react'
import RulesTable from './RulesTable'
import './TextualPreview.css'

/**
 * TextualPreview component - displays URL preview and rules table
 * @param {Object} props
 * @param {string} props.generatedUrl - The generated Cloudinary URL
 * @param {Array} props.urlSegments - Array of URL segments for display
 * @param {string|null} props.highlightedRow - Currently highlighted row key
 * @param {Function} props.onSegmentClick - Callback when URL segment is clicked
 * @param {Object} props.editableRules - Editable rules object
 * @param {Object} props.selectedDesign - Selected design object
 * @param {Object} props.canvasDimensions - Canvas dimensions { width, height }
 * @param {Object} props.formValues - Form values
 * @param {Object} props.useMetadata - Metadata toggle state
 * @param {Function} props.handleRuleUpdate - Callback to update a rule
 * @param {Function} props.handleResetProperty - Callback to reset a property
 * @param {Function} props.isPropertyInherited - Function to check if property is inherited
 * @param {Function} props.isPropertyOverriddenForDisplay - Function to check if property is overridden
 * @param {Function} props.wouldPropertyBeInherited - Function to check if property would be inherited
 * @param {Function} props.getFieldType - Function to get field type
 * @param {Function} props.getGravityOptions - Function to get gravity options
 * @param {Function} props.getFontOptions - Function to get font options
 * @param {Function} props.handleFontSizeValidation - Function to validate font size
 */
export default function TextualPreview({
  generatedUrl,
  urlSegments,
  highlightedRow,
  onSegmentClick,
  editableRules,
  selectedDesign,
  canvasDimensions,
  formValues,
  useMetadata,
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
  return (
    <>
      {/* URL Preview Card */}
      <div className="url-preview-card">
        <div className="url-preview-header">
          <div className="url-preview-label">Transformation URL</div>
          <button
            className="url-open-button"
            onClick={() => window.open(generatedUrl, '_blank')}
            title="Open URL in new tab"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
              <polyline points="15 3 21 3 21 9"></polyline>
              <line x1="10" y1="14" x2="21" y2="3"></line>
            </svg>
          </button>
        </div>
        <div className="url-preview-content">
          {urlSegments.map((segment, index) => (
            <span
              key={index}
              className={`url-segment url-segment-${segment.type} ${segment.rowKey && highlightedRow === segment.rowKey ? 'highlighted' : ''}`}
              onClick={() => onSegmentClick(segment.rowKey)}
              title={segment.rowKey ? `Click to highlight ${segment.rowKey}` : ''}
              style={{ cursor: segment.rowKey ? 'pointer' : 'default' }}
            >
              {segment.text}
              {segment.separator && <span>{segment.separator}</span>}
            </span>
          ))}
        </div>
      </div>
      
      <RulesTable
        editableRules={editableRules}
        selectedDesign={selectedDesign}
        canvasDimensions={canvasDimensions}
        formValues={formValues}
        useMetadata={useMetadata}
        highlightedRow={highlightedRow}
        handleRuleUpdate={handleRuleUpdate}
        handleResetProperty={handleResetProperty}
        isPropertyInherited={isPropertyInherited}
        isPropertyOverriddenForDisplay={isPropertyOverriddenForDisplay}
        wouldPropertyBeInherited={wouldPropertyBeInherited}
        getFieldType={getFieldType}
        getGravityOptions={getGravityOptions}
        getFontOptions={getFontOptions}
        handleFontSizeValidation={handleFontSizeValidation}
      />
    </>
  )
}

