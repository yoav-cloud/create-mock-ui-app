import { GRAVITY_VALUES, BASE_WIDTH } from '../pages/playground/constants'
import { calculatePosition } from './positionUtils'
import { estimateTextWidth, estimateTextHeight, estimateWrappedTextDimensions } from './fontUtils'
import { hasMetadataSyntax } from './metadataUtils'
import { extractLayers, isTextLayer, isImageLayer, getLayerTextContent, getTextFormatting } from './layerUtils'

/**
 * Calculates layer overlays for the preview image
 * @param {Object} params - Parameters object
 * @param {HTMLElement} params.wrapperRef - Reference to the preview wrapper element
 * @param {Object} params.canvasDimensions - Canvas dimensions { width, height }
 * @param {Object} params.editableRules - Editable rules object
 * @param {string} params.selectedDesignId - Selected design ID
 * @param {Object} params.formValues - Form values
 * @param {Object} params.useMetadata - Metadata toggle state
 * @returns {Array} Array of overlay objects with { id, name, left, top, width, height }
 */
export function calculateLayerOverlays({
  wrapperRef,
  canvasDimensions,
  editableRules,
  selectedDesignId,
  formValues,
  useMetadata
}) {
  if (!wrapperRef?.current) return []
  
  const wrapper = wrapperRef.current
  const wrapperRect = wrapper.getBoundingClientRect()
  
  // Find the actual image element (could be .preview-image.current or .preview-image.previous)
  const imageElement = wrapper.querySelector('.preview-image.current:not(.loading)') || 
                      wrapper.querySelector('.preview-image.previous') ||
                      wrapper.querySelector('.preview-image')
  
  if (!imageElement || !(imageElement instanceof HTMLImageElement)) return []
  
  // Ensure image has loaded
  if (imageElement.naturalWidth === 0 || imageElement.naturalHeight === 0) return []
  
  // Get rules for current design
  const rules = editableRules[selectedDesignId] || editableRules['parent']
  
  // Get intrinsic dimensions from the actual rendered image
  const intrinsicWidth = imageElement.naturalWidth
  const intrinsicHeight = imageElement.naturalHeight
  
  // Get expected dimensions from rules
  const expectedWidth = rules.width || canvasDimensions.width
  const expectedHeight = rules.height || canvasDimensions.height
  
  // Check if the rendered image matches the expected dimensions for this design
  // If not, the image is stale (from a previous design) - skip calculation
  if (Math.abs(intrinsicWidth - expectedWidth) > 1 || Math.abs(intrinsicHeight - expectedHeight) > 1) {
    return []
  }
  
  // Use intrinsic dimensions as canvas dimensions (positions in rules are relative to these)
  const canvasWidth = intrinsicWidth
  const canvasHeight = intrinsicHeight
  const canvasAspectRatio = canvasWidth / canvasHeight
  
  // Rules scale factor - the Cloudinary transformation scales all positions/sizes by this factor
  // This is because rule values are defined at BASE_WIDTH scale, then scaled up for larger canvases
  const rulesScale = canvasWidth / BASE_WIDTH
  
  // Get the image element's bounding rect (this is its container size, not content size)
  const imageRect = imageElement.getBoundingClientRect()
  const elementWidth = imageRect.width
  const elementHeight = imageRect.height
  const elementAspectRatio = elementWidth / elementHeight
  
  // Calculate how the image CONTENT is displayed within the element with object-fit: contain
  // The content maintains its aspect ratio and is centered within the element
  let displayedImageWidth, displayedImageHeight, contentOffsetX, contentOffsetY
  
  if (canvasAspectRatio > elementAspectRatio) {
    // Canvas is wider than element - fit to width, center vertically
    displayedImageWidth = elementWidth
    displayedImageHeight = elementWidth / canvasAspectRatio
    contentOffsetX = 0
    contentOffsetY = (elementHeight - displayedImageHeight) / 2
  } else {
    // Canvas is taller than element - fit to height, center horizontally
    displayedImageHeight = elementHeight
    displayedImageWidth = elementHeight * canvasAspectRatio
    contentOffsetX = (elementWidth - displayedImageWidth) / 2
    contentOffsetY = 0
  }
  
  // Calculate uniform scale factor
  const scale = displayedImageWidth / canvasWidth
  
  // Calculate image offset relative to the wrapper
  // This is the offset of the image element within the wrapper, plus the content offset within the element
  const imageOffsetX = (imageRect.left - wrapperRect.left) + contentOffsetX
  const imageOffsetY = (imageRect.top - wrapperRect.top) + contentOffsetY
  
  // Extract all layers dynamically
  const layers = extractLayers(rules)
  
  // Find base font size for percentage calculations (first text layer's fontSize)
  let baseFontSize = 32 // Default fallback
  for (const [layerKey, layerData] of Object.entries(layers)) {
    if (isTextLayer(layerData) && layerData.fontSize) {
      if (typeof layerData.fontSize === 'string' && layerData.fontSize.endsWith('%')) {
        baseFontSize = 32 // Default fallback
      } else {
        baseFontSize = typeof layerData.fontSize === 'number' ? layerData.fontSize : parseFloat(layerData.fontSize) || 32
      }
      break
    }
  }
  
  const newOverlays = []
  
  // Process layers in object key order (JavaScript preserves insertion order)
  const layerEntries = Object.entries(layers)
  
  // Process each layer
  layerEntries.forEach(([layerKey, layerData]) => {
    // Generate display name from layer key (capitalize first letter, add spaces)
    const displayName = layerData.displayName || layerKey
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, str => str.toUpperCase())
      .trim()
    
    if (isTextLayer(layerData)) {
      // Text layer - calculate actual size
      // Font size uses displayScale only (not rulesScale) - sizes are absolute in Cloudinary
      const fontSize = typeof layerData.fontSize === 'string' && layerData.fontSize.endsWith('%')
        ? baseFontSize * (parseFloat(layerData.fontSize) / 100)
        : (layerData.fontSize || baseFontSize)
      
      const fontFamily = layerData.font || 'Arial'
      
      // Get text content dynamically
      let textContent = getLayerTextContent(layerKey, formValues, layerData)
      
      // Handle calculations (e.g., origPrice = price * 1.25)
      if (layerData.calculation && layerData.calculation.dependsOn) {
        const dependsFieldName = layers[layerData.calculation.dependsOn]?.fieldName || layerData.calculation.dependsOn
        const dependsValue = formValues[dependsFieldName] || '0'
        const formula = layerData.calculation.formula || 'mul_1.25'
        
        if (formula.startsWith('mul_')) {
          const multiplier = parseFloat(formula.replace('mul_', '')) || 1.25
          const calculatedValue = (parseFloat(dependsValue) * multiplier).toFixed(2)
          textContent = `${layerData.prefix || ''}${calculatedValue}${layerData.suffix || ''}`
        }
      } else {
        // Apply prefix and suffix if specified
        textContent = `${layerData.prefix || ''}${textContent}${layerData.suffix || ''}`
      }
      
      // Get formatting flags
      const formatting = getTextFormatting(layerData)
      const isBold = formatting.bold === true
      
      // Get field name for metadata check
      const fieldName = layerData.fieldName || layerKey
      const isMetadata = useMetadata[fieldName] || hasMetadataSyntax(formValues[fieldName])
      
      let layerW, layerH
      
      if (!isMetadata && layerData.textWrap !== false && layerData.textWidth) {
        // Text wraps - calculate wrapped dimensions
        // textWidth is in base coordinates, no rulesScale for sizes
        const maxWidth = layerData.textWidth || Math.round(canvasWidth * 0.8)
        const dims = estimateWrappedTextDimensions(textContent, fontSize, maxWidth, fontFamily, isBold)
        layerW = dims.width * scale
        layerH = dims.height * scale
      } else {
        // No wrapping or metadata - calculate exact width
        layerW = estimateTextWidth(textContent, fontSize, fontFamily, isBold, layerKey, isMetadata, layerData) * scale
        layerH = estimateTextHeight(fontSize) * scale
      }
      
      // Apply rulesScale to x, y positions (Cloudinary transformation scales positions)
      const scaledX = (layerData.x || 0) * rulesScale
      const scaledY = (layerData.y || 0) * rulesScale
      
      const pos = calculatePosition(
        scaledX,
        scaledY,
        layerData.gravity || GRAVITY_VALUES.northWest,
        layerW,
        layerH,
        canvasWidth,
        canvasHeight,
        scale,
        imageOffsetX,
        imageOffsetY
      )
      newOverlays.push({
        id: layerKey,
        name: displayName,
        ...pos,
        width: layerW,
        height: layerH
      })
    } else if (isImageLayer(layerData)) {
      // Image layer - can be main product image or overlay image (logo, etc.)
      
      // Check if layer should be shown (for overlay images with show property)
      if (layerData.show === false) {
        return
      }
      
      // For image layers, BOTH positions and sizes are scaled by rulesScale in Cloudinary
      // (unlike text layers where fontSize is absolute)
      const scaledX = (layerData.x || 0) * rulesScale
      const scaledY = (layerData.y || 0) * rulesScale
      const scaledWidth = (layerData.width || (layerData.publicId ? 100 : 300)) * rulesScale
      const scaledHeight = (layerData.height || (layerData.publicId ? 100 : 300)) * rulesScale
      
      const imgW = scaledWidth * scale
      const imgH = scaledHeight * scale
      const pos = calculatePosition(
        scaledX,
        scaledY,
        layerData.gravity || GRAVITY_VALUES.northWest,
        imgW,
        imgH,
        canvasWidth,
        canvasHeight,
        scale,
        imageOffsetX,
        imageOffsetY
      )
      newOverlays.push({
        id: layerKey,
        name: displayName,
        ...pos,
        width: imgW,
        height: imgH
      })
    }
  })
  
  return newOverlays
}

