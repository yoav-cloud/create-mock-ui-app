import { extractLayers, isTextLayer, isImageLayer } from '../../utils/layerUtils'

const GRAVITY_TO_FLEX_ALIGN = {
  north_west: { justifyContent: 'flex-start', alignItems: 'flex-start' },
  north: { justifyContent: 'flex-start', alignItems: 'center' },
  north_east: { justifyContent: 'flex-start', alignItems: 'flex-end' },
  west: { justifyContent: 'center', alignItems: 'flex-start' },
  center: { justifyContent: 'center', alignItems: 'center' },
  east: { justifyContent: 'center', alignItems: 'flex-end' },
  south_west: { justifyContent: 'flex-end', alignItems: 'flex-start' },
  south: { justifyContent: 'flex-end', alignItems: 'center' },
  south_east: { justifyContent: 'flex-end', alignItems: 'flex-end' }
}

/**
 * Converts gravity-based positioning to absolute top-left coordinates
 * Cloudinary uses gravity to specify which corner/edge to position from
 */
const convertGravityToAbsolutePosition = (x, y, gravity, layerWidth, layerHeight, containerWidth, containerHeight) => {
  let absoluteTop = y || 0
  let absoluteLeft = x || 0
  
  // Convert Y coordinate based on vertical gravity
  if (gravity.includes('south')) {
    // Y is offset from bottom
    absoluteTop = containerHeight - y - layerHeight
  } else if (gravity === 'center' || gravity === 'west' || gravity === 'east') {
    // Y is offset from vertical center
    absoluteTop = (containerHeight / 2) - (layerHeight / 2) + y
  }
  // else north/north_west/north_east - Y is already from top
  
  // Convert X coordinate based on horizontal gravity
  if (gravity.includes('east')) {
    // X is offset from right
    absoluteLeft = containerWidth - x - layerWidth
  } else if (gravity === 'center' || gravity === 'north' || gravity === 'south') {
    // X is offset from horizontal center
    absoluteLeft = (containerWidth / 2) - (layerWidth / 2) + x
  }
  // else west/north_west/south_west - X is already from left
  
  return { top: Math.round(absoluteTop), left: Math.round(absoluteLeft) }
}

/**
 * Estimates the rendered width of text based on content and font size
 * This is a rough approximation - actual width depends on font family and styling
 */
const estimateTextWidth = (text, fontSize, isBold = false) => {
  if (!text || !fontSize) return 0
  
  // Average character width is roughly 0.6 of font size for normal text
  // Bold text is slightly wider, approximately 0.65
  const avgCharWidth = isBold ? fontSize * 0.65 : fontSize * 0.6
  return Math.round(text.length * avgCharWidth)
}

export const convertLayerToYogaNode = (layerKey, layerData, parentDimensions) => {
  const { width: parentWidth = 500, height: parentHeight = 900 } = parentDimensions
  
  // Determine layer dimensions first (needed for position calculation)
  let layerWidth = layerData.width || 0
  let layerHeight = layerData.height || 0
  
  // For text layers without explicit dimensions, estimate them based on actual content
  if (isTextLayer(layerData)) {
    const fontSize = layerData.fontSize || 16
    const isBold = layerData.bold || false
    
    if (!layerWidth) {
      // Estimate width based on actual text content, not textWidth (which is for wrapping)
      const textContent = (layerData.prefix || '') + (layerData.defaultValue || '')
      layerWidth = estimateTextWidth(textContent, fontSize, isBold)
      
      // Add some padding for better visualization (20% extra)
      layerWidth = Math.round(layerWidth * 1.2)
    }
    
    if (!layerHeight) {
      // Estimate height: fontSize * 1.5 for single line (includes line-height)
      layerHeight = Math.round(fontSize * 1.5)
    }
  }
  
  const gravity = layerData.gravity || 'north_west'
  
  // Convert gravity-based positioning to absolute top-left coordinates
  const absolutePosition = convertGravityToAbsolutePosition(
    layerData.x || 0,
    layerData.y || 0,
    gravity,
    layerWidth,
    layerHeight,
    parentWidth,
    parentHeight
  )
  
  const yogaNode = {
    key: layerKey,
    type: isTextLayer(layerData) ? 'text' : 'image',
    displayName: layerData.displayName || layerKey,
    layout: {
      position: 'absolute',
      width: layerWidth,
      height: layerHeight,
      top: absolutePosition.top,
      left: absolutePosition.left
    }
  }

  if (layerData.gravity) {
    const flexAlign = GRAVITY_TO_FLEX_ALIGN[layerData.gravity]
    if (flexAlign) {
      yogaNode.layout.alignSelf = flexAlign.alignItems
    }
  }

  if (isTextLayer(layerData)) {
    yogaNode.text = {
      content: layerData.defaultValue || '',
      fontSize: layerData.fontSize || 16,
      fontFamily: layerData.font || 'Arial',
      color: layerData.color || '#000000',
      fieldName: layerData.fieldName || layerKey
    }

    if (layerData.textWrap) {
      yogaNode.text.wrap = true
      yogaNode.text.maxWidth = layerData.textWidth || Math.round(parentWidth * 0.8)
    }
    
    if (layerData.bold) yogaNode.text.fontWeight = 'bold'
    if (layerData.italic) yogaNode.text.fontStyle = 'italic'
  } else if (isImageLayer(layerData)) {
    yogaNode.image = {
      publicId: layerData.publicId || null,
      isMainProduct: layerData.isMainProduct || false,
      fit: 'contain'
    }
  }

  if (layerData.backgroundImage) {
    yogaNode.backgroundImage = {
      publicId: layerData.backgroundImage.publicId || null,
      width: layerData.backgroundImage.width,
      height: layerData.backgroundImage.height
    }
  }

  yogaNode.metadata = {
    originalX: layerData.x || 0,
    originalY: layerData.y || 0,
    originalGravity: gravity,
    absoluteTop: absolutePosition.top,
    absoluteLeft: absolutePosition.left
  }

  // Dev mode logging to verify gravity conversion
  if (import.meta.env.DEV && gravity !== 'north_west') {
    console.log(`[Yoga] ${layerKey} gravity conversion:`, {
      gravity,
      original: { x: layerData.x, y: layerData.y },
      dimensions: { w: layerWidth, h: layerHeight },
      absolute: { top: absolutePosition.top, left: absolutePosition.left },
      container: { w: parentWidth, h: parentHeight }
    })
  }

  return yogaNode
}

export const convertDesignRulesToYogaLayout = (designRules, designId = 'parent') => {
  if (!designRules || !designRules[designId]) {
    throw new Error(`Design rules for "${designId}" not found`)
  }

  const rules = designRules[designId]
  const layers = extractLayers(rules)
  
  const yogaLayout = {
    container: {
      width: rules.width || 500,
      height: rules.height || 900,
      backgroundColor: rules.backgroundColor || '#FFFFFF',
      flexDirection: 'column',
      position: 'relative'
    },
    children: []
  }

  if (rules.backgroundImage) {
    yogaLayout.backgroundImage = {
      publicId: rules.backgroundImage.publicId,
      width: rules.backgroundImage.width,
      height: rules.backgroundImage.height,
      x: rules.backgroundImage.x || 0,
      y: rules.backgroundImage.y || 0
    }
  }

  Object.entries(layers).forEach(([layerKey, layerData]) => {
    const yogaNode = convertLayerToYogaNode(
      layerKey,
      layerData,
      { width: rules.width, height: rules.height }
    )
    yogaLayout.children.push(yogaNode)
  })

  yogaLayout.children.sort((a, b) => {
    const aZ = a.layout.top || 0
    const bZ = b.layout.top || 0
    return aZ - bZ
  })

  return yogaLayout
}

export const convertAllDesignRulesToYoga = (designRules) => {
  const allYogaLayouts = {}
  
  Object.keys(designRules).forEach(designId => {
    try {
      allYogaLayouts[designId] = convertDesignRulesToYogaLayout(designRules, designId)
    } catch (error) {
      console.warn(`Failed to convert ${designId} to Yoga layout:`, error.message)
    }
  })
  
  return allYogaLayouts
}

export const yogaLayoutToString = (yogaLayout, indent = 0) => {
  const spaces = ' '.repeat(indent)
  const lines = []
  
  lines.push(`${spaces}YGNodeStyleSetWidth(root, ${yogaLayout.container.width});`)
  lines.push(`${spaces}YGNodeStyleSetHeight(root, ${yogaLayout.container.height});`)
  lines.push(`${spaces}YGNodeStyleSetFlexDirection(root, YGFlexDirection${yogaLayout.container.flexDirection === 'row' ? 'Row' : 'Column'});`)
  
  yogaLayout.children.forEach((child, index) => {
    lines.push('')
    lines.push(`${spaces}// ${child.displayName} (${child.type})`)
    lines.push(`${spaces}const child${index} = YGNodeNew();`)
    lines.push(`${spaces}YGNodeStyleSetPosition(child${index}, YGEdgeLeft, ${child.layout.left});`)
    lines.push(`${spaces}YGNodeStyleSetPosition(child${index}, YGEdgeTop, ${child.layout.top});`)
    lines.push(`${spaces}YGNodeStyleSetWidth(child${index}, ${child.layout.width});`)
    lines.push(`${spaces}YGNodeStyleSetHeight(child${index}, ${child.layout.height});`)
    lines.push(`${spaces}YGNodeStyleSetPositionType(child${index}, YGPositionTypeAbsolute);`)
    
    if (child.text) {
      lines.push(`${spaces}// Text properties: "${child.text.content}"`)
      lines.push(`${spaces}// fontSize: ${child.text.fontSize}, fontFamily: ${child.text.fontFamily}`)
    } else if (child.image) {
      lines.push(`${spaces}// Image: ${child.image.publicId || 'dynamic'}`)
    }
    
    lines.push(`${spaces}YGNodeInsertChild(root, child${index}, ${index});`)
  })
  
  return lines.join('\n')
}

