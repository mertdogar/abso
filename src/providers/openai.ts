import {
  IProvider,
  ChatCompletionRequest,
  ChatCompletion,
  ChatCompletionStream,
} from "../types";
import { ChatCompletionStream as ChatCompletionStreamInterface } from "../types";
import { EventEmitter } from "events";
import fetch from "node-fetch"; // or `cross-fetch` if you need browser support

interface OpenAIProviderOptions {
  apiKey: string;
  baseUrl?: string; // override for e.g. azure endpoints
}

export class OpenAIProvider implements IProvider {
  public name = "openai";
  private apiKey: string;
  private baseUrl: string;

  constructor(options: OpenAIProviderOptions) {
    this.apiKey = options.apiKey;
    this.baseUrl = options.baseUrl || "https://api.openai.com/v1";
  }

  matchesModel(model: string): boolean {
    // For simplicity, let's say any "gpt-" or "text-davinci-"
    return model.startsWith("gpt-") || model.startsWith("text-davinci-");
  }

  async createCompletion(
    request: ChatCompletionRequest
  ): Promise<ChatCompletion> {
    const url = `${this.baseUrl}/chat/completions`;
    const resp = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify({
        model: request.model,
        messages: request.messages,
        temperature: request.temperature ?? 0.7,
        stream: false,
      }),
    });

    if (!resp.ok) {
      const errText = await resp.text();
      throw new Error(`OpenAI API error: ${resp.status} - ${errText}`);
    }

    const data = await resp.json();
    return data as ChatCompletion;
  }

  async createCompletionStream(
    request: ChatCompletionRequest,
    StreamClass: new () => ChatCompletionStreamInterface
  ): Promise<ChatCompletionStream> {
    const url = `${this.baseUrl}/chat/completions`;
    // We'll build a standard SSE-like approach
    const streamImpl = new StreamClass();

    // Kick off the request with "stream: true"
    const resp = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify({
        model: request.model,
        messages: request.messages,
        temperature: request.temperature ?? 0.7,
        stream: true,
      }),
    });

    if (!resp.ok || !resp.body) {
      const errText = await resp.text();
      streamImpl.emit(
        "error",
        new Error(`OpenAI streaming error: ${resp.status} - ${errText}`)
      );
      return streamImpl;
    }

    // We read from resp.body as a stream of SSE lines
    // This is a simplified streaming logic. In a real-world scenario,
    // you'd parse the SSE lines carefully (they start with "data:")
    // and end with "[DONE]". This is just a minimal example.

    (async () => {
      try {
        const reader = resp.body.getReader();
        let partialJson = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          const chunk = new TextDecoder().decode(value);
          partialJson += chunk;

          // Attempt naive splitting by newlines
          const lines = partialJson.split("\n");
          for (let i = 0; i < lines.length - 1; i++) {
            const line = lines[i].trim();
            if (line.startsWith("data:")) {
              const raw = line.replace(/^data:\s*/, "").trim();
              if (raw === "[DONE]") {
                // In an actual scenario, parse final usage, etc.
                // For now, we just end
                streamImpl.end({
                  id: "chatcmpl-stream",
                  model: request.model,
                  created: Math.floor(Date.now() / 1000),
                  choices: [
                    {
                      index: 0,
                      message: {
                        role: "assistant",
                        content: streamImpl["partialContent"] || "", // hacky reference
                      },
                      finish_reason: "stop",
                    },
                  ],
                });
                return;
              }
              // Otherwise parse partial JSON
              try {
                const parsed = JSON.parse(raw);
                // The partial content might be in e.g. parsed.choices[0].delta.content
                const deltaContent = parsed.choices?.[0]?.delta?.content;
                if (deltaContent) {
                  streamImpl.pushDelta(deltaContent);
                }
              } catch (err) {
                // If parse error, ignore or handle
              }
            }
          }
          partialJson = lines[lines.length - 1]; // leftover
        }
      } catch (err: any) {
        streamImpl.emit("error", err);
      }
    })();

    return streamImpl;
  }
}
