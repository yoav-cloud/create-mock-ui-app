/**
 * Determines if a layer is a text layer (has fontSize property)
 * @param {Object} layerData - Layer data object
 * @returns {boolean} True if layer is a text layer
 */
export function isTextLayer(layerData) {
  return layerData && typeof layerData === 'object' && 'fontSize' in layerData
}

/**
 * Determines if a layer is an image layer (has width and height but no fontSize)
 * @param {Object} layerData - Layer data object
 * @returns {boolean} True if layer is an image layer
 */
export function isImageLayer(layerData) {
  return layerData && typeof layerData === 'object' && 'width' in layerData && 'height' in layerData && !('fontSize' in layerData)
}

/**
 * Determines if a layer is a logo layer (has isLogo property or layerKey is 'logo')
 * @param {string} layerKey - Layer key
 * @param {Object} layerData - Layer data object
 * @returns {boolean} True if layer is a logo layer
 */
export function isLogoLayer(layerKey, layerData) {
  // Check if layer has isLogo property, or fallback to layerKey === 'logo' for backward compatibility
  return (layerData?.isLogo === true) || (layerKey === 'logo' && layerData && typeof layerData === 'object' && 'width' in layerData && 'height' in layerData)
}

/**
 * Gets text content for a layer based on form values and layer key
 * @param {string} layerKey - Layer key
 * @param {Object} formValues - Form values
 * @param {Object} layerData - Layer data (may contain textContent or calculation logic)
 * @returns {string} Text content for the layer
 */
export function getLayerTextContent(layerKey, formValues, layerData) {
  // Check if layer has a textContent property (for dynamic calculations)
  if (layerData?.textContent) {
    // If it's a function, call it; otherwise use the value
    if (typeof layerData.textContent === 'function') {
      return layerData.textContent(formValues)
    }
    return layerData.textContent
  }
  
  // Use fieldName if specified, otherwise use layerKey
  const fieldName = layerData?.fieldName || layerKey
  return formValues[fieldName] || ''
}

/**
 * Gets text formatting flags for a text layer
 * @param {Object} layerData - Layer data object
 * @returns {Object} Formatting flags { bold, italic, strikethrough }
 */
export function getTextFormatting(layerData) {
  return {
    bold: layerData?.bold === true,
    italic: layerData?.italic === true,
    strikethrough: layerData?.strikethrough === true
  }
}

/**
 * Gets the variable name for a layer
 * @param {string} layerKey - Layer key
 * @returns {string} Variable name (e.g., 'title', 'tagline', 'price')
 */
export function getLayerVariableName(layerKey) {
  // Default: use layerKey as variable name
  // Can be overridden by layerData.variableName if needed
  return layerKey
}

/**
 * Extracts all layers from rules, excluding non-layer properties
 * @param {Object} rules - Rules object
 * @returns {Object} Map of layerKey -> layerData
 */
export function extractLayers(rules) {
  if (!rules || typeof rules !== 'object') return {}
  
  const nonLayerKeys = ['width', 'height', 'showLogo', 'logoPublicId']
  const layers = {}
  
  Object.keys(rules).forEach(key => {
    if (!nonLayerKeys.includes(key) && rules[key] && typeof rules[key] === 'object' && !Array.isArray(rules[key])) {
      layers[key] = rules[key]
    }
  })
  
  return layers
}

/**
 * Gets field names that should be in formValues based on text layers
 * @param {Object} rules - Rules object
 * @returns {Array<string>} Array of field names
 */
export function getFormFieldNames(rules) {
  const layers = extractLayers(rules)
  const fieldNames = []
  
  Object.keys(layers).forEach(layerKey => {
    if (isTextLayer(layers[layerKey])) {
      // Check if layer has a fieldName property, otherwise use layerKey
      const fieldName = layers[layerKey].fieldName || layerKey
      if (!fieldNames.includes(fieldName)) {
        fieldNames.push(fieldName)
      }
    }
  })
  
  return fieldNames
}

