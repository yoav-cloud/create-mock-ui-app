const DEFAULT_CORS_HEADERS = {
  'access-control-allow-origin': '*',
  'access-control-allow-headers': 'content-type',
  'access-control-allow-methods': 'OPTIONS,POST',
}

export function jsonResponse(statusCode, body, headers = {}) {
  return {
    statusCode,
    headers: { ...DEFAULT_CORS_HEADERS, ...headers, 'content-type': 'application/json' },
    body: JSON.stringify(body ?? null),
  }
}

export function textResponse(statusCode, body, headers = {}) {
  return {
    statusCode,
    headers: { ...DEFAULT_CORS_HEADERS, ...headers, 'content-type': 'text/plain' },
    body: String(body ?? ''),
  }
}

export function parseJsonBody(event) {
  const raw = event?.body
  if (!raw) return null
  const decoded = event?.isBase64Encoded ? Buffer.from(raw, 'base64').toString('utf8') : raw
  return JSON.parse(decoded)
}


