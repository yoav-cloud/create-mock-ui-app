import React from 'react'
import './Preview.css'
import LayerIndicators from './LayerIndicators'
import TextualPreview from './TextualPreview'
import { YogaPreview } from '../../yoga/components'

export default function Preview({
  previewTab,
  onTabChange,
  canvasDimensions,
  previewWrapperRef,
  imageLoading,
  imageError,
  currentImageUrl,
  generatedUrl,
  onImageLoad,
  onImageError,
  showLayerOverlays,
  onToggleLayerOverlays,
  editableRules,
  setEditableRules,
  selectedDesignId,
  formValues,
  useMetadata,
  urlSegments,
  highlightedRow,
  onSegmentClick,
  onLayerIndicatorClick,
  modifiedLayers,
  selectedDesign,
  handleRuleUpdate,
  handleResetProperty,
  isPropertyInherited,
  isPropertyOverriddenForDisplay,
  wouldPropertyBeInherited,
  getFieldType,
  getGravityOptions,
  getFontOptions,
  handleFontSizeValidation,
  hoveredLayerFromPanel,
  yogaLayout,
  designTypes,
  setDesignTypes,
  selectedAsset,
  buildDesignPreviewUrl
}) {
  return (
    <div className="preview-area">
      <div className="preview-tabs">
        <button
          type="button"
          className={`preview-tab ${previewTab === 'visual' ? 'active' : ''}`}
          onClick={() => onTabChange('visual')}
        >
          Visual
        </button>
        <button
          type="button"
          className={`preview-tab ${previewTab === 'textual' ? 'active' : ''}`}
          onClick={() => onTabChange('textual')}
        >
          Rules
        </button>
        <button
          type="button"
          className={`preview-tab ${previewTab === 'yoga' ? 'active' : ''}`}
          onClick={() => onTabChange('yoga')}
        >
          Yoga
        </button>
      </div>

      {previewTab === 'visual' && (
        <div
          className="preview-wrapper"
          ref={previewWrapperRef}
          style={{ aspectRatio: `${canvasDimensions.width}/${canvasDimensions.height}` }}
        >
          {imageLoading && (
            <div className="loading-overlay">
              <div className="spinner"></div>
            </div>
          )}
          {currentImageUrl && currentImageUrl !== generatedUrl && !imageError && (
            <img
              src={currentImageUrl}
              alt="Design Preview Previous"
              className="preview-image previous"
            />
          )}
          {!imageError ? (
            <img
              src={generatedUrl}
              alt="Design Preview"
              className={`preview-image current ${imageLoading ? 'loading' : ''}`}
              onLoad={onImageLoad}
              onError={onImageError}
            />
          ) : (
            <div className="broken-image-placeholder">
              <div className="broken-icon">⚠️</div>
              <div className="broken-text">Image failed to load</div>
            </div>
          )}

          <LayerIndicators
            wrapperRef={previewWrapperRef}
            showLayerOverlays={showLayerOverlays}
            onToggleLayerOverlays={onToggleLayerOverlays}
            canvasDimensions={canvasDimensions}
            editableRules={editableRules}
            selectedDesignId={selectedDesignId}
            formValues={formValues}
            useMetadata={useMetadata}
            onLayerIndicatorClick={onLayerIndicatorClick}
            imageLoading={imageLoading}
            modifiedLayers={modifiedLayers}
            hoveredLayerFromPanel={hoveredLayerFromPanel}
          />
        </div>
      )}

      {previewTab === 'textual' && (
        <div className="textual-preview">
          <TextualPreview
            generatedUrl={generatedUrl}
            urlSegments={urlSegments}
            highlightedRow={highlightedRow}
            onSegmentClick={onSegmentClick}
            editableRules={editableRules}
            selectedDesign={selectedDesign}
            canvasDimensions={canvasDimensions}
            formValues={formValues}
            useMetadata={useMetadata}
            handleRuleUpdate={handleRuleUpdate}
            handleResetProperty={handleResetProperty}
            isPropertyInherited={isPropertyInherited}
            isPropertyOverriddenForDisplay={isPropertyOverriddenForDisplay}
            wouldPropertyBeInherited={wouldPropertyBeInherited}
            getFieldType={getFieldType}
            getGravityOptions={getGravityOptions}
            getFontOptions={getFontOptions}
            handleFontSizeValidation={handleFontSizeValidation}
          />
        </div>
      )}

      {previewTab === 'yoga' && (
        <div className="yoga-preview-wrapper">
          <YogaPreview 
            yogaLayout={yogaLayout?.currentDesignYogaLayout}
            designId={selectedDesign?.id || 'unknown'}
            editableRules={editableRules}
            setEditableRules={setEditableRules}
            designTypes={designTypes}
            setDesignTypes={setDesignTypes}
            selectedAsset={selectedAsset}
            buildDesignPreviewUrl={buildDesignPreviewUrl}
          />
        </div>
      )}
    </div>
  )
}

