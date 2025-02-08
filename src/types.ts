/**
 * A single message in a conversation.
 */
export interface Message {
  role: "system" | "user" | "assistant" | "function";
  content: string;
  name?: string;
}

/**
 * The request object for creating or streaming a chat completion.
 */
export interface ChatCompletionRequest {
  model: string;
  messages: Message[];
  stream?: boolean; // if you want streaming or not
  provider?: string; // optional provider override
  temperature?: number; // typical param
  // ... any other LLM-specific parameters ...
}

/**
 * A final chat completion response, akin to OpenAI's.
 */
export interface ChatCompletion {
  id: string;
  model: string;
  created: number;
  choices: Array<{
    index: number;
    message: Message;
    finish_reason: string;
  }>;
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

/**
 * The streaming interface for partial responses.
 * Instead of returning raw SSE data, we define a streamlined approach:
 * - You can consume it via events (.on('content', (delta) => ...))
 * - Or via an async iterator (for await ... of stream)
 * - finalChatCompletion() is used to get the full final ChatCompletion
 */
export interface ChatCompletionStream extends AsyncIterable<string> {
  on(
    event: "content",
    listener: (delta: string, snapshot: string) => void
  ): this;
  on(event: "error", listener: (error: Error) => void): this;
  on(event: "end", listener: (final: ChatCompletion) => void): this;

  finalChatCompletion(): Promise<ChatCompletion>;
}

/**
 * Provider interface. Each provider must implement these methods
 * to handle how completions (both single-shot and streaming) are created.
 */
export interface IProvider {
  name: string;
  matchesModel(model: string): boolean;
  createCompletion(request: ChatCompletionRequest): Promise<ChatCompletion>;

  /**
   * The provider can choose how to build the stream. We allow
   * a "streamClass" argument so the provider can instantiate
   * a library-supplied or user-supplied class for streaming behavior.
   */
  createCompletionStream(
    request: ChatCompletionRequest,
    streamClass: new () => ChatCompletionStream
  ): Promise<ChatCompletionStream>;
}
