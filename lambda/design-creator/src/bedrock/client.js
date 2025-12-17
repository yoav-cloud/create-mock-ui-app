import { BedrockRuntimeClient } from '@aws-sdk/client-bedrock-runtime'

export function createBedrockRuntimeClient() {
  // AWS_REGION is already set in Lambda; allow override for local usage.
  const region = process.env.AWS_REGION || process.env.AWS_DEFAULT_REGION || 'us-east-1'
  return new BedrockRuntimeClient({ region })
}


