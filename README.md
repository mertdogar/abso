<div align="center">

<p align="center">
  <img src="https://github.com/user-attachments/assets/cfec6d10-7e1e-4412-bd4b-edb3df45fe99" alt="Abso banner" width=1040 />
</p>

**Drop-in replacement for OpenAI**

[![npm version](https://badge.fury.io/js/abso-ai.svg)](https://badge.fury.io/js/abso-ai) ![GitHub last commit (by committer)](https://img.shields.io/github/last-commit/lunary-ai/abso) ![GitHub commit activity (branch)](https://img.shields.io/github/commit-activity/w/lunary-ai/abso)

**Abso** provides a unified interface for calling various LLMs while maintaining full type safety.

</div>

## Features

- **OpenAI-compatible API 🔁** (drop in replacement)
- **Call any LLM provider** (OpenAI, Anthropic, Groq, Ollama, etc.)
- **Lightweight & Fast ⚡**
- **Embeddings support 🧮**
- **Unified tool calling 🛠️**
- **Tokenizer and cost calculation (soon) 🔢**
- **Smart routing (soon)**

## Providers

| Provider   | Chat | Streaming | Tool Calling | Embeddings | Tokenizer | Cost Calculation |
| ---------- | ---- | --------- | ------------ | ---------- | --------- | ---------------- |
| OpenAI     | ✅   | ✅        | ✅           | ✅         | 🚧        | 🚧               |
| Anthropic  | ✅   | ✅        | ✅           | ❌         | 🚧        | 🚧               |
| xAI Grok   | ✅   | ✅        | ✅           | ❌         | 🚧        | 🚧               |
| Mistral    | ✅   | ✅        | ✅           | ❌         | 🚧        | 🚧               |
| Groq       | ✅   | ✅        | ✅           | ❌         | ❌        | 🚧               |
| Ollama     | ✅   | ✅        | ✅           | ❌         | ❌        | 🚧               |
| OpenRouter | ✅   | ✅        | ✅           | ❌         | ❌        | 🚧               |
| Voyage     | ❌   | ❌        | ❌           | ✅         | ❌        | ❌               |
| Azure      | 🚧   | 🚧        | 🚧           | 🚧         | ❌        | 🚧               |
| Bedrock    | 🚧   | 🚧        | 🚧           | 🚧         | ❌        | 🚧               |
| Gemini     | ✅   | ✅        | ✅           | ❌         | 🚧        | ❌               |
| DeepSeek   | ✅   | ✅        | ✅           | ❌         | 🚧        | ❌               |
| Perplexity | ✅   | ✅        | ❌           | ❌         | 🚧        | ❌               |

## Installation

```bash
npm install abso-ai
```

## Usage

```ts
import { abso } from "abso-ai"

const result = await abso.chat.completions.create({
  messages: [{ role: "user", content: "Say this is a test" }],
  model: "gpt-4o",
})

console.log(result.choices[0].message.content)
```

## Manually selecting a provider

Abso tries to infer the correct provider for a given model, but you can also manually select a provider.

```ts
const result = await abso.chat.completions.create({
  messages: [{ role: "user", content: "Say this is a test" }],
  model: "openai/gpt-4o",
  provider: "openrouter",
})

console.log(result.choices[0].message.content)
```

## Streaming

```ts
const stream = await abso.chat.completions.create({
  messages: [{ role: "user", content: "Say this is a test" }],
  model: "gpt-4o",
  stream: true,
})

for await (const chunk of stream) {
  console.log(chunk)
}

// Helper to get the final result
const fullResult = await stream.finalChatCompletion()

console.log(fullResult)
```

## Embeddings

```ts
const embeddings = await abso.embeddings.create({
  model: "text-embedding-3-small",
  input: ["A cat was playing with a ball on the floor"],
})

console.log(embeddings.data[0].embedding)
```

## Tokenizers (soon)

```ts
const tokens = await abso.chat.tokenize({
  messages: [{ role: "user", content: "Hello, world!" }],
  model: "gpt-4o",
})

console.log(`${tokens.count} tokens`)
```

## Custom Providers

You can also configure built-in providers directly by passing a configuration object with provider names as keys when instantiating Abso:

```ts
import { Abso } from "abso-ai"

const abso = new Abso({
  openai: { apiKey: "your-openai-key" },
  anthropic: { apiKey: "your-anthropic-key" },
  // add other providers as needed
})

const result = await abso.chat.completions.create({
  model: "gpt-4o",
  messages: [{ role: "user", content: "Hello!" }],
})

console.log(result.choices[0].message.content)
```

Alternatively, you can also change the providers that are loaded by passing a custom `providers` array to the constructor.

## Observability

You can use Abso with [Lunary](https://lunary.ai) to get instant observability into your LLM usage.

First signup to [Lunary](https://lunary.ai) and get your public key.

Then simply set the `LUNARY_PUBLIC_KEY` environment variable to your public key to enable observability.

## Contributing

See our [Contributing Guide](CONTRIBUTING.md).

## Roadmap

- [ ] More providers
- [ ] Built in caching
- [ ] Tokenizers
- [ ] Cost calculation
- [ ] Smart routing
