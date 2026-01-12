/**
 * Converts a Yoga layout back to playground design rules format
 * This allows saving reflowed layouts as new sub-designs
 */

/**
 * Convert absolute top/left back to gravity-based positioning
 * Finds the best matching gravity and calculates x/y offsets
 */
const convertAbsoluteToGravity = (left, top, width, height, containerWidth, containerHeight) => {
  // Calculate relative positions from all edges
  const leftDist = left
  const rightDist = containerWidth - (left + width)
  const topDist = top
  const bottomDist = containerHeight - (top + height)
  
  // Determine vertical gravity (closest edge)
  let verticalGravity = 'north'
  let yOffset = topDist
  
  if (bottomDist < topDist) {
    verticalGravity = 'south'
    yOffset = bottomDist
  } else if (Math.abs(topDist - (containerHeight / 2 - height / 2)) < 20) {
    verticalGravity = 'center'
    yOffset = top - (containerHeight / 2 - height / 2)
  }
  
  // Determine horizontal gravity (closest edge)
  let horizontalGravity = 'west'
  let xOffset = leftDist
  
  if (rightDist < leftDist) {
    horizontalGravity = 'east'
    xOffset = rightDist
  } else if (Math.abs(leftDist - (containerWidth / 2 - width / 2)) < 20) {
    horizontalGravity = 'center'
    xOffset = left - (containerWidth / 2 - width / 2)
  }
  
  // Combine gravity values
  let gravity
  if (verticalGravity === 'center' && horizontalGravity === 'center') {
    gravity = 'center'
  } else if (verticalGravity === 'center') {
    gravity = horizontalGravity // 'east' or 'west'
  } else if (horizontalGravity === 'center') {
    gravity = verticalGravity // 'north' or 'south'
  } else {
    gravity = `${verticalGravity}_${horizontalGravity}` // e.g., 'north_west', 'south_east'
  }
  
  return {
    gravity,
    x: Math.round(xOffset),
    y: Math.round(yOffset)
  }
}

/**
 * Converts a Yoga layout back to design rules format
 * @param {Object} yogaLayout - The yoga layout to convert
 * @param {string} designId - ID for the new design (e.g., 'leaderboard-728x90')
 * @param {string} designName - Display name for the design
 * @param {string} originalDesignId - ID of the original design this was based on
 * @returns {Object} Design rules object compatible with playground format
 */
export const yogaLayoutToDesignRules = (yogaLayout, designId, designName, originalDesignId = 'parent') => {
  if (!yogaLayout) return null
  
  const { container, children = [], backgroundImage } = yogaLayout
  
  // Start with container dimensions
  const designRules = {
    width: container.width,
    height: container.height,
    backgroundColor: container.backgroundColor || '#FFFFFF'
  }
  
  // Add background image if present
  if (backgroundImage) {
    designRules.backgroundImage = {
      publicId: backgroundImage.publicId,
      width: backgroundImage.width || container.width,
      height: backgroundImage.height || container.height,
      x: backgroundImage.x || 0,
      y: backgroundImage.y || 0
    }
  }
  
  // Convert each layer
  children.forEach(layer => {
    if (!layer.key) return
    
    const { left, top, width, height } = layer.layout
    
    // Convert absolute position back to gravity-based
    const positioning = convertAbsoluteToGravity(
      left,
      top,
      width,
      height,
      container.width,
      container.height
    )
    
    // Base layer properties
    const layerRules = {
      x: positioning.x,
      y: positioning.y,
      gravity: positioning.gravity,
      width,
      height,
      displayName: layer.displayName || layer.key
    }
    
    // Add type-specific properties
    if (layer.type === 'text' && layer.text) {
      // Text layer
      Object.assign(layerRules, {
        fontSize: layer.text.fontSize || 16,
        color: layer.text.color || '#000000',
        font: layer.text.fontFamily || 'Arial',
        fieldName: layer.text.fieldName || layer.key,
        defaultValue: layer.text.content || '',
        textWrap: layer.text.wrap !== undefined ? layer.text.wrap : true,
        textWidth: layer.text.maxWidth || Math.round(container.width * 0.8)
      })
      
      // Optional text properties
      if (layer.text.fontWeight === 'bold') layerRules.bold = true
      if (layer.text.fontStyle === 'italic') layerRules.italic = true
      if (layer.text.fieldName) layerRules.fieldName = layer.text.fieldName
      
      // Remove width/height for text layers (they're calculated)
      delete layerRules.width
      delete layerRules.height
      
    } else if (layer.type === 'image' && layer.image) {
      // Image layer
      if (layer.image.publicId) {
        layerRules.publicId = layer.image.publicId
      }
      if (layer.image.isMainProduct) {
        layerRules.isMainProduct = true
      }
      // isLogo and show properties
      if (layer.key.toLowerCase().includes('logo')) {
        layerRules.isLogo = true
        layerRules.show = true
      }
    }
    
    // Add metadata from original layer if available
    if (layer.metadata) {
      if (layer.metadata.originalX !== undefined) {
        layerRules._originalX = layer.metadata.originalX
      }
      if (layer.metadata.originalY !== undefined) {
        layerRules._originalY = layer.metadata.originalY
      }
      if (layer.metadata.originalGravity) {
        layerRules._originalGravity = layer.metadata.originalGravity
      }
      if (layer.priority !== undefined) {
        layerRules.priority = layer.priority
      }
    }
    
    designRules[layer.key] = layerRules
  })
  
  return designRules
}

/**
 * Creates a design type object for the reflowed design
 * @param {Object} yogaLayout - The yoga layout
 * @param {string} bannerName - Name of the banner size (e.g., 'Leaderboard')
 * @param {string} bannerId - ID of the banner size (e.g., 'leaderboard')
 * @param {string} originalDesignId - ID of the original design
 * @returns {Object} Design type object { id, name, width, height, description }
 */
export const createDesignType = (yogaLayout, bannerName, bannerId, originalDesignId = 'parent') => {
  if (!yogaLayout) return null
  
  const { container } = yogaLayout
  const timestamp = Date.now()
  
  return {
    id: `${bannerId}-${timestamp}`,
    name: `${bannerName} (${container.width}×${container.height})`,
    width: container.width,
    height: container.height,
    description: `Reflowed from ${originalDesignId} to ${bannerName} format`,
    isReflowed: true,
    sourceDesign: originalDesignId,
    reflowDate: new Date().toISOString()
  }
}
