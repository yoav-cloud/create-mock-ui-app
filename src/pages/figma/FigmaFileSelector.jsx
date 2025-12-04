import React from 'react'
import FigmaProjectFiles from './FigmaProjectFiles'
import './FigmaImportModal.css'

export default function FigmaFileSelector({
  projectName,
  files = [],
  isLoading,
  onInspectFile,
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
      <FigmaProjectFiles
        projectName={projectName}
        files={files}
        isLoading={isLoading}
        onConvert={onInspectFile}
      />
    </div>
  )
}

