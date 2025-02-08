import { OpenAIProvider } from "./openai";
import type { ChatCompletionCreateParams, IProvider } from "../types";

interface GroqProviderOptions {
  apiKey?: string;
  // We can accept more config if needed
}

export class GroqProvider extends OpenAIProvider implements IProvider {
  public name = "groq";

  constructor(options: GroqProviderOptions) {
    super({
      apiKey: options.apiKey,
      baseURL: "https://api.groq.com/openai/v1/",
    });
  }

  sanitizeRequest(
    request: ChatCompletionCreateParams
  ): ChatCompletionCreateParams {
    if (request.response_format?.type === "json_object") {
      if (request.stream) {
        throw new Error(
          "OpenRouter does not support streaming when the response_format is json_object"
        );
      }

      if (request.stop) {
        throw new Error(
          "OpenRouter does not support the stop parameter when response_format is json_object"
        );
      }
    }

    return request;
  }

  matchesModel(model: string): boolean {
    // TODO: Implement this
    return false;
  }
}
