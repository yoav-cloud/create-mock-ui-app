const TEMPLATE_MARKER = '#'

import { GRAVITY_VALUES, DESIGN_TYPES } from '../playground/constants'

const sanitizeVariableName = (name = '') => {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '')
}

export const extractVariableFromName = (nodeName = '') => {
  const hashIndex = nodeName.indexOf(TEMPLATE_MARKER)
  if (hashIndex === -1) return null
  const raw = nodeName.slice(hashIndex + 1)
  const sanitized = sanitizeVariableName(raw)
  return sanitized || null
}

export const isDynamicCandidateName = (nodeName = '') => {
  return typeof nodeName === 'string' && nodeName.includes(TEMPLATE_MARKER)
}

export const collectFramesFromDocument = (documentNode) => {
  if (!documentNode?.children) return []
  const frames = []
  documentNode.children.forEach(page => {
    if (!page?.children) return
    page.children.forEach(child => {
      if (child.type === 'FRAME') {
        frames.push({
          id: child.id,
          name: child.name,
          pageName: page.name,
          node: child
        })
      }
    })
  })
  return frames
}

export const findNodeById = (node, id) => {
  if (!node) return null
  if (node.id === id) return node
  if (!node.children) return null
  for (const child of node.children) {
    const found = findNodeById(child, id)
    if (found) return found
  }
  return null
}

export const findNodePathById = (node, id, path = []) => {
  if (!node) return null
  const nextPath = [...path, node]
  if (node.id === id) return nextPath
  if (!node.children) return null
  for (const child of node.children) {
    const found = findNodePathById(child, id, nextPath)
    if (found) return found
  }
  return null
}

export const extractTemplatedNodes = (node, acc = []) => {
  if (!node) return acc
  if (typeof node.name === 'string' && node.name.includes(TEMPLATE_MARKER)) {
    acc.push(node)
  }
  if (node.children) {
    node.children.forEach(child => extractTemplatedNodes(child, acc))
  }
  return acc
}

const isNodeVisible = (node) => {
  if (!node) return false
  if (node.visible === false) return false
  if (node.opacity !== undefined && Number(node.opacity) <= 0) return false
  return true
}

const hasRenderableBounds = (node) => {
  const bounds = node?.absoluteRenderBounds || node?.absoluteBoundingBox
  if (!bounds) return false
  const width = Number(bounds.width) || 0
  const height = Number(bounds.height) || 0
  return width > 0 && height > 0
}

export const collectRenderableNodesForFrame = (frameNode) => {
  const acc = []

  const walk = (node) => {
    if (!node || !isNodeVisible(node)) return

    // Treat any node with a template marker as an atomic layer (don’t descend),
    // even if it’s a group/instance. This matches the “# => dynamic candidate” convention.
    if (isDynamicCandidateName(node.name) && hasRenderableBounds(node)) {
      acc.push(node)
      return
    }

    if (node.type === 'TEXT' && hasRenderableBounds(node)) {
      acc.push(node)
      return
    }

    if (Array.isArray(node.children) && node.children.length) {
      node.children.forEach(walk)
      return
    }

    // Leaf non-text nodes become background image layers.
    if (node.type !== 'TEXT' && hasRenderableBounds(node)) {
      acc.push(node)
    }
  }

  // Start from the frame itself (but only collect its descendants)
  if (frameNode?.children?.length) {
    frameNode.children.forEach(walk)
  }

  return acc
}

const toHex = (value) => {
  return Math.max(0, Math.min(255, Math.round(value))).toString(16).padStart(2, '0')
}

export const colorToHex = (color, opacity = 1) => {
  if (!color) return null
  const r = toHex((color.r ?? color.red ?? 0) * 255)
  const g = toHex((color.g ?? color.green ?? 0) * 255)
  const b = toHex((color.b ?? color.blue ?? 0) * 255)
  const finalOpacity = color.a !== undefined ? color.a * opacity : opacity
  if (finalOpacity < 1) {
    const a = toHex(finalOpacity * 255)
    return `${r}${g}${b}${a}`
  }
  return `${r}${g}${b}`
}

const getBackgroundColor = (node) => {
  const fill = node?.fills?.find(fill => fill.type === 'SOLID' && fill.visible !== false)
  if (!fill) return null
  return colorToHex(fill.color, fill.opacity ?? 1)
}

const cleanText = (value = '') => {
  return value
    .replace(/\u2028|\u2029/g, '\n')
    .replace(/[\u200B-\u200D\uFEFF]/g, '')
}

export const getRelativeBox = (node, frame) => {
  const source = node.absoluteRenderBounds || node.absoluteBoundingBox || { x: 0, y: 0, width: 0, height: 0 }
  const frameBox = frame.absoluteBoundingBox || { x: 0, y: 0 }
  return {
    x: Math.round((source.x ?? 0) - (frameBox.x ?? 0)),
    y: Math.round((source.y ?? 0) - (frameBox.y ?? 0)),
    width: Math.round(source.width ?? 0),
    height: Math.round(source.height ?? 0)
  }
}

export const buildLayerPreviewForFrame = ({ frameNode, templatedNodes = [] }) => {
  const frameBox = frameNode?.absoluteBoundingBox || { width: 0, height: 0 }
  const frameWidth = Math.round(frameBox.width ?? frameNode?.width ?? 0)
  const frameHeight = Math.round(frameBox.height ?? frameNode?.height ?? 0)

  const previewLayers = {
    images: [],
    texts: [],
    dynamicIds: []
  }

  const overlayLayers = []

  if (!frameNode || !Array.isArray(templatedNodes)) {
    return { previewLayers, overlayLayers, frameWidth, frameHeight }
  }

  templatedNodes.forEach(node => {
    const variable = extractVariableFromName(node?.name || '')
    const box = getRelativeBox(node, frameNode)
    const layerBase = {
      id: node.id,
      name: node.name,
      type: node.type,
      variable,
      box
    }

    overlayLayers.push(layerBase)
    if (isDynamicCandidateName(node?.name || '')) {
      previewLayers.dynamicIds.push(node.id)
    }

    if (node.type === 'TEXT') {
      previewLayers.texts.push({
        id: node.id,
        name: node.name,
        variable,
        characters: (node.characters || '').trim()
      })
      return
    }

    previewLayers.images.push({
      id: node.id,
      name: node.name,
      variable,
      width: box.width || null,
      height: box.height || null,
      type: node.type
    })
  })

  return { previewLayers, overlayLayers, frameWidth, frameHeight }
}

const buildTextLayer = (node, frame, { isDynamic } = {}) => {
  const variable = isDynamic ? extractVariableFromName(node.name) : null
  const text = cleanText(node.characters || '')
  const fontSize = Math.round(node.style?.fontSize || node.fontSize || 32)
  const fontFamily = (node.style?.fontFamily || node.fontName?.family || 'Arial').replace(/\s+/g, '_')
  const colorHex = colorToHex(node.fills?.[0]?.color, (node.fills?.[0]?.opacity ?? 1) * (node.opacity ?? 1)) || '000000'
  const relative = getRelativeBox(node, frame)

  let encodedText
  let variableDefinition = null
  
  if (variable) {
    // For variable definitions, the value between !...! must be double-encoded
    // to handle special characters like $, /, etc. that could break Cloudinary's transformation parsing
    // CRITICAL: Must use nested encodeURIComponent calls to ensure proper double-encoding
    // Example: "$55" -> "%2455" -> "%252455"
    let rawText = text || ''
    
    // Ensure we're working with raw text (decode if already encoded)
    // This handles cases where Figma might return already-encoded text
    try {
      // If text contains encoded characters and can be decoded, decode it first
      if (rawText.includes('%') && /%[0-9A-Fa-f]{2}/.test(rawText)) {
        const decoded = decodeURIComponent(rawText)
        // Only use decoded if it's different (was actually encoded)
        if (decoded !== rawText) {
          rawText = decoded
        }
      }
    } catch (e) {
      // If decoding fails, use original text
      // This means it wasn't encoded or had invalid encoding
    }
    
    // First encoding: converts special chars to %XX format
    // "$55" becomes "%2455"
    const firstEncode = encodeURIComponent(rawText)
    
    // Second encoding: encodes the % from first encoding to %25
    // "%2455" becomes "%252455"
    const doubleEncodedValue = encodeURIComponent(firstEncode)
    
    // Verify encoding in dev mode
    if (import.meta.env.DEV) {
      // eslint-disable-next-line no-console
      console.log(`[Figma] Encoding variable "${variable}":`, {
        original: text,
        raw: rawText,
        firstEncode,
        doubleEncode: doubleEncodedValue,
        variableDef: `$${variable}_!${doubleEncodedValue}!`
      })
    }
    
    variableDefinition = `$${variable}_!${doubleEncodedValue}!`
    // For variable references in the overlay, use the variable directly (no encoding needed)
    encodedText = `$(${variable})`
  } else {
    // For static text, double-encode to handle special characters like slashes
    // This prevents Cloudinary from interpreting slashes as transformation separators
    // Use nested encodeURIComponent calls to ensure proper double-encoding
    const textToEncode = text || node.name || 'Text'
    const firstEncode = encodeURIComponent(textToEncode)
    encodedText = encodeURIComponent(firstEncode)
  }

  const overlay = [
    `l_text:${fontFamily}_${fontSize}:${encodedText}`,
    `co_rgb:${colorHex}`,
    'g_north_west',
    `x_${relative.x}`,
    `y_${relative.y}`
  ].join(',')

  return {
    id: node.id,
    name: node.name,
    type: 'text',
    variable,
    variableDefinition,
    summary: `${variable ? `Variable $${variable}` : 'Static text'} @ (${relative.x}, ${relative.y})`,
    overlay: `${overlay}/fl_layer_apply`
  }
}

const buildImageLayer = (node, frame, assetsMap, { isDynamic } = {}) => {
  const variable = isDynamic ? extractVariableFromName(node.name) : null
  const asset = assetsMap[node.id]
  if (!asset?.publicId) {
    return {
      id: node.id,
      name: node.name,
      type: 'image',
      variable,
      summary: 'Skipped (asset missing)',
      overlay: null
    }
  }
  const rel = getRelativeBox(node, frame)
  const publicId = asset.publicId.replace(/\//g, ':')
  
  let variableDefinition = null
  let layerPublicId = publicId

  if (variable) {
    // URL encode the publicId for Cloudinary variable syntax
    const urlEncodedPublicId = encodeURIComponent(publicId)
    variableDefinition = `$${variable}_!${urlEncodedPublicId}!`
    layerPublicId = `$${variable}`
  }

  const overlay = [
    `l_${layerPublicId}`,
    'g_north_west',
    `x_${rel.x}`,
    `y_${rel.y}`,
    `w_${rel.width}`,
    `h_${rel.height}`,
    'c_fit'
  ].join(',')

  return {
    id: node.id,
    name: node.name,
    type: 'image',
    variable,
    variableDefinition,
    summary: `${variable ? `Variable $${variable}` : 'Layer'} @ (${rel.x}, ${rel.y})`,
    overlay: `${overlay}/fl_layer_apply`
  }
}

export const buildTransformationForFrame = ({
  frameNode,
  textNodes = [],
  imageNodes = [],
  assetsMap = {},
  dynamicNodeIds = null,
  backgroundAssetPublicId = ''
}) => {
  const background = getBackgroundColor(frameNode)
  const baseSegments = []
  
  // Collect variable definitions
  const variableDefinitions = []

  const frameBox = frameNode.absoluteBoundingBox || { width: 0, height: 0 }
  if (frameBox.width && frameBox.height) {
    baseSegments.push(`c_pad,w_${Math.round(frameBox.width)},h_${Math.round(frameBox.height)}`)
  }
  
  if (background) {
    baseSegments.push(`b_rgb:${background}`)
  }

  const layers = []
  const overlays = []

  if (backgroundAssetPublicId) {
    const frameBox = frameNode.absoluteBoundingBox || { width: 0, height: 0 }
    const w = Math.round(frameBox.width ?? frameNode.width ?? 0)
    const h = Math.round(frameBox.height ?? frameNode.height ?? 0)
    const publicId = backgroundAssetPublicId.replace(/\//g, ':')
    const baseOverlay = [
      `l_${publicId}`,
      'g_north_west',
      'x_0',
      'y_0',
      w ? `w_${w}` : null,
      h ? `h_${h}` : null,
      'c_fit'
    ].filter(Boolean).join(',')
    overlays.push(`${baseOverlay}/fl_layer_apply`)
  }

  textNodes.forEach(node => {
    const isDynamic = dynamicNodeIds ? dynamicNodeIds.has(node.id) : Boolean(extractVariableFromName(node.name))
    const layer = buildTextLayer(node, frameNode, { isDynamic })
    layers.push(layer)
    if (layer.variableDefinition) {
      // Ensure variable definition is properly double-encoded
      // Log in dev mode to verify encoding
      if (import.meta.env.DEV && layer.variable) {
        // eslint-disable-next-line no-console
        console.log(`[Figma] Variable ${layer.variable} definition:`, layer.variableDefinition)
      }
      variableDefinitions.push(layer.variableDefinition)
    }
    overlays.push(layer.overlay)
  })

  imageNodes.forEach(node => {
    const isDynamic = dynamicNodeIds ? dynamicNodeIds.has(node.id) : Boolean(extractVariableFromName(node.name))
    const layer = buildImageLayer(node, frameNode, assetsMap, { isDynamic })
    layers.push(layer)
    if (layer.variableDefinition) {
      variableDefinitions.push(layer.variableDefinition)
    }
    if (layer.overlay) {
      overlays.push(layer.overlay)
    }
  })

  const transformation = [...variableDefinitions, ...baseSegments, ...overlays].filter(Boolean).join('/')

  // Log final transformation in dev mode to verify encoding
  if (import.meta.env.DEV && variableDefinitions.length > 0) {
    // eslint-disable-next-line no-console
    console.log('[Figma] Final transformation string:', transformation)
    // eslint-disable-next-line no-console
    console.log('[Figma] Variable definitions:', variableDefinitions)
  }

  return {
    transformation,
    background,
    layers
  }
}

const cleanLayerName = (name = '') => {
  if (!name || typeof name !== 'string') return 'Layer'
  // Remove the #variable part but keep the rest of the name
  // Handle cases like "Title #headline" -> "Title"
  // Or "#headline" -> use a fallback
  let cleaned = name.replace(/#[^\s#]+/g, '').trim()
  // If after removing #variable we have nothing, try to get the part before #
  if (!cleaned) {
    const beforeHash = name.split('#')[0].trim()
    cleaned = beforeHash || name.trim()
  }
  // If still empty or just whitespace, return a default
  return cleaned || 'Layer'
}

const toCamelCase = (value = '') => {
  const cleaned = value
    .replace(/#[^#]+$/, '')
    .replace(/[^a-zA-Z0-9]+/g, ' ')
    .trim()
  if (!cleaned) return ''
  return cleaned
    .split(' ')
    .map((word, index) => {
      if (!word) return ''
      if (index === 0) return word.toLowerCase()
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    })
    .join('')
}

const ensureUniqueKey = (base, usedKeys, fallback) => {
  let key = base || fallback
  let attempt = 1
  while (usedKeys.has(key) || !key) {
    key = `${base || fallback}${attempt}`
    attempt += 1
  }
  usedKeys.add(key)
  return key
}

const getFillColorHex = (node) => {
  const fill = node?.fills?.find(f => f.type === 'SOLID' && f.visible !== false)
  if (!fill) return '#ffffff'
  return `#${colorToHex(fill.color, fill.opacity ?? 1)}`
}

export const buildDesignRulesFromNodes = ({
  frameNode,
  nodes,
  assetsMap = {},
  mainProductLayerId = null
}) => {
  if (!frameNode) return { rules: {}, fonts: [] }

  const frameBox = frameNode.absoluteBoundingBox || { width: frameNode.width, height: frameNode.height }
  const rules = {
    width: Math.round(frameBox?.width || frameNode.width || 500),
    height: Math.round(frameBox?.height || frameNode.height || 500),
    backgroundColor: frameNode.backgroundColor
      ? `#${colorToHex(frameNode.backgroundColor)}`
      : '#000428'
  }
  const fonts = new Set()
  const usedKeys = new Set(['width', 'height', 'backgroundColor'])

  // Filter out original price layers
  const filteredNodes = nodes.filter(node => {
    const name = (node.name || '').toLowerCase()
    const variable = extractVariableFromName(node.name)
    const variableLower = (variable || '').toLowerCase()
    // Exclude if name or variable contains original price patterns
    return !name.includes('original') && 
           !name.includes('orig') && 
           !variableLower.includes('original') && 
           !variableLower.includes('origprice') &&
           !variableLower.includes('orig')
  })

  filteredNodes.forEach((node, index) => {
    const relative = getRelativeBox(node, frameNode)
    const variableName = extractVariableFromName(node.name)
    const baseKey = variableName || toCamelCase(node.name)
    const fallbackKey = `layer${index + 1}`
    const layerKey = ensureUniqueKey(baseKey, usedKeys, fallbackKey)
    const displayName = cleanLayerName(node.name) || `Layer ${index + 1}`

    if (node.type === 'TEXT') {
      const fontFamily = (node.style?.fontFamily || node.fontName?.family || 'Arial').trim()
      if (fontFamily) {
        fonts.add(fontFamily)
      }
      const fontSize = Math.round(node.style?.fontSize || node.fontSize || 32)
      const color = getFillColorHex(node)
      const fieldName = variableName || layerKey

      rules[layerKey] = {
        x: Math.round(relative.x),
        y: Math.round(relative.y),
        gravity: GRAVITY_VALUES.northWest,
        fontSize,
        color,
        font: fontFamily || 'Arial',
        fieldName,
        defaultValue: cleanText(node.characters || ''),
        displayName,
        textWrap: true,
        textWidth: Math.round(relative.width || rules.width * 0.8)
      }
    } else {
      const layerData = {
        width: Math.round(relative.width),
        height: Math.round(relative.height),
        x: Math.round(relative.x),
        y: Math.round(relative.y),
        gravity: GRAVITY_VALUES.northWest,
        displayName
      }

      if (node.id === mainProductLayerId) {
        layerData.isMainProduct = true
      } else {
        const upload = assetsMap[node.id]
        if (upload?.publicId) {
          layerData.publicId = upload.publicId
        }
      }

      rules[layerKey] = layerData
    }
  })

  return {
    rules,
    fonts: Array.from(fonts)
  }
}

// Identify layer type based on key name and properties
const identifyLayerType = (layerKey, layerData) => {
  const keyLower = layerKey.toLowerCase()
  const displayNameLower = (layerData?.displayName || '').toLowerCase()
  
  // Check for logo
  if (keyLower.includes('logo') || displayNameLower.includes('logo') || layerData?.isLogo) {
    return 'logo'
  }
  
  // Check for product/main image
  if (keyLower.includes('product') || keyLower.includes('image') || keyLower.includes('main') || 
      displayNameLower.includes('product') || displayNameLower.includes('main') || 
      layerData?.isMainProduct) {
    return 'product'
  }
  
  // Check for price
  if (keyLower.includes('price') || displayNameLower.includes('price')) {
    return 'price'
  }
  
  // Check for title
  if (keyLower.includes('title') || keyLower.includes('headline') || displayNameLower.includes('title') || displayNameLower.includes('headline')) {
    return 'title'
  }
  
  // Check for tagline
  if (keyLower.includes('tagline') || keyLower.includes('subtitle') || keyLower.includes('description') || 
      displayNameLower.includes('tagline') || displayNameLower.includes('subtitle')) {
    return 'tagline'
  }
  
  return null
}

const generateChildDesign = (parentRules, childId, childDimensions) => {
  if (!parentRules || !childDimensions) return null

  const childRules = {
    width: childDimensions.width,
    height: childDimensions.height,
    backgroundColor: parentRules.backgroundColor || '#000428'
  }

  // Get recommended positions/sizes for this child design type
  const designType = DESIGN_TYPES.find(dt => dt.id === childId)
  const recommended = designType?.recommended || {}

  // Calculate scale ratios from parent to child
  const parentWidth = parentRules.width || 500
  const parentHeight = parentRules.height || 900
  const childWidth = childDimensions.width
  const childHeight = childDimensions.height
  
  const widthRatio = childWidth / parentWidth
  const heightRatio = childHeight / parentHeight
  // Use average ratio for balanced scaling
  const scaleRatio = (widthRatio + heightRatio) / 2

  // Copy all layers from parent and scale/position appropriately
  Object.keys(parentRules).forEach(key => {
    if (key === 'width' || key === 'height' || key === 'backgroundColor') return

    const parentLayer = parentRules[key]
    if (!parentLayer || typeof parentLayer !== 'object') return

    // Deep copy the layer to avoid reference issues
    const childLayer = JSON.parse(JSON.stringify(parentLayer))
    
    // Identify layer type
    const layerType = identifyLayerType(key, parentLayer)
    
    // Use recommended values if available, otherwise scale from parent
    if (layerType && recommended[layerType]) {
      const rec = recommended[layerType]
      
      // Apply recommended values
      if (rec.x !== undefined) childLayer.x = rec.x
      if (rec.y !== undefined) childLayer.y = rec.y
      if (rec.gravity !== undefined) childLayer.gravity = rec.gravity
      if (rec.fontSize !== undefined) childLayer.fontSize = rec.fontSize
      if (rec.textWidth !== undefined) childLayer.textWidth = rec.textWidth
      if (rec.width !== undefined) childLayer.width = rec.width
      if (rec.height !== undefined) childLayer.height = rec.height
    } else {
      // Scale from parent using ratios
      if (typeof childLayer.x === 'number') {
        childLayer.x = Math.round(childLayer.x * widthRatio)
      }
      if (typeof childLayer.y === 'number') {
        childLayer.y = Math.round(childLayer.y * heightRatio)
      }
      if (typeof childLayer.width === 'number') {
        childLayer.width = Math.round(childLayer.width * widthRatio)
      }
      if (typeof childLayer.height === 'number') {
        childLayer.height = Math.round(childLayer.height * heightRatio)
      }
      if (typeof childLayer.fontSize === 'number') {
        childLayer.fontSize = Math.round(childLayer.fontSize * scaleRatio)
      }
      if (typeof childLayer.textWidth === 'number') {
        childLayer.textWidth = Math.round(childLayer.textWidth * widthRatio)
      }
    }

    // Ensure layer fits within canvas bounds
    const layerX = childLayer.x || 0
    const layerY = childLayer.y || 0
    const layerWidth = childLayer.width || 0
    const layerHeight = childLayer.height || 0

    // Calculate the right and bottom edges of the layer
    const layerRight = layerX + layerWidth
    const layerBottom = layerY + layerHeight

    // Adjust X position if layer overflows to the right
    if (layerRight > childWidth) {
      const overflowX = layerRight - childWidth
      childLayer.x = Math.max(0, layerX - overflowX)
    }
    // Ensure layer doesn't start outside left boundary
    if (childLayer.x < 0) {
      childLayer.x = 0
    }

    // Adjust Y position if layer overflows to the bottom
    if (layerBottom > childHeight) {
      const overflowY = layerBottom - childHeight
      childLayer.y = Math.max(0, layerY - overflowY)
    }
    // Ensure layer doesn't start outside top boundary
    if (childLayer.y < 0) {
      childLayer.y = 0
    }

    // If layer is still too large, clamp width/height to canvas size
    if (childLayer.width && childLayer.width > childWidth) {
      childLayer.width = childWidth
      childLayer.x = 0
    }
    if (childLayer.height && childLayer.height > childHeight) {
      childLayer.height = childHeight
      childLayer.y = 0
    }

    // For text layers, also check textWidth
    if (childLayer.textWidth && childLayer.textWidth > childWidth) {
      childLayer.textWidth = childWidth
    }

    childRules[key] = childLayer
  })

  return childRules
}

export const buildDesignRulesWithChildren = (parentRules) => {
  if (!parentRules || !parentRules.width || !parentRules.height) {
    return { parent: parentRules || {}, 'ig-ad': {}, 'fb-mobile': {} }
  }

  const igAdRules = generateChildDesign(parentRules, 'ig-ad', { width: 1080, height: 1080 })
  const fbMobileRules = generateChildDesign(parentRules, 'fb-mobile', { width: 1080, height: 1350 })

  return {
    parent: parentRules,
    'ig-ad': igAdRules || {},
    'fb-mobile': fbMobileRules || {}
  }
}

