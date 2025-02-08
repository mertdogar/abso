import { OpenAIProvider } from "./openai";
import type { IProvider } from "../types";

interface OpenRouterProviderOptions {
  apiKey?: string;
  defaultHeaders?: Record<string, string>;
}

export class OpenRouterProvider extends OpenAIProvider implements IProvider {
  public name = "openrouter";

  constructor(options: OpenRouterProviderOptions) {
    super({
      apiKey: options.apiKey,
      baseURL: "https://openrouter.ai/api/v1",
      defaultHeaders: options.defaultHeaders || {
        "HTTP-Referer": "abso.ai",
        "X-Title": "Abso",
      },
    });
  }

  matchesModel(model: string): boolean {
    return false;
  }
}
