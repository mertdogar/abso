import { OpenAIProvider } from "./openai";
import type { IProvider } from "../types";

interface MistralProviderOptions {
  apiKey?: string;
  // We can accept more config if needed
}

export class MistralProvider extends OpenAIProvider implements IProvider {
  public name = "mistral";

  constructor(options: MistralProviderOptions) {
    super({
      apiKey: options.apiKey,
      baseURL: "https://api.mistral.ai/v1/",
    });
  }

  matchesModel(model: string): boolean {
    // TODO: better match
    return model.startsWith("tral-");
  }
}
