import Anthropic from "@anthropic-ai/sdk"
import type {
  IProvider,
  ChatCompletionCreateParams,
  ChatCompletion,
  ProviderChatCompletionStream,
} from "../types"
import { EventEmitter } from "events"
import type {
  TextBlock,
  Message,
  MessageCreateParamsNonStreaming,
  ToolUseBlock,
} from "@anthropic-ai/sdk/resources/messages/index.mjs"

interface AnthropicProviderOptions {
  apiKey?: string
  baseURL?: string
  maxRetries?: number
  defaultHeaders?: Record<string, string>
  defaultQuery?: Record<string, string>
}

export class AnthropicProvider implements IProvider {
  public name = "anthropic"
  private client: Anthropic

  constructor(options: AnthropicProviderOptions) {
    this.client = new Anthropic({
      apiKey: options.apiKey,
      baseURL: options.baseURL,
      maxRetries: options.maxRetries,
      defaultHeaders: options.defaultHeaders,
      defaultQuery: options.defaultQuery,
    })
  }

  matchesModel(model: string): boolean {
    return model.startsWith("claude-")
  }

  private convertOpenAIToAnthropic(
    request: ChatCompletionCreateParams
  ): MessageCreateParamsNonStreaming {
    // Convert OpenAI messages format to Anthropic format
    const messages = request.messages.map((msg) => {
      const role =
        msg.role === "assistant" ? ("assistant" as const) : ("user" as const)
      if (typeof msg.content === "string" || !msg.content) {
        return {
          role,
          content: msg.content || "",
        }
      }
      // For now, just convert array content to string
      // TODO: Add proper support for image/array content
      return {
        role,
        content: msg.content
          .map((c) => (typeof c === "string" ? c : ""))
          .join(""),
      }
    })

    // Convert OpenAI functions/tools to Anthropic tools format
    const tools =
      request.functions
        ?.filter((fn) => fn.parameters)
        .map((fn) => ({
          name: fn.name,
          description: fn.description || "",
          input_schema: {
            type: "object" as const,
            properties: fn.parameters!.properties || {},
            required: fn.parameters!.required || [],
          },
        })) ||
      request.tools
        ?.filter((tool) => tool.function.parameters)
        .map((tool) => ({
          name: tool.function.name,
          description: tool.function.description || "",
          input_schema: {
            type: "object" as const,
            properties: tool.function.parameters!.properties || {},
            required: tool.function.parameters!.required || [],
          },
        }))

    // Convert tool_choice to Anthropic format
    let tool_choice:
      | { type: "tool" | "auto"; name: string }
      | { type: "auto" }
      | undefined
    if (request.function_call === "auto" || request.tool_choice === "auto") {
      tool_choice = { type: "auto" }
    } else if (request.function_call === "none") {
      tool_choice = undefined
    } else if (typeof request.function_call === "object") {
      tool_choice = { type: "tool", name: request.function_call.name }
    } else if (typeof request.tool_choice === "object") {
      tool_choice = { type: "tool", name: request.tool_choice.function.name }
    }

    return {
      model: request.model,
      messages,
      tools,
      tool_choice,
      max_tokens: request.max_tokens ?? 8192,
      temperature: request.temperature ?? undefined,
      top_p: request.top_p ?? undefined,
    }
  }

  private convertAnthropicToOpenAI(response: Message): ChatCompletion {
    // Convert tool_calls to OpenAI function_call format
    const toolCalls = response.content
      .filter((block): block is ToolUseBlock => block.type === "tool_use")
      .map((block) => ({
        id: block.id,
        type: "function" as const,
        function: {
          name: block.name,
          arguments: JSON.stringify(block.input),
        },
      }))

    // Convert text content
    const content = response.content
      .filter((block): block is TextBlock => block.type === "text")
      .map((block) => block.text)
      .join("")

    return {
      id: response.id,
      object: "chat.completion",
      created: Date.now(),
      model: response.model,
      choices: [
        {
          index: 0,
          message: {
            role: "assistant",
            content: content || null,
            tool_calls: toolCalls.length > 0 ? toolCalls : undefined,
            // Add required refusal field
            refusal: null,
          },
          logprobs: null,
          finish_reason:
            response.stop_reason === "tool_use" ? "tool_calls" : "stop",
        },
      ],
      usage: {
        prompt_tokens: response.usage.input_tokens,
        completion_tokens: response.usage.output_tokens,
        total_tokens:
          response.usage.input_tokens + response.usage.output_tokens,
      },
    }
  }

  async createCompletion(
    request: ChatCompletionCreateParams
  ): Promise<ChatCompletion> {
    const anthropicRequest = this.convertOpenAIToAnthropic(request)
    const response = await this.client.messages.create({
      ...anthropicRequest,
      stream: false,
    })
    return this.convertAnthropicToOpenAI(response)
  }

  async createCompletionStream(
    request: ChatCompletionCreateParams
  ): Promise<ProviderChatCompletionStream> {
    const anthropicRequest = this.convertOpenAIToAnthropic(request)
    const stream = await this.client.messages.create({
      ...anthropicRequest,
      stream: true,
    })

    let chunkIndex = 0

    return {
      controller: stream.controller,
      async *[Symbol.asyncIterator]() {
        try {
          for await (const chunk of stream) {
            if (chunk.type === "message_start") continue

            if (
              chunk.type === "content_block_delta" &&
              chunk.delta.type === "text_delta"
            ) {
              yield {
                id: `chunk-${chunkIndex++}`,
                object: "chat.completion.chunk",
                created: Math.floor(Date.now() / 1000),
                model: request.model,
                choices: [
                  {
                    index: chunk.index,
                    delta: {
                      content: chunk.delta.text,
                    },
                    logprobs: null,
                    finish_reason:
                      chunk.delta.text.trim() === "" ? "stop" : null,
                  },
                ],
              }
            }

            if (
              chunk.type == "content_block_start" &&
              chunk.content_block.type == "tool_use"
            ) {
              yield {
                id: `chunk-${chunkIndex++}`,
                object: "chat.completion.chunk",
                created: Math.floor(Date.now() / 1000),
                model: request.model,
                choices: [
                  {
                    index: chunk.index,
                    delta: {
                      tool_calls: [
                        {
                          index: 0,
                          id: chunk.content_block.id,
                          function: {
                            arguments: "",
                            name: chunk.content_block.name
                          },
                          type: "function"
                        }
                      ]
                    },
                    logprobs: null,
                    finish_reason: null,
                  },
                ],
              }
            }

            if (
              chunk.type === "content_block_delta" &&
              chunk.delta.type === "input_json_delta"
            ) {
              yield {
                id: `chunk-${chunkIndex++}`,
                object: "chat.completion.chunk",
                created: Math.floor(Date.now() / 1000),
                model: request.model,
                choices: [
                  {
                    index: chunk.index,
                    delta: {
                      tool_calls: [
                        {
                          index: 0,
                          id: `call_${chunkIndex}`,
                          type: "function" as const,
                          function: {
                            arguments: chunk.delta.partial_json,
                          },
                        },
                      ],
                    },
                    logprobs: null,
                    finish_reason: null,
                  },
                ],
              }
            }

            if (chunk.type === "message_delta" && chunk.delta.stop_reason) {
              // Final chunk with stop reason
              yield {
                id: `chunk-${chunkIndex++}`,
                object: "chat.completion.chunk",
                created: Math.floor(Date.now() / 1000),
                model: request.model,
                choices: [
                  {
                    index: chunk.index,
                    delta: {},
                    logprobs: null,
                    finish_reason:
                      chunk.delta.stop_reason === "tool_use"
                        ? "tool_calls"
                        : "stop",
                  },
                ],
              }
            }
          }
        } catch (error) {
          throw error
        }
      },
    }
  }
}
