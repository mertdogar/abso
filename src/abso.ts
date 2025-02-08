// src/abso.ts
import { EventEmitter } from "events";
import type {
  ChatCompletionCreateParams,
  ChatCompletion,
  ChatCompletionStream,
  ChatCompletionChunk,
  ChatCompletionMessage,
  CompletionUsage,
  CreateEmbeddingResponse,
  EmbeddingCreateParams,
} from "./types";
import { findMatchingProvider } from "./utils/modelRouting";
import type { IProvider } from "./types";

export class Abso {
  private providers: IProvider[];

  constructor(providers: IProvider[]) {
    this.providers = providers;
  }

  registerProvider(provider: IProvider) {
    this.providers.push(provider);
  }

  private getProviderForRequest(
    request: ChatCompletionCreateParams | EmbeddingCreateParams
  ): IProvider {
    if (request.model == null) {
      throw new Error(`Must provide a "model" field in the request.`);
    }
    // If user explicitly selected a provider by name:
    if (request.provider) {
      const found = this.providers.find((p) => p.name === request.provider);
      if (!found) {
        throw new Error(
          `Provider "${request.provider}" not found among registered providers.`
        );
      }
      return found;
    }

    // Otherwise use model-based matching
    const found = findMatchingProvider(request.model, this.providers);
    if (!found) {
      throw new Error(`No provider found matching model: "${request.model}".`);
    }
    return found;
  }

  public chat = {
    create: (request: ChatCompletionCreateParams): Promise<ChatCompletion> => {
      return this.createChat(request);
    },
    stream: (
      request: ChatCompletionCreateParams
    ): Promise<ChatCompletionStream> => {
      return this.streamChat(request);
    },
  };

  private async createChat(
    request: ChatCompletionCreateParams
  ): Promise<ChatCompletion> {
    const provider = this.getProviderForRequest(request);

    if (provider.sanitizeRequest) {
      request = provider.sanitizeRequest(request);
    }

    delete request.provider;

    if (provider.createCompletion) {
      return provider.createCompletion(request);
    }

    throw new Error(
      `Provider "${provider.name}" does not support chat completion.`
    );
  }

  async tokenize(request: ChatCompletionCreateParams) {
    const provider = this.getProviderForRequest(request);
    if (provider.tokenize) {
      return provider.tokenize(request);
    }

    throw new Error(
      `Provider "${provider.name}" does not support tokenization.`
    );
  }

  async embed(
    request: EmbeddingCreateParams
  ): Promise<CreateEmbeddingResponse> {
    const provider = this.getProviderForRequest(request);

    delete request.provider;

    if (provider.embed) {
      return provider.embed(request);
    }

    throw new Error(`Provider "${provider.name}" does not support embedding.`);
  }

  /**
   * The main streaming method. We ask the selected provider for a
   * ProviderChatCompletionStream, and then wrap that in a ChatCompletionStream
   * that matches all our interface expectations (events, helper methods, etc.).
   */
  private async streamChat(
    request: ChatCompletionCreateParams
  ): Promise<ChatCompletionStream> {
    const provider = this.getProviderForRequest(request);

    delete request.provider;

    if (provider.sanitizeRequest) {
      request = provider.sanitizeRequest(request);
    }

    if (!provider.createCompletionStream) {
      throw new Error(
        `Provider "${provider.name}" does not support streaming.`
      );
    }

    const providerStream = await provider.createCompletionStream(request);

    // We'll define a class that extends EventEmitter and implements
    // ChatCompletionStream. It will listen to 'chunk', 'end', 'error'
    // (and potentially others) from the providerStream, and re-emit them
    // in a higher-level form as needed.
    class AbsoStream extends EventEmitter implements ChatCompletionStream {
      public messages: ChatCompletion[] = [];
      public controller: AbortController;
      private chunkQueue: ChatCompletionChunk[] = [];
      private chunkWaiters: Array<() => void> = [];
      private doneStreaming = false;
      private finalCompletion: ChatCompletion | null = null;
      private finalContentStr = "";
      private finalMessageObj: ChatCompletionMessage | null = null;
      private usage: CompletionUsage | null = null;

      constructor() {
        super();
        // Create our own abort controller (you may or may not use it directly,
        // depending on your provider)
        this.controller = new AbortController();

        // Listen to the raw providerStream events and transform them to
        // the higher-level aggregator events/methods
        providerStream.on("connect", () => {
          this.emit("connect");
        });

        providerStream.on("chunk", (chunk) => {
          // Gather partial content from the chunk for the first choice, for example
          let delta = "";
          if (chunk.choices) {
            for (const choice of chunk.choices) {
              if (choice.delta?.content) {
                delta += choice.delta.content;
              }
            }
          }

          // Accumulate the partial content
          this.finalContentStr += delta;

          // Emit "content" to let consumers see incremental text
          // Provide a 'snapshot' = everything so far
          const snapshot = this.finalContentStr;
          this.emit("content", delta, snapshot);

          // Also emit "content.delta" if you want a separate event
          this.emit("content.delta", { delta, snapshot });

          // Optionally also re-emit the chunk event with a "snapshot" object
          // Or you could build up a ChatCompletionSnapshot manually
          // if you wish to parse all fields.
          // For now, we just pass chunk along:
          this.emit("chunk", chunk, { choices: [] /* dummy snapshot */ });

          // Store chunk for the async iterator
          this.chunkQueue.push(chunk);
          if (this.chunkWaiters.length > 0) {
            const waiter = this.chunkWaiters.shift()!;
            waiter();
          }
        });

        providerStream.on("end", (final: ChatCompletion) => {
          this.doneStreaming = true;
          this.finalCompletion = final;
          // Track usage if the final object includes it
          this.usage = final.usage || null;

          // Save final message (assuming choice[0], but you can adapt)
          this.finalMessageObj = final.choices?.[0]?.message || null;

          // We also keep track in messages[] if desired
          this.messages.push(final);

          // Emit final events
          this.emit("end", final);
          this.emit("finalChatCompletion", final);
          this.emit("finalContent", this.finalContentStr);
          if (this.finalMessageObj) {
            this.emit("finalMessage", this.finalMessageObj);
          }

          // Wake up any awaiting iterators so they can complete
          for (const waiter of this.chunkWaiters) {
            waiter();
          }
          this.chunkWaiters = [];
        });

        providerStream.on("error", (err) => {
          this.emit("error", err);
        });

        // If you want to forward "abort" from the aggregator to the provider
        this.on("abort", (abortError) => {
          // The providerStream might or might not handle 'abort'. In your
          // OpenAI provider, you've set up something like:
          //   absoStream.on('abort', () => { stream.controller.abort(); })
          // So just forward it:
          providerStream.emit("abort", abortError);
        });
      }

      /**
       * Retrieve total usage stats (if available).
       * You might want to wait until streaming is done to be certain usage
       * is final. If you call it before then, we either return partial or
       * wait until the stream is complete.
       */
      totalUsage(): Promise<CompletionUsage> {
        if (this.doneStreaming) {
          return Promise.resolve(
            this.usage || {
              prompt_tokens: 0,
              completion_tokens: 0,
              total_tokens: 0,
            }
          );
        }
        return new Promise((resolve) => {
          this.on("end", () => {
            resolve(
              this.usage || {
                prompt_tokens: 0,
                completion_tokens: 0,
                total_tokens: 0,
              }
            );
          });
        });
      }

      /**
       * Return the final ChatCompletion once done streaming.
       */
      finalChatCompletion(): Promise<ChatCompletion> {
        if (this.finalCompletion) {
          return Promise.resolve(this.finalCompletion);
        }
        if (this.doneStreaming) {
          // done but finalCompletion is null, so just resolve
          return Promise.resolve(null as unknown as ChatCompletion);
        }
        return new Promise((resolve) => {
          this.on("finalChatCompletion", (comp) => {
            resolve(comp);
          });
        });
      }

      /**
       * Return the entire text content that was formed from all partial chunks.
       */
      finalContent(): Promise<string> {
        if (this.doneStreaming) {
          return Promise.resolve(this.finalContentStr);
        }
        return new Promise((resolve) => {
          this.on("finalContent", (content) => {
            resolve(content);
          });
        });
      }

      /**
       * Return the final message object (the main assistant message).
       */
      finalMessage(): Promise<ChatCompletionMessage> {
        if (this.doneStreaming && this.finalMessageObj) {
          return Promise.resolve(this.finalMessageObj);
        }
        return new Promise((resolve) => {
          this.on("finalMessage", (message) => {
            resolve(message);
          });
        });
      }

      /**
       * Returns a promise that resolves when the stream is completely finished.
       */
      done(): Promise<void> {
        if (this.doneStreaming) {
          return Promise.resolve();
        }
        return new Promise((resolve) => {
          this.on("end", () => {
            resolve();
          });
        });
      }

      /**
       * Aborts the stream. We simply emit "abort" with an error-like object,
       * which the provider implementation should interpret and stop the request.
       */
      abort(): void {
        // If you have a specialized APIUserAbortError, you can construct it here.
        this.emit("abort", new Error("User aborted the request"));
      }

      /**
       * Implementation of AsyncIterable<ChatCompletionChunk>.
       * We yield each chunk as it's received.
       */
      async *[Symbol.asyncIterator](): AsyncIterator<ChatCompletionChunk> {
        while (!this.doneStreaming || this.chunkQueue.length > 0) {
          if (this.chunkQueue.length === 0) {
            if (this.doneStreaming) {
              break;
            }
            // Wait for the next chunk to arrive
            await new Promise<void>((resolve) => {
              this.chunkWaiters.push(resolve);
            });
            continue;
          }
          // Yield all chunks currently in the queue
          while (this.chunkQueue.length > 0) {
            yield this.chunkQueue.shift()!;
          }
        }
      }
    }

    const absoStream = new AbsoStream();
    return absoStream;
  }
}
