import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react'
import { NavLink, Outlet } from 'react-router-dom'
import toast from 'react-hot-toast'
import './DesignPlayground.css'
import { ASSETS, DESIGN_TYPES, DESIGN_RULES as DEFAULT_DESIGN_RULES, GRAVITY_VALUES, GOOGLE_FONTS as DEFAULT_GOOGLE_FONTS, LIGHT_BLUE, BASE_WIDTH, CLOUDINARY_BASE_URL } from './playground/constants'
import AssetSwitcher from './playground/AssetSwitcher'
import { parseUrlSegments as parseUrlSegmentsUtil, generateLayerConfig, extractLayersFromRules } from '../utils/urlParser'
import { extractMetadataId, hasMetadataSyntax, getMetadataKey } from '../utils/metadataUtils'
import { escapeCloudinaryString, getDefaultValue, shouldUseMetadata, getMetaKeyForField, getBackgroundColorValue, doubleEscapeCloudinaryString, normalizeCloudinaryNumber } from '../utils/cloudinaryUtils'
import { buildCloudinaryTransform } from '../utils/cloudinaryTransformBuilder'
import { getAllFieldNames, getFieldDefaultValue, getFieldMetadataSyntax } from '../utils/fieldMetadataUtils'
import { extractLayers, isTextLayer, isImageLayer } from '../utils/layerUtils'
import { shouldInheritProperty } from '../utils/inheritanceUtils'
import { createRuleUpdateHandler } from '../utils/ruleUpdateUtils'
import FigmaImportModal from './figma/FigmaImportModal'
import NewDesignModal from './playground/NewDesignModal'
import AICreateChildDesignModal from './playground/AICreateChildDesignModal'
import { fetchImageAsBase64 } from './playground/imageBase64'
import { createChildDesignWithAI } from './playground/aiDesignCreatorApi'
import { computePropertyOverridesForChild } from './playground/propertyOverridesFromRules'
import { useYogaLayout } from '../yoga/hooks/useYogaLayout'

const cloneDesignRules = () => JSON.parse(JSON.stringify(DEFAULT_DESIGN_RULES))

const mergeFontOptions = (current = [], incoming = []) => {
  const existing = new Set(current.map(font => font.value.toLowerCase()))
  const additions = incoming
    .map(font => (typeof font === 'string' ? { name: font, value: font } : font))
    .filter(font => font && !existing.has(font.value.toLowerCase()))
  return [...current, ...additions]
}

function DesignPlayground() {
  const defaultRulesRef = useRef(cloneDesignRules())
  const [designTypes, setDesignTypes] = useState(() => {
    const saved = localStorage.getItem('playground_design_types')
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        if (Array.isArray(parsed) && parsed.length) {
          const byId = new Map()
          ;[...DESIGN_TYPES, ...parsed].forEach((d) => {
            if (d?.id) byId.set(d.id, d)
          })
          const merged = Array.from(byId.values())
          merged.sort((a, b) => (a.id === 'parent' ? -1 : b.id === 'parent' ? 1 : 0))
          return merged
        }
      } catch {
        // ignore
      }
    }
    return [...DESIGN_TYPES]
  })
  const [selectedAsset, setSelectedAsset] = useState(() => {
    const saved = localStorage.getItem('playground_asset')
    return saved ? ASSETS.find(a => a.id === saved) || ASSETS[2] : ASSETS[2]
  })

  const [selectedDesign, setSelectedDesign] = useState(() => {
    const saved = localStorage.getItem('playground_design')
    return saved ? designTypes.find(d => d.id === saved) || designTypes[0] : designTypes[0]
  })

  const [designName, setDesignName] = useState('Shoes Ad Example')

  const [isNewDesignModalOpen, setIsNewDesignModalOpen] = useState(false)
  const [isImportModalOpen, setIsImportModalOpen] = useState(false)
  const [isAICreateChildModalOpen, setIsAICreateChildModalOpen] = useState(false)

  const [formValues, setFormValues] = useState(() => {
    const saved = localStorage.getItem('playground_form')
    if (saved) {
      return JSON.parse(saved)
    }
    // Initialize dynamically from field definitions
    const fieldNames = getAllFieldNames(defaultRulesRef.current['parent'])
    const initialValues = {}
    fieldNames.forEach(fieldName => {
      initialValues[fieldName] = getFieldDefaultValue(fieldName, defaultRulesRef.current['parent'])
    })
    return initialValues
  })

  // Canvas dimensions state - initialized from rules
  const [canvasDimensions, setCanvasDimensions] = useState(() => {
    const saved = localStorage.getItem('playground_canvas_dimensions')
    if (saved) {
      return JSON.parse(saved)
    }
    // Initialize from current design rules
    const currentRules = defaultRulesRef.current[selectedDesign.id] || defaultRulesRef.current['parent']
    return {
      width: currentRules.width,
      height: currentRules.height
    }
  })

  // Preview tab state (visual or textual)
  const [previewTab, setPreviewTab] = useState('visual')
  const [reviewMode, setReviewMode] = useState('grid')
  const [activeReviewDesignId, setActiveReviewDesignId] = useState('parent')

  // Highlighted row state for URL preview interaction
  const [highlightedRow, setHighlightedRow] = useState(null)
  const [highlightedField, setHighlightedField] = useState(null)
  const [expandedLayers, setExpandedLayers] = useState(() => new Set())
  const [highlightedLayer, setHighlightedLayer] = useState(null) // For highlighting accordion
  const [hoveredLayerFromPanel, setHoveredLayerFromPanel] = useState(null) // For hover sync between panel and indicators

  // Layer overlay toggle state (default off)
  const [showLayerOverlays, setShowLayerOverlays] = useState(false)

  // Ref for preview wrapper to get actual displayed size
  const previewWrapperRef = useRef(null)

  // Editable rules state - initialized from DESIGN_RULES
  const [editableRules, setEditableRules] = useState(() => {
    const saved = localStorage.getItem('playground_editable_rules')
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        // Merge with DESIGN_RULES to ensure all properties exist
        const merged = {}
        const designIds = new Set([
          ...Object.keys(defaultRulesRef.current),
          ...Object.keys(parsed || {})
        ])
        designIds.forEach(designId => {
          const designRule = defaultRulesRef.current[designId] || parsed[designId] || {}
          const savedRule = parsed[designId] || {}

          // Deep merge layer properties dynamically
          const layers = extractLayers(designRule)
          const mergedLayers = {}
          Object.keys(layers).forEach(layerKey => {
            if (designRule[layerKey] || savedRule[layerKey]) {
              mergedLayers[layerKey] = {
                ...(designRule[layerKey] || {}),
                ...(savedRule[layerKey] || {})
              }
              // Ensure textWidth defaults to 80% of canvas width for text layers with textWrap
              const layerData = mergedLayers[layerKey]
              if (isTextLayer(layerData) && layerData.textWrap !== false && !layerData.textWidth) {
                layerData.textWidth = Math.round((designRule.width || 500) * 0.8)
              }
              // Ensure textWrap defaults to true for text layers
              if (isTextLayer(layerData) && layerData.textWrap === undefined) {
                layerData.textWrap = true
              }
            }
          })

          merged[designId] = {
            ...designRule,
            ...savedRule,
            ...mergedLayers
          }
        })
        // Ensure textWidth defaults for text layers with textWrap in merged rules
        Object.keys(merged).forEach(designId => {
          const designRule = merged[designId]
          Object.keys(designRule).forEach(key => {
            const layer = designRule[key]
            if (layer && typeof layer === 'object' && 'fontSize' in layer) {
              // It's a text layer
              if (layer.textWrap !== false && !layer.textWidth) {
                layer.textWidth = Math.round((designRule.width || 500) * 0.8)
              }
              if (layer.textWrap === undefined) {
                layer.textWrap = true
              }
            }
          })
        })
        return merged
      } catch (e) {
        // If parsing fails, use DESIGN_RULES
        const defaultRules = JSON.parse(JSON.stringify(defaultRulesRef.current))
        // Ensure textWidth defaults for text layers with textWrap
        Object.keys(defaultRules).forEach(designId => {
          const designRule = defaultRules[designId]
          Object.keys(designRule).forEach(key => {
            const layer = designRule[key]
            if (layer && typeof layer === 'object' && 'fontSize' in layer) {
              // It's a text layer
              if (layer.textWrap !== false && !layer.textWidth) {
                layer.textWidth = Math.round((designRule.width || 500) * 0.8)
              }
            }
          })
        })
        return defaultRules
      }
    }
    const defaultRules = JSON.parse(JSON.stringify(defaultRulesRef.current))
    // Ensure textWidth defaults for text layers with textWrap
    Object.keys(defaultRules).forEach(designId => {
      const designRule = defaultRules[designId]
      Object.keys(designRule).forEach(key => {
        const layer = designRule[key]
        if (layer && typeof layer === 'object' && 'fontSize' in layer) {
          // It's a text layer
          if (layer.textWrap !== false && !layer.textWidth) {
            layer.textWidth = Math.round((designRule.width || 500) * 0.8)
          }
        }
      })
    })
    return defaultRules
  })

  const [availableFonts, setAvailableFonts] = useState(() => {
    const saved = localStorage.getItem('playground_fonts')
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        if (Array.isArray(parsed)) {
          return parsed
        }
      } catch {
        // ignore parse errors
      }
    }
    return [...DEFAULT_GOOGLE_FONTS]
  })

  const [useMetadata, setUseMetadata] = useState(() => {
    const saved = localStorage.getItem('playground_metadata_toggles')
    if (saved) {
      return JSON.parse(saved)
    }
    // Initialize dynamically from field definitions
    const fieldNames = getAllFieldNames(defaultRulesRef.current['parent'])
    const initialToggles = {}
    fieldNames.forEach(fieldName => {
      initialToggles[fieldName] = false
    })
    return initialToggles
  })

  // Store saved values before toggling metadata on
  const [savedValues, setSavedValues] = useState(() => {
    const saved = localStorage.getItem('playground_saved_values')
    if (saved) {
      return JSON.parse(saved)
    }
    // Initialize dynamically from field definitions
    const fieldNames = getAllFieldNames(defaultRulesRef.current['parent'])
    const initialSaved = {}
    fieldNames.forEach(fieldName => {
      initialSaved[fieldName] = null
    })
    return initialSaved
  })

  // Inheritance toggles state
  const [inheritanceToggles, setInheritanceToggles] = useState(() => {
    const saved = localStorage.getItem('playground_inheritance_toggles')
    return saved ? JSON.parse(saved) : {
      inheritStyles: true,  // ON by default, disabled
      inheritAll: false      // OFF by default, can be changed
    }
  })

  // Track which properties are overridden (not inherited) for each child design
  // Structure: { 'ig-ad': { 'title': { 'color': true, 'font': false }, ... }, ... }
  const [propertyOverrides, setPropertyOverrides] = useState(() => {
    const saved = localStorage.getItem('playground_property_overrides')
    return saved ? JSON.parse(saved) : {}
  })

  const parentRules = useMemo(() => {
    return editableRules['parent'] || defaultRulesRef.current['parent']
  }, [editableRules])

  const getRulesForDesign = useCallback((designId) => {
    return editableRules[designId]
      || defaultRulesRef.current[designId]
      || editableRules['parent']
      || defaultRulesRef.current['parent']
      || {}
  }, [editableRules])

  // Parent card hover state
  const [isParentHovered, setIsParentHovered] = useState(false)

  // Save state to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('playground_asset', selectedAsset.id)
  }, [selectedAsset])

  useEffect(() => {
    localStorage.setItem('playground_design', selectedDesign.id)
  }, [selectedDesign])

  useEffect(() => {
    localStorage.setItem('playground_design_types', JSON.stringify(designTypes))
  }, [designTypes])

  useEffect(() => {
    if (!selectedDesign?.id) return
    const exists = designTypes.some(d => d.id === selectedDesign.id)
    if (!exists) {
      setSelectedDesign(designTypes.find(d => d.id === 'parent') || designTypes[0] || DESIGN_TYPES[0])
    }
  }, [designTypes, selectedDesign?.id])

  useEffect(() => {
    localStorage.setItem('playground_form', JSON.stringify(formValues))
  }, [formValues])

  useEffect(() => {
    localStorage.setItem('playground_metadata_toggles', JSON.stringify(useMetadata))
  }, [useMetadata])

  useEffect(() => {
    localStorage.setItem('playground_saved_values', JSON.stringify(savedValues))
  }, [savedValues])

  useEffect(() => {
    localStorage.setItem('playground_canvas_dimensions', JSON.stringify(canvasDimensions))
  }, [canvasDimensions])

  useEffect(() => {
    localStorage.setItem('playground_editable_rules', JSON.stringify(editableRules))
  }, [editableRules])

  useEffect(() => {
    localStorage.setItem('playground_inheritance_toggles', JSON.stringify(inheritanceToggles))
  }, [inheritanceToggles])

  useEffect(() => {
    localStorage.setItem('playground_property_overrides', JSON.stringify(propertyOverrides))
  }, [propertyOverrides])

  useEffect(() => {
    localStorage.setItem('playground_fonts', JSON.stringify(availableFonts))
  }, [availableFonts])

  // Update canvas dimensions when design changes
  useEffect(() => {
    const rules = getRulesForDesign(selectedDesign.id)
    // Update to match the new design's dimensions
    setCanvasDimensions({
      width: rules.width,
      height: rules.height
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDesign.id]) // Only depend on design ID to avoid resetting on rule changes

  // Helper to extract metadata ID from {id} syntax

  // Initialize formValues to show metadata syntax if toggle is on but formValues doesn't have it
  useEffect(() => {
    const fieldNames = getAllFieldNames(parentRules)
    const updates = {}
    let needsUpdate = false

    fieldNames.forEach(fieldName => {
      if (useMetadata[fieldName]) {
        const currentValue = formValues[fieldName]
        const expectedSyntax = getFieldMetadataSyntax(fieldName, parentRules)
        // If toggle is on but value doesn't match metadata syntax, update it
        if (currentValue !== expectedSyntax && !hasMetadataSyntax(currentValue)) {
          updates[fieldName] = expectedSyntax
          needsUpdate = true
        }
      }
    })

    if (needsUpdate) {
      setFormValues(prev => ({ ...prev, ...updates }))
    }
  }, [designTypes])

  // Sync toggle state with formValues on mount (in case formValues already contain {metadata})
  useEffect(() => {
    const syncUpdates = {}
    let needsSync = false

    Object.keys(formValues).forEach(field => {
      const hasMetadata = hasMetadataSyntax(formValues[field])
      const currentToggleState = useMetadata[field]

      if (hasMetadata !== currentToggleState) {
        syncUpdates[field] = hasMetadata
        needsSync = true

        // If formValue has {metadata} but toggle is off, save the non-metadata part
        if (hasMetadata && !currentToggleState && savedValues[field] === null) {
          const cleaned = formValues[field].replace(/\{[^}]+\}/g, '').trim()
          setSavedValues(prev => ({
            ...prev,
            [field]: cleaned || getFieldDefaultValue(field, parentRules)
          }))
        }
      }
    })

    if (needsSync) {
      setUseMetadata(prev => ({
        ...prev,
        ...syncUpdates
      }))
    }
  }, [designTypes])

  // Debounced values for the URL generation
  const [debouncedValues, setDebouncedValues] = useState(formValues)
  // Also debounce the toggle state for URL generation
  const [debouncedUseMetadata, setDebouncedUseMetadata] = useState(useMetadata)

  const [copySuccess, setCopySuccess] = useState('')
  const [imageLoading, setImageLoading] = useState(true)
  const [modifiedLayers, setModifiedLayers] = useState(new Set()) // Track layers that caused reload
  const [imageError, setImageError] = useState(false)
  // Track the URL currently being displayed in the image tag
  const [currentImageUrl, setCurrentImageUrl] = useState('')
  // Track if this is the initial load (don't show toast on initial load)
  const isInitialLoad = useRef(true)

  // Yoga Layout integration
  const yogaLayoutHook = useYogaLayout(editableRules)

  // Regenerate Yoga layouts when design rules change
  useEffect(() => {
    if (Object.keys(editableRules).length > 0) {
      yogaLayoutHook.generateYogaLayouts()
    }
  }, [editableRules, yogaLayoutHook.generateYogaLayouts])

  // Sync Yoga layout selected design with playground selected design
  useEffect(() => {
    if (selectedDesign?.id && yogaLayoutHook.yogaLayouts) {
      console.log(`[DesignPlayground] Switching Yoga design to: ${selectedDesign.id}`)
      yogaLayoutHook.switchDesign(selectedDesign.id)
    } else {
      console.log(`[DesignPlayground] Cannot switch Yoga design:`, { 
        designId: selectedDesign?.id, 
        hasLayouts: !!yogaLayoutHook.yogaLayouts 
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDesign?.id, yogaLayoutHook.yogaLayouts])

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValues(formValues)
      setDebouncedUseMetadata(useMetadata)
    }, 300)
    return () => clearTimeout(timer)
  }, [formValues, useMetadata])

  // Helper to build the logic for one field
  const buildFieldLogicLocal = useCallback((varName, metaKey, defaultValue, isNumber = false) => {
    // Format default value
    const safeDefault = (defaultValue && String(defaultValue).trim() !== '')
      ? defaultValue
      : (isNumber ? 0 : ' ')

    const defaultValFormatted = isNumber
      ? normalizeCloudinaryNumber(safeDefault, 0)
      : `!${doubleEscapeCloudinaryString(String(safeDefault))}!`

    // Check if we should use metadata (either toggle is on, or value contains {metadata})
    const useMeta = shouldUseMetadata(varName, debouncedValues, debouncedUseMetadata)

    if (!useMeta) {
      return `$${varName}_${defaultValFormatted}`
    } else {
      // Init-Default-Override Pattern
      // This ensures the variable is never empty/undefined, avoiding "Must specify text" errors.
      const parts = []
      // Generate unique simple temp variable name from varName (first 2 chars, or first char if short)
      const tempVar = varName.length >= 2 ? varName.substring(0, 2) : `t${varName.charAt(0)}`

      // 1. Initialize variable with Default Value first
      parts.push(`$${varName}_${defaultValFormatted}`)

      // 2. Fetch metadata into a temporary variable
      // Using 'md:!external_id!' for structured metadata (not ctx:)
      // The external_id should match the structured metadata field's external ID
      parts.push(`$${tempVar}_md:!${metaKey}!`)

      // 3. If temp variable is NOT empty, override the main variable
      // 'ne_!!' checks for not equal to empty string
      parts.push(`if_!${tempVar}!_ne_!!`)
      // Copy temp variable to main variable
      // Variables should be assigned directly, not wrapped in !...! (that's only for literal text)
      parts.push(`$${varName}_$${tempVar}`)
      parts.push(`if_end`)

      return parts.join('/')
    }
  }, [debouncedValues, debouncedUseMetadata])

  const buildDesignPreviewUrl = useCallback((designObj, dimensionsOverride = null) => {
    if (!designObj) return ''

    const rules = getRulesForDesign(designObj.id)

    const resolvedDimensions = dimensionsOverride || {
      width: rules?.width || designObj.width || BASE_WIDTH,
      height: rules?.height || designObj.height || BASE_WIDTH
    }

    const resolveDefaultValue = (fieldName, formVals, metadataToggles, saved) =>
      getDefaultValue(fieldName, formVals, metadataToggles, saved, rules)
    const resolveMetaKey = (fieldName, formVals) => getMetaKeyForField(fieldName, formVals, rules)

    return buildCloudinaryTransform({
      rules,
      canvasDimensions: resolvedDimensions,
      formValues: debouncedValues,
      useMetadata: debouncedUseMetadata,
      savedValues,
      selectedAsset,
      selectedDesign: designObj,
      baseWidth: resolvedDimensions.width,
      getDefaultValue: resolveDefaultValue,
      shouldUseMetadata,
      getMetaKeyForField: resolveMetaKey,
      getBackgroundColorValue: () => getBackgroundColorValue(debouncedValues, debouncedUseMetadata, savedValues),
      buildFieldLogicLocal
    })
  }, [
    getRulesForDesign,
    debouncedValues,
    debouncedUseMetadata,
    savedValues,
    selectedAsset,
    buildFieldLogicLocal
  ])

  const normalizeRulesForTextDefaults = useCallback((designRule) => {
    if (!designRule) return designRule
    const next = JSON.parse(JSON.stringify(designRule))
    Object.keys(next).forEach(key => {
      const layer = next[key]
      if (layer && typeof layer === 'object' && 'fontSize' in layer) {
        if (layer.textWrap !== false && !layer.textWidth) {
          layer.textWidth = Math.round((next.width || 500) * 0.8)
        }
        if (layer.textWrap === undefined) {
          layer.textWrap = true
        }
      }
    })
    return next
  }, [])

  const mergeRulesWithParent = useCallback((parent, child) => {
    const out = { ...(parent || {}), ...(child || {}) }
    Object.keys(out).forEach((k) => {
      const pv = parent?.[k]
      const cv = child?.[k]
      if (pv && cv && typeof pv === 'object' && typeof cv === 'object' && !Array.isArray(pv) && !Array.isArray(cv)) {
        out[k] = { ...pv, ...cv }
      }
    })
    return out
  }, [])

  const handleCreateChildDesignWithAI = useCallback(async (adType) => {
    const endpointUrl = import.meta.env.VITE_DESIGN_CREATOR_LAMBDA_URL
    if (!endpointUrl) {
      throw new Error('Missing VITE_DESIGN_CREATOR_LAMBDA_URL')
    }

    const parentDesignObj = designTypes.find(d => d.id === 'parent') || DESIGN_TYPES[0]
    const parentPreviewUrl = buildDesignPreviewUrl(parentDesignObj, {
      width: parentRules.width || BASE_WIDTH,
      height: parentRules.height || BASE_WIDTH
    })

    toast.loading('Generating child design…', { id: 'ai-child' })
    const { base64, contentType } = await fetchImageAsBase64({ url: parentPreviewUrl })
    const aiResponse = await createChildDesignWithAI({
      endpointUrl,
      adType,
      parentRules,
      parentImageBase64: base64,
      parentImageMediaType: contentType
    })

    const { designType, designRules } = aiResponse || {}
    if (!designType?.id || !designRules?.width || !designRules?.height) {
      throw new Error('Lambda response missing designType/designRules')
    }

    const childId = designType.id
    const childType = {
      id: childId,
      name: designType.name || adType,
      width: designType.width || designRules.width,
      height: designType.height || designRules.height,
      description: designType.description || `AI generated: ${adType}`
    }

    const mergedChildRules = mergeRulesWithParent(parentRules, designRules)
    const normalizedChildRules = normalizeRulesForTextDefaults(mergedChildRules)

    setDesignTypes(prev => {
      const exists = prev.some(d => d.id === childId)
      if (exists) return prev.map(d => (d.id === childId ? { ...d, ...childType } : d))
      return [...prev, childType]
    })
    setEditableRules(prev => ({
      ...prev,
      [childId]: normalizedChildRules
    }))
    defaultRulesRef.current = {
      ...defaultRulesRef.current,
      [childId]: normalizedChildRules
    }

    setPropertyOverrides(prev => {
      const computed = computePropertyOverridesForChild({
        childDesignId: childId,
        parentRules,
        childRules: normalizedChildRules,
        inheritanceToggles
      })
      return { ...prev, ...computed }
    })

    setSelectedDesign(childType)
    setCanvasDimensions({ width: normalizedChildRules.width, height: normalizedChildRules.height })
    toast.success(`Created "${childType.name}"`, { id: 'ai-child', duration: 2000 })
  }, [buildDesignPreviewUrl, designTypes, parentRules, inheritanceToggles, normalizeRulesForTextDefaults, mergeRulesWithParent])

  const getTransformedUrl = useCallback(() => {
    return buildDesignPreviewUrl(selectedDesign, canvasDimensions)
  }, [buildDesignPreviewUrl, selectedDesign, canvasDimensions])

  const generatedUrl = getTransformedUrl()

  const reviewPreviews = useMemo(() => {
    return designTypes.map(design => {
      const rules = getRulesForDesign(design.id)
      const width = rules.width || design.width || BASE_WIDTH
      const height = rules.height || design.height || BASE_WIDTH

      return {
        design,
        url: buildDesignPreviewUrl(design, { width, height }),
        width,
        height
      }
    })
  }, [buildDesignPreviewUrl, getRulesForDesign, designTypes])

  useEffect(() => {
    if (!reviewPreviews.length) return
    const exists = reviewPreviews.some(preview => preview.design.id === activeReviewDesignId)
    if (!exists) {
      setActiveReviewDesignId(reviewPreviews[0].design.id)
    }
  }, [reviewPreviews, activeReviewDesignId])

  const handleReviewDesignSelect = useCallback((designId) => {
    setActiveReviewDesignId(designId)
  }, [])

  const handleReviewCarouselNavigate = useCallback((direction) => {
    if (!reviewPreviews.length) return
    const currentIndex = reviewPreviews.findIndex(preview => preview.design.id === activeReviewDesignId)
    const safeIndex = currentIndex === -1 ? 0 : currentIndex
    const nextIndex = (safeIndex + direction + reviewPreviews.length) % reviewPreviews.length
    setActiveReviewDesignId(reviewPreviews[nextIndex].design.id)
  }, [reviewPreviews, activeReviewDesignId])

  // Extract layers from rules dynamically
  const layerMap = useMemo(() => {
    return extractLayersFromRules(parentRules)
  }, [parentRules])

  // Generate layer configuration from layer map
  const layerConfig = useMemo(() => {
    return generateLayerConfig(layerMap, {
      canvasRowKey: 'canvas-dimensions',
      backgroundRowKey: 'background-color'
    })
  }, [layerMap])

  // Parse URL into segments for interactive preview
  const urlSegments = useMemo(() => {
    return parseUrlSegmentsUtil(
      generatedUrl,
      CLOUDINARY_BASE_URL,
      selectedAsset.publicId,
      layerConfig
    )
  }, [generatedUrl, selectedAsset.publicId, layerConfig])

  // Handle URL segment click
  const handleSegmentClick = (rowKey) => {
    if (rowKey) {
      setHighlightedRow(rowKey)
      // Clear highlight after 2 seconds
      setTimeout(() => {
        setHighlightedRow(null)
      }, 2000)

      // Scroll to the first row with this key if it exists
      const rowElement = document.querySelector(`[data-row-key="${rowKey}"]`)
      if (rowElement) {
        rowElement.scrollIntoView({ behavior: 'smooth', block: 'center' })
      }
    }
  }

  // Handle layer indicator click - expand accordion, highlight accordion, and highlight field
  const handleLayerIndicatorClick = useCallback((layerKey) => {
    if (!layerKey) return

    // Expand the accordion for this layer
    setExpandedLayers(prev => {
      const newExpanded = new Set(prev)
      newExpanded.add(layerKey)
      return newExpanded
    })

    // Highlight the accordion
    setHighlightedLayer(layerKey)
    setTimeout(() => {
      setHighlightedLayer(null)
    }, 2000)

    // Find the field name for this layer
    const rules = editableRules[selectedDesign.id] || editableRules['parent'] || {}
    const layers = extractLayers(rules)
    const layerData = layers[layerKey]
    
    if (layerData && isTextLayer(layerData)) {
      const fieldName = layerData.fieldName || layerKey
      
      // Highlight the field
      setHighlightedField(fieldName)
      setTimeout(() => {
        setHighlightedField(null)
      }, 2000)
    } else if (layerData && isImageLayer(layerData)) {
      // For image layers, just expand the accordion (no field to highlight)
      // The accordion expansion above handles this
    }
  }, [editableRules, selectedDesign.id])

  // Apply/remove highlighted class to table rows
  useEffect(() => {
    // Remove all highlights first
    document.querySelectorAll('[data-row-key].highlighted').forEach(el => {
      el.classList.remove('highlighted')
    })

    // Add highlight to matching rows
    if (highlightedRow) {
      document.querySelectorAll(`[data-row-key="${highlightedRow}"]`).forEach(el => {
        el.classList.add('highlighted')
      })
    }
  }, [highlightedRow])

  // Helper to determine field type
  const getFieldType = (key, layerName) => {
    if (key === 'color') return 'color'
    if (key === 'gravity') return 'gravity'
    if (key === 'font') return 'font'
    if (key === 'flNoOverflow' || key === 'flTextDisallowOverflow' || key === 'textWrap') return 'boolean'
    if (key === 'fontSize') return 'fontSize' // Special type for fontSize (text input with validation)
    if (key === 'textWidth' || key === 'width' || key === 'height' || key === 'x' || key === 'y') return 'number'
    return 'text'
  }

  // Helper to get gravity options
  const getGravityOptions = () => {
    return Object.entries(GRAVITY_VALUES).map(([key, value]) => ({
      label: key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1').trim(),
      value: value
    }))
  }

  // Helper to get font options
  const getFontOptions = () => {
    return availableFonts
  }

  // Helper to check if a property is overridden (not inherited) for a child design
  const isPropertyOverridden = useCallback((designId, layerKey, propertyKey) => {
    if (designId === 'parent') return false // Parent doesn't inherit
    return propertyOverrides[designId]?.[layerKey]?.[propertyKey] === true
  }, [propertyOverrides])


  // Handle fontSize validation and revert (prevent percentage in parent)
  const handleFontSizeValidation = (category, layerName, key, value, previousValue) => {
    const designId = selectedDesign.id

    // Check if parent design and value contains percentage
    if (designId === 'parent' && typeof value === 'string' && value.includes('%')) {
      toast.error('Parent design cannot use percentage values for font size')
      // Revert to previous value
      if (previousValue !== undefined && previousValue !== null) {
        handleRuleUpdate(category, layerName, key, previousValue)
      }
      return false
    }

    return true
  }

  // Handle rule value update - created using utility function
  const handleRuleUpdate = useMemo(() => createRuleUpdateHandler({
    setEditableRules,
    selectedDesignId: selectedDesign.id,
    setCanvasDimensions,
    setPropertyOverrides,
    layerMap,
    setModifiedLayers,
    setFormValues,
    inheritanceToggles,
    isPropertyOverridden,
    getChildDesignIds: () => designTypes.filter(d => d.id !== 'parent').map(d => d.id)
  }), [selectedDesign.id, layerMap, inheritanceToggles, propertyOverrides, isPropertyOverridden, designTypes])

  // Helper to get layer key from layer display name
  const getLayerKey = useCallback((layerName) => {
    if (!layerName || !layerMap) return null
    const found = Object.keys(layerMap).find(
      key => layerMap[key].displayName === layerName
    )
    return found || null
  }, [layerMap])

  const getLayerKeyByFieldName = useCallback((fieldName) => {
    if (!fieldName || !layerMap) return null
    return Object.keys(layerMap).find(key => {
      const layer = layerMap[key]?.layerData
      if (!layer) return false
      if (layer.fieldName) {
        return layer.fieldName === fieldName
      }
      return key === fieldName
    }) || null
  }, [layerMap])

  // Helper to check if a property is inherited (for display)
  const isPropertyInherited = (category, layerName, key) => {
    const designId = selectedDesign.id
    if (designId === 'parent') return false // Parent doesn't inherit

    const layerKey = category === 'General' ? '_general' : getLayerKey(layerName)
    if (!layerKey) return false

    // Normalize key for General properties (Width/Height -> width/height)
    const normalizedKey = category === 'General' && (key === 'Width' || key === 'Height')
      ? key.toLowerCase()
      : key

    // Check if property is overridden
    const isOverridden = isPropertyOverridden(designId, layerKey, normalizedKey)
    if (isOverridden) return false

    // Check if property should be inherited
    return shouldInheritProperty(normalizedKey, inheritanceToggles)
  }

  // Helper to check if a property would be inherited (even if currently overridden)
  const wouldPropertyBeInherited = (category, layerName, key) => {
    const designId = selectedDesign.id
    if (designId === 'parent') return false // Parent doesn't inherit

    const layerKey = category === 'General' ? '_general' : getLayerKey(layerName)
    if (!layerKey) return false

    // Normalize key for General properties (Width/Height -> width/height)
    const normalizedKey = category === 'General' && (key === 'Width' || key === 'Height')
      ? key.toLowerCase()
      : key

    // Check if property should be inherited (regardless of override status)
    return shouldInheritProperty(normalizedKey, inheritanceToggles)
  }

  // Helper to check if a property is overridden (for showing reset button)
  const isPropertyOverriddenForDisplay = (category, layerName, key) => {
    const designId = selectedDesign.id
    if (designId === 'parent') return false // Parent doesn't have overrides

    const layerKey = category === 'General' ? '_general' : getLayerKey(layerName)
    if (!layerKey) return false

    // Normalize key for General properties (Width/Height -> width/height)
    const normalizedKey = category === 'General' && (key === 'Width' || key === 'Height')
      ? key.toLowerCase()
      : key

    return isPropertyOverridden(designId, layerKey, normalizedKey)
  }

  // Handle reset property to inherited state
  const handleResetProperty = (category, layerName, key) => {
    const designId = selectedDesign.id
    if (designId === 'parent') return // Can't reset parent

    const layerKey = category === 'General' ? '_general' : getLayerKey(layerName)

    // Remove override
    setPropertyOverrides(prev => {
      const newOverrides = JSON.parse(JSON.stringify(prev))
      if (newOverrides[designId]?.[layerKey]) {
        delete newOverrides[designId][layerKey][key]
        // Clean up empty objects
        if (Object.keys(newOverrides[designId][layerKey]).length === 0) {
          delete newOverrides[designId][layerKey]
        }
        if (Object.keys(newOverrides[designId]).length === 0) {
          delete newOverrides[designId]
        }
      }
      return newOverrides
    })

    // Copy value from parent
    setEditableRules(prev => {
      const newRules = JSON.parse(JSON.stringify(prev))

      if (category === 'General') {
        if (key === 'Width' || key === 'Height') {
          const propKey = key.toLowerCase()
          const parentValue = newRules['parent']?.[propKey] || 0
          if (newRules[designId]) {
            newRules[designId][propKey] = parentValue
          }
          if (key === 'Width') {
            setCanvasDimensions(prev => ({ ...prev, width: parentValue }))
          } else {
            setCanvasDimensions(prev => ({ ...prev, height: parentValue }))
          }
        }
      } else if (category === 'Layers' && layerName && layerKey) {
        const parentValue = newRules['parent']?.[layerKey]?.[key]
        if (parentValue !== undefined && newRules[designId]?.[layerKey]) {
          newRules[designId][layerKey][key] = parentValue
        }
      }

      return newRules
    })
  }

  // Track the previous URL to detect changes
  const previousUrlRef = useRef('')

  // When generated URL changes, set loading to true and clear error
  useEffect(() => {
    if (generatedUrl !== currentImageUrl) {
      setImageLoading(true)
      setImageError(false)
      // Store the previous URL to detect if this is a change (not initial load)
      previousUrlRef.current = currentImageUrl
    }
  }, [generatedUrl, currentImageUrl])

  const handleImageLoad = () => {
    setImageLoading(false)
    setImageError(false)
    setModifiedLayers(new Set()) // Clear modified layers when image finishes loading

    // Show success toast if this is not the initial load and URL actually changed
    if (!isInitialLoad.current && previousUrlRef.current && previousUrlRef.current !== generatedUrl) {
      toast.success('Preview updated successfully', {
        duration: 2000,
        icon: '✓'
      })
    }

    // Mark that initial load is complete
    if (isInitialLoad.current) {
      isInitialLoad.current = false
    }

    setCurrentImageUrl(generatedUrl)
  }

  const handleImageError = (e) => {
    setImageLoading(false)
    setImageError(true)
    toast.error('Failed to load preview image. Check the transformation URL for errors.')
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    const hasMetadata = hasMetadataSyntax(value)
    const currentToggleState = useMetadata[name]

    // Find which layer uses this fieldName and track it as modified
    if (name !== 'backgroundColor') { // backgroundColor is not a layer field
      const rules = editableRules[selectedDesign.id] || editableRules['parent'] || {}
      const layers = extractLayers(rules)
      
      // Find the layer that uses this fieldName
      const layerKey = Object.keys(layers).find(key => {
        const layerData = layers[key]
        if (isTextLayer(layerData)) {
          const layerFieldName = layerData.fieldName || key
          return layerFieldName === name
        }
        return false
      })
      
      // Track this layer as modified (will cause image reload)
      if (layerKey) {
        setModifiedLayers(prev => {
          const newSet = new Set(prev)
          newSet.add(layerKey)
          return newSet
        })
      }
    }

    // Update form value first
    setFormValues(prev => ({
      ...prev,
      [name]: value
    }))

    // Auto-sync toggle state based on {metadata} syntax
    if (hasMetadata !== currentToggleState) {
      // If value contains {metadata} but toggle is off, turn it on
      if (hasMetadata && !currentToggleState) {
        // Extract any non-metadata text from the value to save
        const cleaned = value.replace(/\{[^}]+\}/g, '').trim()
        // Only save if we have a meaningful value to save (not just metadata syntax)
        if (cleaned && savedValues[name] === null) {
          setSavedValues(prev => ({
            ...prev,
            [name]: cleaned
          }))
        }
        setUseMetadata(prev => ({
          ...prev,
          [name]: true
        }))
      }
      // If value doesn't contain {metadata} but toggle is on, turn it off
      else if (!hasMetadata && currentToggleState) {
        // Don't auto-restore here - let user keep typing
        // The toggle will just turn off, but value stays as user typed
        setUseMetadata(prev => ({
          ...prev,
          [name]: false
        }))
      }
    }
  }

  const handleToggleChange = (field) => {
    const isTurningOn = !useMetadata[field]

    // Find which layer uses this fieldName and track it as modified (if not backgroundColor)
    if (field !== 'backgroundColor') {
      const rules = editableRules[selectedDesign.id] || editableRules['parent'] || {}
      const layers = extractLayers(rules)
      
      // Find the layer that uses this fieldName
      const layerKey = Object.keys(layers).find(key => {
        const layerData = layers[key]
        if (isTextLayer(layerData)) {
          const layerFieldName = layerData.fieldName || key
          return layerFieldName === field
        }
        return false
      })
      
      // Track this layer as modified (will cause image reload)
      if (layerKey) {
        setModifiedLayers(prev => {
          const newSet = new Set(prev)
          newSet.add(layerKey)
          return newSet
        })
      }
    }

    if (isTurningOn) {
      // Save current value before turning on
      // If current value already has {metadata}, extract the text part or use saved/default
      const currentValue = formValues[field]
      let valueToSave = currentValue

      // If current value contains {metadata}, try to extract the non-metadata part
      if (hasMetadataSyntax(currentValue)) {
        const cleaned = currentValue.replace(/\{[^}]+\}/g, '').trim()
        valueToSave = cleaned || getFieldDefaultValue(field, parentRules)
      }

      setSavedValues(prev => ({
        ...prev,
        [field]: valueToSave
      }))

      // Set to metadata syntax using {id} format
      const metaSyntax = getFieldMetadataSyntax(field, parentRules)
      setFormValues(prev => ({
        ...prev,
        [field]: metaSyntax
      }))
    } else {
      // Restore saved value when turning off, or fallback to default
      const valueToRestore = savedValues[field] !== null
        ? savedValues[field]
        : getFieldDefaultValue(field, parentRules)

      setFormValues(prev => ({
        ...prev,
        [field]: valueToRestore
      }))
    }

    setUseMetadata(prev => ({
      ...prev,
      [field]: !prev[field]
    }))
  }

  const handleCopy = async () => {
    try {
      // Always copy the valid URL, regardless of display mode
      await navigator.clipboard.writeText(generatedUrl)
      setCopySuccess('Copied!')
      setTimeout(() => setCopySuccess(''), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }



  const focusLayerInDesign = useCallback((fieldName) => {
    if (!fieldName) return
    setHighlightedField(fieldName)
    const layerKey = getLayerKeyByFieldName(fieldName)
    if (layerKey) {
      setHighlightedLayer(layerKey)
      setExpandedLayers(prev => {
        const next = new Set(prev)
        next.add(layerKey)
        return next
      })
    }
  }, [getLayerKeyByFieldName])

  const handleTemplateImported = useCallback((payload) => {
    if (!payload?.designRules?.parent) return
    const parentRule = payload.designRules.parent
    setEditableRules(prev => ({
      ...prev,
      ...payload.designRules
    }))
    defaultRulesRef.current = {
      ...defaultRulesRef.current,
      ...payload.designRules
    }
    const fieldNames = getAllFieldNames(parentRule)
    const nextFormValues = {}
    fieldNames.forEach(fieldName => {
      if (fieldName === 'backgroundColor' && parentRule.backgroundColor) {
        nextFormValues[fieldName] = parentRule.backgroundColor
      } else {
        nextFormValues[fieldName] = getFieldDefaultValue(fieldName, parentRule)
      }
    })
    setFormValues(nextFormValues)
    const metadataToggles = {}
    fieldNames.forEach(fieldName => {
      metadataToggles[fieldName] = false
    })
    setUseMetadata(metadataToggles)
    const nextSavedValues = {}
    fieldNames.forEach(fieldName => {
      nextSavedValues[fieldName] = null
    })
    setSavedValues(nextSavedValues)
    setCanvasDimensions({
      width: parentRule.width || BASE_WIDTH,
      height: parentRule.height || BASE_WIDTH
    })
    setSelectedDesign(designTypes.find(d => d.id === 'parent') || DESIGN_TYPES[0])
    setInheritanceToggles({
      inheritStyles: true,
      inheritAll: false
    })
    setPropertyOverrides({})
    setPreviewTab('visual')
    setReviewMode('grid')
    setActiveReviewDesignId('parent')
    setHighlightedRow(null)
    setHighlightedField(null)
    setHighlightedLayer(null)
    setExpandedLayers(new Set())
    setShowLayerOverlays(false)
    if (payload.fonts?.length) {
      setAvailableFonts(prev => mergeFontOptions(prev, payload.fonts))
    }
    if (payload.templateName) {
      setDesignName(payload.templateName)
    }
    
    // Generate Yoga Layout representation after import
    setTimeout(() => {
      const yogaLayouts = yogaLayoutHook.generateYogaLayouts()
      if (yogaLayouts) {
        console.log('✅ Yoga Layout generated and stored in memory')
      }
    }, 500)
    
    toast.success(`Created design from ${payload.templateName || 'imported template'}`)
  }, [yogaLayoutHook])

  const handleSelectExample = useCallback(() => {
    // Reset to default design rules
    const defaultRules = cloneDesignRules()
    defaultRulesRef.current = defaultRules
    setEditableRules(defaultRules)
    
    // Reset form values to defaults
    const fieldNames = getAllFieldNames(defaultRules['parent'])
    const initialValues = {}
    fieldNames.forEach(fieldName => {
      initialValues[fieldName] = getFieldDefaultValue(fieldName, defaultRules['parent'])
    })
    setFormValues(initialValues)
    
    // Reset metadata toggles
    const metadataToggles = {}
    fieldNames.forEach(fieldName => {
      metadataToggles[fieldName] = false
    })
    setUseMetadata(metadataToggles)
    
    // Reset saved values
    const savedVals = {}
    fieldNames.forEach(fieldName => {
      savedVals[fieldName] = null
    })
    setSavedValues(savedVals)
    
    // Reset canvas dimensions
    const parentRule = defaultRules['parent']
    setCanvasDimensions({
      width: parentRule.width || BASE_WIDTH,
      height: parentRule.height || BASE_WIDTH
    })
    
    // Reset design name
    setDesignName('Shoes Ad Example')
    
    // Reset other states
    setSelectedDesign(designTypes.find(d => d.id === 'parent') || DESIGN_TYPES[0])
    setInheritanceToggles({
      inheritStyles: true,
      inheritAll: false
    })
    setPropertyOverrides({})
    setPreviewTab('visual')
    setReviewMode('grid')
    setActiveReviewDesignId('parent')
    setHighlightedRow(null)
    setHighlightedField(null)
    setHighlightedLayer(null)
    setExpandedLayers(new Set())
    setShowLayerOverlays(false)
    
    toast.success('Reset to default example')
  }, [])

  const handleSelectFigma = useCallback(() => {
    setIsImportModalOpen(true)
  }, [])

  const handleSelectCloudinary = useCallback(() => {
    toast('Coming soon', {
      icon: 'ℹ️',
      duration: 2000
    })
  }, [])

  const isLocalEnvironment = useMemo(() => {
    if (typeof window === 'undefined') {
      return import.meta.env.DEV
    }
    const host = window.location.hostname
    return host === 'localhost' || host === '127.0.0.1' || host.endsWith('.local')
  }, [])

  useEffect(() => {
    if (!isLocalEnvironment) {
      setIsNewDesignModalOpen(false)
      setIsImportModalOpen(false)
    }
  }, [isLocalEnvironment])

  const designContext = {
    selectedAsset,
    setSelectedAsset,
    designTypes,
    selectedDesign,
    setSelectedDesign,
    openAICreateChildDesignModal: () => setIsAICreateChildModalOpen(true),
    canvasDimensions,
    setCanvasDimensions,
    inheritanceToggles,
    setInheritanceToggles,
    previewTab,
    setPreviewTab,
    previewWrapperRef,
    imageLoading,
    imageError,
    currentImageUrl,
    generatedUrl,
    handleImageLoad,
    handleImageError,
    showLayerOverlays,
    setShowLayerOverlays,
    editableRules,
    formValues,
    useMetadata,
    urlSegments,
    highlightedRow,
    handleSegmentClick,
    handleLayerIndicatorClick,
    modifiedLayers,
    handleRuleUpdate,
    handleResetProperty,
    isPropertyInherited,
    isPropertyOverriddenForDisplay,
    wouldPropertyBeInherited,
    getFieldType,
    getGravityOptions,
    getFontOptions,
    getRulesForDesign,
    handleFontSizeValidation,
    hoveredLayerFromPanel,
    setHoveredLayerFromPanel,
    copySuccess,
    handleInputChange,
    handleToggleChange,
    handleCopy,
    getTransformedUrl,
    layerMap,
    highlightedField,
    expandedLayers,
    setExpandedLayers,
    highlightedLayer,
    yogaLayout: yogaLayoutHook
  }

  const reviewContext = {
    reviewMode,
    setReviewMode,
    reviewPreviews,
    activeReviewDesignId,
    handleReviewDesignSelect,
    handleReviewCarouselNavigate,
    formValues,
    handleInputChange,
    layerMap,
    focusLayerInDesign
  }

  return (
    <div className="playground-container">
      <div className="playground-top-nav">
        <div className="playground-nav-title">
          <h2>Design Playground</h2>
          {designName && <h3>{designName}</h3>}
        </div>
        <div className="playground-nav-actions">
          <div className="playground-nav-links">
            <NavLink
              to="/playground/design"
              end
              className={({ isActive }) => `playground-nav-link ${isActive ? 'active' : ''}`}
            >
              Design
            </NavLink>
            <NavLink
              to="/playground/review"
              className={({ isActive }) => `playground-nav-link ${isActive ? 'active' : ''}`}
            >
              Review
            </NavLink>
          </div>          
          <AssetSwitcher
            selectedAsset={selectedAsset}
            onAssetChange={setSelectedAsset}
          />
          {isLocalEnvironment && (
            <button
              type="button"
              className="playground-new-btn"
              onClick={() => setIsNewDesignModalOpen(true)}
            >
              New
            </button>
          )}
        </div>
      </div>

      <div className="playground-route-shell">
        <Outlet context={{ design: designContext, review: reviewContext }} />
      </div>
      {isLocalEnvironment && (
        <>
          <NewDesignModal
            isOpen={isNewDesignModalOpen}
            onClose={() => setIsNewDesignModalOpen(false)}
            onSelectExample={handleSelectExample}
            onSelectFigma={handleSelectFigma}
            onSelectCloudinary={handleSelectCloudinary}
          />
          <FigmaImportModal
            isOpen={isImportModalOpen}
            onClose={() => setIsImportModalOpen(false)}
            onTemplateImported={handleTemplateImported}
          />
        </>
      )}
      <AICreateChildDesignModal
        isOpen={isAICreateChildModalOpen}
        onClose={() => setIsAICreateChildModalOpen(false)}
        onCreate={async (adType) => {
          try {
            await handleCreateChildDesignWithAI(adType)
          } catch (e) {
            toast.error(e?.message || 'Failed to create child design', { id: 'ai-child' })
          }
        }}
      />
    </div>
  )
}

export default DesignPlayground

