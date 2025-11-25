import { GRAVITY_VALUES } from '../pages/playground/constants'
import { calculatePosition } from './positionUtils'
import { estimateTextWidth, estimateTextHeight, estimateWrappedTextDimensions } from './fontUtils'
import { hasMetadataSyntax } from './metadataUtils'
import { extractLayers, isTextLayer, isImageLayer, isLogoLayer, getLayerTextContent, getTextFormatting } from './layerUtils'

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
  
  // Get canvas dimensions (intrinsic size - what the user perceives)
  const canvasWidth = canvasDimensions.width
  const canvasHeight = canvasDimensions.height
  const canvasAspectRatio = canvasWidth / canvasHeight
  
  // Get wrapper dimensions
  const wrapperWidth = wrapperRect.width
  const wrapperHeight = wrapperRect.height
  const wrapperAspectRatio = wrapperWidth / wrapperHeight
  
  // Calculate how the image is displayed with object-fit: contain
  // The image maintains its aspect ratio and fits within the wrapper
  // We need to determine the actual displayed size and position
  let displayedImageWidth, displayedImageHeight, imageOffsetX, imageOffsetY
  
  if (canvasAspectRatio > wrapperAspectRatio) {
    // Canvas is wider - fit to width, center vertically
    displayedImageWidth = wrapperWidth
    displayedImageHeight = wrapperWidth / canvasAspectRatio
    imageOffsetX = 0
    imageOffsetY = (wrapperHeight - displayedImageHeight) / 2
  } else {
    // Canvas is taller - fit to height, center horizontally
    displayedImageHeight = wrapperHeight
    displayedImageWidth = wrapperHeight * canvasAspectRatio
    imageOffsetX = (wrapperWidth - displayedImageWidth) / 2
    imageOffsetY = 0
  }
  
  // Calculate uniform scale factor (image maintains aspect ratio)
  const scale = displayedImageWidth / canvasWidth
  
  // Get rules for current design
  const rules = editableRules[selectedDesignId] || editableRules['parent']
  
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
  
  // Process layers in order (can be defined by layer.order or use default order)
  const layerEntries = Object.entries(layers)
  
  // Sort layers by order if specified, otherwise maintain object key order
  layerEntries.sort(([keyA, dataA], [keyB, dataB]) => {
    const orderA = dataA.order !== undefined ? dataA.order : 999
    const orderB = dataB.order !== undefined ? dataB.order : 999
    return orderA - orderB
  })
  
  // Process each layer
  layerEntries.forEach(([layerKey, layerData]) => {
    // Generate display name from layer key (capitalize first letter, add spaces)
    const displayName = layerData.displayName || layerKey
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, str => str.toUpperCase())
      .trim()
    
    if (isLogoLayer(layerKey, layerData)) {
      // Logo layer - only show if showLogo is enabled
      if (rules.showLogo === false) return
      
      const logoW = (layerData.width || 100) * scale
      const logoH = (layerData.height || 100) * scale
      const pos = calculatePosition(
        layerData.x || 0,
        layerData.y || 0,
        layerData.gravity || GRAVITY_VALUES.northWest,
        logoW,
        logoH,
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
        width: logoW,
        height: logoH
      })
    } else if (isTextLayer(layerData)) {
      // Text layer - calculate actual size
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
        const maxWidth = layerData.textWidth
        const dims = estimateWrappedTextDimensions(textContent, fontSize, maxWidth, fontFamily, isBold)
        layerW = dims.width * scale
        layerH = dims.height * scale
      } else {
        // No wrapping or metadata - calculate exact width
        layerW = estimateTextWidth(textContent, fontSize, fontFamily, isBold, layerKey, isMetadata, layerData) * scale
        layerH = estimateTextHeight(fontSize) * scale
      }
      
      const pos = calculatePosition(
        layerData.x || 0,
        layerData.y || 0,
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
      // Image layer (main product image)
      const imgW = (layerData.width || 300) * scale
      const imgH = (layerData.height || 300) * scale
      const pos = calculatePosition(
        layerData.x || 0,
        layerData.y || 0,
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

