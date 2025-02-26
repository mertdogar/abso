import lunary from "lunary"
import type {
  AbsoCallback,
  ChatCompletion,
  ChatCompletionCreateParams,
} from "../types"

const PARAMS_TO_CAPTURE = [
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
  "logit_bias",
]

const cleanParams = (extra: object) => {
  return Object.fromEntries(Object.entries(extra).filter(([_, v]) => v != null))
}

export class LunaryCallback implements AbsoCallback {
  constructor() {
    if (!process.env.LUNARY_PUBLIC_KEY) {
      throw new Error("LUNARY_PUBLIC_KEY environment variable is required")
    }
    lunary.init({
      publicKey: process.env.LUNARY_PUBLIC_KEY,
      privateKey: process.env.LUNARY_PRIVATE_KEY,
    })
  }

  onChatStart(id: string, request: ChatCompletionCreateParams) {
    const rawParams: Record<string, unknown> = {}

    for (const param of PARAMS_TO_CAPTURE) {
      if (param in request) {
        rawParams[param] = (request as unknown as Record<string, unknown>)[
          param
        ]
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
      runtime: "abso-js",
    })
  }

  onChatEnd(id: string, result: ChatCompletion) {
    lunary.trackEvent("llm", "end", {
      runId: id,
      model: result.model,
      output: result.choices[0].message.content,
      tokensUsage: {
        prompt: result.usage?.prompt_tokens || 0,
        completion: result.usage?.completion_tokens || 0,
      },
      runtime: "abso-js",
    })
  }

  onChatError(id: string, error: Error) {
    lunary.trackEvent("llm", "error", {
      runId: id,
      error: {
        message: error.message,
        stack: error.stack,
      },
      runtime: "abso-js",
    })
  }
}
