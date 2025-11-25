/**
 * Converts a camelCase string to a display name
 * @param {string} key - The layer key (e.g., 'origPrice', 'title')
 * @returns {string} Display name (e.g., 'Original Price', 'Title')
 */
function formatDisplayName(key) {
  // Handle special cases
  if (key === 'origPrice') return 'Original Price'
  
  // Convert camelCase to Title Case
  return key
    .replace(/([A-Z])/g, ' $1') // Add space before capital letters
    .replace(/^./, str => str.toUpperCase()) // Capitalize first letter
    .trim()
}

/**
 * Generates a row key from a layer key
 * @param {string} layerKey - The layer key (e.g., 'title', 'origPrice')
 * @returns {string} Row key (e.g., 'title-layer', 'origPrice-layer')
 */
function generateRowKey(layerKey) {
  return `${layerKey}-layer`
}

/**
 * Extracts layer information from a rules object
 * @param {Object} rules - Rules object (e.g., from DESIGN_RULES or editableRules)
 * @returns {Object} Map of layer keys to { displayName, rowKey }
 */
export function extractLayersFromRules(rules) {
  if (!rules || typeof rules !== 'object') return {}
  
  const layerMap = {}
  const nonLayerKeys = ['width', 'height', 'showLogo', 'logoPublicId'] // Keys that are not layers
  
  Object.keys(rules).forEach(key => {
    // Skip non-layer keys and only include object values (layers are objects)
    if (!nonLayerKeys.includes(key) && rules[key] && typeof rules[key] === 'object' && !Array.isArray(rules[key])) {
      layerMap[key] = {
        displayName: formatDisplayName(key),
        rowKey: generateRowKey(key)
      }
    }
  })
  
  return layerMap
}

/**
 * Generates a layer configuration from a layer name map
 * @param {Object} layerNameMap - Map of layer keys to { displayName, rowKey }
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
  
  // Generate variable and layer text patterns from layer map
  // Process origPrice first to ensure it's matched before price
  const sortedEntries = Object.entries(layerNameMap).sort(([keyA], [keyB]) => {
    // Sort origPrice before price
    if (keyA === 'origPrice' && keyB === 'price') return -1
    if (keyA === 'price' && keyB === 'origPrice') return 1
    return 0
  })
  
  sortedEntries.forEach(([layerKey, layerInfo]) => {
    const { rowKey } = layerInfo
    const identifier = layerKey.toLowerCase()
    
    // Create variable pattern (e.g., $title_, $tagline_)
    if (layerKey === 'origPrice') {
      // Special handling for origPrice - match $origprice
      variables.push({
        pattern: new RegExp(`\\$origprice`),
        rowKey: rowKey
      })
    } else {
      variables.push({
        pattern: new RegExp(`\\$${identifier}`),
        rowKey: rowKey,
        // Exclude origprice when matching price
        excludePattern: layerKey === 'price' ? /origprice/ : undefined
      })
    }
    
    // Create layer text pattern (e.g., l_text with title, tagline)
    // Only for text layers (not image or logo)
    if (layerKey !== 'image' && layerKey !== 'logo') {
      layerText.push({
        pattern: new RegExp(identifier),
        rowKey: rowKey,
        type: `layer-${layerKey}`,
        // Exclude patterns for layers with similar names (e.g., price vs origprice)
        excludePattern: layerKey === 'price' ? /origprice/ : undefined
      })
    }
  })
  
  // Add special variables
  if (layerNameMap.image) {
    variables.unshift({
      pattern: /^\$img_/,
      rowKey: layerNameMap.image.rowKey
    })
  }
  
  if (layerNameMap.logo) {
    variables.push({
      pattern: /\$logo/,
      rowKey: layerNameMap.logo.rowKey
    })
  }
  
  variables.push({
    pattern: /\$bgcolor/,
    rowKey: backgroundRowKey
  })
  
  return {
    variables,
    layerText,
    layerImage: layerNameMap.image ? {
      pattern: /^l_\$img/,
      rowKey: layerNameMap.image.rowKey,
      type: 'layer-image'
    } : undefined,
    layerLogo: layerNameMap.logo ? {
      pattern: /^l_/,
      rowKey: layerNameMap.logo.rowKey,
      type: 'layer-logo',
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
 * @param {Object} layerConfig.layerLogo - Logo layer config: { pattern: RegExp, rowKey: string, type: string, excludePatterns?: Array<RegExp> }
 * @param {Object} layerConfig.canvas - Canvas config: { pattern: RegExp, rowKey: string, type: string }
 * @param {Object} layerConfig.layerApply - Layer apply config: { pattern: RegExp, type: string }
 * @returns {Array} Array of segment objects with { text, type, rowKey, separator }
 */
export function parseUrlSegments(url, baseUrl, publicId, layerConfig = {}) {
  // Default layer configuration - can be overridden by passing layerConfig
  const defaultLayerConfig = {
    variables: [
      { pattern: /^\$img_/, rowKey: 'image-layer' },
      { pattern: /\$title/, rowKey: 'title-layer' },
      { pattern: /\$tagline/, rowKey: 'tagline-layer' },
      { pattern: /\$price/, rowKey: 'price-layer', excludePattern: /origprice/ },
      { pattern: /\$origprice/, rowKey: 'origPrice-layer' },
      { pattern: /\$bgcolor/, rowKey: 'background-color' }
    ],
    layerText: [
      { pattern: /title/, rowKey: 'title-layer', type: 'layer-title' },
      { pattern: /tagline/, rowKey: 'tagline-layer', type: 'layer-tagline' },
      { pattern: /origprice/, rowKey: 'origPrice-layer', type: 'layer-origPrice' },
      { pattern: /price/, rowKey: 'price-layer', type: 'layer-price', excludePattern: /origprice/ }
    ],
    layerImage: { pattern: /^l_\$img/, rowKey: 'image-layer', type: 'layer-image' },
    layerLogo: { 
      pattern: /^l_/, 
      rowKey: 'logo-layer', 
      type: 'layer-logo',
      excludePatterns: [/^l_text/, /^l_\$img/]
    },
    canvas: { pattern: /^c_pad/, rowKey: 'canvas-dimensions', type: 'canvas' },
    layerApply: { pattern: /^fl_layer_apply/, type: 'layer-apply' }
  }

  // Merge with provided config (provided config takes precedence)
  const config = {
    variables: layerConfig.variables ?? defaultLayerConfig.variables,
    layerText: layerConfig.layerText ?? defaultLayerConfig.layerText,
    layerImage: layerConfig.layerImage ?? defaultLayerConfig.layerImage,
    layerLogo: layerConfig.layerLogo ?? defaultLayerConfig.layerLogo,
    canvas: layerConfig.canvas ?? defaultLayerConfig.canvas,
    layerApply: layerConfig.layerApply ?? defaultLayerConfig.layerApply
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
    // Check layer logo pattern
    else if (!rowKey && config.layerLogo.pattern.test(part)) {
      // Check if it matches exclude patterns
      const matchesExclude = config.layerLogo.excludePatterns?.some(excludePattern => 
        excludePattern.test(part)
      )
      if (!matchesExclude) {
        type = config.layerLogo.type
        rowKey = config.layerLogo.rowKey
      }
    }
    // Check c_fit after logo layer (special case)
    else if (!rowKey && part.startsWith('c_fit') && index > 0) {
      const prevPart = parts[index - 1]
      if (config.layerLogo.pattern.test(prevPart)) {
        const matchesExclude = config.layerLogo.excludePatterns?.some(excludePattern => 
          excludePattern.test(prevPart)
        )
        if (!matchesExclude) {
          type = config.layerLogo.type
          rowKey = config.layerLogo.rowKey
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
  
  // Check two parts back for logo layer (fl_layer_apply after logo layer and c_fit)
  if (index > 1) {
    const prevPrevPart = parts[index - 2]
    if (config.layerLogo.pattern.test(prevPrevPart)) {
      const matchesExclude = config.layerLogo.excludePatterns?.some(excludePattern => 
        excludePattern.test(prevPrevPart)
      )
      if (!matchesExclude) {
        return config.layerLogo.rowKey
      }
    }
  }
  
  return null
}
