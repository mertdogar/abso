import type {
  ChatCompletionCreateParams,
  ChatCompletion,
  ChatCompletionStream,
  CreateEmbeddingResponse,
  EmbeddingCreateParams,
  AbsoCallback,
  AbsoOptions,
  CompletionUsage,
} from "./types"
import { LunaryCallback } from "./callbacks/lunary"
import { findMatchingProvider } from "./utils/modelRouting"
import type { IProvider } from "./types"
import { OpenAIProvider } from "./providers/openai"
import { GroqProvider } from "./providers/groq"
import { AnthropicProvider } from "./providers/anthropic"
import { OpenRouterProvider } from "./providers/openrouter"
import { MistralProvider } from "./providers/mistral"
import { XaiProvider } from "./providers/xai"
import { VoyageProvider } from "./providers/voyage"
import { GeminiProvider } from "./providers/gemini"
import { DeepSeekProvider } from "./providers/deepseek"
import { PerplexityProvider } from "./providers/perplexity"
import { OllamaProvider } from "./providers/ollama"

/**
 * Interface for managing multiple AI providers (like OpenAI, Anthropic, etc.)
 * Provides a unified interface for chat completions, embeddings, and tokenization
 */
export class Abso {
  private providers: IProvider[]
  private callbacks: AbsoCallback[] = []

  /**
   * Creates a new Abso instance with the given providers
   * @param options - An object containing the providers and optional callbacks
   */
  constructor(options: AbsoOptions = {}) {
    this.callbacks = [
      ...(process.env.LUNARY_PUBLIC_KEY ? [new LunaryCallback()] : []),
      ...(options.callbacks || []),
    ]

    // Load all providers by default, regardless of API key availability
    // API key validation will happen when the provider is actually used

    this.providers = options.providers || [
      new OpenAIProvider(options.openai || {}),
      new GroqProvider(options.groq || {}),
      new AnthropicProvider(options.anthropic || {}),
      new OpenRouterProvider(options.openrouter || {}),
      new MistralProvider(options.mistral || {}),
      new XaiProvider(options.xai || {}),
      new VoyageProvider(options.voyage || {}),
      new GeminiProvider(options.gemini || {}),
      new DeepSeekProvider(options.deepseek || {}),
      new PerplexityProvider(options.perplexity || {}),
      new OllamaProvider(options.ollama || {}),
    ]
  }

  /**
   * Adds a new provider to the available providers list
   * @param provider - The provider to register
   */
  registerProvider(provider: IProvider) {
    this.providers.push(provider)
  }

  /**
   * Finds the appropriate provider for a given request
   * @param request - The request containing model and optional provider info
   * @throws Error if no matching provider is found
   * @returns The matched provider
   */
  private getProviderForRequest(
    request: ChatCompletionCreateParams | EmbeddingCreateParams
  ): IProvider {
    if (request.model == null) {
      throw new Error(`Must provide a "model" field in the request`)
    }

    let provider: IProvider | undefined

    // If user explicitly selected a provider by name
    if (request.provider) {
      provider = this.providers.find(
        (p) => p.name.toLowerCase() === request.provider?.toLowerCase()
      )

      if (!provider) {
        throw new Error(
          `Provider "${
            request.provider
          }" not found among registered providers. Available: ${this.providers
            .map((p) => p.name)
            .join(", ")}`
        )
      }
    }

    // Otherwise use model-based matching
    provider = findMatchingProvider(request.model, this.providers)
    if (!provider) {
      throw new Error(`No provider found matching model: "${request.model}"`)
    }

    // Validate provider configuration before using it
    if (provider.validateConfig) {
      provider.validateConfig()
    }

    return provider
  }

  /**
   * Convenience object for chat-related methods
   */
  public chat = {
    /**
     * Creates a non-streaming chat completion
     * @param request - The chat completion request
     */
    create: (request: ChatCompletionCreateParams): Promise<ChatCompletion> => {
      return this.createChat(request)
    },
    /**
     * Creates a streaming chat completion
     * @param request - The chat completion request
     */
    stream: (
      request: ChatCompletionCreateParams
    ): Promise<ChatCompletionStream> => {
      return this.streamChat(request)
    },
    completions: {
      create: <T extends ChatCompletionCreateParams>(
        request: T
      ): Promise<
        T extends { stream: true }
          ? ChatCompletionStream
          : T extends { stream: false }
          ? ChatCompletion
          : ChatCompletion
      > => {
        if (request.stream) {
          return this.streamChat(request) as any
        }
        return this.createChat(request) as any
      },
    },
  }

  /**
   * Beta endpoints following OpenAI's beta API structure
   */
  public beta = {
    chat: {
      completions: {
        stream: (
          request: ChatCompletionCreateParams
        ): Promise<ChatCompletionStream> => {
          return this.streamChat(request)
        },
      },
    },
  }

  /**
   * Creates a non-streaming chat completion
   * @param request - The chat completion request
   * @throws Error if the provider doesn't support chat completions
   */
  private async createChat(
    request: ChatCompletionCreateParams
  ): Promise<ChatCompletion> {
    const chatId = this.generateChatID()

    for (const callback of this.callbacks) {
      callback.onChatStart(chatId, request)
    }

    try {
      const provider = this.getProviderForRequest(request)

      if (provider.sanitizeRequest) {
        request = provider.sanitizeRequest(request)
      }

      // These fields will cause issues with the provider's request
      delete request.tags
      delete request.userId
      delete request.userProps
      delete request.provider

      if (!provider.createCompletion) {
        throw new Error(
          `Provider "${provider.name}" does not support chat completion`
        )
      }

      const result = await provider.createCompletion(request)
      for (const callback of this.callbacks) {
        callback.onChatEnd(chatId, result)
      }
      return result
    } catch (error) {
      for (const callback of this.callbacks) {
        callback.onChatError(chatId, error as Error)
      }
      throw error
    }
  }

  /**
   * Tokenizes the input using the specified provider
   * @param request - The request containing the text to tokenize
   * @throws Error if the provider doesn't support tokenization
   */
  async tokenize(request: ChatCompletionCreateParams) {
    const provider = this.getProviderForRequest(request)
    if (provider.tokenize) {
      return provider.tokenize(request)
    }

    throw new Error(`Provider "${provider.name}" does not support tokenization`)
  }

  /**
   * Creates embeddings for the input text
   * @param request - The embedding request
   * @throws Error if the provider doesn't support embeddings
   */
  async embed(
    request: EmbeddingCreateParams
  ): Promise<CreateEmbeddingResponse> {
    const provider = this.getProviderForRequest(request)

    delete request.provider

    if (provider.embed) {
      return provider.embed(request)
    }

    throw new Error(`Provider "${provider.name}" does not support embedding`)
  }

  /**
   * Creates a streaming chat completion
   * Returns a ChatCompletionStream that wraps the provider's stream implementation
   * @param request - The chat completion request
   * @throws Error if the provider doesn't support streaming
   */
  private async streamChat(
    request: ChatCompletionCreateParams
  ): Promise<ChatCompletionStream> {
    const chatId = this.generateChatID()

    for (const callback of this.callbacks) {
      callback.onChatStart(chatId, request)
    }

    const provider = this.getProviderForRequest(request)

    if (provider.sanitizeRequest) {
      request = provider.sanitizeRequest(request)
    }

    delete request.provider
    delete request.tags
    delete request.userId
    delete request.userProps

    if (!provider.createCompletionStream) {
      throw new Error(`Provider "${provider.name}" does not support streaming`)
    }

    const providerStream = await provider.createCompletionStream(request)
    const asyncIterator = providerStream[Symbol.asyncIterator]()
    const self = this
    const streamChatId = chatId
    let finalResult: ChatCompletion | null = null

    async function* streamingAggregatingIterator() {
      let tokens = 0
      let choices: any[] = []
      let finalUsage: CompletionUsage | undefined
      try {
        while (true) {
          const { value, done } = await asyncIterator.next()
          if (done) break

          // Handle usage information if present
          if ("usage" in value && value.usage) {
            finalUsage = value.usage as CompletionUsage
          }

          // Skip if no choices (might be a usage-only chunk)
          if (!value.choices?.length) {
            continue
          }

          // Each chunk is assumed to have a 'choices' array; we take the first element
          tokens += 1
          const chunk = value.choices[0]
          if (!chunk.delta) continue

          const { index = 0 } = chunk
          const { content, role, tool_calls } = chunk.delta

          if (!choices[index]) {
            choices.splice(index, 0, {
              message: {
                role: role || "",
                content: "",
                tool_calls: [],
              },
            })
          }
          if (content) choices[index].message.content += content || ""
          if (role) choices[index].message.role = role

          if (tool_calls) {
            for (const tool_call of tool_calls) {
              const existingCallIndex = choices[
                index
              ].message.tool_calls.findIndex(
                (tc: any) => tc.index === tool_call.index
              )
              if (existingCallIndex === -1) {
                choices[index].message.tool_calls.push(tool_call)
              } else {
                const existingCall =
                  choices[index].message.tool_calls[existingCallIndex]
                if (tool_call.function?.arguments) {
                  existingCall.function.arguments +=
                    tool_call.function.arguments
                }
              }
            }
          }
          yield value
        }
        // Remove the 'index' property from tool_calls
        choices = choices.map((c: any) => {
          if (c.message.tool_calls) {
            c.message.tool_calls = c.message.tool_calls.map((tc: any) => {
              const { index, ...rest } = tc
              return rest
            })
          }
          return c
        })
        const aggregatedResult: ChatCompletion = {
          id: crypto.randomUUID(),
          object: "chat.completion",
          created: Math.floor(Date.now() / 1000),
          model: request.model,
          choices,
          usage: finalUsage || {
            completion_tokens: tokens,
            prompt_tokens: 0,
            total_tokens: tokens,
          },
        }
        finalResult = aggregatedResult
        if (self.callbacks?.length) {
          for (const callback of self.callbacks) {
            callback.onChatEnd(streamChatId, aggregatedResult)
          }
        }
      } catch (error) {
        if (self.callbacks?.length) {
          for (const callback of self.callbacks) {
            callback.onChatError(streamChatId, error as Error)
          }
        }
        throw error
      }
    }

    return {
      controller: providerStream.controller,
      abort: () => {
        providerStream.controller.abort()
      },
      [Symbol.asyncIterator]: streamingAggregatingIterator,
      finalChatCompletion: async () => {
        // If we already have the final result, return it
        if (finalResult) return finalResult

        // Otherwise, consume the stream to get the final result
        const iterator = streamingAggregatingIterator()
        for await (const _ of iterator) {
          // Just consume the stream
        }
        if (!finalResult) {
          throw new Error("Failed to get final chat completion")
        }
        return finalResult
      },
    }
  }

  private generateChatID() {
    return crypto.randomUUID()
  }
}
