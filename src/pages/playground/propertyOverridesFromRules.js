import { shouldInheritProperty } from '../../utils/inheritanceUtils'

const isPlainObject = (v) => !!v && typeof v === 'object' && !Array.isArray(v)

const shallowEqual = (a, b) => {
  if (a === b) return true
  if (Number.isNaN(a) && Number.isNaN(b)) return true
  return false
}

export function computePropertyOverridesForChild({
  childDesignId,
  parentRules,
  childRules,
  inheritanceToggles,
}) {
  const overridesForDesign = {}

  if (!isPlainObject(parentRules) || !isPlainObject(childRules)) {
    return { [childDesignId]: overridesForDesign }
  }

  // General width/height never inherit, but we still track override for UI reset affordance.
  if (!shallowEqual(childRules.width, parentRules.width)) {
    overridesForDesign._general = { ...(overridesForDesign._general || {}), width: true }
  }
  if (!shallowEqual(childRules.height, parentRules.height)) {
    overridesForDesign._general = { ...(overridesForDesign._general || {}), height: true }
  }

  const parentLayerKeys = Object.keys(parentRules).filter((k) => isPlainObject(parentRules[k]))
  const childLayerKeys = Object.keys(childRules).filter((k) => isPlainObject(childRules[k]))
  const allLayerKeys = new Set([...parentLayerKeys, ...childLayerKeys])

  allLayerKeys.forEach((layerKey) => {
    const parentLayer = parentRules[layerKey]
    const childLayer = childRules[layerKey]
    if (!isPlainObject(childLayer)) return

    const propKeys = new Set([
      ...Object.keys(isPlainObject(parentLayer) ? parentLayer : {}),
      ...Object.keys(childLayer),
    ])

    propKeys.forEach((propKey) => {
      const wouldInherit = shouldInheritProperty(propKey, inheritanceToggles)
      if (!wouldInherit) return

      const pv = isPlainObject(parentLayer) ? parentLayer[propKey] : undefined
      const cv = childLayer[propKey]
      if (!shallowEqual(cv, pv)) {
        overridesForDesign[layerKey] = { ...(overridesForDesign[layerKey] || {}), [propKey]: true }
      }
    })
  })

  return { [childDesignId]: overridesForDesign }
}


