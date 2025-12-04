const TEMPLATE_MARKER = '#'

import { GRAVITY_VALUES } from '../playground/constants'

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

const buildTextLayer = (node, frame) => {
  const variable = extractVariableFromName(node.name)
  const text = cleanText(node.characters || '')
  const fontSize = Math.round(node.style?.fontSize || node.fontSize || 32)
  const fontFamily = (node.style?.fontFamily || node.fontName?.family || 'Arial').replace(/\s+/g, '_')
  const colorHex = colorToHex(node.fills?.[0]?.color, (node.fills?.[0]?.opacity ?? 1) * (node.opacity ?? 1)) || '000000'
  const relative = getRelativeBox(node, frame)

  let encodedText
  let variableDefinition = null
  
  if (variable) {
    // URL encode the text value for Cloudinary variable syntax
    // The value between !...! delimiters should be URL encoded
    const urlEncodedValue = encodeURIComponent(text)
    variableDefinition = `$${variable}_!${urlEncodedValue}!`
    encodedText = `$(${variable})`
  } else {
    encodedText = encodeURIComponent(text || node.name || 'Text')
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

const buildImageLayer = (node, frame, assetsMap) => {
  const variable = extractVariableFromName(node.name)
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

export const buildTransformationForFrame = ({ frameNode, textNodes = [], imageNodes = [], assetsMap = {} }) => {
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

  textNodes.forEach(node => {
    const layer = buildTextLayer(node, frameNode)
    layers.push(layer)
    if (layer.variableDefinition) {
      variableDefinitions.push(layer.variableDefinition)
    }
    overlays.push(layer.overlay)
  })

  imageNodes.forEach(node => {
    const layer = buildImageLayer(node, frameNode, assetsMap)
    layers.push(layer)
    if (layer.variableDefinition) {
      variableDefinitions.push(layer.variableDefinition)
    }
    if (layer.overlay) {
      overlays.push(layer.overlay)
    }
  })

  const transformation = [...variableDefinitions, ...baseSegments, ...overlays].filter(Boolean).join('/')

  return {
    transformation,
    background,
    layers
  }
}

const cleanLayerName = (name = '') => {
  return name.replace(/#[^#]+$/, '').trim() || 'Layer'
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

  nodes.forEach((node, index) => {
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

