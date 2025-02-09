import { OpenAIProvider } from "./openai"
import type { ChatCompletionCreateParams, IProvider } from "../types"

interface PerplexityProviderOptions {
  apiKey?: string
}

export class PerplexityProvider extends OpenAIProvider implements IProvider {
  public name = "perplexity"

  constructor(options: PerplexityProviderOptions) {
    super({
      apiKey: options.apiKey,
      baseURL: "https://api.perplexity.ai",
    })
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
