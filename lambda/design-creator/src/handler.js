import { jsonResponse, textResponse, parseJsonBody } from './http.js'
import { validateRequestBody } from './validateRequest.js'
import { createBedrockRuntimeClient } from './bedrock/client.js'
import { invokeClaudeMultimodal } from './bedrock/invokeClaude.js'
import { buildChildDesignPrompt } from './prompt/buildPrompt.js'
import { parsePossiblyWrappedJson } from './parseModelJson.js'
import { normalizeAndValidateModelResponse } from './validateResponse.js'

const DEFAULT_MODEL_ID = 'anthropic.claude-3-5-sonnet-20241022-v2:0'

export async function handler(event) {
  try {
    if (event?.requestContext?.http?.method === 'OPTIONS') {
      return textResponse(204, '')
    }

    const body = parseJsonBody(event)
    const validated = validateRequestBody(body)
    if (!validated.ok) {
      return jsonResponse(400, { error: validated.error })
    }

    const { adType, parentRules, parentImageBase64, parentImageMediaType } = validated.value

    const modelId = process.env.BEDROCK_MODEL_ID || DEFAULT_MODEL_ID
    const client = createBedrockRuntimeClient()

    const promptText = buildChildDesignPrompt({ adType, parentRules })
    const modelText = await invokeClaudeMultimodal({
      client,
      modelId,
      promptText,
      imageBase64: parentImageBase64,
      imageMediaType: parentImageMediaType,
    })

    const modelJson = parsePossiblyWrappedJson(modelText)
    const normalized = normalizeAndValidateModelResponse({ adType, modelJson })

    return jsonResponse(200, normalized)
  } catch (err) {
    // Keep error surface area small but useful.
    return jsonResponse(500, { error: err?.message || 'Internal error' })
  }
}


