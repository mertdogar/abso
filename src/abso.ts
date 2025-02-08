import {
  IProvider,
  ChatCompletionRequest,
  ChatCompletion,
  ChatCompletionStream,
} from "./types";

import { findMatchingProvider } from "./utils/modelRouting";
import { EventEmitter } from "events";

/**
 * A concrete implementation of the ChatCompletionStream interface,
 * combining EventEmitter with AsyncIterable for streaming partial responses.
 */
class ChatCompletionStreamImpl
  extends EventEmitter
  implements ChatCompletionStream
{
  private buffer: any[] = [];
  private done = false;
  private finalCompletion: ChatCompletion | null = null;

  /**
   * We'll accumulate full text as we go, so we can emit
   * a "snapshot" with each delta if desired.
   */
  private partialContent = "";

  constructor() {
    super();
  }

  pushDelta(delta: string) {
    // Append the new partial content
    this.partialContent += delta;

    // Emit the raw delta plus a "snapshot" so far
    this.emit("content", delta, this.partialContent);

    // Also keep it in a buffer so we can yield it in the async iterator
    this.buffer.push(delta);
    this.emit("tick");
  }

  /**
   * Called by the provider when the stream is complete.
   */
  end(final: ChatCompletion) {
    this.done = true;
    this.finalCompletion = final;
    this.emit("end", final);
    this.emit("tick");
  }

  on(
    event: "content",
    listener: (delta: string, snapshot: string) => void
  ): this;
  on(event: "error", listener: (error: Error) => void): this;
  on(event: "end", listener: (final: ChatCompletion) => void): this;
  on(event: string, listener: any): this {
    return super.on(event, listener);
  }

  async *[Symbol.asyncIterator](): AsyncIterator<string> {
    while (!this.done || this.buffer.length > 0) {
      if (this.buffer.length === 0) {
        // Wait for new data
        await new Promise<void>((resolve) => this.once("tick", resolve));
      }
      while (this.buffer.length > 0) {
        yield this.buffer.shift()!;
      }
    }
  }

  async finalChatCompletion(): Promise<ChatCompletion> {
    if (!this.done) {
      await new Promise<void>((resolve) => this.once("end", () => resolve()));
    }
    return this.finalCompletion as ChatCompletion;
  }
}

export class Abso {
  private providers: IProvider[];

  constructor(providers: IProvider[]) {
    this.providers = providers;
  }

  registerProvider(provider: IProvider) {
    this.providers.push(provider);
  }

  private getProviderForRequest(request: ChatCompletionRequest): IProvider {
    // If the user has specified a provider by name, use that
    if (request.provider) {
      const found = this.providers.find((p) => p.name === request.provider);
      if (!found) {
        throw new Error(
          `Provider "${request.provider}" not found among registered providers.`
        );
      }
      return found;
    }

    // Otherwise pick based on the model string
    const found = findMatchingProvider(request.model, this.providers);
    if (!found) {
      throw new Error(`No provider found matching model: "${request.model}"`);
    }

    return found;
  }

  // Chat sub-API
  public chat = {
    create: (request: ChatCompletionRequest): Promise<ChatCompletion> => {
      return this.createChat(request);
    },
    stream: (request: ChatCompletionRequest): Promise<ChatCompletionStream> => {
      return this.streamChat(request);
    },
  };

  private async createChat(
    request: ChatCompletionRequest
  ): Promise<ChatCompletion> {
    const provider = this.getProviderForRequest(request);
    return provider.createCompletion(request);
  }

  private async streamChat(
    request: ChatCompletionRequest
  ): Promise<ChatCompletionStream> {
    const provider = this.getProviderForRequest(request);
    return provider.createCompletionStream(request, ChatCompletionStreamImpl);
  }
}
