import { toDesignTypeId } from './slug.js'

export function normalizeAndValidateModelResponse({ adType, modelJson }) {
  if (!modelJson || typeof modelJson !== 'object') {
    throw new Error('Model JSON is not an object')
  }
  const designType = modelJson.designType
  const designRules = modelJson.designRules

  if (!designRules || typeof designRules !== 'object') {
    throw new Error('Missing designRules')
  }
  const width = Number(designRules.width)
  const height = Number(designRules.height)
  if (!Number.isFinite(width) || !Number.isFinite(height)) {
    throw new Error('designRules.width/height must be numbers')
  }

  const normalizedDesignType = {
    id: (designType?.id && String(designType.id).trim()) || toDesignTypeId(adType),
    name: (designType?.name && String(designType.name).trim()) || adType,
    width: Number(designType?.width) || width,
    height: Number(designType?.height) || height,
    description: (designType?.description && String(designType.description).trim()) || `AI generated: ${adType}`,
  }

  if (normalizedDesignType.id === 'parent') {
    normalizedDesignType.id = toDesignTypeId(adType)
  }

  // Ensure consistency
  const normalizedDesignRules = { ...designRules, width: normalizedDesignType.width, height: normalizedDesignType.height }

  return { designType: normalizedDesignType, designRules: normalizedDesignRules }
}


