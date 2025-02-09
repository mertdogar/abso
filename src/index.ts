// src/index.ts
import type { IProvider } from "./types"

import { Abso } from "./abso"

import { GroqProvider } from "./providers/groq"
import { OpenAIProvider } from "./providers/openai"
import { OpenRouterProvider } from "./providers/openrouter"
import { AnthropicProvider } from "./providers/anthropic"
import { MistralProvider } from "./providers/mistral"
import { XaiProvider } from "./providers/xai"
import { OllamaProvider } from "./providers/ollama"
import { VoyageProvider } from "./providers/voyage"
import { GeminiProvider } from "./providers/gemini"

// Provider configuration map
const providerConfigs = [
  { key: "OPENAI_API_KEY", Provider: OpenAIProvider },
  { key: "GROQ_API_KEY", Provider: GroqProvider },
  { key: "ANTHROPIC_API_KEY", Provider: AnthropicProvider },
  { key: "OPENROUTER_API_KEY", Provider: OpenRouterProvider },
  { key: "MISTRAL_API_KEY", Provider: MistralProvider },
  { key: "XAI_API_KEY", Provider: XaiProvider },
  { key: "VOYAGE_API_KEY", Provider: VoyageProvider },
  { key: "GEMINI_API_KEY", Provider: GeminiProvider },
] as const

// Initialize providers based on available API keys
const defaultProviders: IProvider[] = providerConfigs
  .filter(({ key }) => process.env[key])
  .map(({ key, Provider }) => new Provider({ apiKey: process.env[key]! }))

// Add Ollama provider which doesn't need an API key
defaultProviders.push(new OllamaProvider({}))

export const abso = new Abso(defaultProviders)

// Re-export all classes/types for advanced usage
export * from "./abso"
export * from "./types"
export * from "./providers/openai"
