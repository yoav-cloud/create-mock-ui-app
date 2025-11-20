import React, { useState, useEffect, useRef } from 'react'
import toast from 'react-hot-toast'
import './DesignPlayground.css'

const ASSETS = [
  { 
    id: 'red', 
    name: 'Red & White',
    previewUrl: 'https://res.cloudinary.com/yoav-cloud/image/upload/v1763114784/create/shoes/red-white-sneaker-transparent.png', 
    publicId: 'create/shoes/red-white-sneaker-transparent' 
  },
  { 
    id: 'white', 
    name: 'White & Blue',
    previewUrl: 'https://res.cloudinary.com/yoav-cloud/image/upload/v1763114784/create/shoes/sneakers-white_blue-transparent.png', 
    publicId: 'create/shoes/sneakers-white_blue-transparent' 
  },
  { 
    id: 'blue', 
    name: 'Blue',
    previewUrl: 'https://res.cloudinary.com/yoav-cloud/image/upload/v1763114784/create/shoes/blue-sneakers-transparent.png', 
    publicId: 'create/shoes/blue-sneakers-transparent' 
  }
]

const DESIGN_TYPES = [
  {
    id: 'parent',
    name: 'Main Design',
    width: 500,
    height: 900,
    description: 'Vertical layout (500x900)'
  },
  {
    id: 'ig-ad',
    name: 'Instagram Ad',
    width: 1080,
    height: 1080,
    description: 'Square format (1:1)'
  },
  {
    id: 'fb-mobile',
    name: 'FB Mobile Feed',
    width: 1080,
    height: 1350,
    description: 'Vertical format (4:5)'
  }
]

const BASE_WIDTH = 500

const GRAVITY_VALUES = {
  northEast: 'north_east',
  north: 'north',
  northWest: 'north_west',
  west: 'west',
  southWest: 'south_west',
  south: 'south',
  southEast: 'south_east',
  east: 'east',
  center: 'center'
}

// Google Fonts list - 15 popular fonts
const GOOGLE_FONTS = [
  { name: 'Roboto', value: 'Roboto' },
  { name: 'Open Sans', value: 'Open Sans' },
  { name: 'Lato', value: 'Lato' },
  { name: 'Montserrat', value: 'Montserrat' },
  { name: 'Oswald', value: 'Oswald' },
  { name: 'Raleway', value: 'Raleway' },
  { name: 'Poppins', value: 'Poppins' },
  { name: 'Source Sans Pro', value: 'Source Sans Pro' },
  { name: 'Playfair Display', value: 'Playfair Display' },
  { name: 'Merriweather', value: 'Merriweather' },
  { name: 'Ubuntu', value: 'Ubuntu' },
  { name: 'Nunito', value: 'Nunito' },
  { name: 'Dancing Script', value: 'Dancing Script' },
  { name: 'Bebas Neue', value: 'Bebas Neue' },
  { name: 'Arial', value: 'Arial' } // Keep Arial as default/fallback
]

const LIGHT_BLUE = '#03a9f4'

// Design positioning rules - one entry per design type
// Each rule contains: width, height (canvas dimensions), x, y, gravity, fontSize (and width/height for image)
// fontSize can be a number (absolute) or a string with percentage (e.g., "50%") relative to a parent value
const DESIGN_RULES = {
  'parent': {
    width: 500,
    height: 900,
    title: { x: 30, y: 40, gravity: GRAVITY_VALUES.northWest, fontSize: 32, color: '#ffffff', font: 'Arial', flNoOverflow: true, flTextDisallowOverflow: false, textWrap: true, textWidth: 400 },
    tagline: { x: 30, y: 120, gravity: GRAVITY_VALUES.northEast, fontSize: 20, color: '#ffffff', font: 'Arial', flNoOverflow: true, flTextDisallowOverflow: false, textWrap: true, textWidth: 400 },
    image: { width: 300, height: 300, x: 10, y: 30, gravity: GRAVITY_VALUES.southEast },
    origPrice: { x: 30, y: 40, gravity: GRAVITY_VALUES.southWest, fontSize: 30, color: '#bbbbbb', font: 'Arial', flNoOverflow: false, flTextDisallowOverflow: false },
    price: { x: 130, y: 40, gravity: GRAVITY_VALUES.southWest, fontSize: 44, color: '#ffffff', font: 'Arial', flNoOverflow: false, flTextDisallowOverflow: false }
  },
  'ig-ad': {
    width: 1080,
    height: 1080,
    title: { x: 0, y: 65, gravity: GRAVITY_VALUES.north, fontSize: "110%", color: '#ffffff', font: 'Arial', flNoOverflow: true, flTextDisallowOverflow: false, textWrap: true, textWidth: 864 },
    tagline: { x: 0, y: 100, gravity: GRAVITY_VALUES.north, fontSize: 20, color: '#ffffff', font: 'Arial', flNoOverflow: true, flTextDisallowOverflow: false, textWrap: true, textWidth: 864 },
    image: { width: 350, height: 250, x: 0, y: 120, gravity: GRAVITY_VALUES.north },
    origPrice: { x: -44, y: 60, gravity: GRAVITY_VALUES.south, fontSize: 30, color: '#bbbbbb', font: 'Arial', flNoOverflow: false, flTextDisallowOverflow: false },
    price: { x: 0, y: 50, gravity: GRAVITY_VALUES.south, fontSize: 44, color: '#ffffff', font: 'Arial', flNoOverflow: false, flTextDisallowOverflow: false }
  },
  'fb-mobile': {
    width: 1080,
    height: 1350,
    title: { x: 0, y: 30, gravity: GRAVITY_VALUES.north, fontSize: 32, color: '#ffffff', font: 'Arial', flNoOverflow: true, flTextDisallowOverflow: false, textWrap: true, textWidth: 864 },
    tagline: { x: 0, y: 60, gravity: GRAVITY_VALUES.south, fontSize: 20, color: '#ffffff', font: 'Arial', flNoOverflow: true, flTextDisallowOverflow: false, textWrap: true, textWidth: 864 },
    image: { width: 380, height: 280, x: 0, y: 60, gravity: GRAVITY_VALUES.center },
    origPrice: { x: 0, y: -140, gravity: GRAVITY_VALUES.center, fontSize: "120%", color: '#bbbbbb', font: 'Arial', flNoOverflow: false, flTextDisallowOverflow: false },
    price: { x: 0, y: -120, gravity: GRAVITY_VALUES.center, fontSize: "150%", color: '#ffffff', font: 'Arial', flNoOverflow: false, flTextDisallowOverflow: false }
  }
}

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
          
          // Deep merge layer properties (title, tagline, price, origPrice, image)
          const layerKeys = ['title', 'tagline', 'price', 'origPrice', 'image']
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
            ...mergedLayers
          }
        })
        // Ensure textWidth defaults for title and tagline in merged rules
        Object.keys(merged).forEach(designId => {
          const designRule = merged[designId]
          if (designRule.title && !designRule.title.textWidth) {
            designRule.title.textWidth = Math.round((designRule.width || 500) * 0.8)
          }
          if (designRule.tagline && !designRule.tagline.textWidth) {
            designRule.tagline.textWidth = Math.round((designRule.width || 500) * 0.8)
          }
          if (designRule.title && designRule.title.textWrap === undefined) {
            designRule.title.textWrap = true
          }
          if (designRule.tagline && designRule.tagline.textWrap === undefined) {
            designRule.tagline.textWrap = true
          }
        })
        return merged
      } catch (e) {
        // If parsing fails, use DESIGN_RULES
        const defaultRules = JSON.parse(JSON.stringify(DESIGN_RULES))
        // Ensure textWidth defaults
        Object.keys(defaultRules).forEach(designId => {
          const designRule = defaultRules[designId]
          if (designRule.title && !designRule.title.textWidth) {
            designRule.title.textWidth = Math.round((designRule.width || 500) * 0.8)
          }
          if (designRule.tagline && !designRule.tagline.textWidth) {
            designRule.tagline.textWidth = Math.round((designRule.width || 500) * 0.8)
          }
        })
        return defaultRules
      }
    }
    const defaultRules = JSON.parse(JSON.stringify(DESIGN_RULES))
    // Ensure textWidth defaults
    Object.keys(defaultRules).forEach(designId => {
      const designRule = defaultRules[designId]
      if (designRule.title && !designRule.title.textWidth) {
        designRule.title.textWidth = Math.round((designRule.width || 500) * 0.8)
      }
      if (designRule.tagline && !designRule.tagline.textWidth) {
        designRule.tagline.textWidth = Math.round((designRule.width || 500) * 0.8)
      }
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
  const extractMetadataId = (value) => {
    if (!value || typeof value !== 'string') return null
    const match = value.match(/\{([^}]+)\}/)
    return match ? match[1] : null
  }

  // Helper to check if a value contains metadata syntax {id}
  const hasMetadataSyntax = (value) => {
    return value && typeof value === 'string' && value.includes('{') && value.includes('}')
  }

  // Helper to get metadata key from field name
  const getMetadataKey = (field) => {
    const keyMap = { 
      title: 'ptitle', 
      tagline: 'pdescription', 
      price: 'pprice',
      backgroundColor: 'pbackgroundcolor'
    }
    return keyMap[field] || null
  }

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
  // Store previous fontSize values for validation/revert
  const fontSizePreviousValues = useRef({})
  const [showVerboseUrl, setShowVerboseUrl] = useState(() => {
    const saved = localStorage.getItem('playground_verbose')
    return saved !== null ? JSON.parse(saved) : true // Default to verbose (Cloudinary standard)
  })

  useEffect(() => {
    localStorage.setItem('playground_verbose', JSON.stringify(showVerboseUrl))
  }, [showVerboseUrl])
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValues(formValues)
      setDebouncedUseMetadata(useMetadata)
    }, 300)
    return () => clearTimeout(timer)
  }, [formValues, useMetadata])

  const getTransformedUrl = () => {
    const scale = selectedDesign.width / BASE_WIDTH
    const s = (val) => Math.round(val * scale)
    
    // Helper function to calculate font size with percentage support
    // fontSize can be a number (absolute) or a string like "50%" (relative to parentValue) or "32" (string number)
    // Font sizes are NOT scaled - they remain the same pixel size regardless of canvas size
    const calculateFontSize = (fontSize, parentValue) => {
      if (typeof fontSize === 'string' && fontSize.endsWith('%')) {
        // Percentage value: calculate relative to parent's raw value
        const percentage = parseFloat(fontSize) / 100
        // Get parent's raw value (not scaled)
        const parentRawValue = typeof parentValue === 'string' && parentValue.endsWith('%')
          ? 32 // Fallback if parent is also percentage
          : (typeof parentValue === 'number' ? parentValue : parseFloat(parentValue) || 32)
        return Math.round(parentRawValue * percentage)
      }
      // Absolute value - use as-is, no scaling
      // Handle both number and string number (e.g., "32")
      if (typeof fontSize === 'number') {
        return fontSize
      }
      const parsed = parseFloat(fontSize)
      return isNaN(parsed) ? 0 : parsed
    }
    
    const escapeCloudinaryString = (str) => {
      return encodeURIComponent(str).replace(/!/g, '%21')
    }
    
    // Determine values based on toggles
    // If toggle is ON: use Cloudinary conditional logic to check metadata
    // We construct the variable value to include the logic:
    // e.g. $title_ctx:!PTitle!/if_!title!_eq_!empty!/Then set to default
    // Cloudinary doesn't support "set variable to A, if empty set to B" easily in one line without `if`.
    // But variables allow: $title_ctx:!PTitle!
    // And then we can use: l_text:style:$(title)
    // However, if PTitle is empty, $(title) might be empty string or cause error?
    // Actually, if context key is missing, it might be empty.
    // Better approach: use user-defined variable for the default value too, e.g. $default_title_!Demo!
    // Then logic: $title_ctx:!PTitle!/if_!title!_eq_!empty!/$title_$default_title/if_end
    
    // Let's construct the parts.
    
    // Metadata Keys:
    // title -> PTitle (context or metadata? Prompt says "metadata value", but "PTitle" usually context. Let's try context `ctx:`)
    // tagline -> PDescription
    // price -> PPrice
    
    // Note: Cloudinary context keys are usually user defined. 'PTitle' suggests 'Product Title'.
    // We will assume they are Context keys 'ctx:PTitle'. If they are structured metadata, it would be 'md:key_id'.
    // Given the simple names, context is more likely or simpler.
    
    // Defaults
    // Check if formValues contain {metadata} syntax - if so, treat as metadata usage
    // When toggle is on OR value contains {metadata}, use savedValues as default (not the metadata syntax string)
    // When toggle is off and no {metadata}, use formValues directly
    const getDefaultValue = (field) => {
      const formVal = debouncedValues[field]
      const hasMetadata = hasMetadataSyntax(formVal)
      
      // If value contains {metadata} syntax, use saved value or sensible default
      if (hasMetadata || debouncedUseMetadata[field]) {
        // Use saved value if available
        if (savedValues[field] !== null) {
          return savedValues[field]
        }
        // If no saved value, use a sensible default based on field
        return field === 'title' ? 'Now on Sale' : 
               field === 'tagline' ? 'Limited Time Offer' : 
               field === 'price' ? '80' :
               field === 'backgroundColor' ? '#000428' :
               ''
      }
      // Toggle is off and no metadata syntax - use formValues directly
      return formVal
    }
    
    // Check if we should use metadata for each field
    // Either toggle is on, OR the value contains {metadata} syntax
    const shouldUseMetadata = (field) => {
      const formVal = debouncedValues[field]
      return debouncedUseMetadata[field] || hasMetadataSyntax(formVal)
    }
    
    // Get metadata key for each field (from toggle or from {metadata} syntax)
    const getMetaKeyForField = (field) => {
      const formVal = debouncedValues[field]
      const extractedId = extractMetadataId(formVal)
      if (extractedId) {
        return extractedId
      }
      // Fallback to default mapping
      return getMetadataKey(field)
    }
    
    const defaultTitle = escapeCloudinaryString(getDefaultValue('title'))
    const defaultTagline = escapeCloudinaryString(getDefaultValue('tagline'))
    const defaultPrice = getDefaultValue('price') // Number, no escape needed usually
    
    // Helper to convert hex color to rgb:RRGGBB format
    const hexToRgb = (hex) => {
      if (!hex) return '000000'
      // Remove # if present
      hex = hex.replace('#', '')
      // Handle 3-digit hex
      if (hex.length === 3) {
        hex = hex.split('').map(c => c + c).join('')
      }
      return hex.toLowerCase()
    }

    // Convert font name to kebab-case for Cloudinary (e.g., "Open Sans" → "Open-Sans")
    const fontToKebabCase = (fontName) => {
      if (!fontName) return 'Arial'
      return fontName.replace(/\s+/g, '-')
    }
    
    // Get background color value
    const getBackgroundColorValue = () => {
      const formVal = debouncedValues.backgroundColor
      const hasMetadata = hasMetadataSyntax(formVal)
      
      if (hasMetadata || debouncedUseMetadata.backgroundColor) {
        if (savedValues.backgroundColor !== null) {
          return hexToRgb(savedValues.backgroundColor)
        }
        return '000428' // Default dark blue
      }
      return hexToRgb(formVal || '#000428')
    }
    
    const defaultBackgroundColor = getBackgroundColorValue()

    // Construct variable definitions
    // We will define the "final" variables used in layers: $title, $tagline, $price, $bgcolor
    
    // Helper to build the logic for one field
    const buildFieldLogic = (varName, metaKey, defaultValue, isNumber = false) => {
      // Format default value
      const safeDefault = (defaultValue && String(defaultValue).trim() !== '') 
          ? defaultValue 
          : (isNumber ? 0 : ' ')
      
      const defaultValFormatted = isNumber ? safeDefault : `!${safeDefault}!`
      
      // Check if we should use metadata (either toggle is on, or value contains {metadata})
      const useMeta = shouldUseMetadata(varName)
      
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

    // Variable definitions
    // Get metadata keys - either from {metadata} syntax in formValues or from default mapping
    const titleMetaKey = getMetaKeyForField('title')
    const taglineMetaKey = getMetaKeyForField('tagline')
    const priceMetaKey = getMetaKeyForField('price')
    
    const titleVarDef = buildFieldLogic('title', titleMetaKey, defaultTitle)
    const taglineVarDef = buildFieldLogic('tagline', taglineMetaKey, defaultTagline)
    
    // Price is special because of math: $origprice_$price_mul_1.25
    // If we use metadata, we need to ensure it works with math.
    // If we load price as string, math might fail.
    // However, the layers use: `l_text:Arial...:$(price)` which works with string or number.
    // But `$origprice` calculation needs `$price` to be a number.
    // We can force it: `$price_ctx:!PPrice!/to_n` ? No explicit cast needed usually if it looks like number.
    // Let's try basic replacement.
    const priceVarDef = buildFieldLogic('price', priceMetaKey, defaultPrice, true)
    
    // Background color: needs special handling for RGB format
    // According to Cloudinary docs: For RGB hex values, use syntax $var_!rgb:######!
    // Then use it as b_$var (not b_rgb:$var)
    // The variable should contain the full "rgb:000428" value
    const backgroundColorMetaKey = getMetaKeyForField('backgroundColor')
    const bgColorUseMeta = shouldUseMetadata('backgroundColor')
    let bgColorVarDef = ''
    if (!bgColorUseMeta) {
      // Direct value: use the format $bgcolor_!rgb:000428!
      bgColorVarDef = `$bgcolor_!rgb:${defaultBackgroundColor}!`
    } else {
      // With metadata: initialize with default, then override if metadata exists
      // Note: We can't interpolate variables inside !...! wrapper
      // Solution: Construct rgb: format using a workaround
      // Since metadata might return hex (like "c32222" or "#c32222"), we need to handle it
      // Approach: Use the metadata value and try to construct the rgb: format
      // We'll use a helper variable to store the hex, then construct rgb: format
      // But since we can't concatenate strings, we need a different approach
      // Actually, the best solution: Use conditional logic to handle both cases
      // If metadata returns "rgb:HEX", use it directly
      // If metadata returns just hex, we need to construct it - but that's not possible
      // So we'll assume metadata returns the full "rgb:HEX" format
      // If it doesn't, the metadata field needs to be configured to return that format
      const parts = []
      // Initialize with default value in rgb: format
      parts.push(`$bgcolor_!rgb:${defaultBackgroundColor}!`)
      // Fetch metadata - metadata should return "rgb:HEX" format for this to work
      // If metadata returns just hex, we can't construct "rgb:HEX" easily
      parts.push(`$tb_md:!${backgroundColorMetaKey}!`)
      parts.push(`if_!tb!_ne_!!`)
      // Assign the metadata value directly
      // This works if metadata returns "rgb:HEX" format
      // If metadata returns just hex (like "c32222"), this won't work correctly
      // The metadata field should be configured to return "rgb:HEX" format
      parts.push(`$bgcolor_$tb`)
      parts.push(`if_end`)
      bgColorVarDef = parts.join('/')
    }

    
    // Variable definition block
    // Note: We need to handle the public ID in $img variable.
    // Standard practice: use !...! for strings containing special chars if needed.
    // Public IDs can have slashes. Cloudinary variables cannot have slashes.
    // Replace slashes with colons for use in variables/layers
    const publicIdClean = selectedAsset.publicId.replace(/\//g, ':')
    const imgVar = `!${publicIdClean}!`
    
    // Get positioning rules for the selected design type (use editable rules)
    const rules = editableRules[selectedDesign.id] || editableRules['parent']
    
    // Use canvas dimensions from state (editable) or fallback to rules
    const padW = canvasDimensions.width || rules.width
    const padH = canvasDimensions.height || rules.height
    
    // Extract colors from rules and convert to RGB format for Cloudinary
    const titleColor = hexToRgb(rules.title.color || '#ffffff')
    const taglineColor = hexToRgb(rules.tagline.color || '#ffffff')
    const priceColor = hexToRgb(rules.price.color || '#ffffff')
    const origPriceColor = hexToRgb(rules.origPrice.color || '#bbbbbb')
    
    // Calculate font sizes with percentage support
    // Title is the base (parent) for percentage calculations - use unscaled base value
    const baseTitleSize = typeof rules.title.fontSize === 'string' && rules.title.fontSize.endsWith('%')
      ? 32 // Default base if title itself is percentage (shouldn't happen, but fallback)
      : rules.title.fontSize
    
    // Calculate title font size (not scaled - font sizes remain absolute)
    const fontSizeTitle = calculateFontSize(rules.title.fontSize, baseTitleSize)
    
    // Calculate other font sizes relative to title's base value (not scaled)
    const fontSizeTagline = calculateFontSize(rules.tagline.fontSize, baseTitleSize)
    const fontSizePrice = calculateFontSize(rules.price.fontSize, baseTitleSize)
    const fontSizeOrigPrice = calculateFontSize(rules.origPrice.fontSize, baseTitleSize)
    
    // Apply rules with scaling
    const titleX = s(rules.title.x)
    const titleY = s(rules.title.y)
    const titleGravity = rules.title.gravity
    
    const taglineX = s(rules.tagline.x)
    const taglineY = s(rules.tagline.y)
    const taglineGravity = rules.tagline.gravity
    
    const imgW = s(rules.image.width)
    const imgH = s(rules.image.height)
    const imgX = s(rules.image.x)
    const imgY = s(rules.image.y)
    const imgGravity = rules.image.gravity
    
    const origPriceX = s(rules.origPrice.x)
    const origPriceY = s(rules.origPrice.y)
    const origPriceGravity = rules.origPrice.gravity
    
    const priceX = s(rules.price.x)
    const priceY = s(rules.price.y)
    const priceGravity = rules.price.gravity

    // Get layer-specific fonts and format for Cloudinary (convert to kebab-case)
    const titleFont = fontToKebabCase(rules.title.font || 'Arial')
    const taglineFont = fontToKebabCase(rules.tagline.font || 'Arial')
    const origPriceFont = fontToKebabCase(rules.origPrice.font || 'Arial')
    const priceFont = fontToKebabCase(rules.price.font || 'Arial')

    // Helper to build text layer flags array
    const buildTextFlags = (layerRules) => {
      const flags = []
      if (layerRules.flNoOverflow) {
        flags.push('fl_no_overflow')
      }
      if (layerRules.flTextDisallowOverflow) {
        flags.push('fl_text_disallow_overflow')
      }
      return flags
    }

    // Build flags for each text layer
    const titleFlags = buildTextFlags(rules.title)
    const taglineFlags = buildTextFlags(rules.tagline)
    const origPriceFlags = buildTextFlags(rules.origPrice)
    const priceFlags = buildTextFlags(rules.price)

    // Construct transformation
    
    const transformParts = [
      `$img_${imgVar}`,
      titleVarDef,
      taglineVarDef,
      priceVarDef,
      bgColorVarDef,
      `$origprice_$price_mul_1.25`, // Logic logic stays same
      `c_crop,w_1,h_1,g_north_west`, // Base crop
      `c_pad,w_${padW},h_${padH},b_$bgcolor`, // Canvas
      // Title Layer with optional text wrapping
      ...(rules.title.textWrap !== false 
        ? [`c_fit,l_text:${titleFont}_${fontSizeTitle}_bold:$(title),co_rgb:${titleColor},w_${rules.title.textWidth || Math.round(padW * 0.8)}`]
        : [`l_text:${titleFont}_${fontSizeTitle}_bold:$(title),co_rgb:${titleColor}`]
      ), // Title Layer
      `fl_layer_apply,g_${titleGravity},x_${titleX},y_${titleY}${titleFlags.length > 0 ? ',' + titleFlags.join(',') : ''}`, // Title flags in same part as fl_layer_apply
      // Tagline Layer with optional text wrapping
      ...(rules.tagline.textWrap !== false 
        ? [`c_fit,l_text:${taglineFont}_${fontSizeTagline}_italic:$(tagline),co_rgb:${taglineColor},w_${rules.tagline.textWidth || Math.round(padW * 0.8)}`]
        : [`l_text:${taglineFont}_${fontSizeTagline}_italic:$(tagline),co_rgb:${taglineColor}`]
      ), // Tagline Layer
      `fl_layer_apply,g_${taglineGravity},x_${taglineX},y_${taglineY}${taglineFlags.length > 0 ? ',' + taglineFlags.join(',') : ''}`, // Tagline flags in same part as fl_layer_apply
      `l_$img`, // Image Layer
      `c_fit,w_${imgW},h_${imgH}`,
      `fl_layer_apply,g_${imgGravity},x_${imgX},y_${imgY}`,
      `l_text:${origPriceFont}_${fontSizeOrigPrice}_strikethrough:%24$(origprice),co_rgb:${origPriceColor}`, // Orig Price Layer
      `fl_layer_apply,g_${origPriceGravity},x_${origPriceX},y_${origPriceY}${origPriceFlags.length > 0 ? ',' + origPriceFlags.join(',') : ''}`, // Orig Price flags in same part as fl_layer_apply
      `l_text:${priceFont}_${fontSizePrice}_bold:%24$(price),co_rgb:${priceColor}`, // Price Layer
      `fl_layer_apply,g_${priceGravity},x_${priceX},y_${priceY}${priceFlags.length > 0 ? ',' + priceFlags.join(',') : ''}`, // Price flags in same part as fl_layer_apply
    ]

    const transformString = transformParts.join('/')
    
    return `https://res.cloudinary.com/yoav-cloud/image/upload/${transformString}/${selectedAsset.publicId}.png`
  }

  const generatedUrl = getTransformedUrl()

  // Parse URL into segments for interactive preview
  const parseUrlSegments = () => {
    const url = generatedUrl
    const baseUrl = 'https://res.cloudinary.com/yoav-cloud/image/upload/'
    const transformPart = url.replace(baseUrl, '').replace(`/${selectedAsset.publicId}.png`, '')
    const parts = transformPart.split('/')
    
    const segments = []
    
    // Base URL
    segments.push({ text: baseUrl, type: 'base', rowKey: null })
    
    // Parse transformation parts
    parts.forEach((part, index) => {
      let type = 'transformation'
      let rowKey = null
      
      // Variable definitions
      if (part.startsWith('$img_')) {
        type = 'variable'
        rowKey = 'image-layer'
      } else if (part.startsWith('$title_') || part.includes('$title')) {
        type = 'variable'
        rowKey = 'title-layer'
      } else if (part.startsWith('$tagline_') || part.includes('$tagline')) {
        type = 'variable'
        rowKey = 'tagline-layer'
      } else if (part.startsWith('$price_') || part.includes('$price')) {
        type = 'variable'
        rowKey = part.includes('origprice') ? 'origPrice-layer' : 'price-layer'
      } else if (part.startsWith('$bgcolor_') || part.includes('$bgcolor')) {
        type = 'variable'
        rowKey = 'background-color'
      } else if (part.startsWith('c_pad')) {
        type = 'canvas'
        rowKey = 'canvas-dimensions'
      } else if (part.startsWith('l_text') && part.includes('title')) {
        type = 'layer-title'
        rowKey = 'title-layer'
      } else if (part.startsWith('l_text') && part.includes('tagline')) {
        type = 'layer-tagline'
        rowKey = 'tagline-layer'
      } else if (part.startsWith('l_text') && part.includes('origprice')) {
        type = 'layer-origPrice'
        rowKey = 'origPrice-layer'
      } else if (part.startsWith('l_text') && part.includes('price') && !part.includes('origprice')) {
        type = 'layer-price'
        rowKey = 'price-layer'
      } else if (part.startsWith('l_$img')) {
        type = 'layer-image'
        rowKey = 'image-layer'
      } else if (part.startsWith('fl_layer_apply')) {
        type = 'layer-apply'
        // Determine which layer based on context
        if (index > 0 && parts[index - 1].includes('title')) {
          rowKey = 'title-layer'
        } else if (index > 0 && parts[index - 1].includes('tagline')) {
          rowKey = 'tagline-layer'
        } else if (index > 0 && parts[index - 1].includes('origprice')) {
          rowKey = 'origPrice-layer'
        } else if (index > 0 && parts[index - 1].includes('price') && !parts[index - 1].includes('origprice')) {
          rowKey = 'price-layer'
        } else if (index > 0 && parts[index - 1].includes('$img')) {
          rowKey = 'image-layer'
        }
      }
      
      segments.push({ 
        text: part, 
        type, 
        rowKey,
        separator: index < parts.length - 1 ? '/' : ''
      })
    })
    
    // Public ID
    segments.push({ text: '/', type: 'separator', rowKey: null })
    segments.push({ text: `${selectedAsset.publicId}.png`, type: 'publicId', rowKey: null })
    
    return segments
  }

  const urlSegments = parseUrlSegments()

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
    // Canvas dimensions (width, height) are NEVER inherited
    if (propertyKey === 'width' || propertyKey === 'Height' || propertyKey === 'Width') {
      return false
    }
    // Style properties (color, font, flags, textWrap) are inherited if inheritStyles is ON
    const styleProperties = ['color', 'font', 'flNoOverflow', 'flTextDisallowOverflow', 'textWrap']
    if (styleProperties.includes(propertyKey)) {
      return inheritanceToggles.inheritStyles
    }
    // Position/size properties (x, y, fontSize, gravity, textWidth) are inherited if inheritAll is ON
    const positionSizeProperties = ['x', 'y', 'fontSize', 'gravity', 'textWidth']
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
        }
      } else if (category === 'Layers' && layerName) {
        // Map layer name to key
        const layerKey = layerName === 'Original Price' ? 'origPrice' : 
                        layerName === 'Title' ? 'title' :
                        layerName === 'Tagline' ? 'tagline' :
                        layerName === 'Price' ? 'price' : 'image'
        
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

  // Helper to get layer key from layer name
  const getLayerKey = (layerName) => {
    if (!layerName) return null
    return layerName === 'Original Price' ? 'origPrice' : 
           layerName === 'Title' ? 'title' :
           layerName === 'Tagline' ? 'tagline' :
           layerName === 'Price' ? 'price' : 
           layerName === 'Image' ? 'image' : null
  }

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

  const getNonVerboseUrl = () => {
    // Non-verbose: Show a formatted, more readable version of the URL
    // Break it into logical sections with line breaks for better readability
    const fullUrl = getTransformedUrl()
    const baseUrl = 'https://res.cloudinary.com/yoav-cloud/image/upload'
    
    // Extract the transformation part
    const transformMatch = fullUrl.match(/\/image\/upload\/(.+)\/(.+\.png)/)
    if (!transformMatch) return fullUrl
    
    const transformString = transformMatch[1]
    const publicId = transformMatch[2]
    
    // Split transformation into logical groups for readability
    const parts = transformString.split('/')
    
    // Group parts: variables, canvas setup, layers
    const variables = []
    const canvas = []
    const layers = []
    
    for (let i = 0; i < parts.length; i++) {
      const part = parts[i]
      
      // Variables start with $
      if (part.startsWith('$')) {
        variables.push(part)
      }
      // Canvas operations
      else if (part.startsWith('c_')) {
        canvas.push(part)
      }
      // Layer operations
      else if (part.startsWith('l_') || part.startsWith('fl_layer_apply')) {
        layers.push(part)
      }
      // Other operations (like if conditions)
      else {
        // Check if it's part of a variable definition (if conditions)
        if (part.startsWith('if_') || part === 'if_end') {
          variables.push(part)
        } else {
          layers.push(part)
        }
      }
    }
    
    // Format as readable sections with comments
    const sections = [baseUrl]
    
    if (variables.length > 0) {
      sections.push('// Variables:')
      variables.forEach(v => sections.push(`  ${v}`))
    }
    
    if (canvas.length > 0) {
      sections.push('// Canvas:')
      canvas.forEach(c => sections.push(`  ${c}`))
    }
    
    if (layers.length > 0) {
      sections.push('// Layers:')
      layers.forEach(l => sections.push(`  ${l}`))
    }
    
    sections.push(`/${publicId}`)
    
    return sections.join('\n')
  }

  return (
    <div className="playground-container">
      {/* Top: Assets */}
      <div className="playground-header">
        <h2>Design Playground</h2>
        <div className="asset-selector-container">
          <div className="asset-selector">
            {ASSETS.map(asset => (
              <div 
                key={asset.id}
                className={`asset-option ${selectedAsset.id === asset.id ? 'active' : ''}`}
                onClick={() => setSelectedAsset(asset)}
                title={asset.name}
              >
                <img src={asset.previewUrl} alt={asset.name} />
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="playground-content">
        {/* Left: Designs */}
        <div className="design-selector">
          <h3>Channels</h3>
          <div className="design-tree">
            {/* Parent Design */}
            {DESIGN_TYPES.filter(d => d.id === 'parent').map(design => {
              const rules = DESIGN_RULES[design.id] || DESIGN_RULES['parent']
              const isSelected = selectedDesign.id === design.id
              const displayWidth = isSelected ? canvasDimensions.width : rules.width
              const displayHeight = isSelected ? canvasDimensions.height : rules.height
              return (
                <div key={design.id}>
                  <div 
                    className={`design-option parent ${isSelected ? 'active' : ''} ${isParentHovered ? 'hovered' : ''}`}
                    onClick={() => setSelectedDesign(design)}
                    onMouseEnter={() => setIsParentHovered(true)}
                    onMouseLeave={() => setIsParentHovered(false)}
                  >
                    <div className="design-card-content">
                      <div className="design-name">{design.name}</div>
                      <div className="design-dims">{displayWidth} x {displayHeight}</div>
                      <div className="design-icon-wrapper">
                        <svg className="design-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                          <line x1="9" y1="3" x2="9" y2="21"></line>
                          <line x1="3" y1="9" x2="21" y2="9"></line>
                        </svg>
                      </div>
                    </div>
                    {/* Inheritance toggles - shown on hover, inside card */}
                    {isParentHovered && (
                      <div className="inheritance-toggles" onMouseEnter={() => setIsParentHovered(true)}>
                        <div className="inheritance-toggle-item">
                          <label>Inherit Styles</label>
                          <div className="toggle-wrapper" onClick={(e) => e.stopPropagation()}>
                            <div className={`toggle-track active`} style={{ opacity: 0.5, cursor: 'not-allowed' }}>
                              <div className="toggle-thumb"></div>
                            </div>
                          </div>
                        </div>
                        <div className="inheritance-toggle-item">
                          <label>Inherit All</label>
                          <div className="toggle-wrapper" onClick={(e) => {
                            e.stopPropagation()
                            setInheritanceToggles(prev => ({ ...prev, inheritAll: !prev.inheritAll }))
                          }}>
                            <div className={`toggle-track ${inheritanceToggles.inheritAll ? 'active' : ''}`}>
                              <div className="toggle-thumb"></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                  {/* Tree connector line */}
                  <div className="tree-connector">
                    <div className="tree-line-vertical"></div>
                    <div className="tree-line-horizontal"></div>
                  </div>
                </div>
              )
            })}
            {/* Sub-designs */}
            <div className="sub-designs-container">
              {DESIGN_TYPES.filter(d => d.id !== 'parent').map((design) => {
                const rules = DESIGN_RULES[design.id] || DESIGN_RULES['parent']
                const isSelected = selectedDesign.id === design.id
                const displayWidth = isSelected ? canvasDimensions.width : rules.width
                const displayHeight = isSelected ? canvasDimensions.height : rules.height
                return (
                  <div key={design.id} className="sub-design-wrapper">
                    <div 
                      className={`design-option sub ${isSelected ? 'active' : ''}`}
                      onClick={() => setSelectedDesign(design)}
                    >
                      <div className="design-name">{design.name}</div>
                      <div className="design-dims">{displayWidth} x {displayHeight}</div>
                      <div className="design-icon-wrapper">
                        {design.id === 'ig-ad' ? (
                          <svg className="design-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                            <circle cx="12" cy="12" r="4"></circle>
                            <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                          </svg>
                        ) : design.id === 'fb-mobile' ? (
                          <svg className="design-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                          </svg>
                        ) : null}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Center: Preview */}
        <div className="preview-area">
          {/* Tab Switcher */}
          <div className="preview-tabs">
            <button
              className={`preview-tab ${previewTab === 'visual' ? 'active' : ''}`}
              onClick={() => setPreviewTab('visual')}
            >
              Visual
            </button>
            <button
              className={`preview-tab ${previewTab === 'textual' ? 'active' : ''}`}
              onClick={() => setPreviewTab('textual')}
            >
              Rules
            </button>
          </div>

          {previewTab === 'visual' ? (
            <div className="preview-wrapper" style={{ aspectRatio: `${canvasDimensions.width}/${canvasDimensions.height}` }}>
              {imageLoading && (
                <div className="loading-overlay">
                  <div className="spinner"></div>
                </div>
              )}
              {/* Background image (previous successful load) */}
              {currentImageUrl && currentImageUrl !== generatedUrl && !imageError && (
                 <img 
                 src={currentImageUrl} 
                 alt="Design Preview Previous" 
                 className="preview-image previous"
               />
              )}
              {/* Foreground image (loading) */}
              {!imageError ? (
                <img 
                  src={generatedUrl} 
                  alt="Design Preview" 
                  className={`preview-image current ${imageLoading ? 'loading' : ''}`}
                  onLoad={handleImageLoad}
                  onError={handleImageError}
                />
              ) : (
                <div className="broken-image-placeholder">
                  <div className="broken-icon">⚠️</div>
                  <div className="broken-text">Image failed to load</div>
                </div>
              )}
            </div>
          ) : (
            <div className="textual-preview">
              {/* URL Preview Card */}
              <div className="url-preview-card">
                <div className="url-preview-header">
                  <div className="url-preview-label">Transformation URL</div>
                  <button
                    className="url-open-button"
                    onClick={() => window.open(generatedUrl, '_blank')}
                    title="Open URL in new tab"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                      <polyline points="15 3 21 3 21 9"></polyline>
                      <line x1="10" y1="14" x2="21" y2="3"></line>
                    </svg>
                  </button>
                </div>
                <div className="url-preview-content">
                  {urlSegments.map((segment, index) => (
                    <span
                      key={index}
                      className={`url-segment url-segment-${segment.type} ${segment.rowKey && highlightedRow === segment.rowKey ? 'highlighted' : ''}`}
                      onClick={() => handleSegmentClick(segment.rowKey)}
                      title={segment.rowKey ? `Click to highlight ${segment.rowKey}` : ''}
                      style={{ cursor: segment.rowKey ? 'pointer' : 'default' }}
                    >
                      {segment.text}
                      {segment.separator}
                    </span>
                  ))}
                </div>
              </div>
              
              <table className="rules-table">
                <thead>
                  <tr>
                    <th>Category</th>
                    <th>Property</th>
                    <th>Value</th>
                  </tr>
                </thead>
                <tbody>
                  {/* General Rules */}
                  <tr className="category-row">
                    <td colSpan="3"><strong>General</strong></td>
                  </tr>
                  <tr data-row-key="canvas-dimensions">
                    <td>General</td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        Width
                        {(() => {
                          const isInherited = isPropertyInherited('General', null, 'Width')
                          const isOverridden = isPropertyOverriddenForDisplay('General', null, 'Width')
                          const wouldBeInherited = wouldPropertyBeInherited('General', null, 'Width')
                          const showIcon = isInherited || (isOverridden && wouldBeInherited)
                          return showIcon ? (
                            <svg 
                              width="14" 
                              height="14" 
                              viewBox="0 0 24 24" 
                              fill="none" 
                              stroke={isInherited ? "var(--active-color)" : "#888"} 
                              strokeWidth="2" 
                              style={{ opacity: isInherited ? 0.7 : 0.4 }} 
                              title={isInherited ? "Inherited from parent" : "Would inherit from parent (currently overridden)"}
                            >
                              <path d="M12 2L2 7l10 5 10-5-10-5z"></path>
                              <path d="M2 17l10 5 10-5"></path>
                              <path d="M2 12l10 5 10-5"></path>
                            </svg>
                          ) : null
                        })()}
                      </div>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <input
                          type="number"
                          value={canvasDimensions.width}
                          onChange={(e) => handleRuleUpdate('General', null, 'Width', e.target.value)}
                          className="rule-input rule-input-number"
                          min="1"
                        />
                        {isPropertyOverriddenForDisplay('General', null, 'Width') && (
                          <button
                            className="reset-property-btn"
                            onClick={() => handleResetProperty('General', null, 'Width')}
                            title="Reset to inherited value"
                            style={{
                              padding: '0.25rem 0.5rem',
                              fontSize: '0.75rem',
                              backgroundColor: 'transparent',
                              border: '1px solid #555',
                              borderRadius: '4px',
                              color: '#aaa',
                              cursor: 'pointer',
                              transition: 'all 0.2s'
                            }}
                            onMouseEnter={(e) => {
                              e.target.style.borderColor = 'var(--active-color)'
                              e.target.style.color = 'var(--active-color)'
                            }}
                            onMouseLeave={(e) => {
                              e.target.style.borderColor = '#555'
                              e.target.style.color = '#aaa'
                            }}
                          >
                            Reset
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                  <tr data-row-key="canvas-dimensions">
                    <td>General</td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        Height
                        {(() => {
                          const isInherited = isPropertyInherited('General', null, 'Height')
                          const isOverridden = isPropertyOverriddenForDisplay('General', null, 'Height')
                          const wouldBeInherited = wouldPropertyBeInherited('General', null, 'Height')
                          const showIcon = isInherited || (isOverridden && wouldBeInherited)
                          return showIcon ? (
                            <svg 
                              width="14" 
                              height="14" 
                              viewBox="0 0 24 24" 
                              fill="none" 
                              stroke={isInherited ? "var(--active-color)" : "#888"} 
                              strokeWidth="2" 
                              style={{ opacity: isInherited ? 0.7 : 0.4 }} 
                              title={isInherited ? "Inherited from parent" : "Would inherit from parent (currently overridden)"}
                            >
                              <path d="M12 2L2 7l10 5 10-5-10-5z"></path>
                              <path d="M2 17l10 5 10-5"></path>
                              <path d="M2 12l10 5 10-5"></path>
                            </svg>
                          ) : null
                        })()}
                      </div>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <input
                          type="number"
                          value={canvasDimensions.height}
                          onChange={(e) => handleRuleUpdate('General', null, 'Height', e.target.value)}
                          className="rule-input rule-input-number"
                          min="1"
                        />
                        {isPropertyOverriddenForDisplay('General', null, 'Height') && (
                          <button
                            className="reset-property-btn"
                            onClick={() => handleResetProperty('General', null, 'Height')}
                            title="Reset to inherited value"
                            style={{
                              padding: '0.25rem 0.5rem',
                              fontSize: '0.75rem',
                              backgroundColor: 'transparent',
                              border: '1px solid #555',
                              borderRadius: '4px',
                              color: '#aaa',
                              cursor: 'pointer',
                              transition: 'all 0.2s'
                            }}
                            onMouseEnter={(e) => {
                              e.target.style.borderColor = 'var(--active-color)'
                              e.target.style.color = 'var(--active-color)'
                            }}
                            onMouseLeave={(e) => {
                              e.target.style.borderColor = '#555'
                              e.target.style.color = '#aaa'
                            }}
                          >
                            Reset
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                  <tr data-row-key="background-color">
                    <td>General</td>
                    <td>Background Color</td>
                    <td>
                      <input
                        type="color"
                        value={formValues.backgroundColor || '#000428'}
                        onChange={(e) => handleRuleUpdate('General', null, 'Background Color', e.target.value)}
                        className="rule-input rule-input-color"
                        disabled={useMetadata.backgroundColor}
                        readOnly={useMetadata.backgroundColor}
                        title={useMetadata.backgroundColor ? 'Using metadata value' : 'Background color'}
                      />
                    </td>
                  </tr>
                  
                  {/* Layer Rules */}
                  <tr className="category-row">
                    <td colSpan="3"><strong>Layers</strong></td>
                  </tr>
                  {(() => {
                    const rules = editableRules[selectedDesign.id] || editableRules['parent']
                    const layers = [
                      { name: 'Title', data: rules.title, key: 'title' },
                      { name: 'Tagline', data: rules.tagline, key: 'tagline' },
                      { name: 'Image', data: rules.image, key: 'image' },
                      { name: 'Original Price', data: rules.origPrice, key: 'origPrice' },
                      { name: 'Price', data: rules.price, key: 'price' }
                    ]
                    return layers.flatMap(layer => {
                      const rows = []
                      // Map layer names to row keys
                      const rowKeyMap = {
                        'Title': 'title-layer',
                        'Tagline': 'tagline-layer',
                        'Image': 'image-layer',
                        'Original Price': 'origPrice-layer',
                        'Price': 'price-layer'
                      }
                      const rowKey = rowKeyMap[layer.name]
                      
                      // Add sub-category row for the layer
                      rows.push(
                        <tr key={`${layer.name}-header`} className="sub-category-row" data-row-key={rowKey}>
                          <td colSpan="3"><strong>{layer.name}</strong></td>
                        </tr>
                      )
                      // Add property rows without layer name
                      Object.entries(layer.data).forEach(([key, value]) => {
                        const fieldType = getFieldType(key, layer.name)
                        const currentValue = value
                        
                        let inputElement
                        if (fieldType === 'color') {
                          inputElement = (
                            <input
                              type="color"
                              value={currentValue || '#ffffff'}
                              onChange={(e) => handleRuleUpdate('Layers', layer.name, key, e.target.value)}
                              className="rule-input rule-input-color"
                            />
                          )
                        } else if (fieldType === 'gravity') {
                          inputElement = (
                            <select
                              value={currentValue}
                              onChange={(e) => handleRuleUpdate('Layers', layer.name, key, e.target.value)}
                              className="rule-input rule-input-select"
                            >
                              {getGravityOptions().map(opt => (
                                <option key={opt.value} value={opt.value}>{opt.label}</option>
                              ))}
                            </select>
                          )
                        } else if (fieldType === 'font') {
                          inputElement = (
                            <select
                              value={currentValue || 'Arial'}
                              onChange={(e) => handleRuleUpdate('Layers', layer.name, key, e.target.value)}
                              className="rule-input rule-input-select"
                            >
                              {getFontOptions().map(font => (
                                <option key={font.value} value={font.value}>{font.name}</option>
                              ))}
                            </select>
                          )
                        } else if (fieldType === 'fontSize') {
                          // fontSize: text input with validation (no percentage in parent)
                          const inputKey = `${selectedDesign.id}-${layer.name}-${key}`
                          inputElement = (
                            <input
                              type="text"
                              value={String(currentValue || '')}
                              onFocus={(e) => {
                                // Store the value when focused (before any changes)
                                fontSizePreviousValues.current[inputKey] = currentValue
                              }}
                              onChange={(e) => {
                                // Allow typing freely, validation happens on blur/enter
                                handleRuleUpdate('Layers', layer.name, key, e.target.value)
                              }}
                              onBlur={(e) => {
                                // Validate on blur and revert if invalid
                                const previousValue = fontSizePreviousValues.current[inputKey]
                                handleFontSizeValidation('Layers', layer.name, key, e.target.value, previousValue)
                                // Clean up
                                delete fontSizePreviousValues.current[inputKey]
                              }}
                              onKeyDown={(e) => {
                                // Validate on Enter key
                                if (e.key === 'Enter') {
                                  e.preventDefault()
                                  const previousValue = fontSizePreviousValues.current[inputKey]
                                  handleFontSizeValidation('Layers', layer.name, key, e.target.value, previousValue)
                                  delete fontSizePreviousValues.current[inputKey]
                                  e.target.blur()
                                }
                              }}
                              className="rule-input rule-input-text"
                            />
                          )
                        } else if (fieldType === 'number') {
                          inputElement = (
                            <input
                              type="number"
                              value={currentValue}
                              onChange={(e) => handleRuleUpdate('Layers', layer.name, key, e.target.value)}
                              className="rule-input rule-input-number"
                              step={key === 'fontSize' ? '0.1' : '1'}
                            />
                          )
                        } else if (fieldType === 'boolean') {
                          inputElement = (
                            <div className="toggle-wrapper" onClick={() => handleRuleUpdate('Layers', layer.name, key, !currentValue)}>
                              <div className={`toggle-track ${currentValue ? 'active' : ''}`}>
                                <div className="toggle-thumb"></div>
                              </div>
                            </div>
                          )
                        } else {
                          inputElement = (
                            <input
                              type="text"
                              value={String(currentValue)}
                              onChange={(e) => handleRuleUpdate('Layers', layer.name, key, e.target.value)}
                              className="rule-input rule-input-text"
                            />
                          )
                        }
                        
                        const isInherited = isPropertyInherited('Layers', layer.name, key)
                        const isOverridden = isPropertyOverriddenForDisplay('Layers', layer.name, key)
                        const wouldBeInherited = wouldPropertyBeInherited('Layers', layer.name, key)
                        const showIcon = isInherited || (isOverridden && wouldBeInherited)
                        
                        rows.push(
                          <tr key={`${layer.name}-${key}`} data-row-key={rowKey}>
                            <td></td>
                            <td>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                {key}
                                {showIcon && (
                                  <svg 
                                    width="14" 
                                    height="14" 
                                    viewBox="0 0 24 24" 
                                    fill="none" 
                                    stroke={isInherited ? "var(--active-color)" : "#888"} 
                                    strokeWidth="2" 
                                    style={{ opacity: isInherited ? 0.7 : 0.4 }} 
                                    title={isInherited ? "Inherited from parent" : "Would inherit from parent (currently overridden)"}
                                  >
                                    <path d="M12 2L2 7l10 5 10-5-10-5z"></path>
                                    <path d="M2 17l10 5 10-5"></path>
                                    <path d="M2 12l10 5 10-5"></path>
                                  </svg>
                                )}
                              </div>
                            </td>
                            <td>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                {inputElement}
                                {isOverridden && (
                                  <button
                                    className="reset-property-btn"
                                    onClick={() => handleResetProperty('Layers', layer.name, key)}
                                    title="Reset to inherited value"
                                    style={{
                                      padding: '0.25rem 0.5rem',
                                      fontSize: '0.75rem',
                                      backgroundColor: 'transparent',
                                      border: '1px solid #555',
                                      borderRadius: '4px',
                                      color: '#aaa',
                                      cursor: 'pointer',
                                      transition: 'all 0.2s'
                                    }}
                                    onMouseEnter={(e) => {
                                      e.target.style.borderColor = 'var(--active-color)'
                                      e.target.style.color = 'var(--active-color)'
                                    }}
                                    onMouseLeave={(e) => {
                                      e.target.style.borderColor = '#555'
                                      e.target.style.color = '#aaa'
                                    }}
                                  >
                                    Reset
                                  </button>
                                )}
                              </div>
                            </td>
                          </tr>
                        )
                      })
                      return rows
                    })
                  })()}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Right: Controls */}
        <div className="controls-panel">
          <h3>Customize</h3>
          
          {/* General Section */}
          <div className="control-section">
            <h4 className="section-title">General</h4>
            
            <div className="control-group">
              <div className="label-row">
                <label>Width</label>
              </div>
              <input
                type="number"
                name="width"
                value={canvasDimensions.width}
                onChange={(e) => {
                  const value = parseInt(e.target.value) || 0
                  setCanvasDimensions(prev => ({ ...prev, width: value }))
                }}
                min="1"
                style={{
                  width: '100%',
                  padding: '0.5rem',
                  border: '1px solid #444',
                  borderRadius: '4px',
                  backgroundColor: '#2a2a2a',
                  color: '#fff'
                }}
              />
            </div>

            <div className="control-group">
              <div className="label-row">
                <label>Height</label>
              </div>
              <input
                type="number"
                name="height"
                value={canvasDimensions.height}
                onChange={(e) => {
                  const value = parseInt(e.target.value) || 0
                  setCanvasDimensions(prev => ({ ...prev, height: value }))
                }}
                min="1"
                style={{
                  width: '100%',
                  padding: '0.5rem',
                  border: '1px solid #444',
                  borderRadius: '4px',
                  backgroundColor: '#2a2a2a',
                  color: '#fff'
                }}
              />
            </div>

            <div className="control-group">
              <div className="label-row">
                <label>Background Color</label>
                <div className="toggle-wrapper" onClick={() => handleToggleChange('backgroundColor')}>
                  <div className={`toggle-track ${useMetadata.backgroundColor ? 'active' : ''}`}>
                    <div className="toggle-thumb"></div>
                  </div>
                  <span className="toggle-label">Use Metadata</span>
                </div>
              </div>
              <input 
                type="color" 
                name="backgroundColor"
                value={useMetadata.backgroundColor ? '#888888' : (formValues.backgroundColor || '#000428')}
                onChange={handleInputChange}
                disabled={useMetadata.backgroundColor}
                style={{ 
                  width: '100%', 
                  height: '40px', 
                  border: '1px solid #444', 
                  borderRadius: '4px',
                  cursor: useMetadata.backgroundColor ? 'not-allowed' : 'pointer',
                  opacity: useMetadata.backgroundColor ? 0.5 : 1
                }}
                title={useMetadata.backgroundColor ? 'Using metadata value (pbackgroundcolor)' : 'Background color'}
              />
            </div>
          </div>

          {/* Fields Section */}
          <div className="control-section">
            <h4 className="section-title">Fields</h4>
            
            <div className="control-group">
              <div className="label-row">
                <label>Title</label>
                <div className="toggle-wrapper" onClick={() => handleToggleChange('title')}>
                   <div className={`toggle-track ${useMetadata.title ? 'active' : ''}`}>
                     <div className="toggle-thumb"></div>
                   </div>
                  <span className="toggle-label">Use Metadata</span>
                </div>
              </div>
              <input 
                type="text" 
                name="title"
                value={formValues.title}
                onChange={handleInputChange}
              />
            </div>

            <div className="control-group">
              <div className="label-row">
                <label>Tagline</label>
                <div className="toggle-wrapper" onClick={() => handleToggleChange('tagline')}>
                   <div className={`toggle-track ${useMetadata.tagline ? 'active' : ''}`}>
                     <div className="toggle-thumb"></div>
                   </div>
                  <span className="toggle-label">Use Metadata</span>
                </div>
              </div>
              <input 
                type="text" 
                name="tagline"
                value={formValues.tagline}
                onChange={handleInputChange}
              />
            </div>

            <div className="control-group">
               <div className="label-row">
                <label>Price ($)</label>
                <div className="toggle-wrapper" onClick={() => handleToggleChange('price')}>
                   <div className={`toggle-track ${useMetadata.price ? 'active' : ''}`}>
                     <div className="toggle-thumb"></div>
                   </div>
                  <span className="toggle-label">Use Metadata</span>
                </div>
              </div>
              <input 
                type="text" 
                name="price"
                value={formValues.price}
                onChange={handleInputChange}
              />
            </div>

          </div>

          {/* Layer Styles Section */}
          <div className="control-section">
            <h4 className="section-title">Layer Styles</h4>
            
            {/* Title Font */}
            <div className="control-subsection">
              <h5 className="subsection-title">Title</h5>
              <div className="control-group">
                <div className="label-row">
                  <label>Font</label>
                  {(() => {
                    const isInherited = isPropertyInherited('Layers', 'Title', 'font')
                    const isOverridden = isPropertyOverriddenForDisplay('Layers', 'Title', 'font')
                    const wouldBeInherited = wouldPropertyBeInherited('Layers', 'Title', 'font')
                    const showIcon = isInherited || (isOverridden && wouldBeInherited)
                    return showIcon ? (
                      <svg 
                        width="14" 
                        height="14" 
                        viewBox="0 0 24 24" 
                        fill="none" 
                        stroke={isInherited ? "var(--active-color)" : "#888"} 
                        strokeWidth="2" 
                        style={{ opacity: isInherited ? 0.7 : 0.4 }} 
                        title={isInherited ? "Inherited from parent" : "Would inherit from parent (currently overridden)"}
                      >
                        <path d="M12 2L2 7l10 5 10-5-10-5z"></path>
                        <path d="M2 17l10 5 10-5"></path>
                        <path d="M2 12l10 5 10-5"></path>
                      </svg>
                    ) : null
                  })()}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <select 
                    value={editableRules[selectedDesign.id]?.title?.font || 'Arial'}
                    onChange={(e) => handleRuleUpdate('Layers', 'Title', 'font', e.target.value)}
                    style={{ flex: 1 }}
                  >
                    {GOOGLE_FONTS.map(font => (
                      <option key={font.value} value={font.value}>
                        {font.name}
                      </option>
                    ))}
                  </select>
                  {isPropertyOverriddenForDisplay('Layers', 'Title', 'font') && (
                    <button
                      className="reset-property-btn"
                      onClick={() => handleResetProperty('Layers', 'Title', 'font')}
                      title="Reset to inherited value"
                      style={{
                        padding: '0.25rem 0.5rem',
                        fontSize: '0.75rem',
                        backgroundColor: 'transparent',
                        border: '1px solid #555',
                        borderRadius: '4px',
                        color: '#aaa',
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                        whiteSpace: 'nowrap'
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.borderColor = 'var(--active-color)'
                        e.target.style.color = 'var(--active-color)'
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.borderColor = '#555'
                        e.target.style.color = '#aaa'
                      }}
                    >
                      Reset
                    </button>
                  )}
                </div>
              </div>
              
              {/* Text Flags */}
              <div className="control-group">
                <div className="label-row">
                  <label>No Overflow</label>
                  {(() => {
                    const isInherited = isPropertyInherited('Layers', 'Title', 'flNoOverflow')
                    const isOverridden = isPropertyOverriddenForDisplay('Layers', 'Title', 'flNoOverflow')
                    const wouldBeInherited = wouldPropertyBeInherited('Layers', 'Title', 'flNoOverflow')
                    const showIcon = isInherited || (isOverridden && wouldBeInherited)
                    return showIcon ? (
                      <svg 
                        width="14" 
                        height="14" 
                        viewBox="0 0 24 24" 
                        fill="none" 
                        stroke={isInherited ? "var(--active-color)" : "#888"} 
                        strokeWidth="2" 
                        style={{ opacity: isInherited ? 0.7 : 0.4 }} 
                        title={isInherited ? "Inherited from parent" : "Would inherit from parent (currently overridden)"}
                      >
                        <path d="M12 2L2 7l10 5 10-5-10-5z"></path>
                        <path d="M2 17l10 5 10-5"></path>
                        <path d="M2 12l10 5 10-5"></path>
                      </svg>
                    ) : null
                  })()}
                </div>
                <div className="toggle-wrapper" onClick={() => handleRuleUpdate('Layers', 'Title', 'flNoOverflow', !(editableRules[selectedDesign.id]?.title?.flNoOverflow || false))}>
                  <div className={`toggle-track ${editableRules[selectedDesign.id]?.title?.flNoOverflow ? 'active' : ''}`}>
                    <div className="toggle-thumb"></div>
                  </div>
                </div>
              </div>
              
              <div className="control-group">
                <div className="label-row">
                  <label>Disallow Overflow</label>
                  {(() => {
                    const isInherited = isPropertyInherited('Layers', 'Title', 'flTextDisallowOverflow')
                    const isOverridden = isPropertyOverriddenForDisplay('Layers', 'Title', 'flTextDisallowOverflow')
                    const wouldBeInherited = wouldPropertyBeInherited('Layers', 'Title', 'flTextDisallowOverflow')
                    const showIcon = isInherited || (isOverridden && wouldBeInherited)
                    return showIcon ? (
                      <svg 
                        width="14" 
                        height="14" 
                        viewBox="0 0 24 24" 
                        fill="none" 
                        stroke={isInherited ? "var(--active-color)" : "#888"} 
                        strokeWidth="2" 
                        style={{ opacity: isInherited ? 0.7 : 0.4 }} 
                        title={isInherited ? "Inherited from parent" : "Would inherit from parent (currently overridden)"}
                      >
                        <path d="M12 2L2 7l10 5 10-5-10-5z"></path>
                        <path d="M2 17l10 5 10-5"></path>
                        <path d="M2 12l10 5 10-5"></path>
                      </svg>
                    ) : null
                  })()}
                </div>
                <div className="toggle-wrapper" onClick={() => handleRuleUpdate('Layers', 'Title', 'flTextDisallowOverflow', !(editableRules[selectedDesign.id]?.title?.flTextDisallowOverflow || false))}>
                  <div className={`toggle-track ${editableRules[selectedDesign.id]?.title?.flTextDisallowOverflow ? 'active' : ''}`}>
                    <div className="toggle-thumb"></div>
                  </div>
                </div>
              </div>
              
              <div className="control-group">
                <div className="label-row">
                  <label>Text Wrap</label>
                  {(() => {
                    const isInherited = isPropertyInherited('Layers', 'Title', 'textWrap')
                    const isOverridden = isPropertyOverriddenForDisplay('Layers', 'Title', 'textWrap')
                    const wouldBeInherited = wouldPropertyBeInherited('Layers', 'Title', 'textWrap')
                    const showIcon = isInherited || (isOverridden && wouldBeInherited)
                    return showIcon ? (
                      <svg 
                        width="14" 
                        height="14" 
                        viewBox="0 0 24 24" 
                        fill="none" 
                        stroke={isInherited ? "var(--active-color)" : "#888"} 
                        strokeWidth="2" 
                        style={{ opacity: isInherited ? 0.7 : 0.4 }} 
                        title={isInherited ? "Inherited from parent" : "Would inherit from parent (currently overridden)"}
                      >
                        <path d="M12 2L2 7l10 5 10-5-10-5z"></path>
                        <path d="M2 17l10 5 10-5"></path>
                        <path d="M2 12l10 5 10-5"></path>
                      </svg>
                    ) : null
                  })()}
                </div>
                <div className="toggle-wrapper" onClick={() => handleRuleUpdate('Layers', 'Title', 'textWrap', !(editableRules[selectedDesign.id]?.title?.textWrap !== false))}>
                  <div className={`toggle-track ${editableRules[selectedDesign.id]?.title?.textWrap !== false ? 'active' : ''}`}>
                    <div className="toggle-thumb"></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Tagline Font */}
            <div className="control-subsection">
              <h5 className="subsection-title">Tagline</h5>
              <div className="control-group">
                <div className="label-row">
                  <label>Font</label>
                  {(() => {
                    const isInherited = isPropertyInherited('Layers', 'Tagline', 'font')
                    const isOverridden = isPropertyOverriddenForDisplay('Layers', 'Tagline', 'font')
                    const wouldBeInherited = wouldPropertyBeInherited('Layers', 'Tagline', 'font')
                    const showIcon = isInherited || (isOverridden && wouldBeInherited)
                    return showIcon ? (
                      <svg 
                        width="14" 
                        height="14" 
                        viewBox="0 0 24 24" 
                        fill="none" 
                        stroke={isInherited ? "var(--active-color)" : "#888"} 
                        strokeWidth="2" 
                        style={{ opacity: isInherited ? 0.7 : 0.4 }} 
                        title={isInherited ? "Inherited from parent" : "Would inherit from parent (currently overridden)"}
                      >
                        <path d="M12 2L2 7l10 5 10-5-10-5z"></path>
                        <path d="M2 17l10 5 10-5"></path>
                        <path d="M2 12l10 5 10-5"></path>
                      </svg>
                    ) : null
                  })()}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <select 
                    value={editableRules[selectedDesign.id]?.tagline?.font || 'Arial'}
                    onChange={(e) => handleRuleUpdate('Layers', 'Tagline', 'font', e.target.value)}
                    style={{ flex: 1 }}
                  >
                    {GOOGLE_FONTS.map(font => (
                      <option key={font.value} value={font.value}>
                        {font.name}
                      </option>
                    ))}
                  </select>
                  {isPropertyOverriddenForDisplay('Layers', 'Tagline', 'font') && (
                    <button
                      className="reset-property-btn"
                      onClick={() => handleResetProperty('Layers', 'Tagline', 'font')}
                      title="Reset to inherited value"
                      style={{
                        padding: '0.25rem 0.5rem',
                        fontSize: '0.75rem',
                        backgroundColor: 'transparent',
                        border: '1px solid #555',
                        borderRadius: '4px',
                        color: '#aaa',
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                        whiteSpace: 'nowrap'
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.borderColor = 'var(--active-color)'
                        e.target.style.color = 'var(--active-color)'
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.borderColor = '#555'
                        e.target.style.color = '#aaa'
                      }}
                    >
                      Reset
                    </button>
                  )}
                </div>
              </div>
              
              {/* Text Flags */}
              <div className="control-group">
                <div className="label-row">
                  <label>No Overflow</label>
                  {(() => {
                    const isInherited = isPropertyInherited('Layers', 'Tagline', 'flNoOverflow')
                    const isOverridden = isPropertyOverriddenForDisplay('Layers', 'Tagline', 'flNoOverflow')
                    const wouldBeInherited = wouldPropertyBeInherited('Layers', 'Tagline', 'flNoOverflow')
                    const showIcon = isInherited || (isOverridden && wouldBeInherited)
                    return showIcon ? (
                      <svg 
                        width="14" 
                        height="14" 
                        viewBox="0 0 24 24" 
                        fill="none" 
                        stroke={isInherited ? "var(--active-color)" : "#888"} 
                        strokeWidth="2" 
                        style={{ opacity: isInherited ? 0.7 : 0.4 }} 
                        title={isInherited ? "Inherited from parent" : "Would inherit from parent (currently overridden)"}
                      >
                        <path d="M12 2L2 7l10 5 10-5-10-5z"></path>
                        <path d="M2 17l10 5 10-5"></path>
                        <path d="M2 12l10 5 10-5"></path>
                      </svg>
                    ) : null
                  })()}
                </div>
                <div className="toggle-wrapper" onClick={() => handleRuleUpdate('Layers', 'Tagline', 'flNoOverflow', !(editableRules[selectedDesign.id]?.tagline?.flNoOverflow || false))}>
                  <div className={`toggle-track ${editableRules[selectedDesign.id]?.tagline?.flNoOverflow ? 'active' : ''}`}>
                    <div className="toggle-thumb"></div>
                  </div>
                </div>
              </div>
              
              <div className="control-group">
                <div className="label-row">
                  <label>Disallow Overflow</label>
                  {(() => {
                    const isInherited = isPropertyInherited('Layers', 'Tagline', 'flTextDisallowOverflow')
                    const isOverridden = isPropertyOverriddenForDisplay('Layers', 'Tagline', 'flTextDisallowOverflow')
                    const wouldBeInherited = wouldPropertyBeInherited('Layers', 'Tagline', 'flTextDisallowOverflow')
                    const showIcon = isInherited || (isOverridden && wouldBeInherited)
                    return showIcon ? (
                      <svg 
                        width="14" 
                        height="14" 
                        viewBox="0 0 24 24" 
                        fill="none" 
                        stroke={isInherited ? "var(--active-color)" : "#888"} 
                        strokeWidth="2" 
                        style={{ opacity: isInherited ? 0.7 : 0.4 }} 
                        title={isInherited ? "Inherited from parent" : "Would inherit from parent (currently overridden)"}
                      >
                        <path d="M12 2L2 7l10 5 10-5-10-5z"></path>
                        <path d="M2 17l10 5 10-5"></path>
                        <path d="M2 12l10 5 10-5"></path>
                      </svg>
                    ) : null
                  })()}
                </div>
                <div className="toggle-wrapper" onClick={() => handleRuleUpdate('Layers', 'Tagline', 'flTextDisallowOverflow', !(editableRules[selectedDesign.id]?.tagline?.flTextDisallowOverflow || false))}>
                  <div className={`toggle-track ${editableRules[selectedDesign.id]?.tagline?.flTextDisallowOverflow ? 'active' : ''}`}>
                    <div className="toggle-thumb"></div>
                  </div>
                </div>
              </div>
              
              <div className="control-group">
                <div className="label-row">
                  <label>Text Wrap</label>
                  {(() => {
                    const isInherited = isPropertyInherited('Layers', 'Tagline', 'textWrap')
                    const isOverridden = isPropertyOverriddenForDisplay('Layers', 'Tagline', 'textWrap')
                    const wouldBeInherited = wouldPropertyBeInherited('Layers', 'Tagline', 'textWrap')
                    const showIcon = isInherited || (isOverridden && wouldBeInherited)
                    return showIcon ? (
                      <svg 
                        width="14" 
                        height="14" 
                        viewBox="0 0 24 24" 
                        fill="none" 
                        stroke={isInherited ? "var(--active-color)" : "#888"} 
                        strokeWidth="2" 
                        style={{ opacity: isInherited ? 0.7 : 0.4 }} 
                        title={isInherited ? "Inherited from parent" : "Would inherit from parent (currently overridden)"}
                      >
                        <path d="M12 2L2 7l10 5 10-5-10-5z"></path>
                        <path d="M2 17l10 5 10-5"></path>
                        <path d="M2 12l10 5 10-5"></path>
                      </svg>
                    ) : null
                  })()}
                </div>
                <div className="toggle-wrapper" onClick={() => handleRuleUpdate('Layers', 'Tagline', 'textWrap', !(editableRules[selectedDesign.id]?.tagline?.textWrap !== false))}>
                  <div className={`toggle-track ${editableRules[selectedDesign.id]?.tagline?.textWrap !== false ? 'active' : ''}`}>
                    <div className="toggle-thumb"></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Price Font */}
            <div className="control-subsection">
              <h5 className="subsection-title">Price</h5>
              <div className="control-group">
                <div className="label-row">
                  <label>Font</label>
                  {(() => {
                    const isInherited = isPropertyInherited('Layers', 'Price', 'font')
                    const isOverridden = isPropertyOverriddenForDisplay('Layers', 'Price', 'font')
                    const wouldBeInherited = wouldPropertyBeInherited('Layers', 'Price', 'font')
                    const showIcon = isInherited || (isOverridden && wouldBeInherited)
                    return showIcon ? (
                      <svg 
                        width="14" 
                        height="14" 
                        viewBox="0 0 24 24" 
                        fill="none" 
                        stroke={isInherited ? "var(--active-color)" : "#888"} 
                        strokeWidth="2" 
                        style={{ opacity: isInherited ? 0.7 : 0.4 }} 
                        title={isInherited ? "Inherited from parent" : "Would inherit from parent (currently overridden)"}
                      >
                        <path d="M12 2L2 7l10 5 10-5-10-5z"></path>
                        <path d="M2 17l10 5 10-5"></path>
                        <path d="M2 12l10 5 10-5"></path>
                      </svg>
                    ) : null
                  })()}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <select 
                    value={editableRules[selectedDesign.id]?.price?.font || 'Arial'}
                    onChange={(e) => handleRuleUpdate('Layers', 'Price', 'font', e.target.value)}
                    style={{ flex: 1 }}
                  >
                    {GOOGLE_FONTS.map(font => (
                      <option key={font.value} value={font.value}>
                        {font.name}
                      </option>
                    ))}
                  </select>
                  {isPropertyOverriddenForDisplay('Layers', 'Price', 'font') && (
                    <button
                      className="reset-property-btn"
                      onClick={() => handleResetProperty('Layers', 'Price', 'font')}
                      title="Reset to inherited value"
                      style={{
                        padding: '0.25rem 0.5rem',
                        fontSize: '0.75rem',
                        backgroundColor: 'transparent',
                        border: '1px solid #555',
                        borderRadius: '4px',
                        color: '#aaa',
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                        whiteSpace: 'nowrap'
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.borderColor = 'var(--active-color)'
                        e.target.style.color = 'var(--active-color)'
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.borderColor = '#555'
                        e.target.style.color = '#aaa'
                      }}
                    >
                      Reset
                    </button>
                  )}
                </div>
              </div>
              
              {/* Text Flags */}
              <div className="control-group">
                <div className="label-row">
                  <label>No Overflow</label>
                  {(() => {
                    const isInherited = isPropertyInherited('Layers', 'Price', 'flNoOverflow')
                    const isOverridden = isPropertyOverriddenForDisplay('Layers', 'Price', 'flNoOverflow')
                    const wouldBeInherited = wouldPropertyBeInherited('Layers', 'Price', 'flNoOverflow')
                    const showIcon = isInherited || (isOverridden && wouldBeInherited)
                    return showIcon ? (
                      <svg 
                        width="14" 
                        height="14" 
                        viewBox="0 0 24 24" 
                        fill="none" 
                        stroke={isInherited ? "var(--active-color)" : "#888"} 
                        strokeWidth="2" 
                        style={{ opacity: isInherited ? 0.7 : 0.4 }} 
                        title={isInherited ? "Inherited from parent" : "Would inherit from parent (currently overridden)"}
                      >
                        <path d="M12 2L2 7l10 5 10-5-10-5z"></path>
                        <path d="M2 17l10 5 10-5"></path>
                        <path d="M2 12l10 5 10-5"></path>
                      </svg>
                    ) : null
                  })()}
                </div>
                <div className="toggle-wrapper" onClick={() => handleRuleUpdate('Layers', 'Price', 'flNoOverflow', !(editableRules[selectedDesign.id]?.price?.flNoOverflow || false))}>
                  <div className={`toggle-track ${editableRules[selectedDesign.id]?.price?.flNoOverflow ? 'active' : ''}`}>
                    <div className="toggle-thumb"></div>
                  </div>
                </div>
              </div>
              
              <div className="control-group">
                <div className="label-row">
                  <label>Disallow Overflow</label>
                  {(() => {
                    const isInherited = isPropertyInherited('Layers', 'Price', 'flTextDisallowOverflow')
                    const isOverridden = isPropertyOverriddenForDisplay('Layers', 'Price', 'flTextDisallowOverflow')
                    const wouldBeInherited = wouldPropertyBeInherited('Layers', 'Price', 'flTextDisallowOverflow')
                    const showIcon = isInherited || (isOverridden && wouldBeInherited)
                    return showIcon ? (
                      <svg 
                        width="14" 
                        height="14" 
                        viewBox="0 0 24 24" 
                        fill="none" 
                        stroke={isInherited ? "var(--active-color)" : "#888"} 
                        strokeWidth="2" 
                        style={{ opacity: isInherited ? 0.7 : 0.4 }} 
                        title={isInherited ? "Inherited from parent" : "Would inherit from parent (currently overridden)"}
                      >
                        <path d="M12 2L2 7l10 5 10-5-10-5z"></path>
                        <path d="M2 17l10 5 10-5"></path>
                        <path d="M2 12l10 5 10-5"></path>
                      </svg>
                    ) : null
                  })()}
                </div>
                <div className="toggle-wrapper" onClick={() => handleRuleUpdate('Layers', 'Price', 'flTextDisallowOverflow', !(editableRules[selectedDesign.id]?.price?.flTextDisallowOverflow || false))}>
                  <div className={`toggle-track ${editableRules[selectedDesign.id]?.price?.flTextDisallowOverflow ? 'active' : ''}`}>
                    <div className="toggle-thumb"></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Original Price Font */}
            <div className="control-subsection">
              <h5 className="subsection-title">Original Price</h5>
              <div className="control-group">
                <div className="label-row">
                  <label>Font</label>
                  {(() => {
                    const isInherited = isPropertyInherited('Layers', 'Original Price', 'font')
                    const isOverridden = isPropertyOverriddenForDisplay('Layers', 'Original Price', 'font')
                    const wouldBeInherited = wouldPropertyBeInherited('Layers', 'Original Price', 'font')
                    const showIcon = isInherited || (isOverridden && wouldBeInherited)
                    return showIcon ? (
                      <svg 
                        width="14" 
                        height="14" 
                        viewBox="0 0 24 24" 
                        fill="none" 
                        stroke={isInherited ? "var(--active-color)" : "#888"} 
                        strokeWidth="2" 
                        style={{ opacity: isInherited ? 0.7 : 0.4 }} 
                        title={isInherited ? "Inherited from parent" : "Would inherit from parent (currently overridden)"}
                      >
                        <path d="M12 2L2 7l10 5 10-5-10-5z"></path>
                        <path d="M2 17l10 5 10-5"></path>
                        <path d="M2 12l10 5 10-5"></path>
                      </svg>
                    ) : null
                  })()}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <select 
                    value={editableRules[selectedDesign.id]?.origPrice?.font || 'Arial'}
                    onChange={(e) => handleRuleUpdate('Layers', 'Original Price', 'font', e.target.value)}
                    style={{ flex: 1 }}
                  >
                    {GOOGLE_FONTS.map(font => (
                      <option key={font.value} value={font.value}>
                        {font.name}
                      </option>
                    ))}
                  </select>
                  {isPropertyOverriddenForDisplay('Layers', 'Original Price', 'font') && (
                    <button
                      className="reset-property-btn"
                      onClick={() => handleResetProperty('Layers', 'Original Price', 'font')}
                      title="Reset to inherited value"
                      style={{
                        padding: '0.25rem 0.5rem',
                        fontSize: '0.75rem',
                        backgroundColor: 'transparent',
                        border: '1px solid #555',
                        borderRadius: '4px',
                        color: '#aaa',
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                        whiteSpace: 'nowrap'
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.borderColor = 'var(--active-color)'
                        e.target.style.color = 'var(--active-color)'
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.borderColor = '#555'
                        e.target.style.color = '#aaa'
                      }}
                    >
                      Reset
                    </button>
                  )}
                </div>
              </div>
              
              {/* Text Flags */}
              <div className="control-group">
                <div className="label-row">
                  <label>No Overflow</label>
                  {(() => {
                    const isInherited = isPropertyInherited('Layers', 'Original Price', 'flNoOverflow')
                    const isOverridden = isPropertyOverriddenForDisplay('Layers', 'Original Price', 'flNoOverflow')
                    const wouldBeInherited = wouldPropertyBeInherited('Layers', 'Original Price', 'flNoOverflow')
                    const showIcon = isInherited || (isOverridden && wouldBeInherited)
                    return showIcon ? (
                      <svg 
                        width="14" 
                        height="14" 
                        viewBox="0 0 24 24" 
                        fill="none" 
                        stroke={isInherited ? "var(--active-color)" : "#888"} 
                        strokeWidth="2" 
                        style={{ opacity: isInherited ? 0.7 : 0.4 }} 
                        title={isInherited ? "Inherited from parent" : "Would inherit from parent (currently overridden)"}
                      >
                        <path d="M12 2L2 7l10 5 10-5-10-5z"></path>
                        <path d="M2 17l10 5 10-5"></path>
                        <path d="M2 12l10 5 10-5"></path>
                      </svg>
                    ) : null
                  })()}
                </div>
                <div className="toggle-wrapper" onClick={() => handleRuleUpdate('Layers', 'Original Price', 'flNoOverflow', !(editableRules[selectedDesign.id]?.origPrice?.flNoOverflow || false))}>
                  <div className={`toggle-track ${editableRules[selectedDesign.id]?.origPrice?.flNoOverflow ? 'active' : ''}`}>
                    <div className="toggle-thumb"></div>
                  </div>
                </div>
              </div>
              
              <div className="control-group">
                <div className="label-row">
                  <label>Disallow Overflow</label>
                  {(() => {
                    const isInherited = isPropertyInherited('Layers', 'Original Price', 'flTextDisallowOverflow')
                    const isOverridden = isPropertyOverriddenForDisplay('Layers', 'Original Price', 'flTextDisallowOverflow')
                    const wouldBeInherited = wouldPropertyBeInherited('Layers', 'Original Price', 'flTextDisallowOverflow')
                    const showIcon = isInherited || (isOverridden && wouldBeInherited)
                    return showIcon ? (
                      <svg 
                        width="14" 
                        height="14" 
                        viewBox="0 0 24 24" 
                        fill="none" 
                        stroke={isInherited ? "var(--active-color)" : "#888"} 
                        strokeWidth="2" 
                        style={{ opacity: isInherited ? 0.7 : 0.4 }} 
                        title={isInherited ? "Inherited from parent" : "Would inherit from parent (currently overridden)"}
                      >
                        <path d="M12 2L2 7l10 5 10-5-10-5z"></path>
                        <path d="M2 17l10 5 10-5"></path>
                        <path d="M2 12l10 5 10-5"></path>
                      </svg>
                    ) : null
                  })()}
                </div>
                <div className="toggle-wrapper" onClick={() => handleRuleUpdate('Layers', 'Original Price', 'flTextDisallowOverflow', !(editableRules[selectedDesign.id]?.origPrice?.flTextDisallowOverflow || false))}>
                  <div className={`toggle-track ${editableRules[selectedDesign.id]?.origPrice?.flTextDisallowOverflow ? 'active' : ''}`}>
                    <div className="toggle-thumb"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="generated-url">
            <div className="url-header">
              <label>Generated URL</label>
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <div className="toggle-wrapper" onClick={() => setShowVerboseUrl(!showVerboseUrl)} style={{ cursor: 'pointer' }}>
                  <div className={`toggle-track ${showVerboseUrl ? 'active' : ''}`} style={{ width: '32px', height: '18px' }}>
                    <div className="toggle-thumb" style={{ width: '14px', height: '14px', top: '2px', left: '2px' }}></div>
                  </div>
                  <span className="toggle-label" style={{ fontSize: '0.65rem' }}>Verbose</span>
                </div>
                <button 
                  className="copy-btn"
                  onClick={handleCopy}
                >
                  {copySuccess || 'Copy'}
                </button>
              </div>
            </div>
            <div className="url-display">
              {showVerboseUrl ? generatedUrl : getNonVerboseUrl()}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DesignPlayground

