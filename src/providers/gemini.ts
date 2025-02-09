import type {
  IProvider,
  ChatCompletionCreateParams,
  ChatCompletion,
  ProviderChatCompletionStream,
  ChatCompletionChunk,
} from "../types";

interface GeminiProviderOptions {
  apiKey?: string;
  baseURL?: string;
  timeout?: number;
}

export class GeminiProvider implements IProvider {
  public name = "gemini";
  private options: GeminiProviderOptions;

  constructor(options: GeminiProviderOptions = {}) {
    this.options = options;
  }

  matchesModel(model: string): boolean {
    return model.toLowerCase().startsWith("gemini");
  }

  async createCompletion(
    request: ChatCompletionCreateParams
  ): Promise<ChatCompletion> {
    // Force stream to false
    const req = { ...request, stream: false };
    const apiKey = this.options.apiKey ?? process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error(
        "Gemini API key is required, define GEMINI_API_KEY in your environment or pass it in options"
      );
    }
    if (this.options.baseURL) {
      console.warn("The 'baseURL' option is ignored by Gemini");
    }
    const responseMimeType =
      request.response_format?.type === "json_object"
        ? "application/json"
        : undefined;
    const stopSequences =
      typeof request.stop === "string" ? [request.stop] : request.stop;

    const { GoogleGenerativeAI } = await import("@google/generative-ai");
    const genAI = new GoogleGenerativeAI(apiKey);
    const generationConfig = {
      maxOutputTokens: request.max_tokens ?? undefined,
      temperature: request.temperature ?? undefined,
      topP: request.top_p ?? undefined,
      stopSequences: stopSequences ?? undefined,
      candidateCount: request.n ?? undefined,
      responseMimeType,
    };
    const modelInstance = genAI.getGenerativeModel({
      model: request.model,
      generationConfig,
    });

    const { contents, systemInstruction } = await convertMessagesToContents(
      req.messages
    );
    const params = {
      contents,
      systemInstruction,
      tools: [], // tools not supported for now
      toolConfig: { functionCallingConfig: {} },
    };
    const timestamp = Date.now();

    const result = await modelInstance.generateContent(params);
    return convertResponse(result, request.model, timestamp);
  }

  async createCompletionStream(
    request: ChatCompletionCreateParams
  ): Promise<ProviderChatCompletionStream> {
    // Force stream to true
    const req = { ...request, stream: true };
    const apiKey = this.options.apiKey ?? process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error(
        "Gemini API key is required, define GEMINI_API_KEY in your environment or pass it in options"
      );
    }
    if (this.options.baseURL) {
      console.warn("The 'baseURL' option is ignored by Gemini");
    }
    const responseMimeType =
      request.response_format?.type === "json_object"
        ? "application/json"
        : undefined;
    const stopSequences =
      typeof request.stop === "string" ? [request.stop] : request.stop;

    const { GoogleGenerativeAI } = await import("@google/generative-ai");
    const genAI = new GoogleGenerativeAI(apiKey);
    const generationConfig = {
      maxOutputTokens: request.max_tokens ?? undefined,
      temperature: request.temperature ?? undefined,
      topP: request.top_p ?? undefined,
      stopSequences: stopSequences ?? undefined,
      candidateCount: request.n ?? undefined,
      responseMimeType,
    };
    const modelInstance = genAI.getGenerativeModel({
      model: request.model,
      generationConfig,
    });

    const { contents, systemInstruction } = await convertMessagesToContents(
      req.messages
    );
    const params = {
      contents,
      systemInstruction,
      tools: [],
      toolConfig: { functionCallingConfig: {} },
    };
    const timestamp = Date.now();

    const streamResult = await modelInstance.generateContentStream(params);
    async function* convertStreamResponse(
      stream: AsyncGenerator<any>,
      model: string,
      timestamp: number
    ): AsyncGenerator<ChatCompletionChunk, void, unknown> {
      let chunkIndex = 0;
      for await (const chunk of stream) {
        const text = chunk.text();
        yield {
          id: `chunk-${chunkIndex++}`,
          object: "chat.completion.chunk",
          created: timestamp,
          model,
          choices: [
            {
              index: 0,
              delta: {
                content: text,
                tool_calls: chunk.tool_calls,
              },
              logprobs: null,
              finish_reason: chunk.finishReason ?? null,
            },
          ],
        } as ChatCompletionChunk;
      }
    }
    return {
      controller: new AbortController(),
      [Symbol.asyncIterator]: () =>
        convertStreamResponse(
          streamResult.stream,
          request.model,
          timestamp
        ) as unknown as AsyncIterator<ChatCompletionChunk, any, any>,
    };
  }
}

// Helper function to convert messages to contents
async function convertMessagesToContents(
  messages: any
): Promise<{ contents: any[]; systemInstruction: any | undefined }> {
  let systemInstruction = undefined;
  const contents = [];
  let msgs = messages;
  if (msgs.length > 0 && msgs[0].role === "system") {
    const sys = msgs[0];
    systemInstruction = {
      role: "user",
      parts: [{ text: `System:\n${sys.content || ""}` }],
    };
    msgs = msgs.slice(1);
  }
  for (const msg of msgs) {
    const prefix = msg.role === "system" ? "System:\n" : "";
    contents.push({ role: "user", parts: [{ text: prefix + msg.content }] });
  }
  return { contents, systemInstruction };
}

// Helper function to convert Gemini response to ChatCompletion format
function convertResponse(
  result: any,
  model: string,
  timestamp: number
): ChatCompletion {
  const candidate =
    (result.response &&
      result.response.candidates &&
      result.response.candidates[0]) ||
    {};
  const content = candidate.content?.parts
    ? candidate.content.parts.map((part: any) => part.text).join("")
    : null;
  const message = {
    role: "assistant",
    content,
    tool_calls: candidate.content?.parts
      ? candidate.content.parts
          .filter((part: any) => part.functionCall !== undefined)
          .map((part: any) => ({
            id: "generated",
            type: "function",
            function: {
              name: part.functionCall?.name,
              arguments: JSON.stringify(part.functionCall?.args),
            },
          }))
      : undefined,
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
        logprobs: null,
      },
    ],
    usage: result.response?.usageMetadata
      ? {
          prompt_tokens: result.response.usageMetadata.promptTokenCount,
          completion_tokens: result.response.usageMetadata.candidatesTokenCount,
          total_tokens: result.response.usageMetadata.totalTokenCount,
        }
      : undefined,
  };
}
