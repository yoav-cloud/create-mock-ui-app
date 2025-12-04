import React from 'react'
import './FigmaImportModal.css'

const formatDate = (value) => {
  if (!value) return 'Unknown date'
  try {
    return new Date(value).toLocaleString()
  } catch {
    return value
  }
}

export default function FigmaProjectFiles({
  projectName,
  files = [],
  isLoading,
  emptyState = 'Select a project to see its files.',
  onConvert
}) {
  if (!projectName) {
    return <p className="figma-empty-state">{emptyState}</p>
  }

  return (
    <div className="figma-files-panel">
      <div className="figma-files-panel-header">
        <div>
          <p className="figma-files-eyebrow">Project</p>
          <h5>{projectName}</h5>
        </div>
        {isLoading && <div className="figma-inline-spinner" aria-hidden="true"></div>}
      </div>

      {isLoading && !files.length && <p className="figma-loading">Loading files…</p>}

      {!isLoading && files.length === 0 && (
        <p className="figma-empty-state">This project has no files yet.</p>
      )}

      <div className="figma-files-grid">
        {files.map(file => (
          <article key={file.id} className="figma-file-card">
            <div className="figma-file-thumb">
              {file.thumbnailUrl ? (
                <img src={file.thumbnailUrl} alt={`${file.name} thumbnail`} />
              ) : (
                <div className="figma-file-thumb-fallback">
                  <span>{file.name?.[0]?.toUpperCase() || 'F'}</span>
                </div>
              )}
            </div>
            <div className="figma-file-card-body">
              <p className="figma-file-name">{file.name}</p>
              <p className="figma-file-meta">Last modified: {formatDate(file.lastModified)}</p>
              {onConvert && (
                <div className="figma-file-actions">
                  <button
                    type="button"
                    className="figma-secondary-btn"
                    onClick={() => onConvert?.(file)}
                  >
                    Inspect
                  </button>
                </div>
              )}
            </div>
          </article>
        ))}
      </div>
    </div>
  )
}

