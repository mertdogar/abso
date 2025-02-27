import lunary from 'lunary';
import { OpenAI } from 'openai';
import Anthropic from '@anthropic-ai/sdk';
import { GoogleGenerativeAI } from '@google/generative-ai';

var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var PARAMS_TO_CAPTURE, cleanParams, _LunaryCallback, LunaryCallback;
var init_lunary = __esm({
  "src/callbacks/lunary.ts"() {
    PARAMS_TO_CAPTURE = [
      "temperature",
      "top_p",
      "top_k",
      "stop",
      "audio",
      "prediction",
      "modalities",
      "presence_penalty",
      "frequency_penalty",
      "seed",
      "function_call",
      "service_tier",
      "parallel_tool_calls",
      "functions",
      "tools",
      "tool_choice",
      "top_logprobs",
      "logprobs",
      "response_format",
      "max_tokens",
      "max_completion_tokens",
      "logit_bias"
    ];
    cleanParams = /* @__PURE__ */ __name((extra) => {
      return Object.fromEntries(Object.entries(extra).filter(([_, v]) => v != null));
    }, "cleanParams");
    _LunaryCallback = class _LunaryCallback {
      constructor() {
        if (!process.env.LUNARY_PUBLIC_KEY) {
          throw new Error("LUNARY_PUBLIC_KEY environment variable is required");
        }
        lunary.init({
          publicKey: process.env.LUNARY_PUBLIC_KEY,
          privateKey: process.env.LUNARY_PRIVATE_KEY
        });
      }
      onChatStart(id, request) {
        const rawParams = {};
        for (const param of PARAMS_TO_CAPTURE) {
          if (param in request) {
            rawParams[param] = request[param];
          }
        }
        lunary.trackEvent("llm", "start", {
          runId: id,
          model: request.model,
          messages: request.messages,
          functions: request.functions,
          tools: request.tools,
          tags: request.tags,
          metadata: request.metadata,
          params: cleanParams(rawParams),
          runtime: "abso-js"
        });
      }
      onChatEnd(id, result) {
        lunary.trackEvent("llm", "end", {
          runId: id,
          model: result.model,
          output: result.choices[0].message.content,
          tokensUsage: {
            prompt: result.usage?.prompt_tokens || 0,
            completion: result.usage?.completion_tokens || 0
          },
          runtime: "abso-js"
        });
      }
      onChatError(id, error) {
        lunary.trackEvent("llm", "error", {
          runId: id,
          error: {
            message: error.message,
            stack: error.stack
          },
          runtime: "abso-js"
        });
      }
    };
    __name(_LunaryCallback, "LunaryCallback");
    LunaryCallback = _LunaryCallback;
  }
});

// src/utils/modelRouting.ts
function findMatchingProvider(model, providers) {
  return providers.find((provider) => provider.matchesModel(model));
}
var init_modelRouting = __esm({
  "src/utils/modelRouting.ts"() {
    __name(findMatchingProvider, "findMatchingProvider");
  }
});

// src/providers/openai.ts
var openai_exports = {};
__export(openai_exports, {
  OpenAIProvider: () => OpenAIProvider
});
var _OpenAIProvider, OpenAIProvider;
var init_openai = __esm({
  "src/providers/openai.ts"() {
    _OpenAIProvider = class _OpenAIProvider {
      constructor(options = {}) {
        this.name = "openai";
        const apiKey = options.apiKey || process.env.OPENAI_API_KEY;
        this.client = new OpenAI({
          apiKey,
          baseURL: options.baseURL,
          organization: options.organization,
          timeout: options.timeout,
          project: options.project,
          fetch: options.fetch,
          maxRetries: options.maxRetries,
          defaultHeaders: options.defaultHeaders,
          defaultQuery: options.defaultQuery
        });
      }
      validateConfig() {
        if (!this.client.apiKey) {
          throw new Error(
            "OpenAI API key is required. Set OPENAI_API_KEY environment variable or pass it in constructor options."
          );
        }
      }
      matchesModel(model) {
        return model.startsWith("gpt-") || ["o1", "o3", "o4"].includes(model) || model.startsWith("text-embedding-");
      }
      /**
       * Non-streaming call
       */
      async createCompletion(request) {
        this.validateConfig();
        const response = await this.client.chat.completions.create({
          ...request,
          stream: false
        });
        return response;
      }
      /**
       * Streaming call
       */
      async createCompletionStream(request) {
        this.validateConfig();
        const stream = await this.client.chat.completions.create({
          ...request,
          stream: true,
          stream_options: { include_usage: true }
        });
        return {
          controller: stream.controller,
          [Symbol.asyncIterator]() {
            return stream[Symbol.asyncIterator]();
          }
        };
      }
      async embed(request) {
        this.validateConfig();
        return this.client.embeddings.create(request);
      }
    };
    __name(_OpenAIProvider, "OpenAIProvider");
    OpenAIProvider = _OpenAIProvider;
  }
});

// src/providers/groq.ts
var _GroqProvider, GroqProvider;
var init_groq = __esm({
  "src/providers/groq.ts"() {
    init_openai();
    _GroqProvider = class _GroqProvider extends OpenAIProvider {
      constructor(options = {}) {
        const apiKey = options.apiKey || process.env.GROQ_API_KEY;
        super({
          apiKey,
          baseURL: "https://api.groq.com/openai/v1/"
        });
        this.name = "groq";
        this.apiKey = apiKey;
      }
      validateConfig() {
        if (!this.apiKey) {
          throw new Error(
            "Groq API key is required. Set GROQ_API_KEY environment variable or pass it in constructor options."
          );
        }
      }
      matchesModel(model) {
        return false;
      }
    };
    __name(_GroqProvider, "GroqProvider");
    GroqProvider = _GroqProvider;
  }
});
var _AnthropicProvider, AnthropicProvider;
var init_anthropic = __esm({
  "src/providers/anthropic.ts"() {
    _AnthropicProvider = class _AnthropicProvider {
      constructor(options = {}) {
        this.name = "anthropic";
        const apiKey = options.apiKey || process.env.ANTHROPIC_API_KEY;
        this.client = new Anthropic({
          apiKey,
          baseURL: options.baseURL,
          maxRetries: options.maxRetries,
          defaultHeaders: options.defaultHeaders,
          defaultQuery: options.defaultQuery
        });
      }
      validateApiKey() {
        if (!this.client.apiKey) {
          throw new Error(
            "Anthropic API key is required. Set ANTHROPIC_API_KEY environment variable or pass it in constructor options."
          );
        }
      }
      matchesModel(model) {
        return model.startsWith("claude-");
      }
      convertOpenAIToAnthropic(request) {
        const messages = request.messages.map((msg) => {
          const role = msg.role === "assistant" ? "assistant" : "user";
          if (typeof msg.content === "string" || !msg.content) {
            return {
              role,
              content: msg.content || ""
            };
          }
          return {
            role,
            content: msg.content.map((c) => typeof c === "string" ? c : "").join("")
          };
        });
        const tools = request.functions?.filter((fn) => fn.parameters).map((fn) => ({
          name: fn.name,
          description: fn.description || "",
          input_schema: {
            type: "object",
            properties: fn.parameters.properties || {},
            required: fn.parameters.required || []
          }
        })) || request.tools?.filter((tool) => tool.function.parameters).map((tool) => ({
          name: tool.function.name,
          description: tool.function.description || "",
          input_schema: {
            type: "object",
            properties: tool.function.parameters.properties || {},
            required: tool.function.parameters.required || []
          }
        }));
        let tool_choice;
        if (request.tool_choice === "required") {
          tool_choice = { type: "any" };
        } else if (request.function_call === "auto" || request.tool_choice === "auto") {
          tool_choice = { type: "auto" };
        } else if (request.function_call === "none") {
          tool_choice = void 0;
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
          temperature: request.temperature ?? void 0,
          top_p: request.top_p ?? void 0
        };
      }
      convertAnthropicToOpenAI(response) {
        const toolCalls = response.content.filter((block) => block.type === "tool_use").map((block) => ({
          id: block.id,
          type: "function",
          function: {
            name: block.name,
            arguments: JSON.stringify(block.input)
          }
        }));
        const content = response.content.filter((block) => block.type === "text").map((block) => block.text).join("");
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
                tool_calls: toolCalls.length > 0 ? toolCalls : void 0,
                // Add required refusal field
                refusal: null
              },
              logprobs: null,
              finish_reason: response.stop_reason === "tool_use" ? "tool_calls" : "stop"
            }
          ],
          usage: {
            prompt_tokens: response.usage.input_tokens,
            completion_tokens: response.usage.output_tokens,
            total_tokens: response.usage.input_tokens + response.usage.output_tokens
          }
        };
      }
      async createCompletion(request) {
        this.validateApiKey();
        const anthropicRequest = this.convertOpenAIToAnthropic(request);
        const response = await this.client.messages.create({
          ...anthropicRequest,
          stream: false
        });
        return this.convertAnthropicToOpenAI(response);
      }
      async createCompletionStream(request) {
        this.validateApiKey();
        const anthropicRequest = this.convertOpenAIToAnthropic(request);
        const stream = await this.client.messages.create({
          ...anthropicRequest,
          stream: true
        });
        let chunkIndex = 0;
        return {
          controller: stream.controller,
          async *[Symbol.asyncIterator]() {
            try {
              for await (const chunk of stream) {
                if (chunk.type === "message_start") continue;
                if (chunk.type === "content_block_delta" && chunk.delta.type === "text_delta") {
                  yield {
                    id: `chunk-${chunkIndex++}`,
                    object: "chat.completion.chunk",
                    created: Math.floor(Date.now() / 1e3),
                    model: request.model,
                    choices: [
                      {
                        index: chunk.index,
                        delta: {
                          content: chunk.delta.text
                        },
                        logprobs: null,
                        finish_reason: chunk.delta.text.trim() === "" ? "stop" : null
                      }
                    ]
                  };
                }
                if (chunk.type == "content_block_start" && chunk.content_block.type == "tool_use") {
                  yield {
                    id: `chunk-${chunkIndex++}`,
                    object: "chat.completion.chunk",
                    created: Math.floor(Date.now() / 1e3),
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
                        finish_reason: null
                      }
                    ]
                  };
                }
                if (chunk.type === "content_block_delta" && chunk.delta.type === "input_json_delta") {
                  yield {
                    id: `chunk-${chunkIndex++}`,
                    object: "chat.completion.chunk",
                    created: Math.floor(Date.now() / 1e3),
                    model: request.model,
                    choices: [
                      {
                        index: chunk.index,
                        delta: {
                          tool_calls: [
                            {
                              index: 0,
                              id: `call_${chunkIndex}`,
                              type: "function",
                              function: {
                                arguments: chunk.delta.partial_json
                              }
                            }
                          ]
                        },
                        logprobs: null,
                        finish_reason: null
                      }
                    ]
                  };
                }
                if (chunk.type === "message_delta" && chunk.delta.stop_reason) {
                  yield {
                    id: `chunk-${chunkIndex++}`,
                    object: "chat.completion.chunk",
                    created: Math.floor(Date.now() / 1e3),
                    model: request.model,
                    choices: [
                      {
                        index: chunk.index,
                        delta: {},
                        logprobs: null,
                        finish_reason: chunk.delta.stop_reason === "tool_use" ? "tool_calls" : "stop"
                      }
                    ]
                  };
                }
              }
            } catch (error) {
              throw error;
            }
          }
        };
      }
    };
    __name(_AnthropicProvider, "AnthropicProvider");
    AnthropicProvider = _AnthropicProvider;
  }
});

// src/providers/openrouter.ts
var _OpenRouterProvider, OpenRouterProvider;
var init_openrouter = __esm({
  "src/providers/openrouter.ts"() {
    init_openai();
    _OpenRouterProvider = class _OpenRouterProvider extends OpenAIProvider {
      constructor(options = {}) {
        const apiKey = options.apiKey || process.env.OPENROUTER_API_KEY;
        super({
          apiKey,
          baseURL: "https://openrouter.ai/api/v1",
          defaultHeaders: options.defaultHeaders || {
            "HTTP-Referer": "abso.ai",
            "X-Title": "Abso"
          }
        });
        this.name = "openrouter";
        this.apiKey = apiKey;
      }
      validateConfig() {
        if (!this.apiKey) {
          throw new Error(
            "OpenRouter API key is required. Set OPENROUTER_API_KEY environment variable or pass it in constructor options."
          );
        }
      }
      matchesModel(model) {
        return false;
      }
    };
    __name(_OpenRouterProvider, "OpenRouterProvider");
    OpenRouterProvider = _OpenRouterProvider;
  }
});

// src/providers/mistral.ts
var _MistralProvider, MistralProvider;
var init_mistral = __esm({
  "src/providers/mistral.ts"() {
    init_openai();
    _MistralProvider = class _MistralProvider extends OpenAIProvider {
      constructor(options = {}) {
        const apiKey = options.apiKey || process.env.MISTRAL_API_KEY;
        super({
          apiKey,
          baseURL: "https://api.mistral.ai/v1/"
        });
        this.name = "mistral";
        this.apiKey = apiKey;
      }
      validateConfig() {
        if (!this.apiKey) {
          throw new Error(
            "Mistral API key is required. Set MISTRAL_API_KEY environment variable or pass it in constructor options."
          );
        }
      }
      matchesModel(model) {
        return model.startsWith("tral-");
      }
    };
    __name(_MistralProvider, "MistralProvider");
    MistralProvider = _MistralProvider;
  }
});

// src/providers/xai.ts
var _XaiProvider, XaiProvider;
var init_xai = __esm({
  "src/providers/xai.ts"() {
    init_openai();
    _XaiProvider = class _XaiProvider extends OpenAIProvider {
      constructor(options = {}) {
        const apiKey = options.apiKey || process.env.XAI_API_KEY;
        super({
          apiKey,
          baseURL: "https://api.x.ai/v1"
        });
        this.name = "xai";
        this.apiKey = apiKey;
      }
      validateConfig() {
        if (!this.apiKey) {
          throw new Error(
            "xAI API key is required. Set XAI_API_KEY environment variable or pass it in constructor options."
          );
        }
      }
      matchesModel(model) {
        return model.startsWith("grok-");
      }
    };
    __name(_XaiProvider, "XaiProvider");
    XaiProvider = _XaiProvider;
  }
});

// src/providers/voyage.ts
var _VoyageProvider, VoyageProvider;
var init_voyage = __esm({
  "src/providers/voyage.ts"() {
    _VoyageProvider = class _VoyageProvider {
      constructor(options = {}) {
        this.name = "voyage";
        this.apiKey = options.apiKey || process.env.VOYAGE_API_KEY;
      }
      validateConfig() {
        if (!this.apiKey) {
          throw new Error(
            "Voyage API key is required. Set VOYAGE_API_KEY environment variable or pass it in constructor options."
          );
        }
      }
      matchesModel(model) {
        return model.startsWith("voyage-");
      }
      async embed(request) {
        this.validateConfig();
        const response = await fetch("https://api.voyageai.com/v1/embeddings", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${this.apiKey}`
          },
          body: JSON.stringify({
            model: request.model,
            input: request.input
          })
        });
        const data = await response.json();
        return {
          ...data,
          usage: {
            prompt_tokens: data.usage.total_tokens,
            total_tokens: data.usage.total_tokens
          }
        };
      }
    };
    __name(_VoyageProvider, "VoyageProvider");
    VoyageProvider = _VoyageProvider;
  }
});
async function convertMessagesToContents(messages) {
  let systemInstruction = void 0;
  const contents = [];
  let msgs = messages;
  if (msgs.length > 0 && msgs[0].role === "system") {
    const sys = msgs[0];
    systemInstruction = {
      role: "user",
      parts: [{ text: `System:
${sys.content || ""}` }]
    };
    msgs = msgs.slice(1);
  }
  for (const msg of msgs) {
    const prefix = msg.role === "system" ? "System:\n" : "";
    contents.push({ role: "user", parts: [{ text: prefix + msg.content }] });
  }
  return { contents, systemInstruction };
}
function convertResponse(result, model, timestamp) {
  const candidate = result.response && result.response.candidates && result.response.candidates[0] || {};
  const content = candidate.content?.parts ? candidate.content.parts.map((part) => part.text).join("") : null;
  const message = {
    role: "assistant",
    content,
    refusal: null,
    tool_calls: candidate.content?.parts ? candidate.content.parts.filter((part) => part.functionCall !== void 0).map((part) => ({
      id: "generated",
      type: "function",
      function: {
        name: part.functionCall?.name,
        arguments: JSON.stringify(part.functionCall?.args)
      }
    })) : void 0
  };
  return {
    id: "",
    object: "chat.completion",
    created: timestamp,
    model,
    choices: [
      {
        index: candidate.index || 0,
        finish_reason: candidate.finishReason || "stop",
        message,
        logprobs: null
      }
    ],
    usage: result.response?.usageMetadata ? {
      prompt_tokens: result.response.usageMetadata.promptTokenCount,
      completion_tokens: result.response.usageMetadata.candidatesTokenCount,
      total_tokens: result.response.usageMetadata.totalTokenCount
    } : void 0
  };
}
var _GeminiProvider, GeminiProvider;
var init_gemini = __esm({
  "src/providers/gemini.ts"() {
    _GeminiProvider = class _GeminiProvider {
      constructor(options = {}) {
        this.name = "gemini";
        const apiKey = options.apiKey || process.env.GEMINI_API_KEY;
        if (apiKey) {
          if (options.baseURL) {
            console.warn("The 'baseURL' option is ignored by Gemini");
          }
          this.genAI = new GoogleGenerativeAI(apiKey);
        }
      }
      validateConfig() {
        if (!this.genAI) {
          throw new Error(
            "Gemini API key is required. Set GEMINI_API_KEY environment variable or pass it in constructor options."
          );
        }
      }
      matchesModel(model) {
        return model.toLowerCase().startsWith("gemini");
      }
      async createCompletion(request) {
        this.validateConfig();
        const req = { ...request};
        const responseMimeType = request.response_format?.type === "json_object" ? "application/json" : void 0;
        const stopSequences = typeof request.stop === "string" ? [request.stop] : request.stop;
        const generationConfig = {
          maxOutputTokens: request.max_tokens ?? void 0,
          temperature: request.temperature ?? void 0,
          topP: request.top_p ?? void 0,
          stopSequences: stopSequences ?? void 0,
          candidateCount: request.n ?? void 0,
          responseMimeType
        };
        const modelInstance = this.genAI.getGenerativeModel({
          model: request.model,
          generationConfig
        });
        const { contents, systemInstruction } = await convertMessagesToContents(
          req.messages
        );
        const params = {
          contents,
          systemInstruction,
          tools: [],
          // tools not supported for now
          toolConfig: { functionCallingConfig: {} }
        };
        const timestamp = Date.now();
        const result = await modelInstance.generateContent(params);
        return convertResponse(result, request.model, timestamp);
      }
      async createCompletionStream(request) {
        this.validateConfig();
        const req = { ...request};
        const responseMimeType = request.response_format?.type === "json_object" ? "application/json" : void 0;
        const stopSequences = typeof request.stop === "string" ? [request.stop] : request.stop;
        const generationConfig = {
          maxOutputTokens: request.max_tokens ?? void 0,
          temperature: request.temperature ?? void 0,
          topP: request.top_p ?? void 0,
          stopSequences: stopSequences ?? void 0,
          candidateCount: request.n ?? void 0,
          responseMimeType
        };
        const modelInstance = this.genAI.getGenerativeModel({
          model: request.model,
          generationConfig
        });
        const { contents, systemInstruction } = await convertMessagesToContents(
          req.messages
        );
        const params = {
          contents,
          systemInstruction,
          tools: [],
          toolConfig: { functionCallingConfig: {} }
        };
        const timestamp = Date.now();
        const streamResult = await modelInstance.generateContentStream(params);
        async function* convertStreamResponse(stream, model, timestamp2) {
          let chunkIndex = 0;
          for await (const chunk of stream) {
            const text = chunk.text();
            yield {
              id: `chunk-${chunkIndex++}`,
              object: "chat.completion.chunk",
              created: timestamp2,
              model,
              choices: [
                {
                  index: 0,
                  delta: {
                    content: text,
                    tool_calls: chunk.tool_calls
                  },
                  logprobs: null,
                  finish_reason: chunk.finishReason ?? null
                }
              ]
            };
          }
        }
        __name(convertStreamResponse, "convertStreamResponse");
        return {
          controller: new AbortController(),
          [Symbol.asyncIterator]: () => convertStreamResponse(
            streamResult.stream,
            request.model,
            timestamp
          )
        };
      }
    };
    __name(_GeminiProvider, "GeminiProvider");
    GeminiProvider = _GeminiProvider;
    __name(convertMessagesToContents, "convertMessagesToContents");
    __name(convertResponse, "convertResponse");
  }
});

// src/providers/deepseek.ts
var _DeepSeekProvider, DeepSeekProvider;
var init_deepseek = __esm({
  "src/providers/deepseek.ts"() {
    init_openai();
    _DeepSeekProvider = class _DeepSeekProvider extends OpenAIProvider {
      constructor(options = {}) {
        const apiKey = options.apiKey || process.env.DEEPSEEK_API_KEY;
        super({
          apiKey,
          baseURL: "https://api.deepseek.com"
        });
        this.name = "deepseek";
        this.apiKey = apiKey;
      }
      validateConfig() {
        if (!this.apiKey) {
          throw new Error(
            "DeepSeek API key is required. Set DEEPSEEK_API_KEY environment variable or pass it in constructor options."
          );
        }
      }
      matchesModel(model) {
        return model.includes("deepseek");
      }
    };
    __name(_DeepSeekProvider, "DeepSeekProvider");
    DeepSeekProvider = _DeepSeekProvider;
  }
});

// src/providers/perplexity.ts
var _PerplexityProvider, PerplexityProvider;
var init_perplexity = __esm({
  "src/providers/perplexity.ts"() {
    init_openai();
    _PerplexityProvider = class _PerplexityProvider extends OpenAIProvider {
      constructor(options = {}) {
        const apiKey = options.apiKey || process.env.PERPLEXITY_API_KEY;
        super({
          apiKey,
          baseURL: "https://api.perplexity.ai"
        });
        this.name = "perplexity";
        this.apiKey = apiKey;
      }
      validateConfig() {
        if (!this.apiKey) {
          throw new Error(
            "Perplexity API key is required. Set PERPLEXITY_API_KEY environment variable or pass it in constructor options."
          );
        }
      }
      sanitizeRequest(request) {
        const temperature = request.temperature === 2 ? 2 - Number.EPSILON : request.temperature;
        return {
          ...request,
          temperature
        };
      }
      matchesModel(model) {
        return model.includes("sonar");
      }
    };
    __name(_PerplexityProvider, "PerplexityProvider");
    PerplexityProvider = _PerplexityProvider;
  }
});

// src/providers/ollama.ts
var _OllamaProvider, OllamaProvider;
var init_ollama = __esm({
  "src/providers/ollama.ts"() {
    init_openai();
    _OllamaProvider = class _OllamaProvider extends OpenAIProvider {
      constructor(options) {
        super({
          apiKey: "ollama",
          baseURL: options.baseURL || "http://localhost:11434/v1"
        });
        this.name = "ollama";
      }
      matchesModel(model) {
        return false;
      }
    };
    __name(_OllamaProvider, "OllamaProvider");
    OllamaProvider = _OllamaProvider;
  }
});

// src/abso.ts
var abso_exports = {};
__export(abso_exports, {
  Abso: () => Abso
});
var _Abso, Abso;
var init_abso = __esm({
  "src/abso.ts"() {
    init_lunary();
    init_modelRouting();
    init_openai();
    init_groq();
    init_anthropic();
    init_openrouter();
    init_mistral();
    init_xai();
    init_voyage();
    init_gemini();
    init_deepseek();
    init_perplexity();
    init_ollama();
    _Abso = class _Abso {
      /**
       * Creates a new Abso instance with the given providers
       * @param options - An object containing the providers and optional callbacks
       */
      constructor(options = {}) {
        this.callbacks = [];
        /**
         * Convenience object for chat-related methods
         */
        this.chat = {
          /**
           * Creates a non-streaming chat completion
           * @param request - The chat completion request
           */
          create: /* @__PURE__ */ __name((request) => {
            return this.createChat(request);
          }, "create"),
          /**
           * Creates a streaming chat completion
           * @param request - The chat completion request
           */
          stream: /* @__PURE__ */ __name((request) => {
            return this.streamChat(request);
          }, "stream"),
          completions: {
            create: /* @__PURE__ */ __name((request) => {
              if (request.stream) {
                return this.streamChat(request);
              }
              return this.createChat(request);
            }, "create")
          }
        };
        /**
         * Beta endpoints following OpenAI's beta API structure
         */
        this.beta = {
          chat: {
            completions: {
              stream: /* @__PURE__ */ __name((request) => {
                return this.streamChat(request);
              }, "stream")
            }
          }
        };
        /**
         * Convenience object for embeddings-related methods
         */
        this.embeddings = {
          /**
           * Creates embeddings for the input text
           * @param request - The embedding request
           */
          create: /* @__PURE__ */ __name((request) => {
            return this.embed(request);
          }, "create")
        };
        this.callbacks = [
          ...process.env.LUNARY_PUBLIC_KEY ? [new LunaryCallback()] : [],
          ...options.callbacks || []
        ];
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
          new OllamaProvider(options.ollama || {})
        ];
      }
      /**
       * Adds a new provider to the available providers list
       * @param provider - The provider to register
       */
      registerProvider(provider) {
        this.providers.push(provider);
      }
      /**
       * Finds the appropriate provider for a given request
       * @param request - The request containing model and optional provider info
       * @throws Error if no matching provider is found
       * @returns The matched provider
       */
      getProviderForRequest(request) {
        if (request.model == null) {
          throw new Error(`Must provide a "model" field in the request`);
        }
        let provider;
        if (request.provider) {
          provider = this.providers.find(
            (p) => p.name.toLowerCase() === request.provider?.toLowerCase()
          );
          if (!provider) {
            throw new Error(
              `Provider "${request.provider}" not found among registered providers. Available: ${this.providers.map((p) => p.name).join(", ")}`
            );
          }
        }
        provider = findMatchingProvider(request.model, this.providers);
        if (!provider) {
          throw new Error(`No provider found matching model: "${request.model}"`);
        }
        if (provider.validateConfig) {
          provider.validateConfig();
        }
        return provider;
      }
      /**
       * Creates a non-streaming chat completion
       * @param request - The chat completion request
       * @throws Error if the provider doesn't support chat completions
       */
      async createChat(request) {
        const chatId = this.generateChatID();
        for (const callback of this.callbacks) {
          callback.onChatStart(chatId, request);
        }
        try {
          const provider = this.getProviderForRequest(request);
          if (provider.sanitizeRequest) {
            request = provider.sanitizeRequest(request);
          }
          delete request.tags;
          delete request.userId;
          delete request.userProps;
          delete request.provider;
          if (!provider.createCompletion) {
            throw new Error(
              `Provider "${provider.name}" does not support chat completion`
            );
          }
          const result = await provider.createCompletion(request);
          for (const callback of this.callbacks) {
            callback.onChatEnd(chatId, result);
          }
          return result;
        } catch (error) {
          for (const callback of this.callbacks) {
            callback.onChatError(chatId, error);
          }
          throw error;
        }
      }
      /**
       * Tokenizes the input using the specified provider
       * @param request - The request containing the text to tokenize
       * @throws Error if the provider doesn't support tokenization
       */
      async tokenize(request) {
        const provider = this.getProviderForRequest(request);
        if (provider.tokenize) {
          return provider.tokenize(request);
        }
        throw new Error(`Provider "${provider.name}" does not support tokenization`);
      }
      /**
       * Creates embeddings for the input text
       * @param request - The embedding request
       * @throws Error if the provider doesn't support embeddings
       */
      async embed(request) {
        const provider = this.getProviderForRequest(request);
        delete request.provider;
        if (provider.embed) {
          return provider.embed(request);
        }
        throw new Error(`Provider "${provider.name}" does not support embedding`);
      }
      /**
       * Creates a streaming chat completion
       * Returns a ChatCompletionStream that wraps the provider's stream implementation
       * @param request - The chat completion request
       * @throws Error if the provider doesn't support streaming
       */
      async streamChat(request) {
        const chatId = this.generateChatID();
        for (const callback of this.callbacks) {
          callback.onChatStart(chatId, request);
        }
        const provider = this.getProviderForRequest(request);
        if (provider.sanitizeRequest) {
          request = provider.sanitizeRequest(request);
        }
        delete request.provider;
        delete request.tags;
        delete request.userId;
        delete request.userProps;
        if (!provider.createCompletionStream) {
          throw new Error(`Provider "${provider.name}" does not support streaming`);
        }
        const providerStream = await provider.createCompletionStream(request);
        const asyncIterator = providerStream[Symbol.asyncIterator]();
        const self = this;
        const streamChatId = chatId;
        let finalResult = null;
        async function* streamingAggregatingIterator() {
          let tokens = 0;
          let choices = [];
          let finalUsage;
          try {
            while (true) {
              const { value, done } = await asyncIterator.next();
              if (done) break;
              if ("usage" in value && value.usage) {
                finalUsage = value.usage;
              }
              if (!value.choices?.length) {
                continue;
              }
              tokens += 1;
              const chunk = value.choices[0];
              if (!chunk.delta) continue;
              const { index = 0 } = chunk;
              const { content, role, tool_calls } = chunk.delta;
              if (!choices[index]) {
                choices.splice(index, 0, {
                  message: {
                    role: role || "",
                    content: "",
                    tool_calls: []
                  }
                });
              }
              if (content) choices[index].message.content += content || "";
              if (role) choices[index].message.role = role;
              if (tool_calls) {
                for (const tool_call of tool_calls) {
                  const existingCallIndex = choices[index].message.tool_calls.findIndex(
                    (tc) => tc.index === tool_call.index
                  );
                  if (existingCallIndex === -1) {
                    choices[index].message.tool_calls.push(tool_call);
                  } else {
                    const existingCall = choices[index].message.tool_calls[existingCallIndex];
                    if (tool_call.function?.arguments) {
                      existingCall.function.arguments += tool_call.function.arguments;
                    }
                  }
                }
              }
              yield value;
            }
            choices = choices.map((c) => {
              if (c.message.tool_calls) {
                c.message.tool_calls = c.message.tool_calls.map((tc) => {
                  const { index, ...rest } = tc;
                  return rest;
                });
              }
              return c;
            });
            const aggregatedResult = {
              id: crypto.randomUUID(),
              object: "chat.completion",
              created: Math.floor(Date.now() / 1e3),
              model: request.model,
              choices,
              usage: finalUsage || {
                completion_tokens: tokens,
                prompt_tokens: 0,
                total_tokens: tokens
              }
            };
            finalResult = aggregatedResult;
            if (self.callbacks?.length) {
              for (const callback of self.callbacks) {
                callback.onChatEnd(streamChatId, aggregatedResult);
              }
            }
          } catch (error) {
            if (self.callbacks?.length) {
              for (const callback of self.callbacks) {
                callback.onChatError(streamChatId, error);
              }
            }
            throw error;
          }
        }
        __name(streamingAggregatingIterator, "streamingAggregatingIterator");
        return {
          controller: providerStream.controller,
          abort: /* @__PURE__ */ __name(() => {
            providerStream.controller.abort();
          }, "abort"),
          [Symbol.asyncIterator]: streamingAggregatingIterator,
          finalChatCompletion: /* @__PURE__ */ __name(async () => {
            if (finalResult) return finalResult;
            const iterator = streamingAggregatingIterator();
            for await (const _ of iterator) {
            }
            if (!finalResult) {
              throw new Error("Failed to get final chat completion");
            }
            return finalResult;
          }, "finalChatCompletion")
        };
      }
      generateChatID() {
        return crypto.randomUUID();
      }
    };
    __name(_Abso, "Abso");
    Abso = _Abso;
  }
});

// src/types.ts
var types_exports = {};
var init_types = __esm({
  "src/types.ts"() {
  }
});

// src/index.ts
var require_index = __commonJS({
  "src/index.ts"(exports, module) {
    var { Abso: Abso2 } = (init_abso(), __toCommonJS(abso_exports));
    var abso = new Abso2();
    module.exports = {
      abso,
      ...(init_abso(), __toCommonJS(abso_exports)),
      ...(init_types(), __toCommonJS(types_exports)),
      ...(init_openai(), __toCommonJS(openai_exports))
    };
    module.exports.default = module.exports;
  }
});
var index = require_index();

export { index as default };
