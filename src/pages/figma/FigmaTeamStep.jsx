import React from 'react'
import FigmaRecentTeams from './FigmaRecentTeams'
import './FigmaImportModal.css'

export default function FigmaTeamStep({
  teamIdInput,
  onTeamIdChange,
  onSubmit,
  isLoading,
  recentTeams,
  onSelectRecent
}) {
  return (
    <form className="figma-team-form" onSubmit={onSubmit}>
      <label htmlFor="figma-team-id" className="figma-team-label">
        Team ID
      </label>
      <input
        id="figma-team-id"
        className="figma-team-input"
        type="text"
        placeholder="Enter a team ID or paste a team URL"
        value={teamIdInput}
        onChange={onTeamIdChange}
      />
      <p className="figma-team-help">
        You can paste a URL like <code>https://www.figma.com/files/team/&lt;team_id&gt;</code> and we&apos;ll extract the ID.
      </p>
      <div className="figma-actions">
        <button type="submit" className="figma-primary-btn" disabled={isLoading}>
          {isLoading && <div className="figma-inline-spinner on-dark" aria-hidden="true" />}
          {isLoading ? 'Loading projects…' : 'Load projects'}
        </button>
      </div>
      <FigmaRecentTeams teams={recentTeams} onSelect={onSelectRecent} />
    </form>
  )
}

