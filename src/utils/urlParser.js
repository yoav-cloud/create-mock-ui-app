import { isTextLayer, isImageLayer } from './layerUtils'

/**
 * Converts a camelCase string to a display name
 * @param {string} key - The layer key (e.g., 'origPrice', 'title')
 * @param {Object} layerData - Optional layer data with displayName property
 * @returns {string} Display name (e.g., 'Original Price', 'Title')
 */
function formatDisplayName(key, layerData = null) {
  // Use displayName from layer data if available
  if (layerData?.displayName) {
    return layerData.displayName
  }
  
  // Convert camelCase to Title Case
  return key
    .replace(/([A-Z])/g, ' $1') // Add space before capital letters
    .replace(/^./, str => str.toUpperCase()) // Capitalize first letter
    .trim()
}

/**
 * Generates a row key from a layer key
 * @param {string} layerKey - The layer key (e.g., 'title'')
 * @returns {string} Row key (e.g., 'title-layer')
 */
function generateRowKey(layerKey) {
  return `${layerKey}-layer`
}

/**
 * Extracts layer information from a rules object
 * @param {Object} rules - Rules object (e.g., from DESIGN_RULES or editableRules)
 * @returns {Object} Map of layer keys to { displayName, rowKey, layerData }
 */
export function extractLayersFromRules(rules) {
  if (!rules || typeof rules !== 'object') return {}
  
  const layerMap = {}
  const nonLayerKeys = ['width', 'height', 'backgroundColor'] // Keys that are not layers
  
  Object.keys(rules).forEach(key => {
    // Skip non-layer keys and only include object values (layers are objects)
    if (!nonLayerKeys.includes(key) && rules[key] && typeof rules[key] === 'object' && !Array.isArray(rules[key])) {
      layerMap[key] = {
        displayName: formatDisplayName(key, rules[key]),
        rowKey: generateRowKey(key),
        layerData: rules[key] // Include full layer data for type detection
      }
    }
  })
  
  return layerMap
}

/**
 * Generates a layer configuration from a layer name map
 * @param {Object} layerNameMap - Map of layer keys to { displayName, rowKey, layerData }
 * @param {Object} options - Additional options
 * @param {string} options.canvasRowKey - Row key for canvas dimensions (default: 'canvas-dimensions')
 * @param {string} options.backgroundRowKey - Row key for background color (default: 'background-color')
 * @returns {Object} Layer configuration object
 */
export function generateLayerConfig(layerNameMap, options = {}) {
  const canvasRowKey = options.canvasRowKey || 'canvas-dimensions'
  const backgroundRowKey = options.backgroundRowKey || 'background-color'
  
  const variables = []
  const layerText = []
  let imageLayerKey = null
  let overlayImageLayerKey = null
  
  // Process entries in object key order (JavaScript preserves insertion order)
  // Also identify image layers
  const sortedEntries = Object.entries(layerNameMap)
  
  // First pass: identify image layers
  sortedEntries.forEach(([layerKey, layerInfo]) => {
    const layerData = layerInfo.layerData
    if (isImageLayer(layerData)) {
      // Main image layer (uses $img variable) - no publicId
      if (!layerData.publicId) {
        imageLayerKey = layerKey
      } else {
        // Overlay image layer (has publicId) - like logo
        overlayImageLayerKey = layerKey
      }
    }
  })
  
  // Build exclude pattern map - layers that contain other layer identifiers
  const excludePatternMap = {}
  Object.keys(layerNameMap).forEach(layerKey => {
    const identifier = layerKey.toLowerCase()
    const excludePatterns = []
    
    // Check if any other layer's identifier is contained in this one
    Object.keys(layerNameMap).forEach(otherKey => {
      if (otherKey !== layerKey) {
        const otherIdentifier = otherKey.toLowerCase()
        // If this identifier contains the other (e.g., "origprice" contains "price")
        if (identifier.includes(otherIdentifier) && identifier !== otherIdentifier) {
          excludePatterns.push(new RegExp(otherIdentifier))
        }
      }
    })
    
    if (excludePatterns.length > 0) {
      excludePatternMap[layerKey] = new RegExp(`(${excludePatterns.map(p => p.source).join('|')})`)
    }
  })
  
  // Second pass: generate patterns
  sortedEntries.forEach(([layerKey, layerInfo]) => {
    const { rowKey, layerData } = layerInfo
    const identifier = layerKey.toLowerCase()
    
    // Skip image layers for variable/layerText patterns (they're handled separately)
    if (isImageLayer(layerData)) {
      return
    }
    
    
    // Check if layer has a custom variable pattern, otherwise use default
    // For layers with calculations, use the calculated variable name (e.g., $origprice)
    let variablePattern
    if (layerData?.calculation && layerData.calculation.dependsOn) {
      // Calculated layers use their own variable name (e.g., $origprice)
      variablePattern = new RegExp(`\\$${identifier}`)
    } else {
      variablePattern = new RegExp(`\\$${identifier}`)
    }
    
    variables.push({
      pattern: variablePattern,
      rowKey: rowKey,
      excludePattern: excludePatternMap[layerKey]
    })
    
    // Create layer text pattern (e.g., l_text)
    // Only for text layers
    if (isTextLayer(layerData)) {
      layerText.push({
        pattern: new RegExp(identifier),
        rowKey: rowKey,
        type: `layer-${layerKey}`,
        excludePattern: excludePatternMap[layerKey]
      })
    }
  })
  
  // Add special variables for image layers
  if (imageLayerKey && layerNameMap[imageLayerKey]) {
    variables.unshift({
      pattern: /^\$img_/,
      rowKey: layerNameMap[imageLayerKey].rowKey
    })
  }
  
  variables.push({
    pattern: /\$bgcolor/,
    rowKey: backgroundRowKey
  })
  
  return {
    variables,
    layerText,
    layerImage: imageLayerKey && layerNameMap[imageLayerKey] ? {
      pattern: /^l_\$img/,
      rowKey: layerNameMap[imageLayerKey].rowKey,
      type: 'layer-image'
    } : undefined,
    layerOverlayImage: overlayImageLayerKey && layerNameMap[overlayImageLayerKey] ? {
      pattern: /^l_/,
      rowKey: layerNameMap[overlayImageLayerKey].rowKey,
      type: `layer-${overlayImageLayerKey}`,
      excludePatterns: [/^l_text/, /^l_\$img/]
    } : undefined,
    canvas: {
      pattern: /^c_pad/,
      rowKey: canvasRowKey,
      type: 'canvas'
    },
    layerApply: {
      pattern: /^fl_layer_apply/,
      type: 'layer-apply'
    }
  }
}

/**
 * Parses a Cloudinary transformation URL into interactive segments
 * @param {string} url - The full Cloudinary URL
 * @param {string} baseUrl - The base Cloudinary URL (e.g., 'https://res.cloudinary.com/yoav-cloud/image/upload/')
 * @param {string} publicId - The public ID of the asset (e.g., 'create/shoes/red-white-sneaker-transparent')
 * @param {Object} layerConfig - Configuration mapping layer identifiers to row keys
 * @param {Array} layerConfig.variables - Array of variable pattern configs: { pattern: RegExp, rowKey: string, excludePattern?: RegExp }
 * @param {Array} layerConfig.layerText - Array of layer text pattern configs: { pattern: RegExp, rowKey: string, type: string, excludePattern?: RegExp }
 * @param {Object} layerConfig.layerImage - Image layer config: { pattern: RegExp, rowKey: string, type: string }
 * @param {Object} layerConfig.layerOverlayImage - Overlay image layer config: { pattern: RegExp, rowKey: string, type: string, excludePatterns?: Array<RegExp> }
 * @param {Object} layerConfig.canvas - Canvas config: { pattern: RegExp, rowKey: string, type: string }
 * @param {Object} layerConfig.layerApply - Layer apply config: { pattern: RegExp, type: string }
 * @returns {Array} Array of segment objects with { text, type, rowKey, separator }
 */
export function parseUrlSegments(url, baseUrl, publicId, layerConfig = {}) {
  // Merge with provided config (provided config takes precedence)
  // If no config provided, use empty defaults (caller should always provide config from generateLayerConfig)
  const config = {
    variables: layerConfig.variables ?? [],
    layerText: layerConfig.layerText ?? [],
    layerImage: layerConfig.layerImage ?? undefined,
    layerOverlayImage: layerConfig.layerOverlayImage ?? undefined,
    canvas: layerConfig.canvas ?? { pattern: /^c_pad/, rowKey: 'canvas-dimensions', type: 'canvas' },
    layerApply: layerConfig.layerApply ?? { pattern: /^fl_layer_apply/, type: 'layer-apply' }
  }

  // Extract transformation part
  const transformPart = url.replace(baseUrl, '').replace(`/${publicId}.png`, '')
  const parts = transformPart.split('/')
  
  const segments = []
  
  // Base URL
  segments.push({ text: baseUrl, type: 'base', rowKey: null })
  
  // Parse transformation parts
  parts.forEach((part, index) => {
    let type = 'transformation'
    let rowKey = null
    
    // Check variable patterns
    for (const variable of config.variables) {
      if (variable.pattern.test(part)) {
        // Check exclude pattern if present
        if (variable.excludePattern && variable.excludePattern.test(part)) {
          continue
        }
        type = 'variable'
        rowKey = variable.rowKey
        break
      }
    }
    
    // Check canvas pattern
    if (!rowKey && config.canvas.pattern.test(part)) {
      type = config.canvas.type
      rowKey = config.canvas.rowKey
    }
    // Check layer text patterns
    else if (!rowKey && part.startsWith('l_text')) {
      for (const layerText of config.layerText) {
        if (layerText.pattern.test(part)) {
          // Check exclude pattern if present
          if (layerText.excludePattern && layerText.excludePattern.test(part)) {
            continue
          }
          type = layerText.type
          rowKey = layerText.rowKey
          break
        }
      }
    }
    // Check layer image pattern
    else if (!rowKey && config.layerImage.pattern.test(part)) {
      type = config.layerImage.type
      rowKey = config.layerImage.rowKey
    }
    // Check overlay image layer pattern (e.g., logo or other overlay images)
    else if (!rowKey && config.layerOverlayImage?.pattern.test(part)) {
      // Check if it matches exclude patterns
      const matchesExclude = config.layerOverlayImage.excludePatterns?.some(excludePattern => 
        excludePattern.test(part)
      )
      if (!matchesExclude) {
        type = config.layerOverlayImage.type
        rowKey = config.layerOverlayImage.rowKey
      }
    }
    // Check c_fit after overlay image layer (special case)
    else if (!rowKey && part.startsWith('c_fit') && index > 0) {
      const prevPart = parts[index - 1]
      if (config.layerOverlayImage?.pattern.test(prevPart)) {
        const matchesExclude = config.layerOverlayImage.excludePatterns?.some(excludePattern => 
          excludePattern.test(prevPart)
        )
        if (!matchesExclude) {
          type = config.layerOverlayImage.type
          rowKey = config.layerOverlayImage.rowKey
        }
      }
    }
    // Check layer apply pattern
    else if (!rowKey && config.layerApply.pattern.test(part)) {
      type = config.layerApply.type
      // Determine row key from context (previous parts)
      rowKey = determineLayerApplyRowKey(parts, index, config)
    }
    
    segments.push({ 
      text: part, 
      type, 
      rowKey,
      separator: index < parts.length - 1 ? '/' : ''
    })
  })
  
  // Public ID
  segments.push({ text: '/', type: 'separator', rowKey: null })
  segments.push({ text: `${publicId}.png`, type: 'publicId', rowKey: null })
  
  return segments
}

/**
 * Determines the row key for a fl_layer_apply segment based on context
 * @param {Array} parts - All URL parts
 * @param {number} index - Current index of fl_layer_apply
 * @param {Object} config - Layer configuration
 * @returns {string|null} Row key or null
 */
function determineLayerApplyRowKey(parts, index, config) {
  // Check previous part for layer identifiers
  if (index > 0) {
    const prevPart = parts[index - 1]
    
    // Check layer text patterns
    for (const layerText of config.layerText) {
      if (layerText.pattern.test(prevPart)) {
        if (layerText.excludePattern && layerText.excludePattern.test(prevPart)) {
          continue
        }
        return layerText.rowKey
      }
    }
    
    // Check for image variable
    if (prevPart.includes('$img')) {
      return config.layerImage.rowKey
    }
  }
  
  // Check two parts back for overlay image layer (fl_layer_apply after overlay image layer and c_fit)
  if (index > 1) {
    const prevPrevPart = parts[index - 2]
    if (config.layerOverlayImage?.pattern.test(prevPrevPart)) {
      const matchesExclude = config.layerOverlayImage.excludePatterns?.some(excludePattern => 
        excludePattern.test(prevPrevPart)
      )
      if (!matchesExclude) {
        return config.layerOverlayImage.rowKey
      }
    }
  }
  
  return null
}
