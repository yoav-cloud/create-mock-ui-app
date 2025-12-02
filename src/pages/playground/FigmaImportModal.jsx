import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import Modal from '../../components/Modal'
import './FigmaImportModal.css'
import FigmaRecentTeams from './FigmaRecentTeams'
import FigmaProjectsList from './FigmaProjectsList'
import FigmaProjectFiles from './FigmaProjectFiles'

const STEP = {
  START: 'start',
  TOKEN: 'token',
  TEAM: 'team',
  PROJECTS: 'projects'
}

const buildStateValue = () => {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return `figma-${crypto.randomUUID()}`
  }
  return `figma-${Math.random().toString(36).slice(2)}`
}

const isBrowser = typeof window !== 'undefined'

const STORAGE_KEYS = {
  accessToken: 'figma_access_token',
  expiresAt: 'figma_access_token_expires_at',
  refreshToken: 'figma_refresh_token',
  error: 'figma_oauth_error',
  state: 'figma_oauth_state'
}
const RECENT_TEAMS_KEY = 'figma_recent_team_ids'

export default function FigmaImportModal({ isOpen, onClose }) {
  const [step, setStep] = useState(STEP.START)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [profile, setProfile] = useState(null)
  const [accessToken, setAccessToken] = useState(() => {
    if (!isBrowser) return ''
    return localStorage.getItem(STORAGE_KEYS.accessToken) || ''
  })
  const [hasHydrated, setHasHydrated] = useState(false)
  const [teamIdInput, setTeamIdInput] = useState('')
  const [activeTeamId, setActiveTeamId] = useState('')
  const [teamProjects, setTeamProjects] = useState([])
  const [selectedProjectId, setSelectedProjectId] = useState(null)
  const [projectFiles, setProjectFiles] = useState({})
  const [projectLoadingId, setProjectLoadingId] = useState(null)
  const [recentTeamIds, setRecentTeamIds] = useState(() => {
    if (!isBrowser) return []
    try {
      const stored = localStorage.getItem(RECENT_TEAMS_KEY)
      if (!stored) return []
      const parsed = JSON.parse(stored)
      return Array.isArray(parsed) ? parsed : []
    } catch {
      return []
    }
  })
  const authWindowRef = useRef(null)

  const clientId = import.meta.env.VITE_FIGMA_CLIENT_ID
  const clientSecret = import.meta.env.VITE_FIGMA_CLIENT_SECRET
  const redirectUri = import.meta.env.VITE_FIGMA_REDIRECT_URI || 'http://localhost:9090/playground/figma-auth'
  const isConfigReady = Boolean(clientId && clientSecret && redirectUri)

  useEffect(() => {
    if (!isOpen) {
      setError('')
      setIsLoading(false)
      if (!accessToken) {
        resetState()
      }
    }
  }, [isOpen, accessToken])

  useEffect(() => {
    if (!isBrowser) return
    localStorage.setItem(RECENT_TEAMS_KEY, JSON.stringify(recentTeamIds))
  }, [recentTeamIds])

  const resetState = () => {
    setStep(STEP.START)
    setProfile(null)
    setTeamIdInput('')
    setActiveTeamId('')
    setTeamProjects([])
    setSelectedProjectId(null)
    setProjectFiles({})
    setProjectLoadingId(null)
  }

  const fetchFigmaProfile = useCallback(async (token) => {
    const response = await fetch('https://api.figma.com/v1/me', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })

    const payload = await response.json().catch(() => null)

    if (!response.ok) {
      const message = payload?.err?.message || payload?.message || 'Unable to authenticate with Figma.'
      throw new Error(message)
    }

    return payload
  }, [])

  const fetchTeamProjects = useCallback(async (token, teamIdValue) => {
    const response = await fetch(`https://api.figma.com/v1/teams/${teamIdValue}/projects`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })

    const payload = await response.json().catch(() => null)

    if (!response.ok) {
      const message = payload?.err?.message || payload?.message || 'Unable to fetch projects for that team.'
      throw new Error(message)
    }

    return Array.isArray(payload?.projects) ? payload.projects : []
  }, [])

  const fetchProjectFiles = useCallback(async (token, projectId) => {
    const response = await fetch(`https://api.figma.com/v1/projects/${projectId}/files`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })

    const payload = await response.json().catch(() => null)

    if (!response.ok) {
      const message = payload?.err?.message || payload?.message || 'Unable to fetch files for this project.'
      throw new Error(message)
    }

    const rawFiles = Array.isArray(payload?.files) ? payload.files : []
    return rawFiles.map(file => ({
      id: file.key || file.file_key || file.id || `${file.name}-${Math.random().toString(36).slice(2)}`,
      name: file.name || 'Untitled file',
      lastModified: file.last_modified || file.lastModified || 'Unknown',
      version: file.version || '—',
      thumbnailUrl: file.thumbnail_url || file.thumbnailUrl || null,
      role: file.role || null
    }))
  }, [])

  const persistRecentTeamId = useCallback((teamIdValue) => {
    if (!teamIdValue) return
    setRecentTeamIds(prev => {
      const filtered = prev.filter(id => id !== teamIdValue)
      return [teamIdValue, ...filtered].slice(0, 5)
    })
  }, [])

  const loadProjectsForTeam = useCallback(async (teamIdValue) => {
    if (!accessToken) {
      setError('Missing Figma access token. Please connect again.')
      return
    }
    const normalizedId = teamIdValue?.trim()
    if (!normalizedId) {
      setError('Enter a valid team ID to continue.')
      return
    }

    setIsLoading(true)
    setError('')
    try {
      const projects = await fetchTeamProjects(accessToken, normalizedId)
      setTeamProjects(projects)
      setActiveTeamId(normalizedId)
      setSelectedProjectId(null)
      setProjectFiles({})
      if (!projects.length) {
        setError('No projects were found for that team yet.')
      }
      persistRecentTeamId(normalizedId)
      setStep(STEP.PROJECTS)
    } catch (err) {
      setError(err.message || 'Unable to load projects for that team.')
    } finally {
      setIsLoading(false)
    }
  }, [accessToken, fetchTeamProjects, persistRecentTeamId])

  const hydrateProfile = useCallback(async (token) => {
    setIsLoading(true)
    try {
      const profileResponse = await fetchFigmaProfile(token)
      setProfile({
        id: profileResponse.id,
        email: profileResponse.email,
        handle: profileResponse.handle,
        imageUrl: profileResponse.img_url
      })
      setStep(STEP.TEAM)
      setHasHydrated(true)
    } finally {
      setIsLoading(false)
    }
  }, [fetchFigmaProfile])

  const closeAuthWindow = useCallback(() => {
    if (authWindowRef.current && !authWindowRef.current.closed) {
      authWindowRef.current.close()
    }
    authWindowRef.current = null
  }, [])

  const handleStorageEvent = useCallback((event) => {
    if (event.key === STORAGE_KEYS.accessToken) {
      const token = event.newValue
      if (token) {
        setAccessToken(token)
        setError('')
        setStep(STEP.TOKEN)
        hydrateProfile(token).catch(err => {
          setError(err.message || 'Failed to load data from Figma.')
        })
        closeAuthWindow()
      }
    }

    if (event.key === STORAGE_KEYS.error && event.newValue) {
      setError(event.newValue)
      closeAuthWindow()
      localStorage.removeItem(STORAGE_KEYS.error)
    }
  }, [closeAuthWindow, hydrateProfile])

  useEffect(() => {
    if (!isBrowser) return
    window.addEventListener('storage', handleStorageEvent)
    return () => window.removeEventListener('storage', handleStorageEvent)
  }, [handleStorageEvent])

  useEffect(() => {
    if (!accessToken || hasHydrated) return
    setStep(STEP.TOKEN)
    hydrateProfile(accessToken).catch(err => {
      setError(err.message || 'Failed to load data from Figma.')
    })
  }, [accessToken, hasHydrated, hydrateProfile])

  useEffect(() => {
    return () => {
      closeAuthWindow()
    }
  }, [closeAuthWindow])

  const beginOAuthFlow = () => {
    if (!isBrowser) return
    if (!isConfigReady) {
      setError('Figma OAuth credentials are missing. Add them to your env file to continue.')
      return
    }

    localStorage.removeItem(STORAGE_KEYS.error)

    const stateValue = buildStateValue()
    localStorage.setItem(STORAGE_KEYS.state, stateValue)

    const popupUrl = new URL('/playground/figma-auth', window.location.origin)
    popupUrl.searchParams.set('state', stateValue)

    const popupFeatures = 'width=520,height=720,menubar=no,toolbar=no,status=no'
    authWindowRef.current = window.open(popupUrl.toString(), 'figmaOauthWindow', popupFeatures)
    if (!authWindowRef.current) {
      setError('Unable to open Figma authentication window. Please allow pop-ups for this site.')
      return
    }

    authWindowRef.current.focus()
    setStep(STEP.TOKEN)
    setIsLoading(true)
  }

  const stepTitle = useMemo(() => {
    if (step === STEP.START) return 'Connect your Figma account'
    if (step === STEP.TOKEN) return 'Finishing the connection'
    if (step === STEP.TEAM) return 'Pick which team to explore'
    return 'Browse projects and files'
  }, [step])
  const handleTeamSubmit = async (event) => {
    event.preventDefault()
    await loadProjectsForTeam(teamIdInput)
  }

  const handleSelectRecentTeam = async (teamId) => {
    setTeamIdInput(teamId)
    await loadProjectsForTeam(teamId)
  }

  const handleRefreshProjects = async () => {
    if (!activeTeamId) {
      setError('Enter a team ID first.')
      return
    }
    if (!accessToken) {
      setError('Missing Figma access token. Please connect again.')
      return
    }
    setIsLoading(true)
    setError('')
    try {
      const projects = await fetchTeamProjects(accessToken, activeTeamId)
      setTeamProjects(projects)
      if (!projects.some(project => String(project.id) === String(selectedProjectId))) {
        setSelectedProjectId(null)
      }
      setProjectFiles(prev => {
        const next = { ...prev }
        Object.keys(next).forEach(projectId => {
          if (!projects.some(project => String(project.id) === String(projectId))) {
            delete next[projectId]
          }
        })
        return next
      })
      if (!projects.length) {
        setError('No projects were found for that team yet.')
      }
      persistRecentTeamId(activeTeamId)
    } catch (err) {
      setError(err.message || 'Unable to refresh team projects.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleProjectSelect = async (projectId) => {
    const normalizedId = String(projectId)
    setSelectedProjectId(normalizedId)
    if (projectFiles[normalizedId]) {
      return
    }
    if (!accessToken) {
      setError('Missing Figma access token. Please connect again.')
      return
    }
    setProjectLoadingId(normalizedId)
    setError('')
    try {
      const files = await fetchProjectFiles(accessToken, projectId)
      setProjectFiles(prev => ({
        ...prev,
        [normalizedId]: files
      }))
    } catch (err) {
      setError(err.message || 'Unable to load files for this project.')
    } finally {
      setProjectLoadingId(null)
    }
  }


  const selectedProject = useMemo(() => {
    if (!selectedProjectId) return null
    return teamProjects.find(project => String(project.id) === String(selectedProjectId)) || null
  }, [teamProjects, selectedProjectId])

  const selectedProjectFiles = selectedProjectId ? projectFiles[selectedProjectId] : []
  const isCurrentProjectLoading = projectLoadingId === selectedProjectId

  const profileInitials = useMemo(() => {
    if (!profile) return ''
    if (profile.handle) {
      return profile.handle
        .split(' ')
        .filter(Boolean)
        .slice(0, 2)
        .map(part => part[0]?.toUpperCase() || '')
        .join('')
    }
    return profile.email?.[0]?.toUpperCase() || ''
  }, [profile])

  const shouldUseWideModal = Boolean(profile)

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Create new design"
      size={shouldUseWideModal ? 'wide' : 'default'}
      contentClassName="figma-modal-shell"
    >
      <div className="figma-import-body">
        <div className="figma-import-header">
          {profile && (
            <div className="figma-profile">
              <div className="figma-profile-avatar">
                {profile.imageUrl ? (
                  <img src={profile.imageUrl} alt={`${profile.handle} avatar`} />
                ) : (
                  <span>{profileInitials}</span>
                )}
              </div>
              <div className="figma-profile-meta">
                <p className="figma-profile-handle">{profile.handle}</p>
                <p className="figma-profile-email">{profile.email}</p>
              </div>
            </div>
          )}
          {profile && <div className="figma-profile-divider" aria-hidden="true"></div>}
          <p className="figma-import-subtitle">{stepTitle}</p>
        </div>

        {step === STEP.START && (
          <>
            <p className="figma-start-description">
              We’ll open the Figma OAuth window so you can grant access. Once you approve, we&apos;ll automatically list the files linked
              to your account.
            </p>
            <button type="button" className="figma-start-btn" onClick={beginOAuthFlow} disabled={!isConfigReady}>
              <div>
                <span className="figma-start-eyebrow">Import option</span>
                <h4>Start from Figma</h4>
                <p>Connect via OAuth to pull designs directly from your workspace.</p>
              </div>
              <span aria-hidden="true">→</span>
            </button>
            {!isConfigReady && (
              <p className="figma-error">
                Figma OAuth isn&apos;t configured yet. Add <code>VITE_FIGMA_CLIENT_ID</code>, <code>VITE_FIGMA_CLIENT_SECRET</code> and{' '}
                <code>VITE_FIGMA_REDIRECT_URI</code> to your local env file.
              </p>
            )}
          </>
        )}

        {step === STEP.TOKEN && (
          <div className="figma-connecting-card">
            <p className="figma-connecting-title">Completing sign-in…</p>
            <p className="figma-connecting-help">
              Finish the OAuth prompt in the new tab if it&apos;s still open. We&apos;ll fetch your files as soon as Figma redirects back.
            </p>
            {isLoading && <div className="figma-inline-spinner" aria-hidden="true"></div>}
            {!isLoading && <p className="figma-connecting-hint">If the window closed already, hang tight while we finalize the connection.</p>}
          </div>
        )}

        {step === STEP.TEAM && (
          <form className="figma-team-form" onSubmit={handleTeamSubmit}>
            <label htmlFor="figma-team-id" className="figma-team-label">
              Team ID
            </label>
            <input
              id="figma-team-id"
              className="figma-team-input"
              type="text"
              placeholder="Enter your team ID"
              value={teamIdInput}
              onChange={(event) => setTeamIdInput(event.target.value)}
            />
            <p className="figma-team-help">
              You can copy the team ID from a Figma team URL like <code>https://www.figma.com/files/team/&lt;team_id&gt;</code>.
            </p>
            <div className="figma-actions">
              <button type="submit" className="figma-primary-btn" disabled={isLoading}>
                {isLoading ? 'Loading…' : 'Load projects'}
              </button>
            </div>
            <FigmaRecentTeams teams={recentTeamIds} onSelect={handleSelectRecentTeam} />
          </form>
        )}

        {step === STEP.PROJECTS && (
          <div className="figma-projects-section">
            <div className="figma-designs-header">
              <div>
                <p className="figma-start-eyebrow">Connected team</p>
                <h4>{activeTeamId}</h4>
              </div>
              <div className="figma-designs-actions">
                <button
                  type="button"
                  className="figma-secondary-btn"
                  onClick={() => {
                    setStep(STEP.TEAM)
                    setSelectedProjectId(null)
                    setTeamIdInput(activeTeamId || '')
                  }}
                >
                  Change team
                </button>
                <button type="button" className="figma-secondary-btn" onClick={handleRefreshProjects} disabled={isLoading}>
                  {isLoading ? 'Refreshing…' : 'Refresh projects'}
                </button>
              </div>
            </div>
            <FigmaRecentTeams
              teams={recentTeamIds.filter(id => id !== activeTeamId)}
              onSelect={handleSelectRecentTeam}
              label="Switch quickly"
            />
            <div className="figma-projects-shell">
              <div className="figma-projects-column">
                <FigmaProjectsList
                  projects={teamProjects}
                  selectedProjectId={selectedProjectId}
                  onSelect={handleProjectSelect}
                />
              </div>
              <div className="figma-projects-column figma-projects-column--files">
                <FigmaProjectFiles
                  projectName={selectedProject?.name}
                  files={selectedProjectFiles || []}
                  isLoading={isCurrentProjectLoading}
                />
              </div>
            </div>
          </div>
        )}

        {error && step !== STEP.PROJECTS && <p className="figma-error">{error}</p>}
      </div>
    </Modal>
  )
}

