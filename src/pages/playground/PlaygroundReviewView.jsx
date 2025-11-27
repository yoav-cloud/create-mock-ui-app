import React, { useEffect, useState, useCallback, useMemo } from 'react'
import { useNavigate, useOutletContext } from 'react-router-dom'
import { isTextLayer } from '../../utils/layerUtils'
import ReviewCopyPanel from './ReviewCopyPanel'
import './PlaygroundReview.css'

export default function PlaygroundReviewView() {
  const context = useOutletContext()
  const review = context?.review

  if (!review) {
    return null
  }

  const {
    reviewMode,
    setReviewMode,
    reviewPreviews,
    activeReviewDesignId,
    handleReviewDesignSelect,
    handleReviewCarouselNavigate,
    formValues,
    handleInputChange,
    layerMap,
    focusLayerInDesign
  } = review
  const navigate = useNavigate()

  if (!reviewPreviews.length) {
    return (
      <div className="playground-review-page">
        <div className="review-empty-state">
          <p>No designs available for review.</p>
        </div>
      </div>
    )
  }

  const [loadedDesigns, setLoadedDesigns] = useState(() => new Map())
  const [isLoading, setIsLoading] = useState(false)
  const [isCopyPanelOpen, setIsCopyPanelOpen] = useState(false)

  const fallbackPreview = reviewPreviews[0]
  const selected = reviewPreviews.find(preview => preview.design.id === activeReviewDesignId) || fallbackPreview
  const currentIndex = reviewPreviews.findIndex(preview => preview.design.id === selected.design.id)
  const safeIndex = currentIndex === -1 ? 0 : currentIndex
  const humanIndex = safeIndex + 1

  const activePreviews = useMemo(() => {
    if (!reviewPreviews.length) return []
    if (reviewMode === 'grid') {
      return reviewPreviews
    }
    return selected ? [selected] : []
  }, [reviewMode, reviewPreviews, selected])

  useEffect(() => {
    setLoadedDesigns(prev => {
      const next = new Map()
      activePreviews.forEach(({ design, url }) => {
        const prevUrl = prev.get(design.id)
        if (prevUrl && prevUrl === url) {
          next.set(design.id, url)
        }
      })
      return next
    })
  }, [activePreviews])

  useEffect(() => {
    if (!activePreviews.length) {
      setIsLoading(false)
      return
    }
    const allLoaded = activePreviews.every(({ design, url }) => loadedDesigns.get(design.id) === url)
    setIsLoading(!allLoaded)
  }, [activePreviews, loadedDesigns])

  const handlePreviewImageLoad = useCallback((designId, url) => {
    setLoadedDesigns(prev => {
      if (prev.get(designId) === url) return prev
      const next = new Map(prev)
      next.set(designId, url)
      return next
    })
  }, [])

  const handlePreviewImageError = useCallback((designId, url) => {
    handlePreviewImageLoad(designId, url)
  }, [handlePreviewImageLoad])

  const textLayers = useMemo(() => {
    if (!layerMap) return []
    return Object.entries(layerMap)
      .filter(([, info]) => isTextLayer(info.layerData))
      .map(([layerKey, info]) => {
        const fieldName = info.layerData.fieldName || layerKey
        return {
          layerKey,
          displayName: info.displayName,
          fieldName
        }
      })
  }, [layerMap])

  const handleCopyValueChange = useCallback((fieldName, value) => {
    if (!handleInputChange) return
    handleInputChange({
      target: {
        name: fieldName,
        value
      }
    })
  }, [handleInputChange])

  const handleJumpToDesign = useCallback((fieldName) => {
    if (focusLayerInDesign) {
      focusLayerInDesign(fieldName)
    }
    navigate('/playground/design')
  }, [focusLayerInDesign, navigate])

  return (
    <div className="playground-review-page">
      {isLoading && (
        <div className="review-loading-overlay">
          <div className="spinner"></div>
        </div>
      )}
      <div className="review-mode-switcher">
        <button
          type="button"
          className={`review-mode-btn ${reviewMode === 'grid' ? 'active' : ''}`}
          onClick={() => setReviewMode('grid')}
        >
          Grid
        </button>
        <button
          type="button"
          className={`review-mode-btn ${reviewMode === 'carousel' ? 'active' : ''}`}
          onClick={() => setReviewMode('carousel')}
        >
          Carousel
        </button>
      </div>

      <div className={`review-content-shell ${isCopyPanelOpen ? 'copy-open' : ''}`}>
        <div className="review-main-content">
          {reviewMode === 'grid' ? (
            <div className="review-grid-layout">
              <div className="review-grid-scroll">
                <div className="review-grid">
                  {reviewPreviews.map(({ design, url, width, height }) => (
                    <button
                      type="button"
                      key={design.id}
                      className={`review-grid-card ${activeReviewDesignId === design.id ? 'selected' : ''}`}
                      onClick={() => handleReviewDesignSelect(design.id)}
                    >
                      <div
                        className="review-grid-thumbnail"
                        style={{ aspectRatio: `${width}/${height}` }}
                      >
                        <img
                          src={url}
                          alt={`${design.name} preview`}
                          onLoad={() => handlePreviewImageLoad(design.id, url)}
                          onError={() => handlePreviewImageError(design.id, url)}
                        />
                      </div>
                      <div className="review-grid-label">
                        <span>{design.name}</span>
                        <span>{width}x{height}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="review-detail-panel">
                <div className="review-detail-header">
                  <div>
                    <p className="review-detail-eyebrow">Selected design</p>
                    <h4>{selected.design.name}</h4>
                  </div>
                  <span className="review-detail-dimensions">{selected.width}x{selected.height}</span>
                </div>
                <div className="review-detail-frame">
                  <div
                    className="review-detail-canvas"
                    style={{ aspectRatio: `${selected.width}/${selected.height}` }}
                  >
                    <img
                      src={selected.url}
                      alt={`${selected.design.name} large preview`}
                      onLoad={() => handlePreviewImageLoad(selected.design.id, selected.url)}
                      onError={() => handlePreviewImageError(selected.design.id, selected.url)}
                    />
                  </div>
                </div>
                {selected.design.description && (
                  <p className="review-detail-description">
                    {selected.design.description}
                  </p>
                )}
              </div>
            </div>
          ) : (
            <>
              <div className="review-carousel">
                <button
                  type="button"
                  className="carousel-nav-btn"
                  onClick={() => handleReviewCarouselNavigate(-1)}
                  aria-label="Previous design"
                >
                  &lt;
                </button>
                <div className="carousel-stage">
                  <div className="carousel-stage-content">
                    <div className="review-detail-header">
                      <div>
                        <p className="review-detail-eyebrow">Selected design</p>
                        <h4>{selected.design.name}</h4>
                      </div>
                      <span className="review-detail-dimensions">{selected.width}x{selected.height}</span>
                    </div>
                    <div
                      className="carousel-frame"
                      style={{ aspectRatio: `${selected.width}/${selected.height}` }}
                    >
                      <img
                        src={selected.url}
                        alt={`${selected.design.name} carousel preview`}
                        onLoad={() => handlePreviewImageLoad(selected.design.id, selected.url)}
                        onError={() => handlePreviewImageError(selected.design.id, selected.url)}
                      />
                    </div>
                    {selected.design.description && (
                      <p className="review-detail-description">
                        {selected.design.description}
                      </p>
                    )}
                  </div>
                </div>
                <button
                  type="button"
                  className="carousel-nav-btn"
                  onClick={() => handleReviewCarouselNavigate(1)}
                  aria-label="Next design"
                >
                  &gt;
                </button>
              </div>
              <div className="review-carousel-info">
                <span>{selected.design.name}</span>
                <span>{selected.width}x{selected.height}</span>
                <span>{humanIndex}/{reviewPreviews.length}</span>
              </div>
            </>
          )}
        </div>

        <ReviewCopyPanel
          isOpen={isCopyPanelOpen}
          onToggle={() => setIsCopyPanelOpen(prev => !prev)}
          textLayers={textLayers}
          formValues={formValues}
          onValueChange={handleCopyValueChange}
          onJumpToDesign={handleJumpToDesign}
        />
      </div>
    </div>
  )
}

