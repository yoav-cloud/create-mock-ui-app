import React from 'react'
import FigmaProjectFiles from './FigmaProjectFiles'
import './FigmaImportModal.css'

export default function FigmaFileSelector({
  projectName,
  files = [],
  isLoading,
  onInspectFile,
  fileUrlInput = '',
  onFileUrlChange = () => {},
  onOpenFromUrl = null,
  isResolvingUrl = false,
  onBack
}) {
  return (
    <div className="figma-step-panel">
      <div className="figma-step-header">
        <div>
          <p className="figma-files-eyebrow">Step 4</p>
          <h4>Select a file</h4>
          <p className="figma-step-description">
            Pick a file from this project to inspect. We&apos;ll fetch its frames in the next step.
          </p>
        </div>
        {onBack && (
          <button type="button" className="figma-secondary-btn" onClick={onBack}>
            Back to projects
          </button>
        )}
      </div>

      {onOpenFromUrl && (
        <div className="figma-url-shortcut">
          <p className="figma-files-eyebrow">Shortcut</p>
          <label htmlFor="figma-file-url" className="figma-team-label">
            Paste a Figma file URL (with node-id)
          </label>
          <input
            id="figma-file-url"
            className="figma-team-input"
            type="text"
            value={fileUrlInput}
            onChange={(event) => onFileUrlChange(event.target.value)}
            placeholder="https://www.figma.com/design/<fileKey>/<name>?node-id=838-1447"
            disabled={isResolvingUrl}
          />
          <p className="figma-team-help">
            We&apos;ll validate the file and jump straight to the import step.
          </p>
          <div className="figma-actions">
            <button
              type="button"
              className="figma-primary-btn"
              onClick={() => onOpenFromUrl(fileUrlInput)}
              disabled={isResolvingUrl || !fileUrlInput.trim()}
            >
              {isResolvingUrl && <div className="figma-inline-spinner on-dark" aria-hidden="true" />}
              {isResolvingUrl ? 'Opening…' : 'Open from URL'}
            </button>
          </div>
        </div>
      )}

      <FigmaProjectFiles
        projectName={projectName}
        files={files}
        isLoading={isLoading}
        onConvert={onInspectFile}
      />
    </div>
  )
}

