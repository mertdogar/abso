import type {
  ChatCompletionCreateParams as OriginalChatCompletionCreateParams,
  ChatCompletion,
  ChatCompletionChunk,
  ChatCompletionMessage,
} from "openai/resources/chat/completions"

import type { CompletionUsage } from "openai/resources/completions"

import type {
  EmbeddingCreateParams as OriginalEmbeddingCreateParams,
  CreateEmbeddingResponse,
} from "openai/resources/embeddings"

// Create our extended version of ChatCompletionCreateParams
type ChatCompletionCreateParams = OriginalChatCompletionCreateParams & {
  provider?: string
  tags?: string[]
  userId?: string
  userProps?: Record<string, any>
}

type EmbeddingCreateParams = OriginalEmbeddingCreateParams & {
  provider?: string
}

// Export our types
export type {
  ChatCompletion,
  ChatCompletionChunk,
  ChatCompletionMessage,
  CompletionUsage,
  CreateEmbeddingResponse,
  EmbeddingCreateParams,
  ChatCompletionCreateParams,
}

// Our own minimal version of ChatCompletionStreamingRunner
export interface ChatCompletionStream
  extends AsyncIterable<ChatCompletionChunk> {
  controller: AbortController
  abort: () => void
  finalChatCompletion: () => Promise<ChatCompletion>
}

// Minimal interface for a provider-specific chat completion stream
export interface ProviderChatCompletionStream
  extends AsyncIterable<ChatCompletionChunk> {
  controller: AbortController
}

/**
 * Our provider interface. Each provider maps from a ChatCompletionRequest
 * to a ChatCompletion or ChatCompletionStream, but always in terms of
 * "OpenAI-compatible" types.
 */
export interface IProvider {
  name: string
  matchesModel(model: string): boolean

  /**
   * Validates the provider's configuration.
   * Throws an error if the configuration is invalid.
   */
  validateConfig?(): void

  /**
   * Sanitizes a request before it is sent to the provider.
   */
  sanitizeRequest?(
    request: ChatCompletionCreateParams
  ): ChatCompletionCreateParams

  createCompletion?(
    request: ChatCompletionCreateParams
  ): Promise<ChatCompletion>

  /**
   * Takes a ChatCompletionRequest (potentially with `stream: true`) plus a
   * streaming class. Returns an object that implements ChatCompletionStream.
   */
  createCompletionStream?(
    request: ChatCompletionCreateParams
  ): Promise<ProviderChatCompletionStream>

  embed?(request: EmbeddingCreateParams): Promise<CreateEmbeddingResponse>

  tokenize?(
    request: ChatCompletionCreateParams
  ): Promise<{ count: number; tokens: number[] }>
}

export interface AbsoCallback {
  onChatStart(id: string, request: ChatCompletionCreateParams): void
  onChatEnd(id: string, result: ChatCompletion | string): void
  onChatError(id: string, error: Error): void
}

export interface AbsoOptions {
  providers?: IProvider[]
  callbacks?: AbsoCallback[]
  [key: string]: any
}

// No need for module.exports as we're using export statements
