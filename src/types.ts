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
  extends EventEmitter,
    AsyncIterable<ChatCompletionChunk> {
  on(event: "connect", listener: () => void): this;
  on(
    event: "content",
    listener: (delta: string, snapshot: string) => void
  ): this;
  on(event: "error", listener: (error: Error) => void): this;
  on(
    event: "chunk",
    listener: (
      chunk: ChatCompletionChunk,
      snapshot: ChatCompletionSnapshot
    ) => void
  ): this;
  on(event: "end", listener: (final: ChatCompletion) => void): this;
  on(event: "abort", listener: (error: APIUserAbortError) => void): this;
  on(
    event: "content.delta",
    listener: (props: {
      delta: string;
      snapshot: string;
      parsed?: unknown;
    }) => void
  ): this;
  on(
    event: "content.done",
    listener: <T>(props: { content: string; parsed?: T }) => void
  ): this;
  on(
    event: "finalChatCompletion",
    listener: (completion: ChatCompletion) => void
  ): this;
  on(event: "finalContent", listener: (contentSnapshot: string) => void): this;
  on(
    event: "finalMessage",
    listener: (message: ChatCompletionMessage) => void
  ): this;

  messages: ChatCompletion[];
  controller: AbortController;

  totalUsage: () => Promise<CompletionUsage>;
  finalChatCompletion: () => Promise<ChatCompletion>;
  finalContent: () => Promise<string>;
  finalMessage: () => Promise<ChatCompletionMessage>;
  done: () => Promise<void>;
  abort: () => void;

  [Symbol.asyncIterator](): AsyncIterator<ChatCompletionChunk>;
}

// Minimal interface for a provider-specific chat completion stream
export interface ProviderChatCompletionStream extends EventEmitter {
  on(event: "connect", listener: () => void): this;
  on(event: "chunk", listener: (chunk: ChatCompletionChunk) => void): this;
  on(event: "error", listener: (error: Error) => void): this;
  on(event: "end", listener: () => void): this;
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
