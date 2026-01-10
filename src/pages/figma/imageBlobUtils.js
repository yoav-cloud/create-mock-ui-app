const getBitmapFromBlob = async (blob) => {
  if (typeof createImageBitmap === 'function') {
    return await createImageBitmap(blob)
  }

  // Fallback for older browsers.
  const url = URL.createObjectURL(blob)
  try {
    const img = new Image()
    img.decoding = 'async'
    img.crossOrigin = 'anonymous'
    await new Promise((resolve, reject) => {
      img.onload = resolve
      img.onerror = reject
      img.src = url
    })
    const canvas = document.createElement('canvas')
    canvas.width = img.naturalWidth || img.width
    canvas.height = img.naturalHeight || img.height
    const ctx = canvas.getContext('2d')
    ctx.drawImage(img, 0, 0)
    return await createImageBitmap(canvas)
  } finally {
    URL.revokeObjectURL(url)
  }
}

export const resizeImageBlobMaxDimension = async (blob, maxDim = 2000, quality = 0.92) => {
  const bitmap = await getBitmapFromBlob(blob)
  const srcW = bitmap.width || 1
  const srcH = bitmap.height || 1
  const limit = Math.max(1, Number(maxDim) || 2000)

  // Calculate scale factor: only scale down if either dimension exceeds limit
  // Math.max(srcW, srcH) gets the larger dimension
  // scale will be < 1 only if that dimension > limit
  const scale = Math.min(1, limit / Math.max(srcW, srcH))
  
  // If no resize needed (both dimensions <= limit), return original
  if (scale >= 1) {
    if (import.meta.env.DEV) {
      const sizeMB = (blob.size / (1024 * 1024)).toFixed(2)
      console.log(`[Figma] No resize needed: ${srcW}x${srcH} (${sizeMB}MB) - already within ${limit}px limit`)
    }
    return blob
  }

  if (import.meta.env.DEV) {
    const sizeMB = (blob.size / (1024 * 1024)).toFixed(2)
    console.log(`[Figma] Resizing image: ${srcW}x${srcH} (${sizeMB}MB) -> max ${limit}px`)
  }

  // Apply same scale to both dimensions to maintain aspect ratio
  const targetW = Math.max(1, Math.round(srcW * scale))
  const targetH = Math.max(1, Math.round(srcH * scale))

  const canvas = document.createElement('canvas')
  canvas.width = targetW
  canvas.height = targetH
  const ctx = canvas.getContext('2d')
  ctx.imageSmoothingEnabled = true
  ctx.imageSmoothingQuality = 'high'
  ctx.drawImage(bitmap, 0, 0, targetW, targetH)

  return await new Promise((resolve) => {
    canvas.toBlob((out) => {
      const result = out || blob
      if (import.meta.env.DEV) {
        const resultSizeMB = (result.size / (1024 * 1024)).toFixed(2)
        console.log(`[Figma] Resized to: ${targetW}x${targetH} (${resultSizeMB}MB)`)
        if (result.size > 10 * 1024 * 1024) {
          console.warn(`[Figma] ⚠️ Large file warning: ${resultSizeMB}MB (consider reducing maxDim or using JPEG)`)
        }
      }
      resolve(result)
    }, 'image/png', quality)
  })
}

export const composeBackgroundPngBlob = async ({
  frameWidth,
  frameHeight,
  backgroundColor = 'transparent',
  pieces = [],
  maxDim = 2000
}) => {
  const srcW = Math.max(1, Math.round(frameWidth || 1))
  const srcH = Math.max(1, Math.round(frameHeight || 1))
  const limit = Math.max(1, Number(maxDim) || 2000)
  const scale = Math.min(1, limit / Math.max(srcW, srcH))

  const outW = Math.max(1, Math.round(srcW * scale))
  const outH = Math.max(1, Math.round(srcH * scale))

  if (import.meta.env.DEV) {
    console.log(`[Figma] Composing background: ${srcW}x${srcH} -> ${outW}x${outH} (${pieces.length} pieces)`)
  }

  const canvas = document.createElement('canvas')
  canvas.width = outW
  canvas.height = outH
  const ctx = canvas.getContext('2d')
  ctx.imageSmoothingEnabled = true
  ctx.imageSmoothingQuality = 'high'

  if (backgroundColor && backgroundColor !== 'transparent') {
    ctx.fillStyle = backgroundColor
    ctx.fillRect(0, 0, outW, outH)
  } else {
    ctx.clearRect(0, 0, outW, outH)
  }

  for (const piece of pieces) {
    if (!piece?.imageUrl) continue
    const res = await fetch(piece.imageUrl)
    if (!res.ok) continue
    const blob = await res.blob()
    const bitmap = await getBitmapFromBlob(blob)
    const box = piece.box || { x: 0, y: 0, width: 0, height: 0 }
    const x = Math.round((Number(box.x) || 0) * scale)
    const y = Math.round((Number(box.y) || 0) * scale)
    const w = Math.round((Number(box.width) || 0) * scale)
    const h = Math.round((Number(box.height) || 0) * scale)
    if (w <= 0 || h <= 0) continue
    ctx.drawImage(bitmap, x, y, w, h)
  }

  return await new Promise((resolve) => {
    canvas.toBlob((out) => {
      if (import.meta.env.DEV && out) {
        const sizeMB = (out.size / (1024 * 1024)).toFixed(2)
        console.log(`[Figma] Background composed: ${sizeMB}MB`)
        if (out.size > 10 * 1024 * 1024) {
          console.warn(`[Figma] ⚠️ Large background warning: ${sizeMB}MB`)
        }
      }
      resolve(out)
    }, 'image/png')
  })
}




