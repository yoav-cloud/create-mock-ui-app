import React from 'react'
import FigmaProjectsList from './FigmaProjectsList'
import './FigmaImportModal.css'

export default function FigmaProjectSelector({
  projects = [],
  selectedProjectId,
  onSelectProject,
  onBack
}) {
  return (
    <div className="figma-step-panel">
      <div className="figma-step-header">
        <div>
          <p className="figma-files-eyebrow">Step 3</p>
          <h4>Select a project</h4>
          <p className="figma-step-description">
            Choose which Figma project you want to inspect. You can always go back and pick a different team.
          </p>
        </div>
        {onBack && (
          <button type="button" className="figma-secondary-btn" onClick={onBack}>
            Change team
          </button>
        )}
      </div>
      <FigmaProjectsList
        projects={projects}
        selectedProjectId={selectedProjectId}
        onSelect={onSelectProject}
      />
    </div>
  )
}

