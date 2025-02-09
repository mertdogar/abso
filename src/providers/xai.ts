import { OpenAIProvider } from "./openai"
import type { IProvider } from "../types"

interface XaiProviderOptions {
  apiKey?: string
  // We can accept more config if needed
}

export class XaiProvider extends OpenAIProvider implements IProvider {
  public name = "xai"

  constructor(options: XaiProviderOptions) {
    super({
      apiKey: options.apiKey,
      baseURL: "https://api.x.ai/v1",
    })
  }

  matchesModel(model: string): boolean {
    return model.startsWith("grok-")
  }
}
