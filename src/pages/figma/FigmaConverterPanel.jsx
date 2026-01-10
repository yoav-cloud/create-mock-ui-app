import React from 'react'
import './FigmaImportModal.css'
import FigmaFramePreview from './FigmaFramePreview'

export default function FigmaConverterPanel({
  selectedFile,
  selectedFrameId,
  frameOptions,
  visibleFrames = [],
  frameFilter = '',
  onFrameFilterChange = () => {},
  cloudinaryConfig,
  onFrameChange,
  onCloudinaryChange,
  cloudinaryExpanded = true,
  onToggleCloudinaryExpanded = () => {},
  onCopyTransformation,
  onInspectAnotherFrame,
  conversionStatus,
  conversionResult,
  conversionUploads,
  isInspectingFile,
  isConverting,
  copySuccess,
  previewLayers = null,
  framePreview = null,
  previewMode = 'dynamic',
  onPreviewModeChange = () => {},
  backgroundPreview = null,
  showPreviewOverlays = false,
  onTogglePreviewOverlays = () => {},
  templateName = '',
  onTemplateNameChange = () => {},
  layerSelections = {},
  onToggleLayerSelection = () => {},
  mainProductLayerId = '',
  onSelectMainProduct = () => {},
  transformationValue = '',
  onTransformationChange = () => {},
  mode = 'picker'
}) {
  if (!selectedFile) return null

  const selectedFrame = frameOptions.find(frame => frame.id === selectedFrameId)
  const framesToRender = visibleFrames.length ? visibleFrames : frameOptions
  const cloudinaryComplete = Boolean(
    cloudinaryConfig.cloudName &&
    cloudinaryConfig.uploadPreset
  )
  const showCloudinaryForm = !cloudinaryComplete || cloudinaryExpanded
  const normalizedBaseFolder = (cloudinaryConfig.folder || 'figma-exports').trim().replace(/\/+$/g, '')
  const templatePreviewSegment = templateName.trim()
    ? templateName.trim().replace(/\s+/g, '_')
    : 'your_template'
  const templateFolderPreview = normalizedBaseFolder
    ? `${normalizedBaseFolder}/${templatePreviewSegment}`
    : templatePreviewSegment
  const uploadMap = React.useMemo(() => {
    return conversionUploads.reduce((acc, upload) => {
      if (upload?.nodeId) {
        acc[upload.nodeId] = upload
      }
      return acc
    }, {})
  }, [conversionUploads])
  const isLayerChecked = (nodeId) => layerSelections[nodeId] !== false
  const dynamicIdSet = React.useMemo(() => new Set(previewLayers?.dynamicIds || []), [previewLayers])
  const isDynamicCandidate = (nodeId) => dynamicIdSet.has(nodeId)
  const isDynamicOn = (nodeId) => isDynamicCandidate(nodeId) && isLayerChecked(nodeId)
  const requiresMainProduct = Boolean((previewLayers?.images || []).some(layer => isDynamicOn(layer.id)))
  const isBackgroundMode = previewMode === 'background'

  return (
    <div className="figma-converter-panel">
      <div className="figma-converter-header">
        <div>
          <p className="figma-files-eyebrow">{mode === 'picker' ? 'Step 5' : 'Step 6'}</p>
          <h5>{mode === 'picker' ? 'Choose a frame to inspect' : 'Frame details'}</h5>
          <p className="figma-file-meta">
            File: {selectedFile.name} • Last modified: {selectedFile.lastModified} • Version: {selectedFile.version}
          </p>
          {selectedFrame && mode === 'details' && (
            <p className="figma-team-help">
              Frame: {selectedFrame.pageName ? `${selectedFrame.pageName} / ` : ''}{selectedFrame.name}
            </p>
          )}
        </div>
        <div className="figma-converter-status-pills">
          {conversionStatus && <span className="figma-chip">{conversionStatus}</span>}
          {(isConverting || isInspectingFile) && <div className="figma-inline-spinner" aria-hidden="true"></div>}
        </div>
      </div>

      <div className="figma-preview-toolbar">
        {mode === 'details' && (
          <fieldset className="figma-toggle" role="radiogroup" aria-label="Preview mode">
            <label className={`figma-toggle__option ${previewMode === 'dynamic' ? 'is-active' : ''}`}>
              <input
                type="radio"
                name="figma-preview-mode"
                value="dynamic"
                checked={previewMode === 'dynamic'}
                onChange={() => onPreviewModeChange('dynamic')}
              />
              <span>Dynamic</span>
            </label>
            <label className={`figma-toggle__option ${previewMode === 'background' ? 'is-active' : ''}`}>
              <input
                type="radio"
                name="figma-preview-mode"
                value="background"
                checked={previewMode === 'background'}
                onChange={() => onPreviewModeChange('background')}
              />
              <span>Background</span>
            </label>
          </fieldset>
        )}

        {!isBackgroundMode && (
          <label className="figma-switch">
            <input
              type="checkbox"
              checked={Boolean(showPreviewOverlays)}
              onChange={onTogglePreviewOverlays}
            />
            <span>Show layer overlays</span>
          </label>
        )}
      </div>

      <FigmaFramePreview
        title={mode === 'picker' ? 'Preview' : (isBackgroundMode ? 'Background preview' : 'Preview (no Cloudinary upload yet)')}
        frameName={selectedFrame ? `${selectedFrame.pageName ? `${selectedFrame.pageName} / ` : ''}${selectedFrame.name}` : ''}
        renderMode={isBackgroundMode ? 'background' : 'dynamic'}
        imageUrl={isBackgroundMode ? '' : (framePreview?.imageUrl || '')}
        isLoading={Boolean(isBackgroundMode ? backgroundPreview?.isLoading : framePreview?.isLoading)}
        showOverlays={Boolean(!isBackgroundMode && showPreviewOverlays)}
        backgroundPieces={isBackgroundMode ? (backgroundPreview?.pieces || []) : []}
        backgroundColor={backgroundPreview?.backgroundColor || 'transparent'}
        frameWidth={(isBackgroundMode ? backgroundPreview?.frameWidth : framePreview?.frameWidth) || 0}
        frameHeight={(isBackgroundMode ? backgroundPreview?.frameHeight : framePreview?.frameHeight) || 0}
        layers={framePreview?.overlayLayers || []}
        layerSelections={layerSelections}
        mainProductLayerId={mainProductLayerId}
        onToggleLayer={mode === 'details' && !isBackgroundMode && showPreviewOverlays ? (nodeId) => {
          if (!isDynamicCandidate(nodeId)) return
          onToggleLayerSelection(nodeId)
        } : null}
      />

      {mode === 'picker' && (
        <>
          <div className="figma-frame-filter">
            <input
              type="text"
              value={frameFilter}
              onChange={(event) => onFrameFilterChange(event.target.value)}
              placeholder="Filter frames by name or page"
              className="figma-team-input"
              disabled={isInspectingFile}
            />
            <span className="figma-frame-filter__meta">
              Showing {framesToRender.length} of {frameOptions.length} frames
            </span>
          </div>

          {isInspectingFile && (
            <div className="figma-converter-loading">
              <div className="figma-inline-spinner" aria-hidden="true"></div>
              <span>Fetching frames…</span>
            </div>
          )}

          <div className="figma-frame-picker">
            <div className="figma-frame-list">
              {framesToRender.map(frame => (
                <button
                  type="button"
                  key={frame.id}
                  className={`figma-frame-row ${selectedFrameId === frame.id ? 'active' : ''}`}
                  onClick={() => onFrameChange(frame.id)}
                  disabled={isInspectingFile}
                >
                  <p className="figma-frame-name">{frame.name}</p>
                  <p className="figma-frame-meta">{frame.pageName || 'Root page'}</p>
                </button>
              ))}
              {!framesToRender.length && !isInspectingFile && (
                <p className="figma-empty-state figma-empty-state--spacious">
                  {frameOptions.length
                    ? 'No frames match your filter.'
                    : 'We couldn’t find any frames flagged for export in this file.'}
                </p>
              )}
            </div>
          </div>

        </>
      )}

      {mode === 'details' && (
        <div className="figma-cloudinary-section">
          {cloudinaryComplete && !showCloudinaryForm && (
            <div className="figma-cloudinary-summary">
              <div>
                <p className="figma-files-eyebrow">Cloudinary target</p>
                <p className="figma-cloudinary-summary-name">{cloudinaryConfig.cloudName}</p>
                <p className="figma-cloudinary-summary-meta">
                  Preset: {cloudinaryConfig.uploadPreset}
                  {cloudinaryConfig.folder ? ` • Folder: ${cloudinaryConfig.folder}` : ''}
                </p>
              </div>
              <button type="button" className="figma-secondary-btn" onClick={onToggleCloudinaryExpanded}>
                Edit settings
              </button>
            </div>
          )}

          {showCloudinaryForm && (
            <div className="figma-frame-settings">
              <label className="figma-team-label" htmlFor="cloudinary-cloud-name">Cloudinary cloud name</label>
              <input
                id="cloudinary-cloud-name"
                className="figma-team-input"
                type="text"
                value={cloudinaryConfig.cloudName}
                onChange={(event) => onCloudinaryChange('cloudName', event.target.value)}
                placeholder="e.g. my-company"
              />
              <label className="figma-team-label" htmlFor="cloudinary-upload-preset">Unsigned upload preset</label>
              <input
                id="cloudinary-upload-preset"
                className="figma-team-input"
                type="text"
                value={cloudinaryConfig.uploadPreset}
                onChange={(event) => onCloudinaryChange('uploadPreset', event.target.value)}
                placeholder="Preset configured for unsigned uploads"
              />
              <label className="figma-team-label" htmlFor="cloudinary-folder">Folder (optional)</label>
              <input
                id="cloudinary-folder"
                className="figma-team-input"
                type="text"
                value={cloudinaryConfig.folder}
                onChange={(event) => onCloudinaryChange('folder', event.target.value)}
                placeholder="Defaults to figma-exports"
              />
              {cloudinaryComplete && (
                <div className="figma-cloudinary-actions">
                  <button type="button" className="figma-secondary-btn" onClick={onToggleCloudinaryExpanded}>
                    Collapse
                  </button>
                </div>
              )}
            </div>
          )}

          {!conversionResult && !isConverting && (
            <p className="figma-team-help">
              Configure your Cloudinary target, then use the footer action to import the selected frame.
            </p>
          )}
        </div>
      )}

      {mode === 'details' && (
        <div className="figma-template-field">
          <label className="figma-team-label" htmlFor="figma-template-name">Template name</label>
          <input
            id="figma-template-name"
            type="text"
            className="figma-team-input"
            value={templateName}
            onChange={(event) => onTemplateNameChange(event.target.value)}
            placeholder="e.g. campaign-hero"
          />
          <p className="figma-template-hint">
            Assets will be stored under <code>{templateFolderPreview}</code>
          </p>
        </div>
      )}

      {mode === 'details' && previewLayers && (
        <div className="figma-preflight-section">
          <div className="figma-preview-group">
            <div className="figma-preview-header">
              <p className="figma-files-eyebrow">
                {isBackgroundMode ? 'Background images' : 'Dynamic images'}
              </p>
              <span className="figma-preview-count">
                {isBackgroundMode
                  ? (previewLayers.images.filter(layer => !isDynamicOn(layer.id)).length || 'None')
                  : (previewLayers.images.filter(layer => isDynamicCandidate(layer.id)).length || 'None')}
              </span>
            </div>
            {previewLayers.images.length ? (
              <table className="figma-preview-table">
                <thead>
                  <tr>
                    {!isBackgroundMode && <th className="figma-preview-check-col">Dynamic</th>}
                    {!isBackgroundMode && <th className="figma-preview-main-col">Main product</th>}
                    <th>Layer</th>
                    <th>Variable</th>
                    <th>Dimensions</th>
                  </tr>
                </thead>
                <tbody>
                  {previewLayers.images
                    .filter(layer => (
                      isBackgroundMode
                        ? !isDynamicOn(layer.id)
                        : isDynamicCandidate(layer.id)
                    ))
                    .map(layer => (
                    <tr
                      key={layer.id}
                      className={`figma-preview-row ${!isBackgroundMode && !isDynamicOn(layer.id) ? 'is-disabled' : ''}`}
                    >
                      {!isBackgroundMode && (
                        <td className="figma-preview-check-col">
                          <label className="figma-layer-checkbox">
                            <input
                              type="checkbox"
                              checked={isDynamicOn(layer.id)}
                              onChange={() => onToggleLayerSelection(layer.id)}
                              disabled={isConverting || mainProductLayerId === layer.id}
                            />
                          </label>
                        </td>
                      )}
                      {!isBackgroundMode && (
                        <td className="figma-preview-main-col">
                          <label className={`figma-layer-radio ${!isDynamicOn(layer.id) ? 'disabled' : ''}`}>
                            <input
                              type="radio"
                              name="figma-main-product"
                              value={layer.id}
                              checked={mainProductLayerId === layer.id}
                              onChange={() => onSelectMainProduct(layer.id)}
                              disabled={!isDynamicOn(layer.id) || isConverting}
                            />
                          </label>
                        </td>
                      )}
                      <td>{layer.name}</td>
                      <td>{layer.variable ? `$${layer.variable}` : 'Static'}</td>
                      <td>{layer.width && layer.height ? `${layer.width}×${layer.height}` : 'Auto'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="figma-empty-state figma-empty-state--muted">
                No image layers found in this frame.
              </p>
            )}
            {!isBackgroundMode && requiresMainProduct && (
              <p className="figma-main-product-hint">
                Select the image that should respond to the asset switcher. The others will always use their uploaded assets.
              </p>
            )}
          </div>

          <div className="figma-preview-group">
            <div className="figma-preview-header">
              <p className="figma-files-eyebrow">
                {isBackgroundMode ? 'Background texts' : 'Dynamic texts'}
              </p>
              <span className="figma-preview-count">
                {isBackgroundMode
                  ? (previewLayers.texts.filter(layer => !isDynamicOn(layer.id)).length || 'None')
                  : (previewLayers.texts.filter(layer => isDynamicCandidate(layer.id)).length || 'None')}
              </span>
            </div>
            {previewLayers.texts.length ? (
              <table className="figma-preview-table">
                <thead>
                  <tr>
                    {!isBackgroundMode && <th className="figma-preview-check-col">Dynamic</th>}
                    <th>Layer</th>
                    <th>Variable</th>
                    <th>Content</th>
                  </tr>
                </thead>
                <tbody>
                  {previewLayers.texts
                    .filter(layer => (
                      isBackgroundMode
                        ? !isDynamicOn(layer.id)
                        : isDynamicCandidate(layer.id)
                    ))
                    .map(layer => (
                    <tr
                      key={layer.id}
                      className={`figma-preview-row ${!isBackgroundMode && !isDynamicOn(layer.id) ? 'is-disabled' : ''}`}
                    >
                      {!isBackgroundMode && (
                        <td className="figma-preview-check-col">
                          <label className="figma-layer-checkbox">
                            <input
                              type="checkbox"
                              checked={isDynamicOn(layer.id)}
                              onChange={() => onToggleLayerSelection(layer.id)}
                              disabled={isConverting}
                            />
                          </label>
                        </td>
                      )}
                      <td>{layer.name}</td>
                      <td>{layer.variable ? `$${layer.variable}` : 'Static'}</td>
                      <td>{layer.characters ? layer.characters.slice(0, 80) + (layer.characters.length > 80 ? '…' : '') : 'Variable placeholder'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="figma-empty-state figma-empty-state--muted">
                No text layers found in this frame.
              </p>
            )}
          </div>
        </div>
      )}

      {mode === 'details' && (
        <div className="figma-converter-output">
          <label className="figma-team-label" htmlFor="figma-transformation-output">Transformation preview</label>
          <textarea
            id="figma-transformation-output"
            className="figma-transformation-textarea"
            value={transformationValue}
            onChange={(event) => onTransformationChange(event.target.value)}
            placeholder="Generate or paste the Cloudinary transformation you plan to use."
          />
          <p className="figma-template-hint">
            This string is what the Playground will receive when you create the design. Adjust it if you need to tweak the resulting asset.
          </p>
          {conversionResult && (
            <p className="figma-team-help">
              Frame: {conversionResult.frameName} • File: {conversionResult.fileName}
            </p>
          )}
          <div className="figma-converter-output-actions">
            <button type="button" className="figma-secondary-btn" onClick={onCopyTransformation} disabled={!transformationValue.trim()}>
              Copy transformation
            </button>
            {onInspectAnotherFrame && (
              <button type="button" className="figma-secondary-btn" onClick={onInspectAnotherFrame}>
                Inspect another frame
              </button>
            )}
            {copySuccess && <span className="figma-copy-hint">{copySuccess}</span>}
          </div>
        </div>
      )}

      {mode === 'details' && conversionResult && (
        <div className="figma-converter-output">
          {!!conversionResult.layers?.length && (
            <div className="figma-layers-table">
              <p className="figma-files-eyebrow">Layers</p>
              <table>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Type</th>
                    <th>Summary</th>
                  </tr>
                </thead>
                <tbody>
                  {conversionResult.layers.map(layer => (
                    <tr key={layer.id}>
                      <td>{layer.name}</td>
                      <td>{layer.type}</td>
                      <td>
                        {layer.summary}
                        {uploadMap[layer.id]?.secureUrl && (
                          <>
                            {' '}
                            <a href={uploadMap[layer.id].secureUrl} target="_blank" rel="noreferrer">Preview</a>
                          </>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
