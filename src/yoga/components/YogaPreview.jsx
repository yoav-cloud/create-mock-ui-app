import { useMemo, useRef, useState, useEffect } from 'react'
import { calculateContainerScale } from '../utils/scaleCalculator'
import YogaEmptyState from './YogaEmptyState'
import YogaPreviewHeader from './YogaPreviewHeader'
import YogaBackgroundLayer from './YogaBackgroundLayer'
import YogaLayerBox from './YogaLayerBox'
import YogaLegend from './YogaLegend'
import './YogaPreview.css'

const YogaPreview = ({ yogaLayout, designId }) => {
  const viewportRef = useRef(null)
  const [viewportSize, setViewportSize] = useState({ width: 1200, height: 800 })

  useEffect(() => {
    if (!viewportRef.current) return

    const updateSize = () => {
      const rect = viewportRef.current.getBoundingClientRect()
      setViewportSize({
        width: Math.max(rect.width - 80, 400),
        height: Math.max(rect.height - 80, 400)
      })
    }

    updateSize()
    window.addEventListener('resize', updateSize)
    return () => window.removeEventListener('resize', updateSize)
  }, [])

  const containerScale = useMemo(() => {
    if (!yogaLayout?.container) return 1
    return calculateContainerScale(
      yogaLayout.container.width || 500,
      yogaLayout.container.height || 900,
      viewportSize.width,
      viewportSize.height
    )
  }, [yogaLayout, viewportSize])

  if (!yogaLayout) {
    return <YogaEmptyState />
  }

  const { container, children = [], backgroundImage } = yogaLayout
  const containerWidth = container.width || 500
  const containerHeight = container.height || 900

  const containerStyle = {
    width: containerWidth,
    height: containerHeight,
    backgroundColor: container.backgroundColor || '#ffffff',
    transform: `scale(${containerScale})`,
    transformOrigin: 'top left'
  }

  return (
    <div className="yoga-preview">
      <YogaPreviewHeader
        designId={designId}
        containerWidth={containerWidth}
        containerHeight={containerHeight}
        layerCount={children.length}
        scale={containerScale}
      />

      <div className="yoga-preview-viewport" ref={viewportRef}>
        <div className="yoga-container" style={containerStyle}>
          <YogaBackgroundLayer backgroundImage={backgroundImage} />
          
          {children.map((child, index) => (
            <YogaLayerBox key={child.key || index} layer={child} index={index} />
          ))}
        </div>
      </div>

      <YogaLegend />
    </div>
  )
}

export default YogaPreview
