import { extractLayers, isTextLayer } from './layerUtils'
import { DESIGN_RULES } from '../pages/playground/constants'

/**
 * Gets field metadata (defaultValue, metadataKey) from layer definitions
 * @param {Object} rules - Rules object (defaults to parent rules)
 * @returns {Object} Map of fieldName -> { defaultValue, metadataKey }
 */
export function getFieldMetadata(rules = null) {
  const rulesToUse = rules || DESIGN_RULES['parent']
  const layers = extractLayers(rulesToUse)
  const metadata = {}
  
  // Add text layer fields
  Object.entries(layers).forEach(([layerKey, layerData]) => {
    if (isTextLayer(layerData)) {
      const fieldName = layerData.fieldName || layerKey
      if (!metadata[fieldName]) {
        metadata[fieldName] = {
          defaultValue: layerData.defaultValue || '',
          metadataKey: layerData.metadataKey || null
        }
      }
    }
  })
  
  // Add backgroundColor as a special field (not a layer)
  metadata.backgroundColor = {
    defaultValue: '#000428',
    metadataKey: 'pbackgroundcolor'
  }
  
  return metadata
}

/**
 * Gets default value for a field
 * @param {string} fieldName - Field name
 * @param {Object} rules - Optional rules object (defaults to parent)
 * @returns {string} Default value
 */
export function getFieldDefaultValue(fieldName, rules = null) {
  const metadata = getFieldMetadata(rules)
  return metadata[fieldName]?.defaultValue || ''
}

/**
 * Gets metadata key for a field
 * @param {string} fieldName - Field name
 * @param {Object} rules - Optional rules object (defaults to parent)
 * @returns {string|null} Metadata key or null
 */
export function getFieldMetadataKey(fieldName, rules = null) {
  const metadata = getFieldMetadata(rules)
  return metadata[fieldName]?.metadataKey || null
}

/**
 * Gets metadata syntax string for a field (e.g., '{ptitle}')
 * @param {string} fieldName - Field name
 * @param {Object} rules - Optional rules object (defaults to parent)
 * @returns {string} Metadata syntax string
 */
export function getFieldMetadataSyntax(fieldName, rules = null) {
  const metadataKey = getFieldMetadataKey(fieldName, rules)
  return metadataKey ? `{${metadataKey}}` : ''
}

/**
 * Gets all field names that should be in formValues
 * @param {Object} rules - Optional rules object (defaults to parent)
 * @returns {Array<string>} Array of field names
 */
export function getAllFieldNames(rules = null) {
  const metadata = getFieldMetadata(rules)
  return Object.keys(metadata)
}

