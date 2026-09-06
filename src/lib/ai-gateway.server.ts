import { createOpenAICompatible } from "@ai-sdk/openai-compatible";

export const AARUBA_AI_MODEL = "google/gemini-3-flash-preview";

export function createLovableAiGatewayProvider(apiKey: string) {
  return createOpenAICompatible({
    name: "lovable-ai-gateway",
    baseURL: "https://ai.gateway.lovable.dev/v1",
    headers: { "Lovable-API-Key": apiKey },
  });
}
