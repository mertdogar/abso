import { OpenAIProvider } from "./openai"
import type { IProvider } from "../types"

interface XaiProviderOptions {
  apiKey?: string
  // We can accept more config if needed
}

export class XaiProvider extends OpenAIProvider implements IProvider {
  public name = "xai"
  private apiKey: string | undefined

  constructor(options: XaiProviderOptions = {}) {
    const apiKey = options.apiKey || process.env.XAI_API_KEY
    super({
      apiKey,
      baseURL: "https://api.x.ai/v1",
    })
    this.apiKey = apiKey
  }

  validateConfig(): void {
    if (!this.apiKey) {
      throw new Error(
        "xAI API key is required. Set XAI_API_KEY environment variable or pass it in constructor options."
      )
    }
  }

  matchesModel(model: string): boolean {
    return model.startsWith("grok-")
  }
}
