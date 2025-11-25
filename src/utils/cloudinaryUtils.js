import { extractMetadataId, hasMetadataSyntax, getMetadataKey } from './metadataUtils'
import { hexToRgb } from './colorUtils'

/**
 * Escapes a string for Cloudinary URL encoding
 * @param {string} str - String to escape
 * @returns {string} Escaped string
 */
export function escapeCloudinaryString(str) {
  return encodeURIComponent(str).replace(/!/g, '%21')
}

/**
 * Gets default value for a field, handling metadata syntax
 * @param {string} field - Field name
 * @param {Object} formValues - Current form values
 * @param {Object} useMetadata - Metadata toggle state
 * @param {Object} savedValues - Saved values when metadata is used
 * @returns {string|number} Default value
 */
export function getDefaultValue(field, formValues, useMetadata, savedValues) {
  const formVal = formValues[field]
  const hasMetadata = hasMetadataSyntax(formVal)
  
  // If value contains {metadata} syntax, use saved value or sensible default
  if (hasMetadata || useMetadata[field]) {
    // Use saved value if available
    if (savedValues[field] !== null) {
      return savedValues[field]
    }
    // If no saved value, use a sensible default based on field
    return field === 'title' ? 'Now on Sale' : 
           field === 'tagline' ? 'Limited Time Offer' : 
           field === 'price' ? '80' :
           field === 'backgroundColor' ? '#000428' :
           ''
  }
  // Toggle is off and no metadata syntax - use formValues directly
  return formVal
}

/**
 * Checks if metadata should be used for a field
 * @param {string} field - Field name
 * @param {Object} formValues - Current form values
 * @param {Object} useMetadata - Metadata toggle state
 * @returns {boolean} True if metadata should be used
 */
export function shouldUseMetadata(field, formValues, useMetadata) {
  const formVal = formValues[field]
  return useMetadata[field] || hasMetadataSyntax(formVal)
}

/**
 * Gets metadata key for a field
 * @param {string} field - Field name
 * @param {Object} formValues - Current form values
 * @returns {string|null} Metadata key or null
 */
export function getMetaKeyForField(field, formValues) {
  const formVal = formValues[field]
  const extractedId = extractMetadataId(formVal)
  if (extractedId) {
    return extractedId
  }
  // Fallback to default mapping
  return getMetadataKey(field)
}

/**
 * Gets background color value, handling metadata
 * @param {Object} formValues - Current form values
 * @param {Object} useMetadata - Metadata toggle state
 * @param {Object} savedValues - Saved values when metadata is used
 * @returns {string} RGB color string in format 'RRGGBB'
 */
export function getBackgroundColorValue(formValues, useMetadata, savedValues) {
  const formVal = formValues.backgroundColor
  const hasMetadata = hasMetadataSyntax(formVal)
  
  if (hasMetadata || useMetadata.backgroundColor) {
    if (savedValues.backgroundColor !== null) {
      return hexToRgb(savedValues.backgroundColor)
    }
    return '000428' // Default dark blue
  }
  return hexToRgb(formVal || '#000428')
}

/**
 * Builds Cloudinary field logic for variable definitions
 * @param {string} varName - Variable name (e.g., 'title', 'tagline')
 * @param {string} metaKey - Metadata key (e.g., 'ptitle', 'pdescription')
 * @param {string|number} defaultValue - Default value
 * @param {boolean} isNumber - Whether the value is a number (default: false)
 * @returns {string} Cloudinary variable definition string
 */
export function buildFieldLogic(varName, metaKey, defaultValue, isNumber = false) {
  // Format default value
  const safeDefault = (defaultValue && String(defaultValue).trim() !== '') 
      ? defaultValue 
      : (isNumber ? 0 : ' ')
  
  const defaultValFormatted = isNumber ? safeDefault : `!${safeDefault}!`
  
  // Build the variable definition
  // Format: $varName_ctx:!MetaKey!/if_!$varName!_eq_!empty!/$varName_$defaultVarName/if_end
  // Where $defaultVarName is defined as: $defaultVarName_!defaultValue!
  const defaultVarName = `default_${varName}`
  const defaultVarDef = `$${defaultVarName}_${defaultValFormatted}`
  
  // Main variable: check context, if empty use default
  const mainVarDef = `$${varName}_ctx:!${metaKey}!/if_!$${varName}!_eq_!empty!/$${varName}_$${defaultVarName}/if_end`
  
  return `${defaultVarDef}/${mainVarDef}`
}

