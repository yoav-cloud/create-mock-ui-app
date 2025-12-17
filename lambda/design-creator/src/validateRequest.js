export function validateRequestBody(body) {
  if (!body || typeof body !== 'object') {
    return { ok: false, error: 'Missing JSON body' }
  }

  const { adType, parentRules, parentImageBase64, parentImageMediaType } = body
  if (!adType || typeof adType !== 'string' || !adType.trim()) {
    return { ok: false, error: 'adType is required' }
  }
  if (!parentRules || typeof parentRules !== 'object') {
    return { ok: false, error: 'parentRules is required' }
  }
  if (!parentImageBase64 || typeof parentImageBase64 !== 'string') {
    return { ok: false, error: 'parentImageBase64 is required' }
  }
  if (!parentImageMediaType || typeof parentImageMediaType !== 'string') {
    return { ok: false, error: 'parentImageMediaType is required' }
  }

  return {
    ok: true,
    value: {
      adType: adType.trim(),
      parentRules,
      parentImageBase64,
      parentImageMediaType,
    },
  }
}


