export const calculateContainerScale = (containerWidth, containerHeight, maxViewportWidth = 800, maxViewportHeight = 600) => {
  const scaleX = maxViewportWidth / containerWidth
  const scaleY = maxViewportHeight / containerHeight
  return Math.min(scaleX, scaleY, 1)
}

export const getScaledDimensions = (width, height, scale) => ({
  width: width * scale,
  height: height * scale
})
