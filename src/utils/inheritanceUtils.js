/**
 * Determines if a property should be inherited based on its type and inheritance toggles
 * @param {string} propertyKey - The property key (e.g., 'color', 'fontSize', 'x', 'Width')
 * @param {Object} inheritanceToggles - Inheritance toggle state { inheritStyles: boolean, inheritAll: boolean }
 * @returns {boolean} True if the property should be inherited
 */
export function shouldInheritProperty(propertyKey, inheritanceToggles) {
  // Canvas dimensions (Width, Height with capital letters) are NEVER inherited
  // This only applies to General category canvas dimensions, not layer width/height
  if (propertyKey === 'Width' || propertyKey === 'Height') {
    return false
  }
  // Style properties (color, font, flags, textWrap) are inherited if inheritStyles is ON
  const styleProperties = ['color', 'font', 'flNoOverflow', 'flTextDisallowOverflow', 'textWrap']
  if (styleProperties.includes(propertyKey)) {
    return inheritanceToggles.inheritStyles
  }
  // Position/size properties (x, y, width, height, fontSize, gravity, textWidth) are inherited if inheritAll is ON
  // Note: width/height here refer to layer dimensions (like logo, image), not canvas dimensions
  const positionSizeProperties = ['x', 'y', 'width', 'height', 'fontSize', 'gravity', 'textWidth', 'show', 'publicId']
  if (positionSizeProperties.includes(propertyKey)) {
    return inheritanceToggles.inheritAll
  }
  return false
}

