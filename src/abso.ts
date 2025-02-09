// src/abso.ts
import { EventEmitter } from "events"
import type {
  ChatCompletionCreateParams,
  ChatCompletion,
  ChatCompletionStream,
  ChatCompletionChunk,
  ChatCompletionMessage,
  CompletionUsage,
  CreateEmbeddingResponse,
  EmbeddingCreateParams,
} from "./types"
import { findMatchingProvider } from "./utils/modelRouting"
import type { IProvider } from "./types"

export class Abso {
  private providers: IProvider[]

  constructor(providers: IProvider[]) {
    this.providers = providers
  }

  registerProvider(provider: IProvider) {
    this.providers.push(provider)
  }

  private getProviderForRequest(
    request: ChatCompletionCreateParams | EmbeddingCreateParams
  ): IProvider {
    if (request.model == null) {
      throw new Error(`Must provide a "model" field in the request.`)
    }
    // If user explicitly selected a provider by name:
    if (request.provider) {
      const found = this.providers.find((p) => p.name === request.provider)
      if (!found) {
        throw new Error(
          `Provider "${request.provider}" not found among registered providers.`
        )
      }
      return found
    }

    // Otherwise use model-based matching
    const found = findMatchingProvider(request.model, this.providers)
    if (!found) {
      throw new Error(`No provider found matching model: "${request.model}".`)
    }
    return found
  }

  public chat = {
    create: (request: ChatCompletionCreateParams): Promise<ChatCompletion> => {
      return this.createChat(request)
    },
    stream: (
      request: ChatCompletionCreateParams
    ): Promise<ChatCompletionStream> => {
      return this.streamChat(request)
    },
  }

  private async createChat(
    request: ChatCompletionCreateParams
  ): Promise<ChatCompletion> {
    const provider = this.getProviderForRequest(request)

    if (provider.sanitizeRequest) {
      request = provider.sanitizeRequest(request)
    }

    delete request.provider

    if (provider.createCompletion) {
      return provider.createCompletion(request)
    }

    throw new Error(
      `Provider "${provider.name}" does not support chat completion.`
    )
  }

  async tokenize(request: ChatCompletionCreateParams) {
    const provider = this.getProviderForRequest(request)
    if (provider.tokenize) {
      return provider.tokenize(request)
    }

    throw new Error(
      `Provider "${provider.name}" does not support tokenization.`
    )
  }

  async embed(
    request: EmbeddingCreateParams
  ): Promise<CreateEmbeddingResponse> {
    const provider = this.getProviderForRequest(request)

    delete request.provider

    if (provider.embed) {
      return provider.embed(request)
    }

    throw new Error(`Provider "${provider.name}" does not support embedding.`)
  }

  /**
   * The main streaming method. We ask the selected provider for a
   * ProviderChatCompletionStream, and then wrap that in a ChatCompletionStream
   * that matches all our interface expectations (events, helper methods, etc.).
   */
  private async streamChat(
    request: ChatCompletionCreateParams
  ): Promise<ChatCompletionStream> {
    const provider = this.getProviderForRequest(request)

    delete request.provider

    if (provider.sanitizeRequest) {
      request = provider.sanitizeRequest(request)
    }

    if (!provider.createCompletionStream) {
      throw new Error(`Provider "${provider.name}" does not support streaming.`)
    }

    const providerStream = await provider.createCompletionStream(request)

    return {
      controller: providerStream.controller,
      abort() {
        providerStream.controller.abort()
      },
      [Symbol.asyncIterator]() {
        return providerStream[Symbol.asyncIterator]()
      },
    }
  }
}
