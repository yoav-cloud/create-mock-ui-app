import React from 'react'
import { useOutletContext } from 'react-router-dom'
import DesignSelector from './DesignSelector'
import Preview from './Preview'
import Controls from './Controls'

export default function PlaygroundDesignView() {
  const context = useOutletContext()
  const design = context?.design

  if (!design) {
    return null
  }

  const {
    selectedDesign,
    setSelectedDesign,
    canvasDimensions,
    setCanvasDimensions,
    inheritanceToggles,
    setInheritanceToggles,
    previewTab,
    setPreviewTab,
    previewWrapperRef,
    imageLoading,
    imageError,
    currentImageUrl,
    generatedUrl,
    handleImageLoad,
    handleImageError,
    showLayerOverlays,
    setShowLayerOverlays,
    editableRules,
    formValues,
    useMetadata,
    urlSegments,
    highlightedRow,
    handleSegmentClick,
    handleLayerIndicatorClick,
    modifiedLayers,
    handleRuleUpdate,
    handleResetProperty,
    isPropertyInherited,
    isPropertyOverriddenForDisplay,
    wouldPropertyBeInherited,
    getFieldType,
    getGravityOptions,
    getFontOptions,
    getRulesForDesign,
    handleFontSizeValidation,
    hoveredLayerFromPanel,
    setHoveredLayerFromPanel,
    copySuccess,
    handleInputChange,
    handleToggleChange,
    handleCopy,
    getTransformedUrl,
    layerMap,
    highlightedField,
    expandedLayers,
    setExpandedLayers,
    highlightedLayer
  } = design

  return (
    <div className="playground-content">
      <DesignSelector
        selectedDesign={selectedDesign}
        onDesignChange={setSelectedDesign}
        canvasDimensions={canvasDimensions}
        inheritanceToggles={inheritanceToggles}
        onInheritanceToggleChange={setInheritanceToggles}
        getRulesForDesign={getRulesForDesign}
      />

      <Preview
        previewTab={previewTab}
        onTabChange={setPreviewTab}
        canvasDimensions={canvasDimensions}
        previewWrapperRef={previewWrapperRef}
        imageLoading={imageLoading}
        imageError={imageError}
        currentImageUrl={currentImageUrl}
        generatedUrl={generatedUrl}
        onImageLoad={handleImageLoad}
        onImageError={handleImageError}
        showLayerOverlays={showLayerOverlays}
        onToggleLayerOverlays={setShowLayerOverlays}
        editableRules={editableRules}
        selectedDesignId={selectedDesign.id}
        formValues={formValues}
        useMetadata={useMetadata}
        urlSegments={urlSegments}
        highlightedRow={highlightedRow}
        onSegmentClick={handleSegmentClick}
        onLayerIndicatorClick={handleLayerIndicatorClick}
        modifiedLayers={modifiedLayers}
        selectedDesign={selectedDesign}
        handleRuleUpdate={handleRuleUpdate}
        handleResetProperty={handleResetProperty}
        isPropertyInherited={isPropertyInherited}
        isPropertyOverriddenForDisplay={isPropertyOverriddenForDisplay}
        wouldPropertyBeInherited={wouldPropertyBeInherited}
        getFieldType={getFieldType}
        getGravityOptions={getGravityOptions}
        getFontOptions={getFontOptions}
        handleFontSizeValidation={handleFontSizeValidation}
        hoveredLayerFromPanel={hoveredLayerFromPanel}
      />

      <Controls
        canvasDimensions={canvasDimensions}
        setCanvasDimensions={setCanvasDimensions}
        formValues={formValues}
        useMetadata={useMetadata}
        editableRules={editableRules}
        selectedDesign={selectedDesign}
        copySuccess={copySuccess}
        handleInputChange={handleInputChange}
        handleToggleChange={handleToggleChange}
        handleRuleUpdate={handleRuleUpdate}
        handleResetProperty={handleResetProperty}
        handleCopy={handleCopy}
        getTransformedUrl={getTransformedUrl}
        isPropertyInherited={isPropertyInherited}
        isPropertyOverriddenForDisplay={isPropertyOverriddenForDisplay}
        wouldPropertyBeInherited={wouldPropertyBeInherited}
        layerMap={layerMap}
        highlightedField={highlightedField}
        expandedLayers={expandedLayers}
        setExpandedLayers={setExpandedLayers}
        highlightedLayer={highlightedLayer}
        onLayerHover={setHoveredLayerFromPanel}
        getFontOptions={getFontOptions}
      />
    </div>
  )
}

