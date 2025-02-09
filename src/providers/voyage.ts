import { OpenAIProvider } from "./openai"
import type {
  CreateEmbeddingResponse,
  EmbeddingCreateParams,
  IProvider,
} from "../types"

interface VoyageProviderOptions {
  apiKey: string
}

interface VoyageEmbedding {
  object: "embedding"
  embedding: number[]
  index: number
}

interface VoyageEmbeddingResponse {
  object: "list"
  data: VoyageEmbedding[]
  model: string
  usage: {
    total_tokens: number
  }
}

export class VoyageProvider implements IProvider {
  public name = "voyage"
  private apiKey: string

  constructor(options: VoyageProviderOptions) {
    this.apiKey = options.apiKey
  }

  matchesModel(model: string): boolean {
    return model.startsWith("voyage-")
  }

  async embed(
    request: EmbeddingCreateParams
  ): Promise<CreateEmbeddingResponse> {
    const response = await fetch("https://api.voyageai.com/v1/embeddings", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify({
        model: request.model,
        input: request.input,
      }),
    })

    const data = (await response.json()) as VoyageEmbeddingResponse

    return {
      ...data,
      usage: {
        prompt_tokens: data.usage.total_tokens,
        total_tokens: data.usage.total_tokens,
      },
    }
  }
}
