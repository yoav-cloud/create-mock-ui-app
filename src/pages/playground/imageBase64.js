export async function fetchImageAsBase64({ url }) {
  const res = await fetch(url)
  if (!res.ok) {
    throw new Error(`Failed to fetch image (${res.status})`)
  }
  const contentType = res.headers.get('content-type') || 'image/png'
  const blob = await res.blob()
  const base64 = await blobToBase64(blob)
  return { base64, contentType }
}

function blobToBase64(blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onloadend = () => {
      const dataUrl = reader.result
      if (typeof dataUrl !== 'string') return reject(new Error('Failed to read image'))
      // data:image/png;base64,xxxx -> xxxx
      const idx = dataUrl.indexOf('base64,')
      if (idx === -1) return reject(new Error('Invalid data URL'))
      resolve(dataUrl.slice(idx + 'base64,'.length))
    }
    reader.onerror = () => reject(new Error('Failed to read image'))
    reader.readAsDataURL(blob)
  })
}


