export const isTextLayer = (layer) => layer?.type === 'text'

export const isImageLayer = (layer) => layer?.type === 'image'

export const getLayerIcon = (layer) => {
  if (isTextLayer(layer)) return 'T'
  if (isImageLayer(layer)) return '🖼️'
  return '📦'
}

export const getLayerClassName = (layer) => {
  if (isTextLayer(layer)) return 'yoga-layer text'
  if (isImageLayer(layer)) return 'yoga-layer image'
  return 'yoga-layer'
}

export const formatTextPreview = (text, maxLength = 30) => {
  if (!text) return ''
  return text.length > maxLength 
    ? `"${text.substring(0, maxLength)}..."` 
    : `"${text}"`
}

export const extractImageFilename = (publicId) => {
  if (!publicId) return ''
  return publicId.split('/').pop()
}

export const getLayerTitle = (layer) => {
  return `${layer.displayName} (${layer.type})`
}
