import Anthropic from "@anthropic-ai/sdk";
import type {
  IProvider,
  ChatCompletionCreateParams,
  ChatCompletion,
  ProviderChatCompletionStream,
} from "../types";
import { EventEmitter } from "events";
import type {
  TextBlock,
  Message,
  MessageCreateParamsNonStreaming,
  ToolUseBlock,
} from "@anthropic-ai/sdk/resources/messages/index.mjs";

interface AnthropicProviderOptions {
  apiKey?: string;
  baseURL?: string;
  maxRetries?: number;
  defaultHeaders?: Record<string, string>;
  defaultQuery?: Record<string, string>;
}

export class AnthropicProvider implements IProvider {
  public name = "anthropic";
  private client: Anthropic;

  constructor(options: AnthropicProviderOptions) {
    this.client = new Anthropic({
      apiKey: options.apiKey,
      baseURL: options.baseURL,
      maxRetries: options.maxRetries,
      defaultHeaders: options.defaultHeaders,
      defaultQuery: options.defaultQuery,
    });
  }

  matchesModel(model: string): boolean {
    return model.startsWith("claude-");
  }

  private convertOpenAIToAnthropic(
    request: ChatCompletionCreateParams
  ): MessageCreateParamsNonStreaming {
    // Convert OpenAI messages format to Anthropic format
    const messages = request.messages.map((msg) => ({
      role: msg.role === "assistant" ? "assistant" : "user",
      content: msg.content,
    }));

    // Convert OpenAI functions/tools to Anthropic tools format
    const tools =
      request.functions?.map((fn) => ({
        name: fn.name,
        description: fn.description,
        input_schema: { type: "object", ...fn.parameters },
      })) ||
      request.tools?.map((tool) => ({
        name: tool.function.name,
        description: tool.function.description,
        input_schema: { type: "object", ...tool.function.parameters },
      }));

    // Convert tool_choice to Anthropic format
    let tool_choice;
    if (request.function_call === "auto" || request.tool_choice === "auto") {
      tool_choice = { type: "auto" };
    } else if (request.function_call === "none") {
      tool_choice = undefined;
    } else if (typeof request.function_call === "object") {
      tool_choice = { type: "tool", name: request.function_call.name };
    } else if (typeof request.tool_choice === "object") {
      tool_choice = { type: "tool", name: request.tool_choice.function.name };
    }

    return {
      model: request.model,
      messages,
      tools,
      tool_choice,
      max_tokens: request.max_tokens ?? 8192,
      temperature: request.temperature,
      top_p: request.top_p,
    };
  }

  private convertAnthropicToOpenAI(response: Message): ChatCompletion {
    // Convert tool_calls to OpenAI function_call format
    const toolCalls = response.content
      .filter((block): block is ToolUseBlock => block.type === "tool_use")
      .map((block) => ({
        id: block.id,
        type: "function",
        function: {
          name: block.name,
          arguments: JSON.stringify(block.input),
        },
      }));

    // Convert text content
    const content = response.content
      .filter((block): block is TextBlock => block.type === "text")
      .map((block) => block.text)
      .join("");

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
    };
  }

  async createCompletion(
    request: ChatCompletionCreateParams
  ): Promise<ChatCompletion> {
    const anthropicRequest = this.convertOpenAIToAnthropic(request);
    const response = await this.client.messages.create({
      ...anthropicRequest,
      stream: false,
    });
    return this.convertAnthropicToOpenAI(response);
  }

  async createCompletionStream(
    request: ChatCompletionCreateParams
  ): Promise<ProviderChatCompletionStream> {
    const anthropicRequest = this.convertOpenAIToAnthropic(request);
    const stream = await this.client.messages.create({
      ...anthropicRequest,
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
      // Process Anthropic stream events and convert to OpenAI format
      for await (const chunk of stream) {
        if (chunk.type === "message_start") {
          continue;
        }

        if (
          chunk.type === "content_block_delta" &&
          chunk.delta.type === "text_delta"
        ) {
          absoStream.emit("chunk", {
            id: chunk.index,
            object: "chat.completion.chunk",
            created: Date.now(),
            model: request.model,
            choices: [
              {
                index: 0,
                delta: {
                  content: chunk.delta.text,
                },
                finish_reason: null,
              },
            ],
          });
        }

        if (
          chunk.type === "content_block_delta" &&
          chunk.delta.type === "input_json_delta"
        ) {
          absoStream.emit("chunk", {
            id: chunk.index,
            object: "chat.completion.chunk",
            created: Date.now(),
            model: request.model,
            choices: [
              {
                index: 0,
                delta: {
                  tool_calls: [
                    {
                      index: chunk.index,
                      id: `call_${chunk.index}`,
                      type: "function",
                      function: {
                        arguments: chunk.delta.partial_json,
                      },
                    },
                  ],
                },
                finish_reason: null,
              },
            ],
          });
        }
      }

      absoStream.emit("end");
    } catch (error) {
      absoStream.emit("error", error);
    }

    return absoStream as ProviderChatCompletionStream;
  }
}
