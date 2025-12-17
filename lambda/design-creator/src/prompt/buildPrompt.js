import { toDesignTypeId } from '../slug.js'

export function buildChildDesignPrompt({ adType, parentRules }) {
  const suggestedId = toDesignTypeId(adType)
  const parentRulesJson = JSON.stringify(parentRules, null, 2)

  return [
    'You are an expert template designer for Cloudinary transformation-based ads.',
    '',
    '## Task',
    `Generate ONE new child design for the requested ad type: "${adType}".`,
    'You are given:',
    '- The rendered parent image (as an input image).',
    '- The parent design rules JSON (Cloudinary rules).',
    '',
    '## Requirements',
    '- Output MUST be valid JSON and ONLY JSON (no markdown, no prose).',
    '- Output schema:',
    '  {',
    '    "designType": { "id": string, "name": string, "width": number, "height": number, "description": string },',
    '    "designRules": { "width": number, "height": number, "...layerKeys": { ...layerRuleProps } }',
    '  }',
    '- Use the SAME layer keys as the parent rules (e.g. title/tagline/image/logo/price...).',
    '- Preserve brand style where possible (fonts/colors). Adjust layout for the requested channel.',
    '- Image layers:',
    '  - The main product image layer typically has NO "publicId". Keep that convention.',
    '  - Overlay images like logos MAY have "publicId". Keep it if present.',
    '- Text layers:',
    '  - Keep "fieldName" and "metadataKey" intact when present.',
    '  - You may set fontSize as a number or percentage string like "120%".',
    '  - Include "textWidth" if the text wraps or if present in the parent.',
    '',
    '## Important',
    `- Suggested id format: "${suggestedId}" (must be unique, not "parent").`,
    '- Ensure designRules.width/height match designType.width/height.',
    '',
    '## Parent rules JSON',
    parentRulesJson,
  ].join('\n')
}


