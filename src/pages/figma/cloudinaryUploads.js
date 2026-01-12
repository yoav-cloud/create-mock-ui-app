export async function uploadImageBlob({ blob, filename = 'figma-node.png', publicId = '', config }) {
  if (!config?.cloudName || !config?.uploadPreset) {
    throw new Error('Cloudinary configuration is incomplete.')
  }

  const formData = new FormData()
  formData.append('file', blob, filename)
  formData.append('upload_preset', config.uploadPreset)
  if (config.folder) {
    formData.append('folder', config.folder)
  }
  if (publicId) {
    formData.append('public_id', publicId)
  }

  const uploadUrl = `https://api.cloudinary.com/v1_1/${config.cloudName}/image/upload`
  const uploadResponse = await fetch(uploadUrl, {
    method: 'POST',
    body: formData
  })

  const data = await uploadResponse.json().catch(() => null)
  if (!uploadResponse.ok) {
    const message = data?.error?.message || 'Cloudinary upload failed.'
    throw new Error(message)
  }

  return {
    publicId: data.public_id,
    secureUrl: data.secure_url,
    assetId: data.asset_id,
    bytes: data.bytes
  }
}

export async function uploadImageFromUrl({ imageUrl, fallbackName = 'figma-node', publicId = '', config }) {
  const response = await fetch(imageUrl)
  if (!response.ok) {
    throw new Error('Failed to download node preview from Figma.')
  }
  const blob = await response.blob()
  return uploadImageBlob({
    blob,
    filename: `${fallbackName}.png`,
    publicId,
    config
  })
}