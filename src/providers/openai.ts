// src/providers/openai.ts
import { OpenAI } from "openai";
import type {
  IProvider,
  ChatCompletionCreateParams,
  ChatCompletion,
  ProviderChatCompletionStream,
  EmbeddingCreateParams,
  Embeddings,
} from "../types";
import { EventEmitter } from "events";
import type { CreateEmbeddingResponse } from "openai/resources/embeddings.mjs";

interface OpenAIProviderOptions {
  apiKey?: string;
  baseURL?: string;
  organization?: string;
  project?: string;
  timeout?: number;
  fetch?: typeof fetch;
  maxRetries?: number;
  defaultHeaders?: Record<string, string>;
  defaultQuery?: Record<string, string>;
}

export class OpenAIProvider implements IProvider {
  public name = "openai";

  private client: OpenAI;

  constructor(options: OpenAIProviderOptions) {
    this.client = new OpenAI({
      apiKey: options.apiKey,
      baseURL: options.baseURL,
      organization: options.organization,
      timeout: options.timeout,
      project: options.project,
      fetch: options.fetch,
      maxRetries: options.maxRetries,
      defaultHeaders: options.defaultHeaders,
      defaultQuery: options.defaultQuery,
    });
  }

  matchesModel(model: string): boolean {
    return (
      model.startsWith("gpt-") ||
      ["o1", "o3", "o4"].includes(model) ||
      model.startsWith("text-embedding-")
    );
  }

  /**
   * Non-streaming call
   */
  async createCompletion(
    request: ChatCompletionCreateParams
  ): Promise<ChatCompletion> {
    // Force `stream = false`
    const response = await this.client.chat.completions.create({
      ...request,
      stream: false,
    });
    return response; // This is already typed as ChatCompletion
  }

  /**
   * Streaming call
   */
  async createCompletionStream(
    request: ChatCompletionCreateParams
  ): Promise<ProviderChatCompletionStream> {
    // Start the streaming request with the official library
    const stream = await this.client.chat.completions.create({
      ...request,
      stream: true,
    });

    const absoStream = new EventEmitter();

    // Set up abort handling
    absoStream.on("abort", () => {
      stream.controller.abort();
    });

    // Emit connect event when stream starts
    absoStream.emit("connect");

    try {
      // Forward chunks to the Abso stream
      for await (const chunk of stream) {
        absoStream.emit("chunk", chunk);
      }

      absoStream.emit("end");
    } catch (error) {
      // Emit error event if something goes wrong
      absoStream.emit("error", error);
    }

    return absoStream as ProviderChatCompletionStream;
  }

  async embed(
    request: EmbeddingCreateParams
  ): Promise<CreateEmbeddingResponse> {
    return this.client.embeddings.create(request);
  }
}
