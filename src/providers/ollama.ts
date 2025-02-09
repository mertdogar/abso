import { OpenAIProvider } from "./openai"
import type { IProvider } from "../types"

interface OllamaProviderOptions {
  baseURL?: string
}

export class OllamaProvider extends OpenAIProvider implements IProvider {
  public name = "ollama"

  constructor(options: OllamaProviderOptions) {
    super({
      apiKey: "ollama",
      baseURL: options.baseURL || "http://localhost:11434/v1",
    })
  }

  matchesModel(model: string): boolean {
    return false
  }
}
