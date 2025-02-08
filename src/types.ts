// src/types.ts

import { EventEmitter } from "events";
import type { ChatCompletionSnapshot } from "openai/lib/ChatCompletionStream";

import type {
  ChatCompletionCreateParams as OriginalChatCompletionCreateParams,
  ChatCompletion,
  ChatCompletionChunk,
  ChatCompletionMessage,
} from "openai/resources/chat/completions";

import type { CompletionUsage } from "openai/resources/completions";
import type { APIUserAbortError } from "openai";

import type {
  EmbeddingCreateParams as OriginalEmbeddingCreateParams,
  CreateEmbeddingResponse,
} from "openai/resources/embeddings";

// Create our extended version of ChatCompletionCreateParams
type ChatCompletionCreateParams = OriginalChatCompletionCreateParams & {
  provider?: string;
};

type EmbeddingCreateParams = OriginalEmbeddingCreateParams & {
  provider?: string;
};

// Update exports to use our extended type

export type {
  ChatCompletion,
  ChatCompletionChunk,
  ChatCompletionMessage,
  CompletionUsage,
  CreateEmbeddingResponse,
  EmbeddingCreateParams,
  ChatCompletionCreateParams,
};

// Our own minimal version of ChatCompletionStreamingRunner
export interface ChatCompletionStream
  extends AsyncIterable<ChatCompletionChunk> {
  controller: AbortController;
  abort: () => void;
}

// Minimal interface for a provider-specific chat completion stream
export interface ProviderChatCompletionStream
  extends AsyncIterable<ChatCompletionChunk> {
  controller: AbortController;
}

/**
 * Our provider interface. Each provider maps from a ChatCompletionRequest
 * to a ChatCompletion or ChatCompletionStream, but always in terms of
 * "OpenAI-compatible" types.
 */
export interface IProvider {
  name: string;
  matchesModel(model: string): boolean;

  /**
   * Sanitizes a request before it is sent to the provider.
   */
  sanitizeRequest?(
    request: ChatCompletionCreateParams
  ): ChatCompletionCreateParams;

  createCompletion?(
    request: ChatCompletionCreateParams
  ): Promise<ChatCompletion>;

  /**
   * Takes a ChatCompletionRequest (potentially with `stream: true`) plus a
   * streaming class. Returns an object that implements ChatCompletionStream.
   */
  createCompletionStream?(
    request: ChatCompletionCreateParams
  ): Promise<ProviderChatCompletionStream>;

  embed?(request: EmbeddingCreateParams): Promise<CreateEmbeddingResponse>;

  tokenize?(
    request: ChatCompletionCreateParams
  ): Promise<{ count: number; tokens: number[] }>;
}
