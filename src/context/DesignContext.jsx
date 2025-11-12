import { createContext, useContext, useState } from 'react'

const DesignContext = createContext()

export function DesignProvider({ children }) {
  // Store designs both by ID (for quick lookup) and by project (for project views)
  const [designsById, setDesignsById] = useState({})
  const [designsByProject, setDesignsByProject] = useState({})
  // Store generation data per design (CSV data, expected fields, generated assets)
  const [generationData, setGenerationData] = useState({})

  const saveDesign = (designId, designData) => {
    const design = {
      ...designData,
      id: designId,
      updatedAt: new Date().toISOString(),
      createdAt: designData.createdAt || new Date().toISOString(),
    }

    setDesignsById((prev) => ({
      ...prev,
      [designId]: design,
    }))

    // Also store by project if projectId exists
    if (design.projectId) {
      setDesignsByProject((prev) => {
        const projectDesigns = prev[design.projectId] || []
        const existingIndex = projectDesigns.findIndex((d) => d.id === designId)
        
        if (existingIndex >= 0) {
          // Update existing design
          const updated = [...projectDesigns]
          updated[existingIndex] = design
          return {
            ...prev,
            [design.projectId]: updated,
          }
        } else {
          // Add new design
          return {
            ...prev,
            [design.projectId]: [...projectDesigns, design],
          }
        }
      })
    }
  }

  const getDesign = (designId) => {
    return designsById[designId] || null
  }

  const getDesignsByProject = (projectId) => {
    return designsByProject[projectId] || []
  }

  const getDesignsWithoutProject = () => {
    // Get all designs that don't have a projectId and are not sub-designs
    return Object.values(designsById).filter(
      (d) => !d.projectId && !d.parentId
    )
  }

  const getSubDesigns = (parentDesignId) => {
    return Object.values(designsById).filter(
      (d) => d.parentId === parentDesignId
    )
  }

  const createNewDesign = (projectId, designName) => {
    const newDesignId = `design-${Date.now()}`
    const newDesign = {
      id: newDesignId,
      name: designName || 'Untitled Design',
      projectId,
      layers: [],
      canvasSize: { width: 800, height: 600 },
      status: 'draft',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    saveDesign(newDesignId, newDesign)
    return newDesignId
  }

  const createSubDesign = (parentDesignId, designName, channelId = null) => {
    const parentDesign = getDesign(parentDesignId)
    if (!parentDesign) return null

    const newSubDesignId = `subdesign-${Date.now()}`
    
    // Inherit canvas size from parent (or from channel if provided)
    let canvasSize = { ...parentDesign.canvasSize }
    if (channelId) {
      // Parse channel transformation string to get dimensions
      // For now, use default channel sizes
      const channelSizes = {
        ch1: { width: 1080, height: 1080 }, // Instagram Square
        ch2: { width: 1200, height: 630 }, // Facebook Cover
        ch3: { width: 1500, height: 500 }, // Twitter Header
        ch4: { width: 1200, height: 627 }, // LinkedIn Post
        ch5: { width: 600, height: 200 }, // Email Banner
      }
      if (channelSizes[channelId]) {
        canvasSize = channelSizes[channelId]
      }
    }

    const newSubDesign = {
      id: newSubDesignId,
      name: designName || 'Untitled Sub-Design',
      parentId: parentDesignId,
      projectId: parentDesign.projectId,
      channelId,
      layers: [], // Layers will be inherited from parent
      overrides: {}, // Track which layers have overrides: { layerId: { property: value } }
      canvasSize,
      status: 'draft',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    saveDesign(newSubDesignId, newSubDesign)
    return newSubDesignId
  }

  // Get effective layers for a sub-design (inherited + overridden)
  const getEffectiveLayers = (designId) => {
    const design = getDesign(designId)
    if (!design) return []

    // If not a sub-design, return its own layers
    if (!design.parentId) {
      return design.layers || []
    }

    // Get parent design
    const parentDesign = getDesign(design.parentId)
    if (!parentDesign) return design.layers || []

    const parentLayers = parentDesign.layers || []
    const overrides = design.overrides || {}
    const localLayers = design.layers || []

    // Build effective layers: inherit from parent, apply overrides, add local layers
    const effectiveLayers = []

    // Process parent layers
    parentLayers.forEach((parentLayer) => {
      const layerId = parentLayer.id
      const override = overrides[layerId]

      if (override) {
        // Layer has overrides, use overridden version
        effectiveLayers.push({
          ...parentLayer,
          ...override,
        })
      } else {
        // No override, inherit from parent
        effectiveLayers.push({ ...parentLayer })
      }
    })

    // Add local layers (layers added directly to sub-design)
    localLayers.forEach((localLayer) => {
      // Only add if not already present (not inherited)
      if (!parentLayers.find((pl) => pl.id === localLayer.id)) {
        effectiveLayers.push(localLayer)
      }
    })

    return effectiveLayers
  }

  // Set override for a layer in a sub-design
  const setLayerOverride = (subDesignId, layerId, overrideData) => {
    const design = getDesign(subDesignId)
    if (!design || !design.parentId) return

    const currentOverrides = design.overrides || {}
    const newOverrides = {
      ...currentOverrides,
      [layerId]: {
        ...currentOverrides[layerId],
        ...overrideData,
      },
    }

    saveDesign(subDesignId, {
      ...design,
      overrides: newOverrides,
    })
  }

  // Reset override for a layer (restore inheritance)
  const resetLayerOverride = (subDesignId, layerId) => {
    const design = getDesign(subDesignId)
    if (!design || !design.parentId) return

    const currentOverrides = { ...(design.overrides || {}) }
    delete currentOverrides[layerId]

    saveDesign(subDesignId, {
      ...design,
      overrides: currentOverrides,
    })
  }

  // Remove layer from parent and all sub-designs without overrides
  const removeLayerFromParent = (parentDesignId, layerId) => {
    const parentDesign = getDesign(parentDesignId)
    if (!parentDesign) return

    // Remove from parent
    const updatedLayers = (parentDesign.layers || []).filter(
      (l) => l.id !== layerId
    )
    saveDesign(parentDesignId, {
      ...parentDesign,
      layers: updatedLayers,
    })

    // Remove from all sub-designs that don't have overrides for this layer
    const subDesigns = getSubDesigns(parentDesignId)
    subDesigns.forEach((subDesign) => {
      const hasOverride = subDesign.overrides && subDesign.overrides[layerId]
      if (!hasOverride) {
        // Remove from local layers if it exists
        const updatedSubLayers = (subDesign.layers || []).filter(
          (l) => l.id !== layerId
        )
        saveDesign(subDesign.id, {
          ...subDesign,
          layers: updatedSubLayers,
        })
      }
    })
  }

  // Save generation CSV data for a design
  const saveGenerationData = (designId, data) => {
    setGenerationData((prev) => ({
      ...prev,
      [designId]: {
        ...prev[designId],
        ...data,
      },
    }))
  }

  // Get generation data for a design
  const getGenerationData = (designId) => {
    return generationData[designId] || null
  }

  // Get effective brandKitId for a design (inherited from parent if sub-design)
  const getEffectiveBrandKitId = (designId) => {
    const design = getDesign(designId)
    if (!design) return null

    // If not a sub-design, return its own brandKitId
    if (!design.parentId) {
      return design.brandKitId || null
    }

    // If sub-design has its own brandKitId, use it
    if (design.brandKitId) {
      return design.brandKitId
    }

    // Otherwise, inherit from parent
    const parentDesign = getDesign(design.parentId)
    return parentDesign?.brandKitId || null
  }

  return (
    <DesignContext.Provider
      value={{
        designs: designsById,
        saveDesign,
        getDesign,
        getDesignsByProject,
        getDesignsWithoutProject,
        getSubDesigns,
        getEffectiveLayers,
        createNewDesign,
        createSubDesign,
        setLayerOverride,
        resetLayerOverride,
        removeLayerFromParent,
        saveGenerationData,
        getGenerationData,
        getEffectiveBrandKitId,
      }}
    >
      {children}
    </DesignContext.Provider>
  )
}

export function useDesign() {
  const context = useContext(DesignContext)
  if (!context) {
    throw new Error('useDesign must be used within DesignProvider')
  }
  return context
}

