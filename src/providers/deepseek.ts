import { OpenAIProvider } from "./openai"
import type { IProvider } from "../types"

interface DeepSeekProviderOptions {
  apiKey?: string
}

export class DeepSeekProvider extends OpenAIProvider implements IProvider {
  public name = "deepseek"
  private apiKey: string | undefined

  constructor(options: DeepSeekProviderOptions = {}) {
    const apiKey = options.apiKey || process.env.DEEPSEEK_API_KEY
    super({
      apiKey,
      baseURL: "https://api.deepseek.com",
    })
    this.apiKey = apiKey
  }

  validateConfig(): void {
    if (!this.apiKey) {
      throw new Error(
        "DeepSeek API key is required. Set DEEPSEEK_API_KEY environment variable or pass it in constructor options."
      )
    }
  }

  matchesModel(model: string): boolean {
    return model.includes("deepseek")
  }
}
