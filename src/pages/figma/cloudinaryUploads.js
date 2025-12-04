export async function uploadImageFromUrl({ imageUrl, fallbackName = 'figma-node', config }) {
  if (!config?.cloudName || !config?.uploadPreset) {
    throw new Error('Cloudinary configuration is incomplete.')
  }

  const response = await fetch(imageUrl)
  if (!response.ok) {
    throw new Error('Failed to download node preview from Figma.')
  }

  const blob = await response.blob()
  const formData = new FormData()
  formData.append('file', blob, `${fallbackName}.png`)
  formData.append('upload_preset', config.uploadPreset)
  if (config.folder) {
    formData.append('folder', config.folder)
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

