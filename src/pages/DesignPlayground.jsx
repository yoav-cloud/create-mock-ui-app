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




const LIGHT_BLUE = '#03a9f4'

// Design positioning rules - one entry per design type
// Each rule contains: width, height (canvas dimensions), x, y, gravity, fontSize (and width/height for image)
// fontSize can be a number (absolute) or a string with percentage (e.g., "50%") relative to a parent value
const DESIGN_RULES = {
  'parent': {
    width: 500,
    height: 900,
    title: { x: 30, y: 40, gravity: GRAVITY_VALUES.northWest, fontSize: 32 },
    tagline: { x: 30, y: 120, gravity: GRAVITY_VALUES.northEast, fontSize: 20 },
    image: { width: 300, height: 300, x: 10, y: 30, gravity: GRAVITY_VALUES.southEast },
    origPrice: { x: 30, y: 40, gravity: GRAVITY_VALUES.southWest, fontSize: 30 },
    price: { x: 130, y: 40, gravity: GRAVITY_VALUES.southWest, fontSize: 44 }
  },
  'ig-ad': {
    width: 1080,
    height: 1080,
    title: { x: 0, y: 65, gravity: GRAVITY_VALUES.north, fontSize: 32 },
    tagline: { x: 0, y: 100, gravity: GRAVITY_VALUES.north, fontSize: 20 },
    image: { width: 350, height: 250, x: 0, y: 120, gravity: GRAVITY_VALUES.north },
    origPrice: { x: -50, y: 60, gravity: GRAVITY_VALUES.south, fontSize: 30 },
    price: { x: 50, y: 50, gravity: GRAVITY_VALUES.south, fontSize: 44 }
  },
  'fb-mobile': {
    width: 1080,
    height: 1350,
    title: { x: 0, y: 30, gravity: GRAVITY_VALUES.north, fontSize: 32 },
    tagline: { x: 0, y: 60, gravity: GRAVITY_VALUES.south, fontSize: 20 },
    image: { width: 380, height: 280, x: 0, y: 60, gravity: GRAVITY_VALUES.center },
    origPrice: { x: 0, y: -160, gravity: GRAVITY_VALUES.center, fontSize: 30 },
    price: { x: 0, y: -120, gravity: GRAVITY_VALUES.center, fontSize: 44 }
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

  // Update canvas dimensions when design changes (if not already customized)
  useEffect(() => {
    const rules = DESIGN_RULES[selectedDesign.id] || DESIGN_RULES['parent']
    // Update to match the new design's default dimensions
    setCanvasDimensions({
      width: rules.width,
      height: rules.height
    })
  }, [selectedDesign.id]) // Only depend on design ID

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
    // fontSize can be a number (absolute) or a string like "50%" (relative to parentValue)
    const calculateFontSize = (fontSize, parentValue, scaleFn) => {
      if (typeof fontSize === 'string' && fontSize.endsWith('%')) {
        // Percentage value: calculate relative to parent
        const percentage = parseFloat(fontSize) / 100
        return scaleFn(parentValue * percentage)
      }
      // Absolute value
      return scaleFn(fontSize)
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
    
    // Get positioning rules for the selected design type
    const rules = DESIGN_RULES[selectedDesign.id] || DESIGN_RULES['parent']
    
    // Use canvas dimensions from state (editable) or fallback to rules
    const padW = canvasDimensions.width || rules.width
    const padH = canvasDimensions.height || rules.height
    
    // Calculate font sizes with percentage support
    // Title is the base (parent) for percentage calculations - use unscaled base value
    const baseTitleSize = typeof rules.title.fontSize === 'string' && rules.title.fontSize.endsWith('%')
      ? 32 // Default base if title itself is percentage (shouldn't happen, but fallback)
      : rules.title.fontSize
    
    // Calculate title font size (scaled)
    const fontSizeTitle = calculateFontSize(rules.title.fontSize, baseTitleSize, s)
    
    // Calculate other font sizes relative to title's base (unscaled) value, then scale
    const fontSizeTagline = calculateFontSize(rules.tagline.fontSize, baseTitleSize, s)
    const fontSizePrice = calculateFontSize(rules.price.fontSize, baseTitleSize, s)
    const fontSizeOrigPrice = calculateFontSize(rules.origPrice.fontSize, baseTitleSize, s)
    
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
      `l_text:Arial_${fontSizeTitle}_bold:$(title),co_rgb:ffffff,fl_no_overflow`, // Title Layer
      `fl_layer_apply,g_${titleGravity},x_${titleX},y_${titleY}`,
      `l_text:Arial_${fontSizeTagline}_italic:$(tagline),co_rgb:ffffff,fl_no_overflow`, // Tagline Layer
      `fl_layer_apply,g_${taglineGravity},x_${taglineX},y_${taglineY}`,
      `l_$img`, // Image Layer
      `c_fit,w_${imgW},h_${imgH}`,
      `fl_layer_apply,g_${imgGravity},x_${imgX},y_${imgY}`,
      `l_text:Arial_${fontSizeOrigPrice}_strikethrough:%24$(origprice),co_rgb:bbbbbb,fl_no_overflow`, // Orig Price Layer
      `fl_layer_apply,g_${origPriceGravity},x_${origPriceX},y_${origPriceY}`,
      `l_text:Arial_${fontSizePrice}_bold:%24$(price),co_rgb:ffffff,fl_no_overflow`, // Price Layer
      `fl_layer_apply,g_${priceGravity},x_${priceX},y_${priceY}`
    ]

    const transformString = transformParts.join('/')
    
    return `https://res.cloudinary.com/yoav-cloud/image/upload/${transformString}/${selectedAsset.publicId}.png`
  }

  const generatedUrl = getTransformedUrl()

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
                    className={`design-option parent ${isSelected ? 'active' : ''}`}
                    onClick={() => setSelectedDesign(design)}
                  >
                    <div className="design-name">{design.name}</div>
                    <div className="design-dims">{displayWidth} x {displayHeight}</div>
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
                  <tr>
                    <td>General</td>
                    <td>Width</td>
                    <td>{canvasDimensions.width}</td>
                  </tr>
                  <tr>
                    <td>General</td>
                    <td>Height</td>
                    <td>{canvasDimensions.height}</td>
                  </tr>
                  <tr>
                    <td>General</td>
                    <td>Background Color</td>
                    <td>{formValues.backgroundColor || '#000428'}</td>
                  </tr>
                  
                  {/* Layer Rules */}
                  <tr className="category-row">
                    <td colSpan="3"><strong>Layers</strong></td>
                  </tr>
                  {(() => {
                    const rules = DESIGN_RULES[selectedDesign.id] || DESIGN_RULES['parent']
                    const layers = [
                      { name: 'Title', data: rules.title },
                      { name: 'Tagline', data: rules.tagline },
                      { name: 'Image', data: rules.image },
                      { name: 'Original Price', data: rules.origPrice },
                      { name: 'Price', data: rules.price }
                    ]
                    return layers.flatMap(layer => {
                      const rows = []
                      // Add sub-category row for the layer
                      rows.push(
                        <tr key={`${layer.name}-header`} className="sub-category-row">
                          <td colSpan="3"><strong>{layer.name}</strong></td>
                        </tr>
                      )
                      // Add property rows without layer name
                      Object.entries(layer.data).forEach(([key, value]) => {
                        rows.push(
                          <tr key={`${layer.name}-${key}`}>
                            <td></td>
                            <td>{key}</td>
                            <td>{String(value)}</td>
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

