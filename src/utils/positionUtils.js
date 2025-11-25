import { GRAVITY_VALUES } from '../pages/playground/constants'

/**
 * Calculates position based on gravity and offsets
 * @param {number} x - X offset
 * @param {number} y - Y offset
 * @param {string} gravity - Gravity value (e.g., 'north_west', 'center')
 * @param {number} layerWidth - Layer width in pixels
 * @param {number} layerHeight - Layer height in pixels
 * @param {number} canvasWidth - Canvas width in pixels
 * @param {number} canvasHeight - Canvas height in pixels
 * @param {number} scale - Scale factor for uniform scaling
 * @param {number} imageOffsetX - Image X offset within wrapper
 * @param {number} imageOffsetY - Image Y offset within wrapper
 * @returns {{left: number, top: number}} Calculated position
 */
export function calculatePosition(x, y, gravity, layerWidth, layerHeight, canvasWidth, canvasHeight, scale, imageOffsetX, imageOffsetY) {
  let left = 0
  let top = 0
  
  // Adjust based on gravity (x, y are offsets from gravity point)
  // All positions are relative to the actual image, then we add imageOffset
  // Use uniform scale for both dimensions
  switch (gravity) {
    case GRAVITY_VALUES.northWest:
      // x, y are offsets from top-left
      left = x * scale
      top = y * scale
      break
    case GRAVITY_VALUES.north:
      // x is horizontal offset from center, y is offset from top
      left = (canvasWidth / 2 + x) * scale - (layerWidth / 2)
      top = y * scale
      break
    case GRAVITY_VALUES.northEast:
      // x, y are offsets from top-right
      left = (canvasWidth - x) * scale - layerWidth
      top = y * scale
      break
    case GRAVITY_VALUES.west:
      // x is offset from left, y is vertical offset from center
      left = x * scale
      top = (canvasHeight / 2 + y) * scale - (layerHeight / 2)
      break
    case GRAVITY_VALUES.center:
      // x, y are offsets from center
      left = (canvasWidth / 2 + x) * scale - (layerWidth / 2)
      top = (canvasHeight / 2 + y) * scale - (layerHeight / 2)
      break
    case GRAVITY_VALUES.east:
      // x is offset from right, y is vertical offset from center
      left = (canvasWidth - x) * scale - layerWidth
      top = (canvasHeight / 2 + y) * scale - (layerHeight / 2)
      break
    case GRAVITY_VALUES.southWest:
      // x is offset from left, y is offset from bottom
      left = x * scale
      top = (canvasHeight - y) * scale - layerHeight
      break
    case GRAVITY_VALUES.south:
      // x is horizontal offset from center, y is offset from bottom
      left = (canvasWidth / 2 + x) * scale - (layerWidth / 2)
      top = (canvasHeight - y) * scale - layerHeight
      break
    case GRAVITY_VALUES.southEast:
      // x, y are offsets from bottom-right
      left = (canvasWidth - x) * scale - layerWidth
      top = (canvasHeight - y) * scale - layerHeight
      break
    default:
      left = x * scale
      top = y * scale
  }
  
  // Add the image offset within the wrapper (accounts for centering)
  return { 
    left: left + imageOffsetX, 
    top: top + imageOffsetY 
  }
}

