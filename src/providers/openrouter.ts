import { OpenAIProvider } from "./openai"
import type { IProvider } from "../types"

interface OpenRouterProviderOptions {
  apiKey?: string
  defaultHeaders?: Record<string, string>
}

export class OpenRouterProvider extends OpenAIProvider implements IProvider {
  public name = "openrouter"
  private apiKey: string | undefined

  constructor(options: OpenRouterProviderOptions = {}) {
    const apiKey = options.apiKey || process.env.OPENROUTER_API_KEY
    super({
      apiKey,
      baseURL: "https://openrouter.ai/api/v1",
      defaultHeaders: options.defaultHeaders || {
        "HTTP-Referer": "abso.ai",
        "X-Title": "Abso",
      },
    })
    this.apiKey = apiKey
  }

  validateConfig(): void {
    if (!this.apiKey) {
      throw new Error(
        "OpenRouter API key is required. Set OPENROUTER_API_KEY environment variable or pass it in constructor options."
      )
    }
  }

  matchesModel(model: string): boolean {
    return false
  }
}
