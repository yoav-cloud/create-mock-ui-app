import { GRAVITY_VALUES } from '../pages/playground/constants'
import { calculatePosition } from './positionUtils'
import { estimateTextWidth, estimateTextHeight, estimateWrappedTextDimensions } from './fontUtils'
import { hasMetadataSyntax } from './metadataUtils'

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
  
  const newOverlays = []
  
  // Logo layer
  if (rules.showLogo !== false && rules.logo) {
    const logoRules = rules.logo
    const logoW = (logoRules.width || 100) * scale
    const logoH = (logoRules.height || 100) * scale
    const pos = calculatePosition(logoRules.x || 0, logoRules.y || 0, logoRules.gravity || GRAVITY_VALUES.northWest, logoW, logoH, canvasWidth, canvasHeight, scale, imageOffsetX, imageOffsetY)
    newOverlays.push({
      id: 'logo',
      name: 'Logo',
      ...pos,
      width: logoW,
      height: logoH
    })
  }
  
  // Title layer (text - calculate actual size)
  if (rules.title) {
    const titleRules = rules.title
    const fontSize = typeof titleRules.fontSize === 'string' && titleRules.fontSize.endsWith('%')
      ? 32 * (parseFloat(titleRules.fontSize) / 100)
      : (titleRules.fontSize || 32)
    const fontFamily = titleRules.font || 'Arial'
    const textContent = formValues.title || ''
    const isBold = true // Title is bold
    const isMetadata = useMetadata.title || hasMetadataSyntax(formValues.title)
    
    let titleW, titleH
    
    if (!isMetadata && titleRules.textWrap !== false && titleRules.textWidth) {
      // Text wraps - calculate wrapped dimensions
      const maxWidth = titleRules.textWidth
      const dims = estimateWrappedTextDimensions(textContent, fontSize, maxWidth, fontFamily, isBold)
      titleW = dims.width * scale
      titleH = dims.height * scale
    } else {
      // No wrapping or metadata - calculate exact width
      titleW = estimateTextWidth(textContent, fontSize, fontFamily, isBold, 'title', isMetadata) * scale
      titleH = estimateTextHeight(fontSize) * scale
    }
    
    const pos = calculatePosition(titleRules.x || 0, titleRules.y || 0, titleRules.gravity || GRAVITY_VALUES.northWest, titleW, titleH, canvasWidth, canvasHeight, scale, imageOffsetX, imageOffsetY)
    newOverlays.push({
      id: 'title',
      name: 'Title',
      ...pos,
      width: titleW,
      height: titleH
    })
  }
  
  // Tagline layer (text - calculate actual size)
  if (rules.tagline) {
    const taglineRules = rules.tagline
    const fontSize = typeof taglineRules.fontSize === 'string' && taglineRules.fontSize.endsWith('%')
      ? 32 * (parseFloat(taglineRules.fontSize) / 100)
      : (taglineRules.fontSize || 20)
    const fontFamily = taglineRules.font || 'Arial'
    const textContent = formValues.tagline || ''
    const isBold = false // Tagline is italic, not bold
    const isMetadata = useMetadata.tagline || hasMetadataSyntax(formValues.tagline)
    
    let taglineW, taglineH
    
    if (!isMetadata && taglineRules.textWrap !== false && taglineRules.textWidth) {
      // Text wraps - calculate wrapped dimensions
      const maxWidth = taglineRules.textWidth
      const dims = estimateWrappedTextDimensions(textContent, fontSize, maxWidth, fontFamily, isBold)
      taglineW = dims.width * scale
      taglineH = dims.height * scale
    } else {
      // No wrapping or metadata - calculate exact width based on actual text
      taglineW = estimateTextWidth(textContent, fontSize, fontFamily, isBold, 'tagline', isMetadata) * scale
      taglineH = estimateTextHeight(fontSize) * scale
    }
    
    const pos = calculatePosition(taglineRules.x || 0, taglineRules.y || 0, taglineRules.gravity || GRAVITY_VALUES.northWest, taglineW, taglineH, canvasWidth, canvasHeight, scale, imageOffsetX, imageOffsetY)
    newOverlays.push({
      id: 'tagline',
      name: 'Tagline',
      ...pos,
      width: taglineW,
      height: taglineH
    })
  }
  
  // Image layer
  if (rules.image) {
    const imgRules = rules.image
    const imgW = (imgRules.width || 300) * scale
    const imgH = (imgRules.height || 300) * scale
    const pos = calculatePosition(imgRules.x || 0, imgRules.y || 0, imgRules.gravity || GRAVITY_VALUES.northWest, imgW, imgH, canvasWidth, canvasHeight, scale, imageOffsetX, imageOffsetY)
    newOverlays.push({
      id: 'image',
      name: 'Main Image',
      ...pos,
      width: imgW,
      height: imgH
    })
  }
  
  // Original Price layer (text - calculate actual size)
  if (rules.origPrice) {
    const origPriceRules = rules.origPrice
    const fontSize = typeof origPriceRules.fontSize === 'string' && origPriceRules.fontSize.endsWith('%')
      ? 32 * (parseFloat(origPriceRules.fontSize) / 100)
      : (origPriceRules.fontSize || 30)
    const fontFamily = origPriceRules.font || 'Arial'
    // Original price is calculated as price * 1.25, with strikethrough
    const priceValue = parseFloat(formValues.price || '0')
    const origPriceValue = (priceValue * 1.25).toFixed(2)
    const textContent = `$${origPriceValue}`
    const isBold = false // Strikethrough, not bold
    // Original price relies on price metadata status
    const isMetadata = useMetadata.price || hasMetadataSyntax(formValues.price)
    
    const origPriceW = estimateTextWidth(textContent, fontSize, fontFamily, isBold, 'origPrice', isMetadata) * scale
    const origPriceH = estimateTextHeight(fontSize) * scale
    
    const pos = calculatePosition(origPriceRules.x || 0, origPriceRules.y || 0, origPriceRules.gravity || GRAVITY_VALUES.northWest, origPriceW, origPriceH, canvasWidth, canvasHeight, scale, imageOffsetX, imageOffsetY)
    newOverlays.push({
      id: 'origPrice',
      name: 'Original Price',
      ...pos,
      width: origPriceW,
      height: origPriceH
    })
  }
  
  // Price layer (text - calculate actual size)
  if (rules.price) {
    const priceRules = rules.price
    const fontSize = typeof priceRules.fontSize === 'string' && priceRules.fontSize.endsWith('%')
      ? 32 * (parseFloat(priceRules.fontSize) / 100)
      : (priceRules.fontSize || 44)
    const fontFamily = priceRules.font || 'Arial'
    const textContent = `$${formValues.price || '0'}`
    const isBold = true // Price is bold
    const isMetadata = useMetadata.price || hasMetadataSyntax(formValues.price)
    
    const priceW = estimateTextWidth(textContent, fontSize, fontFamily, isBold, 'price', isMetadata) * scale
    const priceH = estimateTextHeight(fontSize) * scale
    
    const pos = calculatePosition(priceRules.x || 0, priceRules.y || 0, priceRules.gravity || GRAVITY_VALUES.northWest, priceW, priceH, canvasWidth, canvasHeight, scale, imageOffsetX, imageOffsetY)
    newOverlays.push({
      id: 'price',
      name: 'Price',
      ...pos,
      width: priceW,
      height: priceH
    })
  }
  
  return newOverlays
}

