/**
 * Calculates font size with percentage support
 * fontSize can be a number (absolute) or a string like "50%" (relative to parentValue) or "32" (string number)
 * Font sizes are NOT scaled - they remain the same pixel size regardless of canvas size
 * @param {number|string} fontSize - Font size value (number, percentage string, or string number)
 * @param {number|string} parentValue - Parent font size value for percentage calculations
 * @returns {number} Calculated font size in pixels
 */
export function calculateFontSize(fontSize, parentValue) {
  if (typeof fontSize === 'string' && fontSize.endsWith('%')) {
    // Percentage value: calculate relative to parent's raw value
    const percentage = parseFloat(fontSize) / 100
    // Get parent's raw value (not scaled)
    const parentRawValue = typeof parentValue === 'string' && parentValue.endsWith('%')
      ? 32 // Fallback if parent is also percentage
      : (typeof parentValue === 'number' ? parentValue : parseFloat(parentValue) || 32)
    return Math.round(parentRawValue * percentage)
  }
  // Absolute value - use as-is, no scaling
  // Handle both number and string number (e.g., "32")
  if (typeof fontSize === 'number') {
    return fontSize
  }
  const parsed = parseFloat(fontSize)
  return isNaN(parsed) ? 0 : parsed
}

/**
 * Converts font name to kebab-case for Cloudinary (e.g., "Open Sans" → "Open-Sans")
 * @param {string} fontName - Font name to convert
 * @returns {string} Kebab-case font name, or 'Arial' if fontName is empty
 */
export function fontToKebabCase(fontName) {
  if (!fontName) return 'Arial'
  return fontName.replace(/\s+/g, '-')
}

/**
 * Estimates text width based on content, font size, and character count
 * @param {string} text - Text content
 * @param {number} fontSize - Font size in pixels
 * @param {string} fontFamily - Font family (default: 'Arial')
 * @param {boolean} isBold - Whether text is bold (default: false)
 * @param {string} layerName - Layer name (deprecated, use layerData instead)
 * @param {boolean} isMetadata - Whether using metadata (default: false)
 * @param {Object} layerData - Optional layer data object with textWidthMultiplier property
 * @returns {number} Estimated text width in pixels
 */
export function estimateTextWidth(text, fontSize, fontFamily = 'Arial', isBold = false, layerName = '', isMetadata = false, layerData = null) {
  // If using metadata, we can't know the length. Return a fixed small width.
  // Used for indicators when the field is dynamic.
  if (isMetadata) {
    return fontSize * 2 // Small square/rect to indicate position
  }

  if (!text) return 0
  
  // Get multiplier from layer data if available, otherwise use default
  let multiplier = layerData?.textWidthMultiplier || 0.6
  
  // Simple calculation: fontSize * character count * multiplier
  return fontSize * text.length * multiplier
}

/**
 * Estimates text height for a single line
 * @param {number} fontSize - Font size in pixels
 * @returns {number} Estimated text height in pixels
 */
export function estimateTextHeight(fontSize) {
  return fontSize * 1.2 // Line height multiplier
}

/**
 * Estimates wrapped text dimensions
 * @param {string} text - Text content
 * @param {number} fontSize - Font size in pixels
 * @param {number} maxWidth - Maximum width for wrapping
 * @param {string} fontFamily - Font family (default: 'Arial')
 * @param {boolean} isBold - Whether text is bold (default: false)
 * @returns {{width: number, height: number}} Estimated dimensions
 */
export function estimateWrappedTextDimensions(text, fontSize, maxWidth, fontFamily = 'Arial', isBold = false) {
  if (!text) return { width: 0, height: estimateTextHeight(fontSize) }
  
  // Simple word-wrap estimation
  const words = text.split(' ')
  let currentLine = ''
  let lines = []
  
  words.forEach(word => {
    const testLine = currentLine ? `${currentLine} ${word}` : word
    const testWidth = estimateTextWidth(testLine, fontSize, fontFamily, isBold, false)
    
    if (testWidth <= maxWidth && currentLine) {
      currentLine = testLine
    } else {
      if (currentLine) lines.push(currentLine)
      currentLine = word
    }
  })
  if (currentLine) lines.push(currentLine)
  
  const lineCount = Math.max(1, lines.length)
  const actualWidth = Math.min(
    maxWidth,
    Math.max(...lines.map(line => estimateTextWidth(line, fontSize, fontFamily, isBold, false)))
  )
  const height = lineCount * estimateTextHeight(fontSize)
  
  return { width: actualWidth, height }
}

/**
 * Builds text layer flags array for Cloudinary
 * @param {Object} layerRules - Layer rules object
 * @returns {Array<string>} Array of flag strings (e.g., ['fl_no_overflow'])
 */
export function buildTextFlags(layerRules) {
  const flags = []
  if (layerRules.flNoOverflow) {
    flags.push('fl_no_overflow')
  }
  if (layerRules.flTextDisallowOverflow) {
    flags.push('fl_text_disallow_overflow')
  }
  return flags
}

