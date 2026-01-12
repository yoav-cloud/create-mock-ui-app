import { useMemo, useRef, useState, useEffect } from 'react'
import toast from 'react-hot-toast'
import { calculateContainerScale } from '../utils/scaleCalculator'
import { reflowYogaLayout } from '../utils/reflowLayout'
import { yogaLayoutToDesignRules, createDesignType } from '../utils/yogaToDesignRules'
import YogaEmptyState from './YogaEmptyState'
import YogaPreviewHeader from './YogaPreviewHeader'
import YogaBackgroundLayer from './YogaBackgroundLayer'
import YogaLayerBox from './YogaLayerBox'
import YogaLegend from './YogaLegend'
import BannerSizeButtons from './BannerSizeButtons'
import './YogaPreview.css'

const YogaPreview = ({ 
  yogaLayout, 
  designId,
  editableRules,
  setEditableRules,
  designTypes,
  setDesignTypes,
  selectedAsset,
  buildDesignPreviewUrl
}) => {
  const viewportRef = useRef(null)
  const [viewportSize, setViewportSize] = useState({ width: 1200, height: 800 })
  const [originalLayout, setOriginalLayout] = useState(null)
  const [currentLayout, setCurrentLayout] = useState(null)
  const [activeBannerSize, setActiveBannerSize] = useState(null)
  const [currentBannerInfo, setCurrentBannerInfo] = useState(null)

  useEffect(() => {
    if (yogaLayout) {
      setOriginalLayout(yogaLayout)
      setCurrentLayout(yogaLayout)
      setActiveBannerSize(null)
    }
  }, [yogaLayout])

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

  const handleBannerSizeSelect = (bannerSize) => {
    if (!originalLayout) return

    try {
      const reflowedLayout = reflowYogaLayout(
        originalLayout,
        bannerSize.width,
        bannerSize.height
      )

      setCurrentLayout(reflowedLayout)
      setActiveBannerSize(bannerSize.id)
      setCurrentBannerInfo(bannerSize)

      console.group(`🎯 Reflowed to ${bannerSize.name}`)
      console.log('Original:', originalLayout.container)
      console.log('New:', reflowedLayout.container)
      console.log('Scale factor:', reflowedLayout.metadata.scaleFactor)
      console.groupEnd()
    } catch (error) {
      console.error('Failed to reflow layout:', error)
    }
  }

  const handleResetToOriginal = () => {
    setCurrentLayout(originalLayout)
    setActiveBannerSize(null)
    setCurrentBannerInfo(null)
  }

  const handleSaveAsSubDesign = () => {
    if (!currentLayout || !currentBannerInfo || !setEditableRules || !setDesignTypes) return

    try {
      // Convert yoga layout to design rules
      const designRules = yogaLayoutToDesignRules(
        currentLayout,
        currentBannerInfo.id,
        currentBannerInfo.name,
        designId
      )

      // Create design type
      const designType = createDesignType(
        currentLayout,
        currentBannerInfo.name,
        currentBannerInfo.id,
        designId
      )

      // Add to design types
      setDesignTypes(prev => {
        const exists = prev.some(d => d.id === designType.id)
        if (exists) {
          return prev.map(d => d.id === designType.id ? designType : d)
        }
        return [...prev, designType]
      })

      // Add to editable rules
      setEditableRules(prev => ({
        ...prev,
        [designType.id]: designRules
      }))

      // Generate preview URL
      if (buildDesignPreviewUrl) {
        const previewUrl = buildDesignPreviewUrl(designType)
        console.log('Preview URL:', previewUrl)
      }

      console.group(`💾 Saved as Sub-Design`)
      console.log('Design Type:', designType)
      console.log('Design Rules:', designRules)
      console.log('Cloudinary URL can now be generated from the new sub-design')
      console.groupEnd()

      toast.success(`Saved as "${designType.name}"! Find it in the Design Selector.`, {
        duration: 4000,
        position: 'top-center'
      })
    } catch (error) {
      console.error('Failed to save sub-design:', error)
      toast.error(`Failed to save: ${error.message}`, {
        duration: 4000,
        position: 'top-center'
      })
    }
  }

  const containerScale = useMemo(() => {
    if (!currentLayout?.container) return 1
    return calculateContainerScale(
      currentLayout.container.width || 500,
      currentLayout.container.height || 900,
      viewportSize.width,
      viewportSize.height
    )
  }, [currentLayout, viewportSize])

  if (!currentLayout) {
    return <YogaEmptyState />
  }

  const { container, children = [], backgroundImage } = currentLayout
  const containerWidth = container.width || 500
  const containerHeight = container.height || 900

  const containerStyle = {
    width: containerWidth,
    height: containerHeight,
    backgroundColor: container.backgroundColor || '#ffffff',
    transform: `scale(${containerScale})`,
    transformOrigin: 'center center'
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

      <BannerSizeButtons
        onSizeSelect={handleBannerSizeSelect}
        activeSizeId={activeBannerSize}
        isOriginal={!activeBannerSize}
        onResetOriginal={handleResetToOriginal}
        onSaveAsSubDesign={handleSaveAsSubDesign}
        currentBannerSize={currentBannerInfo}
      />
    </div>
  )
}

export default YogaPreview
