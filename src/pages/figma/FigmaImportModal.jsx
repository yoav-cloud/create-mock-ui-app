import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import Modal from '../../components/Modal'
import './FigmaImportModal.css'
import FigmaTeamStep from './FigmaTeamStep'
import FigmaProjectSelector from './FigmaProjectSelector'
import FigmaFileSelector from './FigmaFileSelector'
import FigmaConverterPanel from './FigmaConverterPanel'
import FigmaWizardSteps from './FigmaWizardSteps'
import { fetchFigmaProfile, fetchTeamProjects, fetchProjectFiles, fetchFigmaFileDetails, fetchFigmaFileDetailsForNodes, fetchFigmaImagesForNodes } from './figmaApi'
import { uploadImageBlob, uploadImageFromUrl } from './cloudinaryUploads'
import { collectFramesFromDocument, extractTemplatedNodes, collectRenderableNodesForFrame, findNodeById, findNodePathById, buildTransformationForFrame, buildLayerPreviewForFrame, buildDesignRulesFromNodes, buildDesignRulesWithChildren, colorToHex } from './figmaConversionUtils'
import { parseFigmaFileNodeUrl } from './figmaUrlUtils'
import { composeBackgroundPngBlob, resizeImageBlobMaxDimension } from './imageBlobUtils'

const STEP = {
  CONNECT: 'connect',
  TOKEN: 'token',
  TEAM: 'team',
  PROJECT: 'project',
  FILE: 'file',
  FRAMES: 'frames',
  DETAILS: 'details'
}

const WIZARD_STEPS = [
  { key: STEP.CONNECT, label: 'Connect' },
  { key: STEP.TEAM, label: 'Team' },
  { key: STEP.PROJECT, label: 'Project' },
  { key: STEP.FILE, label: 'File' },
  { key: STEP.FRAMES, label: 'Frames' },
  { key: STEP.DETAILS, label: 'Import' }
]

const sanitizeFolderSegment = (value = '') => {
  return value
    .trim()
    .replace(/\s+/g, '_')
    .replace(/[^a-zA-Z0-9_-]/g, '_')
    .replace(/_+/g, '_')
    .replace(/-+/g, '-')
    .replace(/^[_-]+|[_-]+$/g, '')
}

const sanitizePublicIdSegment = (value = '') => {
  return String(value || '')
    .trim()
    .replace(/\s+/g, '_')
    .replace(/[^a-zA-Z0-9_-]/g, '_')
    .replace(/_+/g, '_')
    .replace(/-+/g, '-')
    .replace(/^[_-]+|[_-]+$/g, '')
}

const buildFolderPath = (baseFolder = '', templateSlug = '') => {
  const base = (baseFolder || '').trim().replace(/\/+$/g, '')
  if (!templateSlug) return base
  return base ? `${base}/${templateSlug}` : templateSlug
}

const formatTemplateNameFromFrame = (frameName = '') => {
  const trimmed = frameName.trim().replace(/\s+/g, '_')
  return trimmed || 'template'
}

const buildStateValue = () => {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return `figma-${crypto.randomUUID()}`
  }
  return `figma-${Math.random().toString(36).slice(2)}`
}

const extractTeamIdFromInput = (value = '') => {
  const raw = String(value || '').trim()
  if (!raw) return ''

  try {
    const url = new URL(raw)
    const path = url.pathname || ''
    const match = path.match(/\/(?:files\/team|team)\/([^/]+)/i)
    if (match?.[1]) return match[1]
  } catch {
    // Not a URL; fall through to regex parsing.
  }

  const fallbackMatch = raw.match(/(?:files\/team|team)\/([^/?#\s]+)/i)
  if (fallbackMatch?.[1]) return fallbackMatch[1]

  return raw
}

const isBrowser = typeof window !== 'undefined'

const STORAGE_KEYS = {
  accessToken: 'figma_access_token',
  expiresAt: 'figma_access_token_expires_at',
  refreshToken: 'figma_refresh_token',
  error: 'figma_oauth_error',
  state: 'figma_oauth_state',
  cloudinary: 'figma_cloudinary_preferences'
}
const RECENT_TEAMS_KEY = 'figma_recent_team_ids'

export default function FigmaImportModal({ isOpen, onClose, onTemplateImported = () => {} }) {
  const [step, setStep] = useState(STEP.CONNECT)
  const [isLoading, setIsLoading] = useState(false)
  const [isStepTransitioning, setIsStepTransitioning] = useState(false)
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
  const [selectedFile, setSelectedFile] = useState(null)
  const [fileDocument, setFileDocument] = useState(null)
  const [frameOptions, setFrameOptions] = useState([])
  const [selectedFrameId, setSelectedFrameId] = useState('')
  const [frameFilter, setFrameFilter] = useState('')
  const [isConverting, setIsConverting] = useState(false)
  const [isImporting, setIsImporting] = useState(false)
  const [isInspectingFile, setIsInspectingFile] = useState(false)
  const [conversionStatus, setConversionStatus] = useState('')
  const [conversionResult, setConversionResult] = useState(null)
  const [copySuccess, setCopySuccess] = useState('')
  const [conversionUploads, setConversionUploads] = useState([])
  const [previewLayers, setPreviewLayers] = useState(null)
  const [framePreview, setFramePreview] = useState(null)
  const [preflightFrameId, setPreflightFrameId] = useState('')
  const [fileUrlInput, setFileUrlInput] = useState('')
  const [isResolvingFileUrl, setIsResolvingFileUrl] = useState(false)
  const [showPreviewOverlays, setShowPreviewOverlays] = useState(false)
  const [previewMode, setPreviewMode] = useState('dynamic')
  const [backgroundPreview, setBackgroundPreview] = useState(null)
  const [templateName, setTemplateName] = useState('')
  const [templateTouched, setTemplateTouched] = useState(false)
  const [layerSelections, setLayerSelections] = useState({})
  const [mainProductLayerId, setMainProductLayerId] = useState('')
  const [transformationOverride, setTransformationOverride] = useState('')
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false)
  const [cloudinaryConfig, setCloudinaryConfig] = useState(() => {
    if (!isBrowser) {
      return { cloudName: '', uploadPreset: '', folder: 'figma-exports' }
    }
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.cloudinary)
      if (!stored) return { cloudName: '', uploadPreset: '', folder: 'figma-exports' }
      const parsed = JSON.parse(stored)
      return {
        cloudName: parsed?.cloudName || '',
        uploadPreset: parsed?.uploadPreset || '',
        folder: parsed?.folder || 'figma-exports'
      }
    } catch {
      return { cloudName: '', uploadPreset: '', folder: 'figma-exports' }
    }
  })
  const [cloudinaryExpanded, setCloudinaryExpanded] = useState(() => {
    const hasConfig = Boolean(
      cloudinaryConfig.cloudName &&
      cloudinaryConfig.uploadPreset
    )
    return !hasConfig
  })
  const authWindowRef = useRef(null)
  const profileMenuRef = useRef(null)

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
    setHasHydrated(false)
    setIsProfileMenuOpen(false)
    }
  }, [isOpen, accessToken])

  useEffect(() => {
    setError('')
  }, [step])

  useEffect(() => {
    if (!isBrowser) return
    localStorage.setItem(RECENT_TEAMS_KEY, JSON.stringify(recentTeamIds))
  }, [recentTeamIds])

  useEffect(() => {
    if (!isBrowser) return
    localStorage.setItem(STORAGE_KEYS.cloudinary, JSON.stringify(cloudinaryConfig))
  }, [cloudinaryConfig])

  useEffect(() => {
    if (!cloudinaryConfig.cloudName || !cloudinaryConfig.uploadPreset) {
      setCloudinaryExpanded(true)
    }
  }, [cloudinaryConfig.cloudName, cloudinaryConfig.uploadPreset])

useEffect(() => {
  if (!isProfileMenuOpen) return

  const handleClick = (event) => {
    if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
      setIsProfileMenuOpen(false)
    }
  }

  const handleKey = (event) => {
    if (event.key === 'Escape') {
      setIsProfileMenuOpen(false)
    }
  }

  document.addEventListener('mousedown', handleClick)
  document.addEventListener('keydown', handleKey)
  return () => {
    document.removeEventListener('mousedown', handleClick)
    document.removeEventListener('keydown', handleKey)
  }
}, [isProfileMenuOpen])

useEffect(() => {
  if (!profile) {
    setIsProfileMenuOpen(false)
  }
}, [profile])

  const resetState = () => {
    setStep(STEP.CONNECT)
    setProfile(null)
    setTeamIdInput('')
    setActiveTeamId('')
    setTeamProjects([])
    setSelectedProjectId(null)
    setProjectFiles({})
    setProjectLoadingId(null)
    setSelectedFile(null)
    setFileDocument(null)
    setFrameOptions([])
    setSelectedFrameId('')
    setFrameFilter('')
    setConversionResult(null)
    setConversionUploads([])
    setConversionStatus('')
    setCopySuccess('')
    setIsInspectingFile(false)
    setIsStepTransitioning(false)
    setIsImporting(false)
    setPreviewLayers(null)
    setFramePreview(null)
    setPreflightFrameId('')
    setFileUrlInput('')
    setIsResolvingFileUrl(false)
    setShowPreviewOverlays(false)
    setPreviewMode('dynamic')
    setBackgroundPreview(null)
    setTemplateName('')
    setTemplateTouched(false)
    setLayerSelections({})
    setMainProductLayerId('')
    setTransformationOverride('')
    setCloudinaryExpanded(!(cloudinaryConfig.cloudName && cloudinaryConfig.uploadPreset))
  }


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
    const normalizedId = extractTeamIdFromInput(teamIdValue)
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
      setTeamIdInput(normalizedId)
      setSelectedProjectId(null)
      setProjectFiles({})
      if (!projects.length) {
        setError('No projects were found for that team yet.')
      }
      persistRecentTeamId(normalizedId)
      setStep(STEP.PROJECT)
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
  if (!isOpen || !accessToken || hasHydrated) return
  setStep(STEP.TOKEN)
  hydrateProfile(accessToken).catch(err => {
    setError(err.message || 'Failed to load data from Figma.')
  })
}, [accessToken, hasHydrated, hydrateProfile, isOpen])

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

    const pollInterval = setInterval(() => {
      if (authWindowRef.current && authWindowRef.current.closed) {
        clearInterval(pollInterval)
        
        const token = localStorage.getItem(STORAGE_KEYS.accessToken)
        const error = localStorage.getItem(STORAGE_KEYS.error)
        
        if (token) {
          setAccessToken(token)
          setError('')
          setStep(STEP.TOKEN)
          hydrateProfile(token).catch(err => {
            setError(err.message || 'Failed to load data from Figma.')
            setIsLoading(false)
          })
        } else if (error) {
          setError(error)
          localStorage.removeItem(STORAGE_KEYS.error)
          setIsLoading(false)
          setStep(STEP.CONNECT)
        } else {
          setError('Authentication window closed without completing the flow.')
          setIsLoading(false)
          setStep(STEP.CONNECT)
        }
        
        authWindowRef.current = null
      }
    }, 500)

    setTimeout(() => {
      clearInterval(pollInterval)
      if (authWindowRef.current && !authWindowRef.current.closed) {
        authWindowRef.current.close()
      }
      if (isLoading && step === STEP.TOKEN && !accessToken) {
        setError('Authentication timed out. Please try again.')
        setIsLoading(false)
        setStep(STEP.CONNECT)
      }
    }, 60000)
  }


  const stepTitle = useMemo(() => {
    if (step === STEP.CONNECT) return 'Connect your Figma account'
    if (step === STEP.TOKEN) return 'Finishing the connection'
    if (step === STEP.TEAM) return 'Pick which team to explore'
    if (step === STEP.PROJECT) return 'Choose a project'
    if (step === STEP.FILE) return 'Choose a file'
    if (step === STEP.FRAMES) return 'Inspect a frame'
    if (step === STEP.DETAILS) return 'Frame details'
    return 'Figma workflow'
  }, [step])
  const progressStep = step === STEP.TOKEN ? STEP.CONNECT : step
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
    setSelectedFile(null)
    setTemplateName('')
    setTemplateTouched(false)
    setFrameOptions([])
    setSelectedFrameId('')
    setFrameFilter('')
    setConversionResult(null)
    setConversionUploads([])
    setConversionStatus('')
    setPreviewLayers(null)
    setFramePreview(null)
    setPreflightFrameId('')
    setFileUrlInput('')
    setIsResolvingFileUrl(false)
    setLayerSelections({})
    setMainProductLayerId('')
    setTransformationOverride('')
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
      setStep(STEP.FILE)
    } catch (err) {
      setError(err.message || 'Unable to load files for this project.')
    } finally {
      setProjectLoadingId(null)
    }
  }

  const handleChangeTeam = useCallback(() => {
    setStep(STEP.TEAM)
    setSelectedProjectId(null)
    setTeamIdInput(activeTeamId || '')
    setSelectedFile(null)
    setTemplateName('')
    setTemplateTouched(false)
    setFrameOptions([])
    setSelectedFrameId('')
    setFrameFilter('')
    setConversionResult(null)
    setConversionUploads([])
    setConversionStatus('')
    setPreviewLayers(null)
    setFramePreview(null)
    setPreflightFrameId('')
    setFileUrlInput('')
    setIsResolvingFileUrl(false)
    setLayerSelections({})
    setMainProductLayerId('')
    setTransformationOverride('')
  }, [activeTeamId])

  const handleBackToProjects = useCallback(() => {
    setStep(STEP.PROJECT)
    setPreviewLayers(null)
    setFramePreview(null)
    setPreflightFrameId('')
    setFileUrlInput('')
    setIsResolvingFileUrl(false)
    setTemplateName('')
    setTemplateTouched(false)
    setLayerSelections({})
    setMainProductLayerId('')
    setTransformationOverride('')
  }, [])

  const handleInspectFile = useCallback(async (file) => {
    if (!file) return
    if (!accessToken) {
      setError('Missing Figma access token. Please connect again.')
      return
    }
    setError('')
    setFrameOptions([])
    setSelectedFrameId('')
    setConversionResult(null)
    setConversionUploads([])
    setConversionStatus('Loading frames…')
    setPreviewLayers(null)
    setFramePreview(null)
    setPreflightFrameId('')
    setLayerSelections({})
    setMainProductLayerId('')
    setTemplateTouched(false)
    setTransformationOverride('')
    setFileUrlInput('')
    setSelectedFile({
      id: file.id,
      key: file.key || file.id,
      name: file.name,
      lastModified: file.lastModified,
      version: file.version
    })
    setIsInspectingFile(true)
    setStep(STEP.FRAMES)
    try {
      const fileDetails = await fetchFigmaFileDetails(accessToken, file.key || file.id)
      if (import.meta.env.DEV) {
        // eslint-disable-next-line no-console
        console.log('[Figma] Selected file details', {
          fileKey: file.key || file.id,
          name: file.name,
          lastModified: file.lastModified,
          version: file.version,
          pages: fileDetails?.document?.children?.map(page => ({
            id: page.id,
            name: page.name,
            type: page.type,
            children: page.children?.length || 0
          }))
        })
      }
      const frames = collectFramesFromDocument(fileDetails.document)
      setFileDocument(fileDetails.document)
      setFrameOptions(frames)
      setSelectedFrameId(frames[0]?.id || '')
      if (!templateTouched && frames[0]) {
        setTemplateName(formatTemplateNameFromFrame(frames[0].name))
      }
      if (!frames.length) {
        setError('No frames were found in this file yet.')
        setConversionStatus('No frames available in this file.')
      } else {
        setConversionStatus(`Found ${frames.length} frame${frames.length === 1 ? '' : 's'}.`)
      }
    } catch (err) {
      setError(err.message || 'Unable to load file details.')
      setSelectedFile(null)
      setFrameOptions([])
      setSelectedFrameId('')
      setTemplateName('')
      setTemplateTouched(false)
      setLayerSelections({})
      setMainProductLayerId('')
    } finally {
      setIsInspectingFile(false)
    }
  }, [accessToken, fetchFigmaFileDetails, templateTouched])

  const handleOpenFromFileUrl = useCallback(async (rawUrl) => {
    if (!accessToken) {
      setError('Missing Figma access token. Please connect again.')
      return
    }

    const { fileKey, nodeId } = parseFigmaFileNodeUrl(rawUrl)
    if (!fileKey || !nodeId) {
      setError('Paste a Figma URL that includes both a file key and a node-id.')
      return
    }

    setIsResolvingFileUrl(true)
    setError('')
    setConversionResult(null)
    setConversionUploads([])
    setConversionStatus('Validating URL…')
    setPreviewLayers(null)
    setFramePreview(null)
    setPreflightFrameId('')
    setLayerSelections({})
    setMainProductLayerId('')
    setTransformationOverride('')

    try {
      const initialDetails = await fetchFigmaFileDetailsForNodes(accessToken, fileKey, [nodeId])
      const initialRoot = initialDetails?.document?.document || initialDetails?.document
      if (!initialRoot) {
        setError('Unable to read the document for that file.')
        return
      }

      const targetPath = findNodePathById(initialRoot, nodeId, [])
      if (!targetPath?.length) {
        setError('That node-id was not found in the file.')
        return
      }
      const frameNode = [...targetPath].reverse().find(node => node?.type === 'FRAME')
      if (!frameNode?.id) {
        setError('That node is not inside a frame. Pick a frame node-id and try again.')
        return
      }
      const pageNode = [...targetPath].reverse().find(node => node?.type === 'CANVAS')

      const frameDetails = frameNode.id === nodeId
        ? initialDetails
        : await fetchFigmaFileDetailsForNodes(accessToken, fileKey, [frameNode.id])

      setSelectedFile({
        id: fileKey,
        key: fileKey,
        name: frameDetails?.name || 'Figma file',
        lastModified: '—',
        version: '—'
      })
      setFileDocument(frameDetails.document)

      setFrameOptions([{
        id: frameNode.id,
        name: frameNode.name,
        pageName: pageNode?.name || '',
        node: frameNode
      }])
      setSelectedFrameId(frameNode.id)
      if (!templateTouched) {
        setTemplateName(formatTemplateNameFromFrame(frameNode.name))
      }
      setConversionStatus('Ready to import.')
      setFileUrlInput(rawUrl)
      setStep(STEP.DETAILS)
    } catch (err) {
      setError(err.message || 'Unable to open that Figma URL.')
    } finally {
      setIsResolvingFileUrl(false)
    }
  }, [accessToken, fetchFigmaFileDetailsForNodes, templateTouched])

  useEffect(() => {
    if (!isOpen) return
    if (!(step === STEP.FRAMES || step === STEP.DETAILS)) return
    if (!accessToken || !selectedFile?.key || !fileDocument || !selectedFrameId) return

    const documentRoot = fileDocument.document || fileDocument
    const frameNode = findNodeById(documentRoot, selectedFrameId)
    if (!frameNode) return

    const renderableNodes = collectRenderableNodesForFrame(frameNode)
    const { previewLayers: nextPreviewLayers, overlayLayers, frameWidth, frameHeight } =
      buildLayerPreviewForFrame({ frameNode, templatedNodes: renderableNodes })

    setPreviewLayers(nextPreviewLayers)

    if (!renderableNodes.length) {
      setLayerSelections({})
      setMainProductLayerId('')
      setPreflightFrameId('')
    } else if (preflightFrameId !== selectedFrameId) {
      const selectionDefaults = {}
      renderableNodes.forEach(node => {
        if (typeof node?.name === 'string' && node.name.includes('#')) {
          selectionDefaults[node.id] = true
        }
      })
      setLayerSelections(selectionDefaults)

      const imageNodes = renderableNodes.filter(node => node.type !== 'TEXT' && typeof node?.name === 'string' && node.name.includes('#'))
      const defaultMain =
        imageNodes.find(node => {
          const normalizedName = node.name ? node.name.toLowerCase() : ''
          return normalizedName.startsWith('#main') || normalizedName.startsWith('#product')
        })?.id || imageNodes[0]?.id || ''
      setMainProductLayerId(defaultMain)
      setPreflightFrameId(selectedFrameId)
    }

    let cancelled = false
    setFramePreview({
      imageUrl: '',
      isLoading: true,
      frameWidth,
      frameHeight,
      overlayLayers
    })
    ;(async () => {
      try {
        const imageMap = await fetchFigmaImagesForNodes(accessToken, selectedFile.key, [selectedFrameId])
        const imageUrl = imageMap?.[selectedFrameId] || ''
        if (cancelled) return
        setFramePreview({
          imageUrl,
          isLoading: false,
          frameWidth,
          frameHeight,
          overlayLayers
        })
      } catch {
        if (cancelled) return
        setFramePreview({
          imageUrl: '',
          isLoading: false,
          frameWidth,
          frameHeight,
          overlayLayers
        })
      }
    })()

    return () => {
      cancelled = true
    }
  }, [accessToken, fileDocument, isOpen, preflightFrameId, selectedFile?.key, selectedFrameId, step])

  useEffect(() => {
    if (!isOpen) return
    if (step !== STEP.DETAILS) return
    if (previewMode !== 'background') return
    if (!accessToken || !selectedFile?.key || !fileDocument || !selectedFrameId) return
    if (!framePreview?.overlayLayers?.length || !previewLayers) return

    const documentRoot = fileDocument.document || fileDocument
    const frameNode = findNodeById(documentRoot, selectedFrameId)
    if (!frameNode) return

    const dynamicIds = new Set(previewLayers.dynamicIds || [])
    const backgroundLayerIds = framePreview.overlayLayers
      .filter(layer => {
        const isCandidate = dynamicIds.has(layer.id)
        const isDynamicOn = isCandidate && layerSelections[layer.id] !== false
        return !isDynamicOn
      })
      .map(layer => layer.id)

    const fill = frameNode?.fills?.find(f => f.type === 'SOLID' && f.visible !== false)
    const bgHex = fill ? `#${colorToHex(fill.color, fill.opacity ?? 1)}` : 'transparent'

    let cancelled = false
    setBackgroundPreview({
      isLoading: true,
      frameWidth: framePreview.frameWidth,
      frameHeight: framePreview.frameHeight,
      backgroundColor: bgHex,
      pieces: []
    })

    ;(async () => {
      try {
        const imageMap = await fetchFigmaImagesForNodes(accessToken, selectedFile.key, backgroundLayerIds)
        if (cancelled) return
        const pieces = framePreview.overlayLayers
          .filter(layer => backgroundLayerIds.includes(layer.id))
          .map(layer => ({
            id: layer.id,
            imageUrl: imageMap?.[layer.id] || '',
            box: layer.box
          }))
          .filter(piece => Boolean(piece.imageUrl))

        setBackgroundPreview({
          isLoading: false,
          frameWidth: framePreview.frameWidth,
          frameHeight: framePreview.frameHeight,
          backgroundColor: bgHex,
          pieces
        })
      } catch {
        if (cancelled) return
        setBackgroundPreview({
          isLoading: false,
          frameWidth: framePreview.frameWidth,
          frameHeight: framePreview.frameHeight,
          backgroundColor: bgHex,
          pieces: []
        })
      }
    })()

    return () => {
      cancelled = true
    }
  }, [accessToken, fileDocument, framePreview, isOpen, layerSelections, previewLayers, previewMode, selectedFile?.key, selectedFrameId, step])

  const handleProceedToDetails = useCallback(() => {
    if (!selectedFile || !fileDocument) {
      setError('Select a file to continue.')
      return
    }
    if (!selectedFrameId) {
      setError('Select a frame to continue.')
      return
    }
    const documentRoot = fileDocument.document || fileDocument
    const frameNode = findNodeById(documentRoot, selectedFrameId)
    if (!frameNode) {
      setError('Frame not found in the selected file.')
      return
    }
    const renderableNodes = collectRenderableNodesForFrame(frameNode)
    const imageNodes = renderableNodes.filter(node => node.type !== 'TEXT')
    const textNodes = renderableNodes.filter(node => node.type === 'TEXT')
    setConversionResult(null)
    setConversionUploads([])
    const totalLayers = imageNodes.length + textNodes.length
    setConversionStatus(
      totalLayers
        ? `Ready to import ${totalLayers} layer${totalLayers === 1 ? '' : 's'}.`
        : 'Ready to import.'
    )
    setCopySuccess('')
    setStep(STEP.DETAILS)
  }, [fileDocument, selectedFile, selectedFrameId])

  const handleRunConversion = useCallback(async () => {
    if (!selectedFile || !fileDocument) {
      setError('Select a file to convert.')
      return
    }
    if (!selectedFrameId) {
      setError('Select a frame to convert.')
      return
    }
    if (!cloudinaryConfig.cloudName || !cloudinaryConfig.uploadPreset) {
      setError('Enter your Cloudinary cloud name and unsigned upload preset.')
      return
    }
    if (!templateName.trim()) {
      setError('Enter a template name before creating the design.')
      return
    }
    const templateSlug = sanitizeFolderSegment(templateName)
    if (!templateSlug) {
      setError('Template name must include at least one alphanumeric character.')
      return
    }
    const baseFolder = cloudinaryConfig.folder || 'figma-exports'
    const uploadFolder = buildFolderPath(baseFolder, templateSlug)

    const documentRoot = fileDocument.document || fileDocument
    const frameNode = findNodeById(documentRoot, selectedFrameId)
    if (!frameNode) {
      setError('Frame not found in the selected file.')
      return
    }
    const renderableNodes = collectRenderableNodesForFrame(frameNode)
    const dynamicCandidateNodes = renderableNodes.filter(node => typeof node?.name === 'string' && node.name.includes('#'))
    const dynamicSelectedNodes = dynamicCandidateNodes.filter(node => layerSelections[node.id] !== false)
    const requiresMainProduct = dynamicSelectedNodes.some(node => node.type !== 'TEXT')
    if (requiresMainProduct && (!mainProductLayerId || layerSelections[mainProductLayerId] === false)) {
      setError('Choose a main product image to continue.')
      return
    }

    setIsConverting(true)
    setIsImporting(true)
    setConversionStatus('Fetching node previews…')
    setConversionResult(null)
    setConversionUploads([])
    setCopySuccess('')

    try {
      const timestampSuffix = Date.now()
      const frameBox = frameNode.absoluteBoundingBox || { width: frameNode.width, height: frameNode.height }
      const frameWidth = Math.round(frameBox?.width || frameNode.width || 1)
      const frameHeight = Math.round(frameBox?.height || frameNode.height || 1)

      const dynamicOnIds = new Set(dynamicSelectedNodes.map(node => node.id))
      const backgroundNodes = renderableNodes.filter(node => !dynamicOnIds.has(node.id))
      const dynamicImageNodes = dynamicSelectedNodes.filter(node => node.type !== 'TEXT')
      const dynamicTextNodes = dynamicSelectedNodes.filter(node => node.type === 'TEXT')

      // Upload 1 flattened background image (includes non-# + dynamic-off layers, including text nodes)
      setConversionStatus('Preparing background…')
      const backgroundLayerIds = backgroundNodes.map(node => node.id)
      const backgroundPiecesMap = backgroundLayerIds.length
        ? await fetchFigmaImagesForNodes(accessToken, selectedFile.key, backgroundLayerIds)
        : {}

      const fill = frameNode?.fills?.find(f => f.type === 'SOLID' && f.visible !== false)
      const bgHex = fill ? `#${colorToHex(fill.color, fill.opacity ?? 1)}` : 'transparent'
      const pieces = (framePreview?.overlayLayers || [])
        .filter(layer => backgroundLayerIds.includes(layer.id))
        .map(layer => ({
          id: layer.id,
          imageUrl: backgroundPiecesMap[layer.id] || '',
          box: layer.box
        }))
        .filter(piece => Boolean(piece.imageUrl))

      const backgroundBlob = await composeBackgroundPngBlob({
        frameWidth,
        frameHeight,
        backgroundColor: bgHex,
        pieces,
        maxDim: 2000
      })
      if (!backgroundBlob) {
        throw new Error('Failed to build background image.')
      }

      const backgroundPublicId = sanitizePublicIdSegment(`${frameNode.name || 'frame'}_background`) || 'background'
      const backgroundUpload = await uploadImageBlob({
        blob: backgroundBlob,
        filename: `${backgroundPublicId}.png`,
        publicId: `${backgroundPublicId}-${timestampSuffix}`,
        config: { ...cloudinaryConfig, folder: uploadFolder }
      })

      const uploads = [
        { nodeId: 'background', publicId: backgroundUpload.publicId, secureUrl: backgroundUpload.secureUrl }
      ]

      // Upload dynamic image layers only
      setConversionStatus('Uploading dynamic assets to Cloudinary…')
      let assetsMap = {}
      if (dynamicImageNodes.length) {
        const dynamicImageMap = await fetchFigmaImagesForNodes(accessToken, selectedFile.key, dynamicImageNodes.map(node => node.id))
        for (const node of dynamicImageNodes) {
          const imageUrl = dynamicImageMap[node.id]
          if (!imageUrl) {
            uploads.push({ nodeId: node.id, error: 'Preview not available' })
            continue
          }
          const res = await fetch(imageUrl)
          if (!res.ok) {
            uploads.push({ nodeId: node.id, error: 'Preview not available' })
            continue
          }
          const rawBlob = await res.blob()
          const resizedBlob = await resizeImageBlobMaxDimension(rawBlob, 2000)
          const cleanName = sanitizePublicIdSegment(node.name || node.id) || `layer_${node.id}`
          const upload = await uploadImageBlob({
            blob: resizedBlob,
            filename: `${cleanName}.png`,
            publicId: `${cleanName}-${timestampSuffix}`,
            config: { ...cloudinaryConfig, folder: uploadFolder }
          })
          assetsMap[node.id] = upload
          uploads.push({ nodeId: node.id, publicId: upload.publicId, secureUrl: upload.secureUrl })
        }
      }

      setConversionUploads(uploads)

      setConversionStatus('Building transformation…')
      const dynamicNodeIds = new Set(dynamicSelectedNodes.map(node => node.id))
      const conversion = buildTransformationForFrame({
        frameNode,
        textNodes: dynamicTextNodes,
        imageNodes: dynamicImageNodes,
        assetsMap,
        dynamicNodeIds,
        backgroundAssetPublicId: backgroundUpload.publicId
      })
      const userOverride = transformationOverride?.trim()
      const finalTransformation = userOverride || conversion.transformation
      setConversionResult({
        transformation: finalTransformation,
        frameName: frameNode.name,
        fileName: selectedFile.name,
        background: conversion.background,
        layers: conversion.layers
      })
      setTransformationOverride(finalTransformation)
      setConversionStatus(`Converted ${conversion.layers.length} layer${conversion.layers.length === 1 ? '' : 's'}.`)
      if (import.meta.env.DEV) {
        // eslint-disable-next-line no-console
        console.log('[Figma] Frame details', {
          frame: frameNode,
          dynamicTextNodes,
          dynamicImageNodes,
          backgroundLayerCount: backgroundNodes.length,
          transformation: conversion.transformation,
          layers: conversion.layers
        })
      }
      setConversionStatus('Importing to Playground…')
      const designRulesResult = buildDesignRulesFromNodes({
        frameNode,
        nodes: dynamicSelectedNodes,
        assetsMap,
        mainProductLayerId: requiresMainProduct ? mainProductLayerId : null
      })
      const parentWithBackground = (() => {
        const rules = designRulesResult.rules || {}
        return {
          width: rules.width,
          height: rules.height,
          backgroundColor: rules.backgroundColor,
          backgroundImage: {
            width: rules.width,
            height: rules.height,
            x: 0,
            y: 0,
            gravity: 'north_west',
            publicId: backgroundUpload.publicId,
            displayName: 'Background'
          },
          ...Object.keys(rules).reduce((acc, key) => {
            if (key === 'width' || key === 'height' || key === 'backgroundColor') return acc
            acc[key] = rules[key]
            return acc
          }, {})
        }
      })()
      const allDesignRules = buildDesignRulesWithChildren(parentWithBackground)
      if (import.meta.env.DEV) {
        // eslint-disable-next-line no-console
        console.log('[Figma] Imported Design Rules (Full JSON):', JSON.stringify(allDesignRules, null, 2))
      }
      onTemplateImported({
        templateName: templateName.trim() || selectedFile.name,
        transformation: finalTransformation,
        designRules: allDesignRules,
        fonts: designRulesResult.fonts
      })
      // Small delay to show the "Importing to Playground..." message
      await new Promise(resolve => setTimeout(resolve, 500))
      onClose()
      resetState()
    } catch (err) {
      setError(err.message || 'Failed to convert the selected frame.')
    } finally {
      setIsConverting(false)
      setIsImporting(false)
    }
  }, [
    accessToken,
    cloudinaryConfig,
    fetchFigmaImagesForNodes,
    fileDocument,
    layerSelections,
    mainProductLayerId,
    selectedFile,
    selectedFrameId,
    templateName,
    transformationOverride,
    uploadImageFromUrl,
    onTemplateImported,
    onClose
  ])

  const generatedPreviewTransformation = useMemo(() => {
    if (step !== STEP.DETAILS || !fileDocument || !selectedFrameId) return ''
    const documentRoot = fileDocument.document || fileDocument
    const frameNode = findNodeById(documentRoot, selectedFrameId)
    if (!frameNode) return ''

    const renderableNodes = collectRenderableNodesForFrame(frameNode)
    if (!renderableNodes.length) return ''

    const dynamicNodeIds = new Set(
      renderableNodes
        .filter(node => typeof node?.name === 'string' && node.name.includes('#') && layerSelections[node.id] !== false)
        .map(node => node.id)
    )
    const dynamicNodes = renderableNodes.filter(node => dynamicNodeIds.has(node.id))
    const textNodes = dynamicNodes.filter(node => node.type === 'TEXT')
    const imageNodes = dynamicNodes.filter(node => node.type !== 'TEXT')

    const templateSlug = sanitizeFolderSegment(templateName)
    const baseFolder = cloudinaryConfig.folder || 'figma-exports'
    const uploadFolder = buildFolderPath(baseFolder, templateSlug)
    const mockBackgroundPublicId = `${uploadFolder}/${sanitizePublicIdSegment(`${frameNode.name || 'frame'}_background`) || 'background'}`

    const mockAssetsMap = {}
    imageNodes.forEach(node => {
      const fallbackName = node.name || node.id
      const cleanName = fallbackName.replace(/\//g, ':')
      mockAssetsMap[node.id] = {
        publicId: `${uploadFolder}/${cleanName}`
      }
    })

    const conversion = buildTransformationForFrame({
      frameNode,
      textNodes,
      imageNodes,
      assetsMap: mockAssetsMap,
      dynamicNodeIds,
      backgroundAssetPublicId: mockBackgroundPublicId
    })

    return conversion.transformation
  }, [step, fileDocument, selectedFrameId, layerSelections, templateName, cloudinaryConfig])

  const transformationPreviewValue = useMemo(() => {
    const overrideValue = transformationOverride.trim()
    if (overrideValue) return overrideValue
    if (conversionResult?.transformation) return conversionResult.transformation
    return generatedPreviewTransformation
  }, [transformationOverride, conversionResult, generatedPreviewTransformation])

  const handleInspectAnotherFrame = useCallback(() => {
    setConversionResult(null)
    setConversionStatus('Pick another frame to inspect.')
    setCopySuccess('')
    setPreviewLayers(null)
    setFramePreview(null)
    setLayerSelections({})
    setMainProductLayerId('')
    setTransformationOverride('')
    setPreviewMode('dynamic')
    setBackgroundPreview(null)
    setStep(STEP.FRAMES)
  }, [])

  const handleCopyTransformation = useCallback(async () => {
    const valueToCopy = transformationPreviewValue.trim()
    if (!valueToCopy) return
    try {
      await navigator.clipboard.writeText(valueToCopy)
      setCopySuccess('Copied!')
      setTimeout(() => setCopySuccess(''), 2000)
    } catch {
      setCopySuccess('Copy failed')
    }
  }, [transformationPreviewValue])


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
  const currentProjectFiles = selectedProjectId ? projectFiles[selectedProjectId] : []
  const isCurrentProjectLoading = projectLoadingId === selectedProjectId
  const filteredFrames = useMemo(() => {
    if (!frameFilter.trim()) return frameOptions
    const query = frameFilter.trim().toLowerCase()
    return frameOptions.filter(frame => {
      const name = frame.name?.toLowerCase() || ''
      const page = frame.pageName?.toLowerCase() || ''
      return name.includes(query) || page.includes(query)
    })
  }, [frameOptions, frameFilter])

  const canGoBack = useMemo(() => step !== STEP.CONNECT, [step])

  const canGoNext = useMemo(() => {
    switch (step) {
      case STEP.TEAM:
        return teamProjects.length > 0
      case STEP.PROJECT:
        return Boolean(selectedProjectId && projectFiles[selectedProjectId])
      case STEP.FILE:
        return Boolean(selectedFile)
      case STEP.FRAMES:
        return Boolean(selectedFrameId && !isInspectingFile)
      default:
        return false
    }
  }, [step, teamProjects.length, selectedProjectId, projectFiles, selectedFile, selectedFrameId, isInspectingFile])

  const nextLabel = step === STEP.FRAMES ? 'Review import' : 'Next'

  const requiresMainProductSelection = Boolean(
    (previewLayers?.images || []).some(layer => {
      const isDynamicCandidate = (previewLayers?.dynamicIds || []).includes(layer.id)
      return isDynamicCandidate && layerSelections[layer.id] !== false
    })
  )
  const hasMainProductSelection = !requiresMainProductSelection || (
    mainProductLayerId && layerSelections[mainProductLayerId] !== false
  )

  const handleBackStep = useCallback(() => {
    setIsStepTransitioning(true)
    setTimeout(() => {
      switch (step) {
        case STEP.TOKEN:
          setStep(STEP.CONNECT)
          break
        case STEP.TEAM:
          setStep(STEP.CONNECT)
          break
        case STEP.PROJECT:
          setStep(STEP.TEAM)
          break
        case STEP.FILE:
          setStep(STEP.PROJECT)
          break
        case STEP.FRAMES:
          setStep(STEP.FILE)
          break
        case STEP.DETAILS:
          setPreviewLayers(null)
          setLayerSelections({})
          setMainProductLayerId('')
          setTransformationOverride('')
          setStep(STEP.FRAMES)
          break
        default:
          break
      }
      setIsStepTransitioning(false)
    }, 150)
  }, [step])

  const handleNextStep = useCallback(() => {
    setIsStepTransitioning(true)
    setTimeout(() => {
      switch (step) {
        case STEP.TEAM:
          if (teamProjects.length) setStep(STEP.PROJECT)
          break
        case STEP.PROJECT:
          if (selectedProjectId && projectFiles[selectedProjectId]) setStep(STEP.FILE)
          break
        case STEP.FILE:
          if (selectedFile) setStep(STEP.FRAMES)
          break
        case STEP.FRAMES:
          handleProceedToDetails()
          break
        default:
          break
      }
      setIsStepTransitioning(false)
    }, 150)
  }, [step, teamProjects.length, selectedProjectId, projectFiles, selectedFile, handleProceedToDetails])

  const shouldUseWideModal = Boolean(profile)
  const handleFrameFilterChange = useCallback((value) => {
    setFrameFilter(value)
  }, [])

  const handleTemplateNameChange = useCallback((value) => {
    setTemplateTouched(true)
    setTemplateName(value)
  }, [])

  const handleToggleLayerSelection = useCallback((nodeId) => {
    setLayerSelections(prev => {
      const nextValue = prev[nodeId] === false
      const nextState = { ...prev, [nodeId]: nextValue }
      if (!nextValue && nodeId === mainProductLayerId) {
        const dynamicIds = new Set(previewLayers?.dynamicIds || [])
        const fallbackImage = previewLayers?.images?.find(image => {
          if (!dynamicIds.has(image.id)) return false
          if (image.id === nodeId) return false
          return nextState[image.id] !== false
        })
        setMainProductLayerId(fallbackImage ? fallbackImage.id : '')
      }
      return nextState
    })
  }, [mainProductLayerId, previewLayers])

  const handleMainProductChange = useCallback((nodeId) => {
    const dynamicIds = new Set(previewLayers?.dynamicIds || [])
    if (!dynamicIds.has(nodeId)) return
    if (!previewLayers?.images?.some(image => image.id === nodeId)) return
    setLayerSelections(prev => ({
      ...prev,
      [nodeId]: true
    }))
    setMainProductLayerId(nodeId)
  }, [previewLayers])

  const handleSignOut = useCallback(() => {
    if (isBrowser) {
      Object.values(STORAGE_KEYS).forEach(key => {
        localStorage.removeItem(key)
      })
      localStorage.removeItem(RECENT_TEAMS_KEY)
    }
    setAccessToken('')
    setProfile(null)
    resetState()
  setIsProfileMenuOpen(false)
}, [resetState])

  const headerActions = profile ? (
    <div
      className={`figma-profile-menu ${isProfileMenuOpen ? 'is-open' : ''}`}
      ref={profileMenuRef}
    >
      <button
        type="button"
        className="figma-profile-chip"
        aria-haspopup="true"
        aria-expanded={isProfileMenuOpen}
        onClick={() => setIsProfileMenuOpen(prev => !prev)}
      >
        {profile.imageUrl ? (
          <img src={profile.imageUrl} alt={`${profile.handle} avatar`} />
        ) : (
          <span>{profileInitials}</span>
        )}
      </button>
      <div className={`figma-profile-dropdown ${isProfileMenuOpen ? 'is-open' : ''}`}>
        <p className="figma-profile-handle">{profile.handle}</p>
        <p className="figma-profile-email">{profile.email}</p>
        <button type="button" className="figma-secondary-btn" onClick={handleSignOut}>
          Sign out
        </button>
      </div>
    </div>
  ) : null

  const isTemplateReady = Boolean(templateName.trim())
  const footerPrimaryLabel =
    step === STEP.DETAILS ? (isConverting ? 'Creating…' : 'Create Design') : nextLabel
  const footerPrimaryDisabled = step === STEP.DETAILS
    ? (isConverting || !isTemplateReady || !hasMainProductSelection)
    : !canGoNext
  const footerPrimaryAction = step === STEP.DETAILS ? handleRunConversion : handleNextStep

  const footerContent = (
    <div className="figma-footer">
      <button type="button" className="figma-secondary-btn" onClick={handleBackStep} disabled={!canGoBack}>
        Back
      </button>
      <button
        type="button"
        className="figma-primary-btn"
        onClick={footerPrimaryAction}
        disabled={footerPrimaryDisabled}
      >
        {footerPrimaryLabel}
      </button>
    </div>
  )

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Create new from Figma"
      subtitle={stepTitle}
      size={shouldUseWideModal ? 'wide' : 'default'}
      contentClassName="figma-modal-shell"
      headerActions={headerActions}
      footerContent={footerContent}
    >
      <div className="figma-import-body">
        {(isStepTransitioning || isImporting) && (
          <div className="figma-loading-overlay">
            <div className="figma-loading-content">
              <div className="figma-inline-spinner" aria-hidden="true"></div>
              <p className="figma-loading-text">
                {isImporting ? conversionStatus || 'Importing…' : 'Loading…'}
              </p>
            </div>
          </div>
        )}
        <div className={`modal-body-static ${isStepTransitioning || isImporting ? 'figma-content-blurred' : ''}`}>
          <FigmaWizardSteps steps={WIZARD_STEPS} currentStep={progressStep} />
          {error && <p className="figma-error">{error}</p>}
        </div>

        <div className={`modal-body-content figma-body-content ${isStepTransitioning || isImporting ? 'figma-content-blurred' : ''}`}>
          {step === STEP.CONNECT && (
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
              {!isLoading && (
                <p className="figma-connecting-hint">If the window closed already, hang tight while we finalize the connection.</p>
              )}
            </div>
          )}

          {step === STEP.TEAM && (
            <FigmaTeamStep
              teamIdInput={teamIdInput}
              onTeamIdChange={(event) => setTeamIdInput(event.target.value)}
              onSubmit={handleTeamSubmit}
              isLoading={isLoading}
              recentTeams={recentTeamIds}
              onSelectRecent={handleSelectRecentTeam}
            />
          )}

          {step === STEP.PROJECT && (
            <FigmaProjectSelector
              projects={teamProjects}
              selectedProjectId={selectedProjectId}
              loadingProjectId={projectLoadingId}
              onSelectProject={handleProjectSelect}
              onBack={handleChangeTeam}
            />
          )}

          {step === STEP.FILE && (
            <FigmaFileSelector
              projectName={teamProjects.find(project => String(project.id) === String(selectedProjectId))?.name}
              files={currentProjectFiles || []}
              isLoading={isCurrentProjectLoading}
              onInspectFile={handleInspectFile}
              fileUrlInput={fileUrlInput}
              onFileUrlChange={setFileUrlInput}
              onOpenFromUrl={handleOpenFromFileUrl}
              isResolvingUrl={isResolvingFileUrl}
              onBack={handleBackToProjects}
            />
          )}

          {step === STEP.FRAMES && (
            <FigmaConverterPanel
              selectedFile={selectedFile}
              selectedFrameId={selectedFrameId}
              frameOptions={frameOptions}
              visibleFrames={filteredFrames}
              frameFilter={frameFilter}
              onFrameFilterChange={handleFrameFilterChange}
              cloudinaryConfig={cloudinaryConfig}
              onFrameChange={(frameId) => {
                setSelectedFrameId(frameId)
                setConversionResult(null)
                setConversionUploads([])
                setConversionStatus('')
                setCopySuccess('')
                setPreviewLayers(null)
                setFramePreview(null)
                setPreflightFrameId('')
                setLayerSelections({})
                setMainProductLayerId('')
                if (!templateTouched) {
                  const nextFrame = frameOptions.find(frame => frame.id === frameId)
                  if (nextFrame) {
                    setTemplateName(formatTemplateNameFromFrame(nextFrame.name))
                  }
                }
              }}
              onCloudinaryChange={(key, value) => setCloudinaryConfig(prev => ({ ...prev, [key]: value }))}
              cloudinaryExpanded={cloudinaryExpanded}
              onToggleCloudinaryExpanded={() => setCloudinaryExpanded(prev => !prev)}
              conversionStatus={conversionStatus}
              conversionResult={conversionResult}
              conversionUploads={conversionUploads}
              isInspectingFile={isInspectingFile}
              isConverting={isConverting}
              copySuccess={copySuccess}
              previewLayers={previewLayers}
              framePreview={framePreview}
              previewMode="dynamic"
              onPreviewModeChange={() => {}}
              backgroundPreview={null}
              showPreviewOverlays={showPreviewOverlays}
              onTogglePreviewOverlays={() => setShowPreviewOverlays(prev => !prev)}
              mode="picker"
            />
          )}

          {step === STEP.DETAILS && (
            <FigmaConverterPanel
              selectedFile={selectedFile}
              selectedFrameId={selectedFrameId}
              frameOptions={frameOptions}
              visibleFrames={frameOptions}
              frameFilter=""
              onFrameFilterChange={() => {}}
              cloudinaryConfig={cloudinaryConfig}
              onFrameChange={() => {}}
              onCloudinaryChange={(key, value) => setCloudinaryConfig(prev => ({ ...prev, [key]: value }))}
              cloudinaryExpanded={cloudinaryExpanded}
              onToggleCloudinaryExpanded={() => setCloudinaryExpanded(prev => !prev)}
              onCopyTransformation={handleCopyTransformation}
              onInspectAnotherFrame={handleInspectAnotherFrame}
              conversionStatus={conversionStatus}
              conversionResult={conversionResult}
              conversionUploads={conversionUploads}
              isInspectingFile={false}
              isConverting={isConverting}
              copySuccess={copySuccess}
              transformationValue={transformationPreviewValue}
              onTransformationChange={setTransformationOverride}
              templateName={templateName}
              onTemplateNameChange={handleTemplateNameChange}
              layerSelections={layerSelections}
              onToggleLayerSelection={handleToggleLayerSelection}
              mainProductLayerId={mainProductLayerId}
              onSelectMainProduct={handleMainProductChange}
              previewLayers={previewLayers}
              framePreview={framePreview}
              previewMode={previewMode}
              onPreviewModeChange={(nextMode) => {
                setPreviewMode(nextMode)
                if (nextMode !== 'dynamic') {
                  setShowPreviewOverlays(false)
                }
              }}
              backgroundPreview={backgroundPreview}
              showPreviewOverlays={showPreviewOverlays}
              onTogglePreviewOverlays={() => setShowPreviewOverlays(prev => !prev)}
              mode="details"
            />
          )}
        </div>
      </div>
    </Modal>
  )
}

