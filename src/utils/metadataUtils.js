import { getFieldMetadataKey } from './fieldMetadataUtils'

/**
 * Extracts metadata ID from a value string (e.g., "{ptitle}" → "ptitle")
 * @param {string} value - Value string that may contain metadata syntax
 * @returns {string|null} Extracted metadata ID or null if not found
 */
export function extractMetadataId(value) {
  if (!value || typeof value !== 'string') return null
  const match = value.match(/\{([^}]+)\}/)
  return match ? match[1] : null
}

/**
 * Checks if a value contains metadata syntax {id}
 * @param {string} value - Value to check
 * @returns {boolean} True if value contains metadata syntax
 */
export function hasMetadataSyntax(value) {
  return value && typeof value === 'string' && value.includes('{') && value.includes('}')
}

/**
 * Gets metadata key from field name
 * @param {string} field - Field name (e.g., 'title')
 * @returns {string|null} Metadata key or null if not found
 * @deprecated Use getFieldMetadataKey from fieldMetadataUtils.js instead
 */
export function getMetadataKey(field, rules = null) {
  // This function is kept for backward compatibility but should use fieldMetadataUtils
  return getFieldMetadataKey(field, rules)
}

