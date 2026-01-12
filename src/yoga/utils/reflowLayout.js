// Use ASM.js version for synchronous, browser-friendly Yoga
import initYoga from 'yoga-wasm-web/asm'

// Initialize Yoga once (synchronous with ASM.js)
const Yoga = initYoga()

console.log('Yoga initialized successfully')

/**
 * Layer priority levels for intelligent reflow
 * Higher priority = less likely to shrink or hide
 */
const LAYER_PRIORITIES = {
  CRITICAL: 0,    // Never shrink (logo, CTA)
  HIGH: 1,        // Try to keep visible (price, product image)
  MEDIUM: 2,      // Can shrink moderately (title)
  LOW: 3          // Can shrink significantly or hide (tagline, decorative)
}

/**
 * Determines layer priority based on its type and metadata
 */
const getLayerPriority = (layer) => {
  // Use explicit priority if set
  if (layer.priority !== undefined) {
    return layer.priority
  }

  // Smart defaults based on layer characteristics
  const key = layer.key?.toLowerCase() || ''
  
  // Critical elements
  if (key.includes('cta') || key.includes('button') || key.includes('logo')) {
    return LAYER_PRIORITIES.CRITICAL
  }
  
  // High priority
  if (key.includes('price') || key.includes('product') || layer.image?.isMainProduct) {
    return LAYER_PRIORITIES.HIGH
  }
  
  // Medium priority
  if (key.includes('title') || key.includes('headline')) {
    return LAYER_PRIORITIES.MEDIUM
  }
  
  // Low priority (decorative text, secondary info)
  if (key.includes('tagline') || key.includes('description') || key.includes('subtitle')) {
    return LAYER_PRIORITIES.LOW
  }
  
  // Default: medium priority
  return LAYER_PRIORITIES.MEDIUM
}

/**
 * Calculate minimum sizes to keep content readable/usable
 */
const getMinimumSize = (layer) => {
  const priority = getLayerPriority(layer)
  
  if (layer.type === 'text') {
    const baseFontSize = layer.text?.fontSize || 16
    const minFontSize = priority === LAYER_PRIORITIES.CRITICAL ? baseFontSize : 
                        priority === LAYER_PRIORITIES.HIGH ? Math.max(baseFontSize * 0.7, 12) :
                        priority === LAYER_PRIORITIES.MEDIUM ? Math.max(baseFontSize * 0.5, 10) :
                        8
    
    const estimatedWidth = (layer.text?.content?.length || 5) * minFontSize * 0.6
    const estimatedHeight = minFontSize * 1.5
    
    return {
      minWidth: Math.max(estimatedWidth, 40),
      minHeight: Math.max(estimatedHeight, 16)
    }
  }
  
  if (layer.type === 'image') {
    if (priority === LAYER_PRIORITIES.CRITICAL) {
      return { minWidth: layer.layout.width * 0.8, minHeight: layer.layout.height * 0.8 }
    } else if (priority === LAYER_PRIORITIES.HIGH) {
      return { minWidth: 50, minHeight: 50 }
    } else {
      return { minWidth: 30, minHeight: 30 }
    }
  }
  
  return { minWidth: 20, minHeight: 20 }
}

/**
 * Reflows a yoga layout to a new container size using the real Yoga layout engine
 * This provides intelligent space distribution, priority-based sizing, and automatic overflow handling
 */
export const reflowYogaLayout = (yogaLayout, newWidth, newHeight) => {
  if (!yogaLayout) return null

  const originalContainer = {
    width: yogaLayout.container.width,
    height: yogaLayout.container.height
  }

  try {
    // STEP 1: Create root Yoga node
    const root = Yoga.Node.create()
    root.setWidth(newWidth)
    root.setHeight(newHeight)
    root.setFlexDirection(Yoga.FLEX_DIRECTION_ROW)
    root.setFlexWrap(Yoga.WRAP_WRAP)
    root.setJustifyContent(Yoga.JUSTIFY_FLEX_START)
    root.setAlignItems(Yoga.ALIGN_FLEX_START)
    root.setAlignContent(Yoga.ALIGN_FLEX_START)

    // Calculate global scale factor for reference
    const globalScaleFactor = Math.min(
      newWidth / originalContainer.width,
      newHeight / originalContainer.height
    )

    // STEP 2: Create child nodes with flex properties based on priorities
    const childNodes = []
    
    yogaLayout.children.forEach((layer, index) => {
      const child = Yoga.Node.create()
      const priority = getLayerPriority(layer)
      const minSizes = getMinimumSize(layer)
      
      // Set base dimensions (scaled proportionally)
      const scaledWidth = Math.max(layer.layout.width * globalScaleFactor, minSizes.minWidth)
      const scaledHeight = Math.max(layer.layout.height * globalScaleFactor, minSizes.minHeight)
      
      child.setWidth(scaledWidth)
      child.setHeight(scaledHeight)
      
      // Set flex properties based on priority
      switch (priority) {
        case LAYER_PRIORITIES.CRITICAL:
          child.setFlexShrink(0)  // Never shrink
          child.setFlexGrow(0)    // Don't expand
          break
        
        case LAYER_PRIORITIES.HIGH:
          child.setFlexShrink(0.3)  // Resist shrinking
          child.setFlexGrow(0.5)    // Can expand a bit
          break
        
        case LAYER_PRIORITIES.MEDIUM:
          child.setFlexShrink(1)    // Normal shrinking
          child.setFlexGrow(1)      // Can expand
          break
        
        case LAYER_PRIORITIES.LOW:
          child.setFlexShrink(2)    // Shrink more
          child.setFlexGrow(0)      // Don't expand
          break
      }
      
      // Set minimum constraints
      child.setMinWidth(minSizes.minWidth)
      child.setMinHeight(minSizes.minHeight)
      
      // Set maximum constraints to prevent overflow
      // Leave room for margins
      const maxWidth = newWidth - 20
      const maxHeight = newHeight - 20
      child.setMaxWidth(maxWidth)
      child.setMaxHeight(maxHeight)
      
      // Preserve aspect ratio for images
      if (layer.type === 'image' && layer.layout.width && layer.layout.height) {
        const aspectRatio = layer.layout.width / layer.layout.height
        child.setAspectRatio(aspectRatio)
      }
      
      // Add some margin for spacing (scale down for small containers)
      const margin = Math.max(Math.min(8 * globalScaleFactor, 8), 2)
      child.setMargin(Yoga.EDGE_ALL, margin)
      
      // Add to root
      root.insertChild(child, index)
      childNodes.push(child)
    })

    // STEP 3: Let Yoga calculate optimal layout
    root.calculateLayout(newWidth, newHeight, Yoga.DIRECTION_LTR)

    // STEP 4: Extract computed positions and build reflowed children
    const reflowedChildren = []
    
    for (let i = 0; i < childNodes.length; i++) {
      const child = childNodes[i]
      const layout = child.getComputedLayout()
      const originalLayer = yogaLayout.children[i]
      
      // Check if layer is effectively visible
      const isVisible = layout.width >= getMinimumSize(originalLayer).minWidth * 0.8 &&
                       layout.height >= getMinimumSize(originalLayer).minHeight * 0.8
      
      const reflowedLayer = {
        ...originalLayer,
        layout: {
          ...originalLayer.layout,
          position: 'absolute',
          left: Math.round(layout.left),
          top: Math.round(layout.top),
          width: Math.round(layout.width),
          height: Math.round(layout.height)
        },
        metadata: {
          ...originalLayer.metadata,
          priority: getLayerPriority(originalLayer),
          isVisible,
          yogaComputed: true
        }
      }
      
      // Adjust font size for text layers based on actual computed size
      if (originalLayer.type === 'text' && originalLayer.text) {
        const originalFontSize = originalLayer.text.fontSize || 16
        const sizeRatio = layout.height / originalLayer.layout.height
        const newFontSize = Math.max(
          Math.round(originalFontSize * sizeRatio),
          getMinimumSize(originalLayer).minHeight / 1.5
        )
        
        reflowedLayer.text = {
          ...originalLayer.text,
          fontSize: newFontSize
        }
      }
      
      reflowedChildren.push(reflowedLayer)
    }

    // STEP 5: Clean up - free Yoga nodes
    childNodes.forEach(node => node.free())
    root.freeRecursive()

    // STEP 6: Return reflowed layout
    const reflowedLayout = {
      ...yogaLayout,
      container: {
        ...yogaLayout.container,
        width: newWidth,
        height: newHeight
      },
      children: reflowedChildren,
      metadata: {
        ...yogaLayout.metadata,
        isReflowed: true,
        originalContainer,
        scaleFactor: globalScaleFactor,
        reflowDate: new Date().toISOString(),
        engine: 'yoga-layout',
        visibleLayerCount: reflowedChildren.filter(c => c.metadata?.isVisible).length
      }
    }

    if (yogaLayout.backgroundImage) {
      reflowedLayout.backgroundImage = {
        ...yogaLayout.backgroundImage,
        width: newWidth,
        height: newHeight
      }
    }

    // Log details in dev mode
    if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.DEV) {
      console.group('🧘 Yoga Layout Reflow')
      console.log('Original:', originalContainer)
      console.log('New:', { width: newWidth, height: newHeight })
      console.log('Global scale:', globalScaleFactor.toFixed(3))
      console.log('Visible layers:', reflowedLayout.metadata.visibleLayerCount, '/', reflowedChildren.length)
      console.log('Layer details:', reflowedChildren.map(l => ({
        key: l.key,
        priority: l.metadata.priority,
        visible: l.metadata.isVisible,
        size: `${l.layout.width}×${l.layout.height}`
      })))
      console.groupEnd()
    }

    return reflowedLayout
    
  } catch (error) {
    console.error('Yoga reflow error:', error)
    console.error('Yoga module:', Yoga)
    // Fallback: return original layout if Yoga fails
    return yogaLayout
  }
}

/**
 * Export priorities for use in layer configuration
 */
export { LAYER_PRIORITIES }
