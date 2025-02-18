import { OpenAIProvider } from "./openai"
import type { ChatCompletionCreateParams, IProvider } from "../types"

interface PerplexityProviderOptions {
  apiKey?: string
}

export class PerplexityProvider extends OpenAIProvider implements IProvider {
  public name = "perplexity"
  private apiKey: string | undefined

  constructor(options: PerplexityProviderOptions = {}) {
    const apiKey = options.apiKey || process.env.PERPLEXITY_API_KEY
    super({
      apiKey,
      baseURL: "https://api.perplexity.ai",
    })
    this.apiKey = apiKey
  }

  validateConfig(): void {
    if (!this.apiKey) {
      throw new Error(
        "Perplexity API key is required. Set PERPLEXITY_API_KEY environment variable or pass it in constructor options."
      )
    }
  }

  sanitizeRequest(
    request: ChatCompletionCreateParams
  ): ChatCompletionCreateParams {
    // Perplexity doesn't support temperature = 2
    const temperature =
      request.temperature === 2 ? 2 - Number.EPSILON : request.temperature

    return {
      ...request,
      temperature,
    }
  }

  matchesModel(model: string): boolean {
    return model.includes("sonar")
  }
}
