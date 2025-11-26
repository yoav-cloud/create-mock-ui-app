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
  modifiedLayers,
  hoveredLayerFromPanel
}) {
  const [overlays, setOverlays] = useState([])
  const [hoveredLayerId, setHoveredLayerId] = useState(null)
  const [hoveredInfoId, setHoveredInfoId] = useState(null)
  
  // Combine internal hover and external hover from panel
  const effectiveHoveredLayerId = hoveredLayerId || hoveredLayerFromPanel

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
  
  // Update overlays when relevant props change (immediate update for responsiveness)
  useEffect(() => {
    updateOverlays()
  }, [canvasDimensions, editableRules, updateOverlays])
  
  // When design changes, wait for CSS transition to complete before recalculating
  useEffect(() => {
    if (showLayerOverlays) {
      // Wait for wrapper's CSS transition (0.3s) plus buffer
      const timer = setTimeout(() => {
        updateOverlays()
      }, 400)
      return () => clearTimeout(timer)
    }
  }, [selectedDesignId, showLayerOverlays, updateOverlays])
  
  // Update overlays when image finishes loading
  // This ensures we recalculate after a new image loads (e.g., after switching designs)
  useEffect(() => {
    if (!imageLoading && showLayerOverlays) {
      // Delay to ensure:
      // 1. The image dimensions are available
      // 2. The wrapper's CSS transition has completed (0.3s transition in Preview.css)
      const timer = setTimeout(() => {
        updateOverlays()
      }, 350)
      return () => clearTimeout(timer)
    }
  }, [imageLoading, showLayerOverlays, updateOverlays])

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
        const baseColor = isModified ? { r: 255, g: 215, b: 0 } : { r: 3, g: 169, b: 244 }
        const isHovered = effectiveHoveredLayerId === overlay.id
        const isDimmed = effectiveHoveredLayerId !== null && effectiveHoveredLayerId !== overlay.id
        const showInfoPanel = hoveredInfoId === overlay.id
        
        return (
          <div
            key={overlay.id}
            className={`layer-overlay ${isHovered ? 'hovered' : ''} ${isDimmed ? 'dimmed' : ''}`}
            onClick={() => onLayerIndicatorClick?.(overlay.id)}
            onMouseEnter={() => setHoveredLayerId(overlay.id)}
            onMouseLeave={() => {
              setHoveredLayerId(null)
              setHoveredInfoId(null)
            }}
            style={{
              position: 'absolute',
              left: `${overlay.left}px`,
              top: `${overlay.top}px`,
              width: `${overlay.width}px`,
              height: `${overlay.height}px`,
              border: `1px solid rgba(${baseColor.r}, ${baseColor.g}, ${baseColor.b}, ${isDimmed ? 0.3 : isHovered ? 1 : 0.8})`,
              backgroundColor: `rgba(${baseColor.r}, ${baseColor.g}, ${baseColor.b}, ${isDimmed ? 0.03 : isHovered ? 0.2 : 0.1})`,
              pointerEvents: 'auto',
              cursor: onLayerIndicatorClick ? 'pointer' : 'default',
              zIndex: isHovered ? 1002 : 1000,
              boxSizing: 'border-box',
              transition: 'all 0.2s ease',
              boxShadow: isModified ? '0 0 8px rgba(255, 215, 0, 0.4)' : 'none',
              opacity: isDimmed ? 0.4 : 1
            }}
          >
            {/* Layer name label */}
            <span className="layer-overlay-label">{overlay.name}</span>
            
            {/* Info icon */}
            <button
              className="layer-info-btn"
              onMouseEnter={(e) => {
                e.stopPropagation()
                setHoveredInfoId(overlay.id)
              }}
              onMouseLeave={(e) => {
                e.stopPropagation()
                setHoveredInfoId(null)
              }}
              title="View layer details"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="16" x2="12" y2="12"></line>
                <line x1="12" y1="8" x2="12.01" y2="8"></line>
              </svg>
            </button>
            
            {/* Info panel */}
            {showInfoPanel && (
              <div 
                className="layer-info-panel" 
                onClick={(e) => e.stopPropagation()}
                onMouseEnter={() => setHoveredInfoId(overlay.id)}
                onMouseLeave={() => setHoveredInfoId(null)}
              >
                <div className="layer-info-header">{overlay.name}</div>
                <div className="layer-info-content">
                  <div className="layer-info-row">
                    <span className="layer-info-label">Position:</span>
                    <span className="layer-info-value">
                      x: {Math.round(overlay.left)}px, y: {Math.round(overlay.top)}px
                    </span>
                  </div>
                  <div className="layer-info-row">
                    <span className="layer-info-label">Size:</span>
                    <span className="layer-info-value">
                      {Math.round(overlay.width)} × {Math.round(overlay.height)}px
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )
      })}
    </>
  )
}

