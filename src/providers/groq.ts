import { OpenAIProvider } from "./openai"
import type { ChatCompletionCreateParams, IProvider } from "../types"

interface GroqProviderOptions {
  apiKey?: string
  // We can accept more config if needed
}

export class GroqProvider extends OpenAIProvider implements IProvider {
  public name = "groq"
  private apiKey: string | undefined

  constructor(options: GroqProviderOptions = {}) {
    const apiKey = options.apiKey || process.env.GROQ_API_KEY
    super({
      apiKey,
      baseURL: "https://api.groq.com/openai/v1/",
    })
    this.apiKey = apiKey
  }

  validateConfig(): void {
    if (!this.apiKey) {
      throw new Error(
        "Groq API key is required. Set GROQ_API_KEY environment variable or pass it in constructor options."
      )
    }
  }

  matchesModel(model: string): boolean {
    return false
  }
}
