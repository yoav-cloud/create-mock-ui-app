import { shouldInheritProperty } from './inheritanceUtils'

/**
 * Creates a rule update handler function
 * @param {Object} params - Parameters object
 * @param {Function} params.setEditableRules - State setter for editableRules
 * @param {string} params.selectedDesignId - Currently selected design ID
 * @param {Function} params.setCanvasDimensions - State setter for canvas dimensions
 * @param {Function} params.setPropertyOverrides - State setter for property overrides
 * @param {Object} params.layerMap - Map of layer keys to layer info
 * @param {Function} params.setModifiedLayers - State setter for modified layers
 * @param {Function} params.setFormValues - State setter for form values
 * @param {Object} params.inheritanceToggles - Inheritance toggle state
 * @param {Function} params.isPropertyOverridden - Function to check if property is overridden
 * @param {Function} params.getChildDesignIds - Returns array of child design IDs (excluding 'parent')
 * @returns {Function} Rule update handler function
 */
export function createRuleUpdateHandler({
  setEditableRules,
  selectedDesignId,
  setCanvasDimensions,
  setPropertyOverrides,
  layerMap,
  setModifiedLayers,
  setFormValues,
  inheritanceToggles,
  isPropertyOverridden,
  getChildDesignIds
}) {
  /**
   * Helper to propagate parent property change to children
   */
  const propagateToChildren = (layerKey, propertyKey, value, newRules) => {
    if (selectedDesignId !== 'parent') return newRules // Only propagate from parent

    const shouldInherit = shouldInheritProperty(propertyKey, inheritanceToggles)
    if (!shouldInherit) return newRules

    // Get child design IDs
    const childDesigns = (typeof getChildDesignIds === 'function' ? getChildDesignIds() : [])

    childDesigns.forEach(childId => {
      // Only propagate if child doesn't have an override
      if (!isPropertyOverridden(childId, layerKey, propertyKey)) {
        if (layerKey === '_general') {
          // General properties (width, height) are at design level
          if (newRules[childId]) {
            newRules[childId][propertyKey] = value
          }
        } else {
          // Layer properties
          if (newRules[childId] && newRules[childId][layerKey]) {
            newRules[childId][layerKey][propertyKey] = value
          }
        }
      }
    })

    return newRules
  }

  /**
   * Handle rule value update
   */
  return function handleRuleUpdate(category, layerName, key, value) {
    setEditableRules(prev => {
      const newRules = JSON.parse(JSON.stringify(prev))
      const designId = selectedDesignId

      if (category === 'General') {
        if (key === 'Width') {
          const widthValue = parseInt(value) || 0
          setCanvasDimensions(prev => ({ ...prev, width: widthValue }))
          // Also update editableRules
          if (newRules[designId]) {
            newRules[designId].width = widthValue
          }
          // Mark as overridden if child (dimensions never inherit, so no propagation)
          if (designId !== 'parent') {
            setPropertyOverrides(prev => ({
              ...prev,
              [designId]: {
                ...prev[designId],
                _general: { ...prev[designId]?._general, width: true }
              }
            }))
          }
          // Dimensions are never inherited, so no propagation
        } else if (key === 'Height') {
          const heightValue = parseInt(value) || 0
          setCanvasDimensions(prev => ({ ...prev, height: heightValue }))
          // Also update editableRules
          if (newRules[designId]) {
            newRules[designId].height = heightValue
          }
          // Mark as overridden if child (dimensions never inherit, so no propagation)
          if (designId !== 'parent') {
            setPropertyOverrides(prev => ({
              ...prev,
              [designId]: {
                ...prev[designId],
                _general: { ...prev[designId]?._general, height: true }
              }
            }))
          }
          // Dimensions are never inherited, so no propagation
        } else if (key === 'Background Color') {
          setFormValues(prev => ({ ...prev, backgroundColor: value }))
        }
      } else if (category === 'Layers' && layerName) {
        // Map layer display name to key dynamically
        const layerKey = Object.keys(layerMap).find(
          key => layerMap[key].displayName === layerName
        ) || null

        // Track this layer as modified (will cause image reload)
        // The useEffect watching generatedUrl will set imageLoading when URL changes
        if (layerKey) {
          setModifiedLayers(prev => {
            const newSet = new Set(prev)
            newSet.add(layerKey)
            return newSet
          })
        }

        // Update layer property
        if (newRules[designId] && newRules[designId][layerKey]) {
          // Convert value based on type
          let convertedValue = value
          if (key === 'fontSize') {
            // fontSize can be a number or a string with percentage (e.g., "110%")
            // Keep as string if it contains %, otherwise convert to number
            if (typeof value === 'string' && value.includes('%')) {
              convertedValue = value // Keep as string for percentage
            } else {
              convertedValue = isNaN(value) ? value : parseFloat(value)
            }
          } else if (key === 'width' || key === 'height' || key === 'x' || key === 'y') {
            convertedValue = parseInt(value) || 0
          } else if (key === 'gravity' || key === 'font' || key === 'color' || key === 'publicId') {
            // String values: gravity, font, color, publicId
            convertedValue = value
          } else if (key === 'flNoOverflow' || key === 'flTextDisallowOverflow' || key === 'textWrap' || key === 'show') {
            // Boolean values: convert string to boolean
            convertedValue = value === true || value === 'true' || value === '1'
          } else if (key === 'textWidth') {
            // textWidth: number value
            convertedValue = parseInt(value) || 0
          } else if (key === 'calculation') {
            // calculation: object value (for computed fields)
            convertedValue = value
          }

          newRules[designId][layerKey][key] = convertedValue

          // Mark as overridden if child, propagate if parent
          if (designId !== 'parent') {
            setPropertyOverrides(prev => ({
              ...prev,
              [designId]: {
                ...prev[designId],
                [layerKey]: { ...prev[designId]?.[layerKey], [key]: true }
              }
            }))
          } else {
            // Propagate to children
            propagateToChildren(layerKey, key, convertedValue, newRules)
          }
        }
      }

      return newRules
    })
  }
}

