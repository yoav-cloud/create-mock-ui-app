import React, { useMemo } from 'react'
import './FigmaImportModal.css'

const clamp01 = (value) => {
  if (!Number.isFinite(value)) return 0
  return Math.max(0, Math.min(1, value))
}

const percent = (value) => `${(clamp01(value) * 100).toFixed(4)}%`

const layerTone = (layerType = '') => {
  const normalized = String(layerType || '').toUpperCase()
  if (normalized === 'TEXT') return 'text'
  return 'image'
}

export default function FigmaFramePreview({
  title = 'Frame preview',
  frameName = '',
  imageUrl = '',
  isLoading = false,
  showOverlays = false,
  frameWidth = 0,
  frameHeight = 0,
  layers = [],
  layerSelections = {},
  mainProductLayerId = '',
  onToggleLayer = null
}) {
  const hasCanvas = Boolean(imageUrl && frameWidth > 0 && frameHeight > 0)
  const layerCount = layers.length

  const normalizedLayers = useMemo(() => {
    if (!Array.isArray(layers) || !frameWidth || !frameHeight) return []
    return layers
      .map(layer => {
        const box = layer?.box || {}
        const x = Number(box.x) || 0
        const y = Number(box.y) || 0
        const w = Number(box.width) || 0
        const h = Number(box.height) || 0
        const left = x / frameWidth
        const top = y / frameHeight
        const width = w / frameWidth
        const height = h / frameHeight

        const isSelected = layerSelections?.[layer.id] !== false
        const isMain = Boolean(mainProductLayerId && mainProductLayerId === layer.id)
        const tone = layerTone(layer.type)
        const showLabel = w >= 84 && h >= 34
        const variable = layer.variable ? `$${layer.variable}` : 'Static'

        return {
          ...layer,
          _layout: { left, top, width, height },
          _tone: tone,
          _isSelected: isSelected,
          _isMain: isMain,
          _showLabel: showLabel,
          _variableLabel: variable
        }
      })
      .filter(layer => layer._layout.width > 0 && layer._layout.height > 0)
  }, [layers, frameWidth, frameHeight, layerSelections, mainProductLayerId])

  return (
    <section className="figma-frame-preview">
      <div className="figma-frame-preview__header">
        <div>
          <p className="figma-files-eyebrow">{title}</p>
          {frameName && (
            <p className="figma-frame-preview__meta">
              <span>{frameName}</span>
              <span className="figma-frame-preview__dot">•</span>
              <span>{layerCount} marked layer{layerCount === 1 ? '' : 's'}</span>
            </p>
          )}
        </div>
        {onToggleLayer && showOverlays && (
          <p className="figma-frame-preview__hint">
            Click a box to toggle whether it imports.
          </p>
        )}
      </div>

      {!hasCanvas && (
        <div className="figma-frame-preview__empty">
          {isLoading && <div className="figma-inline-spinner" aria-hidden="true"></div>}
          <p className="figma-empty-state figma-empty-state--muted">
            {isLoading
              ? 'Loading preview from Figma…'
              : imageUrl
                ? 'Frame dimensions are missing, so we can’t render the preview yet.'
                : 'Select a frame to see a preview.'}
          </p>
        </div>
      )}

      {hasCanvas && (
        <div
          className="figma-frame-preview__canvas"
          style={{ aspectRatio: `${frameWidth} / ${frameHeight}` }}
        >
          <img
            className="figma-frame-preview__image"
            src={imageUrl}
            alt={frameName ? `Preview of ${frameName}` : 'Frame preview'}
            loading="lazy"
          />
          {showOverlays && (
            <div className="figma-frame-preview__overlay" aria-hidden="true">
              {normalizedLayers.map(layer => {
                const styles = {
                  left: percent(layer._layout.left),
                  top: percent(layer._layout.top),
                  width: percent(layer._layout.width),
                  height: percent(layer._layout.height)
                }
                const className = [
                  'figma-frame-preview__box',
                  `tone-${layer._tone}`,
                  layer._isSelected ? 'is-selected' : 'is-muted',
                  layer._isMain ? 'is-main' : ''
                ]
                  .filter(Boolean)
                  .join(' ')

                const label = layer.variable
                  ? `${layer.name} (${layer._variableLabel})`
                  : layer.name

                if (!onToggleLayer) {
                  return (
                    <div
                      key={layer.id}
                      className={className}
                      style={styles}
                      title={label}
                    >
                      {layer._showLabel && (
                        <span className="figma-frame-preview__label">{layer._variableLabel}</span>
                      )}
                    </div>
                  )
                }

                return (
                  <button
                    type="button"
                    key={layer.id}
                    className={className}
                    style={styles}
                    onClick={() => onToggleLayer(layer.id)}
                    title={label}
                    aria-label={`Toggle import for ${layer.name}`}
                  >
                    {layer._showLabel && (
                      <span className="figma-frame-preview__label">{layer._variableLabel}</span>
                    )}
                  </button>
                )
              })}
            </div>
          )}
        </div>
      )}
    </section>
  )
}

