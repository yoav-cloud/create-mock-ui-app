const DEFAULT_TIMEOUT_MS = 120_000

function withTimeout(promise, timeoutMs) {
  return new Promise((resolve, reject) => {
    const t = setTimeout(() => reject(new Error('Request timed out')), timeoutMs)
    promise
      .then((v) => {
        clearTimeout(t)
        resolve(v)
      })
      .catch((e) => {
        clearTimeout(t)
        reject(e)
      })
  })
}

export async function createChildDesignWithAI({
  endpointUrl,
  adType,
  parentRules,
  parentImageBase64,
  parentImageMediaType,
  timeoutMs = DEFAULT_TIMEOUT_MS,
}) {
  if (!endpointUrl) {
    throw new Error('Missing VITE_DESIGN_CREATOR_LAMBDA_URL')
  }
  const res = await withTimeout(
    fetch(endpointUrl, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        adType,
        parentRules,
        parentImageBase64,
        parentImageMediaType,
      }),
    }),
    timeoutMs
  )

  const text = await res.text()
  if (!res.ok) {
    throw new Error(text || `Request failed (${res.status})`)
  }
  try {
    return JSON.parse(text)
  } catch {
    throw new Error('Invalid JSON response from lambda')
  }
}


