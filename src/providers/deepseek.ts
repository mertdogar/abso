import { OpenAIProvider } from "./openai"
import type { IProvider } from "../types"

interface DeepSeekProviderOptions {
  apiKey?: string
}

export class DeepSeekProvider extends OpenAIProvider implements IProvider {
  public name = "deepseek"

  constructor(options: DeepSeekProviderOptions) {
    super({
      apiKey: options.apiKey,
      baseURL: "https://api.deepseek.com",
    })
  }

  matchesModel(model: string): boolean {
    return model.includes("deepseek")
  }
}
