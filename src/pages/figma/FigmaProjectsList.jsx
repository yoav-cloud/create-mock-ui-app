import React from 'react'
import './FigmaImportModal.css'

export default function FigmaProjectsList({ projects = [], selectedProjectId, onSelect }) {
  if (!projects.length) {
    return <p className="figma-empty-state figma-empty-state--spacious">No projects found yet.</p>
  }

  return (
    <div className="figma-projects-list">
      <div className="figma-projects-list-head">
        <span>Project</span>
        <span>ID</span>
      </div>
      <ul className="figma-projects-rows">
        {projects.map((project, index) => {
          const rawId = project.id ?? project.project_id
          const key = rawId ? String(rawId) : `project-${index}`
          const description = project.description || project.team_id || ''
          const isSelectable = Boolean(rawId)
          const isActive = isSelectable && String(selectedProjectId) === String(rawId)

          return (
            <li key={key}>
              <button
                type="button"
                className={`figma-project-row ${isActive ? 'active' : ''} ${!isSelectable ? 'disabled' : ''}`}
                onClick={() => isSelectable && onSelect?.(rawId)}
                disabled={!isSelectable}
              >
                <div className="figma-project-row-main">
                  <p className="figma-project-name">{project.name || 'Untitled project'}</p>
                  <p className="figma-project-meta">{description || '—'}</p>
                </div>
                <span className="figma-project-row-id">{rawId || '—'}</span>
              </button>
            </li>
          )
        })}
      </ul>
    </div>
  )
}


