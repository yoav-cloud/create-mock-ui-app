const handleFigmaResponse = async (response, fallbackMessage) => {
  const payload = await response.json().catch(() => null)
  if (!response.ok) {
    const message = payload?.err?.message || payload?.message || fallbackMessage
    throw new Error(message)
  }
  return payload
}

export async function fetchFigmaProfile(token) {
  const response = await fetch('https://api.figma.com/v1/me', {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
  return handleFigmaResponse(response, 'Unable to authenticate with Figma.')
}

export async function fetchTeamProjects(token, teamId) {
  const response = await fetch(`https://api.figma.com/v1/teams/${teamId}/projects`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
  const payload = await handleFigmaResponse(response, 'Unable to fetch projects for that team.')
  return Array.isArray(payload?.projects) ? payload.projects : []
}

export async function fetchProjectFiles(token, projectId) {
  const response = await fetch(`https://api.figma.com/v1/projects/${projectId}/files`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
  const payload = await handleFigmaResponse(response, 'Unable to fetch files for this project.')
  const rawFiles = Array.isArray(payload?.files) ? payload.files : []
  return rawFiles.map(file => ({
    id: file.key || file.file_key || file.id || `${file.name}-${Math.random().toString(36).slice(2)}`,
    key: file.key || file.file_key || file.id,
    name: file.name || 'Untitled file',
    lastModified: file.last_modified || file.lastModified || 'Unknown',
    version: file.version || '—',
    thumbnailUrl: file.thumbnail_url || file.thumbnailUrl || null,
    role: file.role || null
  }))
}

export async function fetchFigmaFileDetails(token, fileKey) {
  const response = await fetch(`https://api.figma.com/v1/files/${fileKey}`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
  return handleFigmaResponse(response, 'Unable to fetch file details.')
}

export async function fetchFigmaFileDetailsForNodes(token, fileKey, nodeIds = []) {
  const url = new URL(`https://api.figma.com/v1/files/${fileKey}`)
  if (nodeIds.length) {
    url.searchParams.set('ids', nodeIds.join(','))
  }
  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
  return handleFigmaResponse(response, 'Unable to fetch file details for that node.')
}

export async function fetchFigmaImagesForNodes(token, fileKey, nodeIds = []) {
  const images = {}
  const chunkSize = 40
  for (let i = 0; i < nodeIds.length; i += chunkSize) {
    const chunk = nodeIds.slice(i, i + chunkSize)
    const url = new URL(`https://api.figma.com/v1/images/${fileKey}`)
    url.searchParams.set('ids', chunk.join(','))
    url.searchParams.set('format', 'png')
    url.searchParams.set('scale', '2')
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    const payload = await handleFigmaResponse(response, 'Unable to fetch node previews.')
    Object.assign(images, payload?.images || {})
  }
  return images
}

