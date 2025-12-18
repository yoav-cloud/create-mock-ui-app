const safeUrl = (value = '') => {
  try {
    return new URL(String(value || '').trim())
  } catch {
    return null
  }
}

export const normalizeFigmaNodeId = (value = '') => {
  const raw = decodeURIComponent(String(value || '').trim())
  if (!raw) return ''
  if (raw.includes(':')) return raw
  // Figma share URLs often use "-" where the API expects ":" (e.g. 838-1447 -> 838:1447)
  return raw.replace(/-/g, ':')
}

export const parseFigmaFileNodeUrl = (value = '') => {
  const raw = String(value || '').trim()
  if (!raw) return { fileKey: '', nodeId: '' }

  const url = safeUrl(raw)
  if (url) {
    const path = url.pathname || ''
    const fileMatch = path.match(/\/(?:design|file)\/([^/]+)/i)
    const fileKey = fileMatch?.[1] || ''
    const nodeParam = url.searchParams.get('node-id') || ''
    const nodeId = normalizeFigmaNodeId(nodeParam)
    return { fileKey, nodeId }
  }

  // Fallback: try to parse partial strings without full URL format.
  const fileMatch = raw.match(/\/(?:design|file)\/([^/?#\s]+)/i)
  const nodeMatch = raw.match(/[?&]node-id=([^&#\s]+)/i)
  return {
    fileKey: fileMatch?.[1] || '',
    nodeId: normalizeFigmaNodeId(nodeMatch?.[1] || '')
  }
}

