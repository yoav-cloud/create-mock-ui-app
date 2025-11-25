import { calculateFontSize, fontToKebabCase, buildTextFlags } from './fontUtils'
import { hexToRgb } from './colorUtils'
import { extractLayers, isTextLayer, isImageLayer, getLayerTextContent, getTextFormatting, getLayerVariableName } from './layerUtils'
import { escapeCloudinaryString } from './cloudinaryUtils'
import { GRAVITY_VALUES } from '../pages/playground/constants'

/**
 * Builds Cloudinary transformation URL dynamically from rules
 * @param {Object} params - Parameters object
 * @param {Object} params.rules - Rules object from editableRules
 * @param {Object} params.canvasDimensions - Canvas dimensions { width, height }
 * @param {Object} params.formValues - Form values
 * @param {Object} params.useMetadata - Metadata toggle state
 * @param {Object} params.savedValues - Saved values when metadata is used
 * @param {Object} params.selectedAsset - Selected asset object
 * @param {Object} params.selectedDesign - Selected design object
 * @param {number} params.baseWidth - Base width for scaling
 * @param {Function} params.getDefaultValue - Function to get default value
 * @param {Function} params.shouldUseMetadata - Function to check if metadata should be used
 * @param {Function} params.getMetaKeyForField - Function to get metadata key
 * @param {Function} params.getBackgroundColorValue - Function to get background color value
 * @param {Function} params.buildFieldLogicLocal - Function to build field logic
 * @returns {string} Cloudinary transformation URL
 */
export function buildCloudinaryTransform({
  rules,
  canvasDimensions,
  formValues,
  useMetadata,
  savedValues,
  selectedAsset,
  selectedDesign,
  baseWidth,
  getDefaultValue,
  shouldUseMetadata,
  getMetaKeyForField,
  getBackgroundColorValue,
  buildFieldLogicLocal
}) {
  const scale = selectedDesign.width / baseWidth
  const s = (val) => Math.round(val * scale)
  
  // Get canvas dimensions
  const padW = canvasDimensions.width || rules.width
  const padH = canvasDimensions.height || rules.height
  
  // Extract layers dynamically
  const layers = extractLayers(rules)
  
  // Get text layers that need form fields
  const textLayers = Object.entries(layers).filter(([key, data]) => isTextLayer(data))
  
  // Build variable definitions for text layers
  const variableDefs = []
  const variableMap = {} // Map of layerKey -> variableName
  
  textLayers.forEach(([layerKey, layerData]) => {
    const fieldName = layerData.fieldName || layerKey
    const varName = getLayerVariableName(layerKey)
    variableMap[layerKey] = varName
    
    // Check if this is a number field
    const isNumber = layerData.isNumber === true
    
    // Get default value
    const defaultValue = getDefaultValue(fieldName, formValues, useMetadata, savedValues)
    // Escape string values for Cloudinary (but not numbers)
    const escapedDefault = typeof defaultValue === 'string' && !isNumber
      ? escapeCloudinaryString(defaultValue)
      : defaultValue
    
    // Get metadata key
    const metaKey = getMetaKeyForField(fieldName, formValues)
    
    // Build variable definition
    const varDef = buildFieldLogicLocal(varName, metaKey, escapedDefault, isNumber)
    variableDefs.push(varDef)
  })
  
  // Handle special calculations (like origPrice = price * 1.25)
  const specialCalculations = []
  Object.entries(layers).forEach(([layerKey, layerData]) => {
    if (layerData.calculation) {
      // e.g., { calculation: { formula: 'mul_1.25', dependsOn: 'price' } }
      const calc = layerData.calculation
      if (calc.formula && calc.dependsOn) {
        const varName = getLayerVariableName(layerKey)
        const dependsVar = getLayerVariableName(calc.dependsOn)
        // Formula should be like 'mul_1.25' which becomes '$price_mul_1.25'
        specialCalculations.push(`$${varName}_$${dependsVar}_${calc.formula}`)
      }
    }
  })
  
  // Background color variable
  const backgroundColorMetaKey = getMetaKeyForField('backgroundColor', formValues)
  const bgColorUseMeta = shouldUseMetadata('backgroundColor', formValues, useMetadata)
  const defaultBackgroundColor = getBackgroundColorValue(formValues, useMetadata, savedValues)
  let bgColorVarDef = ''
  if (!bgColorUseMeta) {
    bgColorVarDef = `$bgcolor_!rgb:${defaultBackgroundColor}!`
  } else {
    const parts = []
    parts.push(`$bgcolor_!rgb:${defaultBackgroundColor}!`)
    parts.push(`$tb_md:!${backgroundColorMetaKey}!`)
    parts.push(`if_!tb!_ne_!!`)
    parts.push(`$bgcolor_$tb`)
    parts.push(`if_end`)
    bgColorVarDef = parts.join('/')
  }
  
  // Image variable
  const publicIdClean = selectedAsset.publicId.replace(/\//g, ':')
  const imgVar = `!${publicIdClean}!`
  
  // Build transformation parts
  const transformParts = [
    `$img_${imgVar}`,
    ...variableDefs,
    bgColorVarDef,
    ...specialCalculations,
    `c_crop,w_1,h_1,g_north_west`,
    `c_pad,w_${padW},h_${padH},b_$bgcolor`
  ]
  
  // Process layers in order (can be defined by layer.order or use default order)
  const layerEntries = Object.entries(layers)
  
  // Sort layers by order if specified, otherwise maintain object key order
  layerEntries.sort(([keyA, dataA], [keyB, dataB]) => {
    const orderA = dataA.order !== undefined ? dataA.order : 999
    const orderB = dataB.order !== undefined ? dataB.order : 999
    return orderA - orderB
  })
  
  // Find base font size for percentage calculations (first text layer's fontSize)
  let baseFontSize = null
  for (const [layerKey, layerData] of layerEntries) {
    if (isTextLayer(layerData) && layerData.fontSize) {
      if (typeof layerData.fontSize === 'string' && layerData.fontSize.endsWith('%')) {
        baseFontSize = 32 // Default fallback
      } else {
        baseFontSize = typeof layerData.fontSize === 'number' ? layerData.fontSize : parseFloat(layerData.fontSize) || 32
      }
      break
    }
  }
  
  // Process each layer
  layerEntries.forEach(([layerKey, layerData]) => {
    if (isTextLayer(layerData)) {
      // Text layer
      const fieldName = layerData.fieldName || layerKey
      const varName = variableMap[layerKey] || getLayerVariableName(layerKey)
      
      // Calculate font size
      const fontSize = calculateFontSize(layerData.fontSize, baseFontSize)
      
      // Get font
      const font = fontToKebabCase(layerData.font || 'Arial')
      
      // Get color
      const color = hexToRgb(layerData.color || '#ffffff')
      
      // Get formatting
      const formatting = getTextFormatting(layerData)
      const formatParts = []
      if (formatting.bold) formatParts.push('bold')
      if (formatting.italic) formatParts.push('italic')
      if (formatting.strikethrough) formatParts.push('strikethrough')
      const formatStr = formatParts.length > 0 ? `_${formatParts.join('_')}` : ''
      
      // Build text layer
      // For calculated layers (like origPrice), use the calculated variable
      // For regular text layers, use the variable from formValues
      const prefix = layerData.prefix || '' // e.g., '$' for price
      const suffix = layerData.suffix || ''
      
      // If layer has a calculation, use the calculated variable name
      let varToUse = varName
      if (layerData.calculation && layerData.calculation.dependsOn) {
        // Use the calculated variable (e.g., $origprice)
        varToUse = getLayerVariableName(layerKey)
      }
      
      // Handle text wrapping
      const textWrap = layerData.textWrap !== false
      const textWidth = layerData.textWidth || Math.round(padW * 0.8)
      
      let textLayerPart
      if (textWrap && textWidth) {
        textLayerPart = `c_fit,l_text:${font}_${fontSize}${formatStr}:${prefix}$(${varToUse})${suffix},co_rgb:${color},w_${textWidth}`
      } else {
        textLayerPart = `l_text:${font}_${fontSize}${formatStr}:${prefix}$(${varToUse})${suffix},co_rgb:${color}`
      }
      
      transformParts.push(textLayerPart)
      
      // Apply layer with position and flags
      const x = s(layerData.x || 0)
      const y = s(layerData.y || 0)
      const gravity = layerData.gravity || GRAVITY_VALUES.northWest
      const flags = buildTextFlags(layerData)
      const flagsStr = flags.length > 0 ? ',' + flags.join(',') : ''
      
      transformParts.push(`fl_layer_apply,g_${gravity},x_${x},y_${y}${flagsStr}`)
    } else if (isImageLayer(layerData)) {
      // Image layer - can be main product image or overlay image (logo, etc.)
      
      // Check if layer should be shown (for overlay images with show property)
      if (layerData.show === false) {
        return
      }
      
      // Get public ID: use layer's publicId if specified, otherwise it's the main product image
      if (!layerData.publicId) {
        // Main product image uses $img variable
        const imgW = s(layerData.width || 300)
        const imgH = s(layerData.height || 300)
        const imgX = s(layerData.x || 0)
        const imgY = s(layerData.y || 0)
        const imgGravity = layerData.gravity || GRAVITY_VALUES.northWest
        
        transformParts.push(
          `l_$img`,
          `c_fit,w_${imgW},h_${imgH}`,
          `fl_layer_apply,g_${imgGravity},x_${imgX},y_${imgY}`
        )
        return
      }
      
      // Image layer with specific publicId (overlay image like logo)
      const publicIdClean = layerData.publicId.replace(/\//g, ':')
      const imgW = s(layerData.width || 100)
      const imgH = s(layerData.height || 100)
      const imgX = s(layerData.x || 0)
      const imgY = s(layerData.y || 0)
      const imgGravity = layerData.gravity || GRAVITY_VALUES.northWest
      
      transformParts.push(
        `l_${publicIdClean}`,
        `c_fit,w_${imgW},h_${imgH}`,
        `fl_layer_apply,g_${imgGravity},x_${imgX},y_${imgY}`
      )
    }
  })
  
  const transformString = transformParts.join('/')
  return `https://res.cloudinary.com/yoav-cloud/image/upload/${transformString}/${selectedAsset.publicId}.png`
}

