const TEMPLATE_MARKER = '#'

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

const colorToHex = (color, opacity = 1) => {
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

const getRelativeBox = (node, frame) => {
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
  const encodedText = encodeURIComponent(text || variable || node.name || 'Text')
  const colorHex = colorToHex(node.fills?.[0]?.color, (node.fills?.[0]?.opacity ?? 1) * (node.opacity ?? 1)) || '000000'
  const relative = getRelativeBox(node, frame)
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
  const overlay = [
    `l_${publicId}`,
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
    summary: `${variable ? `Variable $${variable}` : 'Layer'} @ (${rel.x}, ${rel.y})`,
    overlay: `${overlay}/fl_layer_apply`
  }
}

export const buildTransformationForFrame = ({ frameNode, textNodes = [], imageNodes = [], assetsMap = {} }) => {
  const background = getBackgroundColor(frameNode)
  const baseSegments = []
  if (background) {
    baseSegments.push(`b_rgb:${background}`)
  }

  const frameBox = frameNode.absoluteBoundingBox || { width: 0, height: 0 }
  if (frameBox.width && frameBox.height) {
    baseSegments.push(`c_pad,w_${Math.round(frameBox.width)},h_${Math.round(frameBox.height)}`)
  }

  const layers = []
  const overlays = []

  textNodes.forEach(node => {
    const layer = buildTextLayer(node, frameNode)
    layers.push(layer)
    overlays.push(layer.overlay)
  })

  imageNodes.forEach(node => {
    const layer = buildImageLayer(node, frameNode, assetsMap)
    layers.push(layer)
    if (layer.overlay) {
      overlays.push(layer.overlay)
    }
  })

  const transformation = [...baseSegments, ...overlays].filter(Boolean).join('/')

  return {
    transformation,
    background,
    layers
  }
}

