export function parsePossiblyWrappedJson(text) {
  if (typeof text !== 'string') {
    throw new Error('Model output is not text')
  }
  const trimmed = text.trim()
  try {
    return JSON.parse(trimmed)
  } catch {
    // Try to extract first JSON object by brace matching.
    const extracted = extractFirstJsonObject(trimmed)
    if (!extracted) {
      throw new Error('Failed to parse JSON from model output')
    }
    return JSON.parse(extracted)
  }
}

function extractFirstJsonObject(s) {
  const start = s.indexOf('{')
  if (start === -1) return null
  let depth = 0
  let inString = false
  let escaped = false
  for (let i = start; i < s.length; i++) {
    const ch = s[i]
    if (inString) {
      if (escaped) {
        escaped = false
      } else if (ch === '\\') {
        escaped = true
      } else if (ch === '"') {
        inString = false
      }
      continue
    }
    if (ch === '"') {
      inString = true
      continue
    }
    if (ch === '{') depth++
    if (ch === '}') depth--
    if (depth === 0) {
      return s.slice(start, i + 1)
    }
  }
  return null
}


