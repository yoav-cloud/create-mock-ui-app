export function toDesignTypeId(adType) {
  const raw = String(adType || '').trim().toLowerCase()
  const slug = raw
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
  const base = slug || 'child-design'
  const safe = base === 'parent' ? 'child-design' : base
  return `ai-${safe}`
}


