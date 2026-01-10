import { useState, useCallback, useEffect, useMemo } from 'react'
import {
  convertDesignRulesToYogaLayout,
  convertAllDesignRulesToYoga,
  yogaLayoutToString
} from '../utils/yogaLayoutConverter'

export const useYogaLayout = (editableRules) => {
  const [yogaLayouts, setYogaLayouts] = useState(null)
  const [currentDesignYogaLayout, setCurrentDesignYogaLayout] = useState(null)
  const [selectedDesignId, setSelectedDesignId] = useState('parent')

  const generateYogaLayouts = useCallback(() => {
    if (!editableRules) {
      console.warn('No design rules available to convert to Yoga layout')
      return
    }

    try {
      const allLayouts = convertAllDesignRulesToYoga(editableRules)
      setYogaLayouts(allLayouts)
      
      console.group('🧘 Yoga Layout Generation')
      console.log('Generated Yoga layouts for all designs:')
      Object.entries(allLayouts).forEach(([designId, layout]) => {
        console.group(`Design: ${designId}`)
        console.log('JSON representation:', JSON.stringify(layout, null, 2))
        console.log('C-style syntax:')
        console.log(yogaLayoutToString(layout))
        console.groupEnd()
      })
      console.groupEnd()

      const parentLayout = allLayouts[selectedDesignId] || allLayouts['parent']
      if (parentLayout) {
        setCurrentDesignYogaLayout(parentLayout)
      }

      return allLayouts
    } catch (error) {
      console.error('Failed to generate Yoga layouts:', error)
      return null
    }
  }, [editableRules, selectedDesignId])

  const getYogaLayoutForDesign = useCallback((designId) => {
    if (!yogaLayouts) return null
    return yogaLayouts[designId] || null
  }, [yogaLayouts])

  const switchDesign = useCallback((designId) => {
    setSelectedDesignId(designId)
    if (yogaLayouts && yogaLayouts[designId]) {
      setCurrentDesignYogaLayout(yogaLayouts[designId])
      
      console.group(`🔄 Switched to design: ${designId}`)
      console.log('Yoga Layout:', yogaLayouts[designId])
      console.groupEnd()
    }
  }, [yogaLayouts])

  const exportYogaLayoutAsJSON = useCallback((designId) => {
    const layout = designId ? getYogaLayoutForDesign(designId) : currentDesignYogaLayout
    if (!layout) return null
    
    return JSON.stringify(layout, null, 2)
  }, [getYogaLayoutForDesign, currentDesignYogaLayout])

  const exportYogaLayoutAsCStyle = useCallback((designId) => {
    const layout = designId ? getYogaLayoutForDesign(designId) : currentDesignYogaLayout
    if (!layout) return null
    
    return yogaLayoutToString(layout)
  }, [getYogaLayoutForDesign, currentDesignYogaLayout])

  const layerCount = useMemo(() => {
    if (!currentDesignYogaLayout) return 0
    return currentDesignYogaLayout.children?.length || 0
  }, [currentDesignYogaLayout])

  const textLayerCount = useMemo(() => {
    if (!currentDesignYogaLayout) return 0
    return currentDesignYogaLayout.children?.filter(child => child.type === 'text').length || 0
  }, [currentDesignYogaLayout])

  const imageLayerCount = useMemo(() => {
    if (!currentDesignYogaLayout) return 0
    return currentDesignYogaLayout.children?.filter(child => child.type === 'image').length || 0
  }, [currentDesignYogaLayout])

  return {
    yogaLayouts,
    currentDesignYogaLayout,
    selectedDesignId,
    generateYogaLayouts,
    getYogaLayoutForDesign,
    switchDesign,
    exportYogaLayoutAsJSON,
    exportYogaLayoutAsCStyle,
    stats: {
      total: layerCount,
      text: textLayerCount,
      image: imageLayerCount
    }
  }
}

