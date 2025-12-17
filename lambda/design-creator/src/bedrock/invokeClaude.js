import { InvokeModelCommand } from '@aws-sdk/client-bedrock-runtime'

const textDecoder = new TextDecoder()

export async function invokeClaudeMultimodal({
  client,
  modelId,
  promptText,
  imageBase64,
  imageMediaType,
  maxTokens = 2500,
  temperature = 0.2,
}) {
  const body = JSON.stringify({
    anthropic_version: 'bedrock-2023-05-31',
    max_tokens: maxTokens,
    temperature,
    messages: [
      {
        role: 'user',
        content: [
          { type: 'text', text: promptText },
          {
            type: 'image',
            source: { type: 'base64', media_type: imageMediaType, data: imageBase64 },
          },
        ],
      },
    ],
  })

  const resp = await client.send(
    new InvokeModelCommand({
      modelId,
      contentType: 'application/json',
      accept: 'application/json',
      body,
    })
  )

  const raw = textDecoder.decode(resp.body)
  const parsed = JSON.parse(raw)
  const text = parsed?.content?.[0]?.text
  if (!text || typeof text !== 'string') {
    throw new Error('Bedrock response missing text')
  }
  return text
}


