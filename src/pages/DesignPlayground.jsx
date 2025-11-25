import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react'
import toast from 'react-hot-toast'
import './DesignPlayground.css'
import { ASSETS, DESIGN_TYPES, DESIGN_RULES, GRAVITY_VALUES, GOOGLE_FONTS, LIGHT_BLUE, BASE_WIDTH } from './playground/constants'
import PlaygroundHeader from './playground/PlaygroundHeader'
import DesignSelector from './playground/DesignSelector'
import Preview from './playground/Preview'
import Controls from './playground/Controls'
import TextualPreview from './playground/TextualPreview'
import { parseUrlSegments as parseUrlSegmentsUtil, generateLayerConfig, extractLayersFromRules } from '../utils/urlParser'
import { extractMetadataId, hasMetadataSyntax, getMetadataKey } from '../utils/metadataUtils'
import { escapeCloudinaryString, getDefaultValue, shouldUseMetadata, getMetaKeyForField, getBackgroundColorValue } from '../utils/cloudinaryUtils'
import { buildCloudinaryTransform } from '../utils/cloudinaryTransformBuilder'

function DesignPlayground() {
  const [selectedAsset, setSelectedAsset] = useState(() => {
    const saved = localStorage.getItem('playground_asset')
    return saved ? ASSETS.find(a => a.id === saved) || ASSETS[2] : ASSETS[2]
  })

  const [selectedDesign, setSelectedDesign] = useState(() => {
    const saved = localStorage.getItem('playground_design')
    return saved ? DESIGN_TYPES.find(d => d.id === saved) || DESIGN_TYPES[0] : DESIGN_TYPES[0]
  })

  const [formValues, setFormValues] = useState(() => {
    const saved = localStorage.getItem('playground_form')
    return saved ? JSON.parse(saved) : {
      title: 'Now on Sale',
      tagline: 'Limited Time Offer',
      price: '80',
      backgroundColor: '#000428'
    }
  })

  // Canvas dimensions state - initialized from rules
  const [canvasDimensions, setCanvasDimensions] = useState(() => {
    const saved = localStorage.getItem('playground_canvas_dimensions')
    if (saved) {
      return JSON.parse(saved)
    }
    // Initialize from current design rules
    const currentRules = DESIGN_RULES[selectedDesign.id] || DESIGN_RULES['parent']
    return {
      width: currentRules.width,
      height: currentRules.height
    }
  })

  // Preview tab state (visual or textual)
  const [previewTab, setPreviewTab] = useState('visual')

  // Highlighted row state for URL preview interaction
  const [highlightedRow, setHighlightedRow] = useState(null)

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
        Object.keys(DESIGN_RULES).forEach(designId => {
          const designRule = DESIGN_RULES[designId]
          const savedRule = parsed[designId] || {}

          // Deep merge layer properties (title, tagline, price, origPrice, image, logo)
          const layerKeys = ['title', 'tagline', 'price', 'origPrice', 'image', 'logo']
          const mergedLayers = {}
          layerKeys.forEach(layerKey => {
            if (designRule[layerKey] || savedRule[layerKey]) {
              mergedLayers[layerKey] = {
                ...(designRule[layerKey] || {}),
                ...(savedRule[layerKey] || {})
              }
              // Ensure textWidth defaults to 80% of canvas width for title and tagline
              if ((layerKey === 'title' || layerKey === 'tagline') && !mergedLayers[layerKey].textWidth) {
                mergedLayers[layerKey].textWidth = Math.round((designRule.width || 500) * 0.8)
              }
              // Ensure textWrap defaults to true for title and tagline
              if ((layerKey === 'title' || layerKey === 'tagline') && mergedLayers[layerKey].textWrap === undefined) {
                mergedLayers[layerKey].textWrap = true
              }
            }
          })

          merged[designId] = {
            ...designRule,
            ...savedRule,
            ...mergedLayers,
            // Ensure showLogo and logoPublicId are merged
            showLogo: savedRule.showLogo !== undefined ? savedRule.showLogo : (designRule.showLogo !== undefined ? designRule.showLogo : true),
            logoPublicId: savedRule.logoPublicId || designRule.logoPublicId || 'create/shoes/shoe-logo-small'
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
        const defaultRules = JSON.parse(JSON.stringify(DESIGN_RULES))
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
    const defaultRules = JSON.parse(JSON.stringify(DESIGN_RULES))
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

  const [useMetadata, setUseMetadata] = useState(() => {
    const saved = localStorage.getItem('playground_metadata_toggles')
    return saved ? JSON.parse(saved) : {
      title: false,
      tagline: false,
      price: false,
      backgroundColor: false
    }
  })

  // Store saved values before toggling metadata on
  const [savedValues, setSavedValues] = useState(() => {
    const saved = localStorage.getItem('playground_saved_values')
    return saved ? JSON.parse(saved) : {
      title: null,
      tagline: null,
      price: null,
      backgroundColor: null
    }
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

  // Update canvas dimensions when design changes
  useEffect(() => {
    const rules = editableRules[selectedDesign.id] || editableRules['parent'] || DESIGN_RULES[selectedDesign.id] || DESIGN_RULES['parent']
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
    const metaFields = {
      title: '{ptitle}',
      tagline: '{pdescription}',
      price: '{pprice}',
      backgroundColor: '{pbackgroundcolor}'
    }

    const updates = {}
    let needsUpdate = false

    Object.keys(metaFields).forEach(field => {
      if (useMetadata[field]) {
        const currentValue = formValues[field]
        const expectedSyntax = metaFields[field]
        // If toggle is on but value doesn't match metadata syntax, update it
        if (currentValue !== expectedSyntax && !hasMetadataSyntax(currentValue)) {
          updates[field] = expectedSyntax
          needsUpdate = true
        }
      }
    })

    if (needsUpdate) {
      setFormValues(prev => ({ ...prev, ...updates }))
    }
  }, []) // Only run on mount

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
            [field]: cleaned || (field === 'title' ? 'Now on Sale' : field === 'tagline' ? 'Limited Time Offer' : '80')
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
  }, []) // Only run on mount

  // Debounced values for the URL generation
  const [debouncedValues, setDebouncedValues] = useState(formValues)
  // Also debounce the toggle state for URL generation
  const [debouncedUseMetadata, setDebouncedUseMetadata] = useState(useMetadata)

  const [copySuccess, setCopySuccess] = useState('')
  const [imageLoading, setImageLoading] = useState(true)
  const [imageError, setImageError] = useState(false)
  // Track the URL currently being displayed in the image tag
  const [currentImageUrl, setCurrentImageUrl] = useState('')
  // Track if this is the initial load (don't show toast on initial load)
  const isInitialLoad = useRef(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValues(formValues)
      setDebouncedUseMetadata(useMetadata)
    }, 300)
    return () => clearTimeout(timer)
  }, [formValues, useMetadata])

  // Helper to build the logic for one field
  const buildFieldLogicLocal = (varName, metaKey, defaultValue, isNumber = false) => {
    // Format default value
    const safeDefault = (defaultValue && String(defaultValue).trim() !== '')
      ? defaultValue
      : (isNumber ? 0 : ' ')

    const defaultValFormatted = isNumber ? safeDefault : `!${safeDefault}!`

    // Check if we should use metadata (either toggle is on, or value contains {metadata})
    const useMeta = shouldUseMetadata(varName, debouncedValues, debouncedUseMetadata)

    if (!useMeta) {
      return `$${varName}_${defaultValFormatted}`
    } else {
      // Init-Default-Override Pattern
      // This ensures the variable is never empty/undefined, avoiding "Must specify text" errors.
      const parts = []
      // Use unique simple temp variable names to avoid parsing issues with underscores
      const tempVarMap = { title: 'tt', tagline: 'tg', price: 'tp', backgroundColor: 'tb' }
      const tempVar = tempVarMap[varName] || `t${varName.charAt(0)}`

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
  }

  const getTransformedUrl = () => {
    // Get positioning rules for the selected design type (use editable rules)
    const rules = editableRules[selectedDesign.id] || editableRules['parent']

    return buildCloudinaryTransform({
      rules,
      canvasDimensions,
      formValues: debouncedValues,
      useMetadata: debouncedUseMetadata,
      savedValues,
      selectedAsset,
      selectedDesign,
      baseWidth: BASE_WIDTH,
      getDefaultValue: (fieldName) => getDefaultValue(fieldName, debouncedValues, debouncedUseMetadata, savedValues),
      shouldUseMetadata,
      getMetaKeyForField,
      getBackgroundColorValue: () => getBackgroundColorValue(debouncedValues, debouncedUseMetadata, savedValues),
      buildFieldLogicLocal
    })
  }

  const generatedUrl = getTransformedUrl()

  // Extract layers from rules dynamically
  const layerMap = useMemo(() => {
    const rules = editableRules['parent'] || DESIGN_RULES['parent'] || {}
    return extractLayersFromRules(rules)
  }, [editableRules])

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
      'https://res.cloudinary.com/yoav-cloud/image/upload/',
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
    return GOOGLE_FONTS
  }

  // Helper to check if a property is overridden (not inherited) for a child design
  const isPropertyOverridden = (designId, layerKey, propertyKey) => {
    if (designId === 'parent') return false // Parent doesn't inherit
    return propertyOverrides[designId]?.[layerKey]?.[propertyKey] === true
  }

  // Helper to check if a property should be inherited based on type and toggles
  const shouldInheritProperty = (propertyKey) => {
    // Canvas dimensions (Width, Height with capital letters) are NEVER inherited
    // This only applies to General category canvas dimensions, not layer width/height
    if (propertyKey === 'Width' || propertyKey === 'Height') {
      return false
    }
    // Logo properties (showLogo, logoPublicId) are inherited if inheritAll is ON
    if (propertyKey === 'showLogo' || propertyKey === 'logoPublicId') {
      return inheritanceToggles.inheritAll
    }
    // Style properties (color, font, flags, textWrap) are inherited if inheritStyles is ON
    const styleProperties = ['color', 'font', 'flNoOverflow', 'flTextDisallowOverflow', 'textWrap']
    if (styleProperties.includes(propertyKey)) {
      return inheritanceToggles.inheritStyles
    }
    // Position/size properties (x, y, width, height, fontSize, gravity, textWidth) are inherited if inheritAll is ON
    // Note: width/height here refer to layer dimensions (like logo, image), not canvas dimensions
    const positionSizeProperties = ['x', 'y', 'width', 'height', 'fontSize', 'gravity', 'textWidth']
    if (positionSizeProperties.includes(propertyKey)) {
      return inheritanceToggles.inheritAll
    }
    return false
  }

  // Helper to propagate parent property change to children
  const propagateToChildren = (layerKey, propertyKey, value, newRules) => {
    if (selectedDesign.id !== 'parent') return newRules // Only propagate from parent

    const shouldInherit = shouldInheritProperty(propertyKey)
    if (!shouldInherit) return newRules

    // Get child design IDs
    const childDesigns = DESIGN_TYPES.filter(d => d.id !== 'parent').map(d => d.id)

    childDesigns.forEach(childId => {
      // Only propagate if child doesn't have an override
      if (!isPropertyOverridden(childId, layerKey, propertyKey)) {
        if (layerKey === '_general') {
          // General properties (width, height) are at design level
          if (newRules[childId]) {
            newRules[childId][propertyKey] = value
          }
        } else {
          // Layer properties
          if (newRules[childId] && newRules[childId][layerKey]) {
            newRules[childId][layerKey][propertyKey] = value
          }
        }
      }
    })

    return newRules
  }

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

  // Handle rule value update
  const handleRuleUpdate = (category, layerName, key, value) => {
    setEditableRules(prev => {
      const newRules = JSON.parse(JSON.stringify(prev))
      const designId = selectedDesign.id

      if (category === 'General') {
        if (key === 'Width') {
          const widthValue = parseInt(value) || 0
          setCanvasDimensions(prev => ({ ...prev, width: widthValue }))
          // Also update editableRules
          if (newRules[designId]) {
            newRules[designId].width = widthValue
          }
          // Mark as overridden if child (dimensions never inherit, so no propagation)
          if (designId !== 'parent') {
            setPropertyOverrides(prev => ({
              ...prev,
              [designId]: {
                ...prev[designId],
                _general: { ...prev[designId]?._general, width: true }
              }
            }))
          }
          // Dimensions are never inherited, so no propagation
        } else if (key === 'Height') {
          const heightValue = parseInt(value) || 0
          setCanvasDimensions(prev => ({ ...prev, height: heightValue }))
          // Also update editableRules
          if (newRules[designId]) {
            newRules[designId].height = heightValue
          }
          // Mark as overridden if child (dimensions never inherit, so no propagation)
          if (designId !== 'parent') {
            setPropertyOverrides(prev => ({
              ...prev,
              [designId]: {
                ...prev[designId],
                _general: { ...prev[designId]?._general, height: true }
              }
            }))
          }
          // Dimensions are never inherited, so no propagation
        } else if (key === 'Background Color') {
          setFormValues(prev => ({ ...prev, backgroundColor: value }))
        } else if (key === 'showLogo') {
          // Update showLogo
          if (newRules[designId]) {
            newRules[designId].showLogo = value
          }
          // Mark as overridden if child, propagate if parent
          if (designId !== 'parent') {
            setPropertyOverrides(prev => ({
              ...prev,
              [designId]: {
                ...prev[designId],
                _general: { ...prev[designId]?._general, showLogo: true }
              }
            }))
          } else {
            // Propagate to children if inheritAll is enabled
            if (inheritanceToggles.inheritAll) {
              Object.keys(newRules).forEach(childId => {
                if (childId !== 'parent' && !isPropertyOverridden(childId, '_general', 'showLogo')) {
                  if (newRules[childId]) {
                    newRules[childId].showLogo = value
                  }
                }
              })
            }
          }
        } else if (key === 'logoPublicId') {
          // Update logoPublicId
          if (newRules[designId]) {
            newRules[designId].logoPublicId = value
          }
          // Mark as overridden if child, propagate if parent
          if (designId !== 'parent') {
            setPropertyOverrides(prev => ({
              ...prev,
              [designId]: {
                ...prev[designId],
                _general: { ...prev[designId]?._general, logoPublicId: true }
              }
            }))
          } else {
            // Propagate to children if inheritAll is enabled
            if (inheritanceToggles.inheritAll) {
              Object.keys(newRules).forEach(childId => {
                if (childId !== 'parent' && !isPropertyOverridden(childId, '_general', 'logoPublicId')) {
                  if (newRules[childId]) {
                    newRules[childId].logoPublicId = value
                  }
                }
              })
            }
          }
        }
      } else if (category === 'Layers' && layerName) {
        // Map layer display name to key dynamically
        const layerKey = Object.keys(layerMap).find(
          key => layerMap[key].displayName === layerName
        ) || null

        // Update layer property
        if (newRules[designId] && newRules[designId][layerKey]) {
          // Convert value based on type
          let convertedValue = value
          if (key === 'fontSize') {
            // fontSize can be a number or a string with percentage (e.g., "110%")
            // Keep as string if it contains %, otherwise convert to number
            if (typeof value === 'string' && value.includes('%')) {
              convertedValue = value // Keep as string for percentage
            } else {
              convertedValue = isNaN(value) ? value : parseFloat(value)
            }
          } else if (key === 'width' || key === 'height' || key === 'x' || key === 'y') {
            convertedValue = parseInt(value) || 0
          } else if (key === 'gravity' || key === 'font' || key === 'color') {
            // String values: gravity, font, color
            convertedValue = value
          } else if (key === 'flNoOverflow' || key === 'flTextDisallowOverflow' || key === 'textWrap') {
            // Boolean values: convert string to boolean
            convertedValue = value === true || value === 'true' || value === '1'
          } else if (key === 'textWidth') {
            // textWidth: number value
            convertedValue = parseInt(value) || 0
          }

          newRules[designId][layerKey][key] = convertedValue

          // Mark as overridden if child, propagate if parent
          if (designId !== 'parent') {
            setPropertyOverrides(prev => ({
              ...prev,
              [designId]: {
                ...prev[designId],
                [layerKey]: { ...prev[designId]?.[layerKey], [key]: true }
              }
            }))
          } else {
            // Propagate to children
            propagateToChildren(layerKey, key, convertedValue, newRules)
          }
        }
      }

      return newRules
    })
  }

  // Helper to get layer key from layer display name
  const getLayerKey = useCallback((layerName) => {
    if (!layerName || !layerMap) return null
    const found = Object.keys(layerMap).find(
      key => layerMap[key].displayName === layerName
    )
    return found || null
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
    return shouldInheritProperty(normalizedKey)
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
    return shouldInheritProperty(normalizedKey)
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
        } else if (key === 'showLogo' || key === 'logoPublicId') {
          const parentValue = newRules['parent']?.[key]
          if (parentValue !== undefined && newRules[designId]) {
            newRules[designId][key] = parentValue
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

    if (isTurningOn) {
      // Save current value before turning on
      // If current value already has {metadata}, extract the text part or use saved/default
      const currentValue = formValues[field]
      let valueToSave = currentValue

      // If current value contains {metadata}, try to extract the non-metadata part
      if (hasMetadataSyntax(currentValue)) {
        const cleaned = currentValue.replace(/\{[^}]+\}/g, '').trim()
        valueToSave = cleaned || (field === 'title' ? 'Now on Sale' :
          field === 'tagline' ? 'Limited Time Offer' :
            field === 'price' ? '80' :
              field === 'backgroundColor' ? '#000428' : '')
      }

      setSavedValues(prev => ({
        ...prev,
        [field]: valueToSave
      }))

      // Set to metadata syntax using {id} format
      const metaSyntax = field === 'title' ? '{ptitle}' :
        field === 'tagline' ? '{pdescription}' :
          field === 'price' ? '{pprice}' :
            field === 'backgroundColor' ? '{pbackgroundcolor}' :
              ''
      setFormValues(prev => ({
        ...prev,
        [field]: metaSyntax
      }))
    } else {
      // Restore saved value when turning off, or fallback to default
      const valueToRestore = savedValues[field] !== null
        ? savedValues[field]
        : (field === 'title' ? 'Now on Sale' :
          field === 'tagline' ? 'Limited Time Offer' :
            field === 'price' ? '80' :
              field === 'backgroundColor' ? '#000428' : '')

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



  return (
    <div className="playground-container">
      <PlaygroundHeader
        selectedAsset={selectedAsset}
        onAssetChange={setSelectedAsset}
      />

      <div className="playground-content">
        <DesignSelector
          selectedDesign={selectedDesign}
          onDesignChange={setSelectedDesign}
          canvasDimensions={canvasDimensions}
          inheritanceToggles={inheritanceToggles}
          onInheritanceToggleChange={setInheritanceToggles}
        />

        <Preview
          previewTab={previewTab}
          onTabChange={setPreviewTab}
          canvasDimensions={canvasDimensions}
          previewWrapperRef={previewWrapperRef}
          imageLoading={imageLoading}
          imageError={imageError}
          currentImageUrl={currentImageUrl}
          generatedUrl={generatedUrl}
          onImageLoad={handleImageLoad}
          onImageError={handleImageError}
          showLayerOverlays={showLayerOverlays}
          onToggleLayerOverlays={setShowLayerOverlays}
          editableRules={editableRules}
          selectedDesignId={selectedDesign.id}
          formValues={formValues}
          useMetadata={useMetadata}
          urlSegments={urlSegments}
          highlightedRow={highlightedRow}
          onSegmentClick={handleSegmentClick}
          selectedDesign={selectedDesign}
          handleRuleUpdate={handleRuleUpdate}
          handleResetProperty={handleResetProperty}
          isPropertyInherited={isPropertyInherited}
          isPropertyOverriddenForDisplay={isPropertyOverriddenForDisplay}
          wouldPropertyBeInherited={wouldPropertyBeInherited}
          getFieldType={getFieldType}
          getGravityOptions={getGravityOptions}
          getFontOptions={getFontOptions}
          handleFontSizeValidation={handleFontSizeValidation}
        />

        <Controls
          canvasDimensions={canvasDimensions}
          setCanvasDimensions={setCanvasDimensions}
          formValues={formValues}
          useMetadata={useMetadata}
          editableRules={editableRules}
          selectedDesign={selectedDesign}
          copySuccess={copySuccess}
          handleInputChange={handleInputChange}
          handleToggleChange={handleToggleChange}
          handleRuleUpdate={handleRuleUpdate}
          handleResetProperty={handleResetProperty}
          handleCopy={handleCopy}
          getTransformedUrl={getTransformedUrl}
          isPropertyInherited={isPropertyInherited}
          isPropertyOverriddenForDisplay={isPropertyOverriddenForDisplay}
          wouldPropertyBeInherited={wouldPropertyBeInherited}
        />
      </div>
    </div>
  )
}

export default DesignPlayground

