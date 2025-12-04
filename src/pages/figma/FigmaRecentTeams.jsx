import React from 'react'
import './FigmaImportModal.css'

export default function FigmaRecentTeams({ teams = [], onSelect, label = 'Recent teams' }) {
  if (!teams.length) return null

  return (
    <div className="figma-recent-teams">
      <p className="figma-recent-label">{label}</p>
      <div className="figma-recent-chips">
        {teams.map(teamId => (
          <button
            type="button"
            key={teamId}
            className="figma-chip"
            onClick={() => onSelect?.(teamId)}
          >
            {teamId}
          </button>
        ))}
      </div>
    </div>
  )
}


