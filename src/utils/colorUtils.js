/**
 * Converts hex color to rgb:RRGGBB format (without rgb: prefix)
 * @param {string} hex - Hex color string (e.g., '#ffffff' or 'fff')
 * @returns {string} RGB color string in format 'RRGGBB' (lowercase)
 */
export function hexToRgb(hex) {
  if (!hex) return '000000'
  // Remove # if present
  hex = hex.replace('#', '')
  // Handle 3-digit hex
  if (hex.length === 3) {
    hex = hex.split('').map(c => c + c).join('')
  }
  return hex.toLowerCase()
}

