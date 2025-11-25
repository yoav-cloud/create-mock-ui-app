import React, { useEffect, useState, useCallback } from 'react'
import { calculateLayerOverlays } from '../../utils/layerOverlayUtils'
import './LayerIndicators.css'

/**
 * LayerIndicators component - displays layer overlay rectangles and toggle button
 * @param {Object} props
 * @param {React.RefObject} props.wrapperRef - Reference to the preview wrapper element
 * @param {boolean} props.showLayerOverlays - Whether to show layer overlays
 * @param {Function} props.onToggleLayerOverlays - Callback to toggle layer overlays
 * @param {Object} props.canvasDimensions - Canvas dimensions { width, height }
 * @param {Object} props.editableRules - Editable rules object
 * @param {string} props.selectedDesignId - Selected design ID
 * @param {Object} props.formValues - Form values
 * @param {Object} props.useMetadata - Metadata toggle state
 * @param {Function} props.onLayerIndicatorClick - Callback when a layer indicator is clicked
 */
export default function LayerIndicators({
  wrapperRef,
  showLayerOverlays,
  onToggleLayerOverlays,
  canvasDimensions,
  editableRules,
  selectedDesignId,
  formValues,
  useMetadata,
  onLayerIndicatorClick,
  imageLoading,
  modifiedLayers
}) {
  const [overlays, setOverlays] = useState([])

  const updateOverlays = useCallback(() => {
    if (!showLayerOverlays) {
      setOverlays([])
      return
    }

    const newOverlays = calculateLayerOverlays({
      wrapperRef,
      canvasDimensions,
      editableRules,
      selectedDesignId,
      formValues,
      useMetadata
    })
    
    setOverlays(newOverlays)
  }, [showLayerOverlays, canvasDimensions, editableRules, selectedDesignId, formValues, useMetadata, wrapperRef])

  // Listen for resize to update overlays
  useEffect(() => {
    if (!wrapperRef?.current || !showLayerOverlays) return
    
    const observer = new ResizeObserver(() => {
      updateOverlays()
    })
    
    observer.observe(wrapperRef.current)
    
    // Also update on window resize (redundant but safe)
    const handleResize = () => updateOverlays()
    window.addEventListener('resize', handleResize)
    
    // Initial update
    updateOverlays()
    
    return () => {
      observer.disconnect()
      window.removeEventListener('resize', handleResize)
    }
  }, [updateOverlays, showLayerOverlays, wrapperRef])
  
  // Update overlays when relevant props change
  useEffect(() => {
    updateOverlays()
  }, [canvasDimensions, editableRules, selectedDesignId, updateOverlays])

  // Debug: Log when modifiedLayers or imageLoading changes
  useEffect(() => {
    if (imageLoading && modifiedLayers) {
      console.log('Image loading:', imageLoading)
      console.log('Modified layers:', modifiedLayers instanceof Set ? Array.from(modifiedLayers) : modifiedLayers)
      console.log('Modified layers size:', modifiedLayers instanceof Set ? modifiedLayers.size : 0)
      console.log('Overlay IDs:', overlays.map(o => o.id))
      overlays.forEach(overlay => {
        const isInSet = modifiedLayers instanceof Set ? modifiedLayers.has(overlay.id) : false
        console.log(`Overlay ${overlay.id} (${overlay.name}): isModified=${isInSet}`)
      })
    }
  }, [imageLoading, modifiedLayers, overlays])

  return (
    <>
      {/* Layer Overlay Toggle Button */}
      <button
        className={`layer-overlay-toggle ${showLayerOverlays ? 'active' : ''}`}
        onClick={() => onToggleLayerOverlays(!showLayerOverlays)}
        title={showLayerOverlays ? 'Hide layer overlays' : 'Show layer overlays'}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
          <line x1="9" y1="3" x2="9" y2="21"></line>
          <line x1="15" y1="3" x2="15" y2="21"></line>
          <line x1="3" y1="9" x2="21" y2="9"></line>
          <line x1="3" y1="15" x2="21" y2="15"></line>
        </svg>
        <span>Layers</span>
      </button>
      
      {/* Layer Overlay Rectangles */}
      {showLayerOverlays && overlays.map((overlay) => {
        // Check if this layer is modified and image is loading
        const isModified = imageLoading && modifiedLayers && modifiedLayers instanceof Set && modifiedLayers.has(overlay.id)
        // Gold color for modified layers during loading
        const borderColor = isModified ? 'rgba(255, 215, 0, 0.9)' : 'rgba(3, 169, 244, 0.8)'
        const backgroundColor = isModified ? 'rgba(255, 215, 0, 0.15)' : 'rgba(3, 169, 244, 0.1)'
        
        return (
          <div
            key={overlay.id}
            className="layer-overlay"
            onClick={() => onLayerIndicatorClick?.(overlay.id)}
            style={{
              position: 'absolute',
              left: `${overlay.left}px`,
              top: `${overlay.top}px`,
              width: `${overlay.width}px`,
              height: `${overlay.height}px`,
              border: `1px solid ${borderColor}`,
              backgroundColor: backgroundColor,
              pointerEvents: 'auto',
              cursor: onLayerIndicatorClick ? 'pointer' : 'default',
              zIndex: 1000,
              boxSizing: 'border-box',
              transition: 'all 0.2s ease',
              boxShadow: isModified ? '0 0 8px rgba(255, 215, 0, 0.4)' : 'none'
            }}
            onMouseEnter={(e) => {
              if (onLayerIndicatorClick) {
                if (isModified) {
                  e.target.style.borderColor = 'rgba(255, 215, 0, 1)'
                  e.target.style.backgroundColor = 'rgba(255, 215, 0, 0.25)'
                } else {
                  e.target.style.borderColor = 'rgba(3, 169, 244, 1)'
                  e.target.style.backgroundColor = 'rgba(3, 169, 244, 0.2)'
                }
              }
            }}
            onMouseLeave={(e) => {
              if (onLayerIndicatorClick) {
                e.target.style.borderColor = borderColor
                e.target.style.backgroundColor = backgroundColor
              }
            }}
            title={onLayerIndicatorClick ? `Click to focus on ${overlay.name} in Controls${isModified ? ' (reloading...)' : ''}` : overlay.name}
          />
        )
      })}
    </>
  )
}

