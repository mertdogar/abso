<img src="https://i.ibb.co/d4wWFcr4/vincelwt-Banner-for-an-SDK-library-called-Abso-Large-centered-4be96c63-74cc-46f9-b216-8de378cf9a2a.png" alt="vincelwt-Banner-for-an-SDK-library-called-Abso-Large-centered-4be96c63-74cc-46f9-b216-8de378cf9a2a" border="0">

A TypeScript framework that unifies LLM calls under an OpenAI-compatible interface.

**Abso** makes calling various Large Language Models—OpenAI, Anthropic, Bedrock, Azure, and more—**simple, typed, and extensible**. It provides a unified interface while maintaining full type safety and streaming capabilities.

## Features

- 🔁 **OpenAI-compatible API** across multiple LLM providers
- 🚀 **Lightweight & Fast**: no overhead
- 🔍 **TypeScript-first**: strongly typed methods, requests, and responses
- 📦 **Streaming support** via both events and async iteration
- 🛠️ **Easy extensibility**: add new providers with minimal fuss
- 🧮 **Embeddings support** for semantic search and text analysis
- 🔢 **Tokenizer support** for accurate token counting and cost estimation

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
| Gemini     | 🚧   | 🚧        | 🚧           | 🚧         | 🚧        | 🚧               |

## Installation

```bash
npm install abso
```

## Usage

```ts
import { abso } from "abso";

const result = await abso.chat.create({
  messages: [{ role: "user", content: "Say this is a test" }],
  model: "gpt-4o",
});

console.log(result.choices[0].message.content);
```

## Manually selecting a provider

Abso tries to infer the best provider for a given model, but you can also manually select a provider.

```ts
const result = await abso.chat.create({
  messages: [{ role: "user", content: "Say this is a test" }],
  model: "openai/gpt-4o",
  provider: "openrouter",
});

console.log(result.choices[0].message.content);
```

## Streaming

```ts
const stream = await abso.chat.stream({
  messages: [{ role: "user", content: "Say this is a test" }],
  model: "gpt-4o",
});

for await (const chunk of stream) {
  console.log(chunk);
}
```

## Tokenizers (soon)

```ts
const tokens = await abso.tokenize({
  messages: [{ role: "user", content: "Hello, world!" }],
  model: "gpt-4o",
});

console.log(`${tokens.count} tokens`);
```

## Custom Providers

```ts
import { Abso } from "abso";
import { MyCustomProvider } from "./myCustomProvider";

const abso = new Abso([]);
abso.registerProvider(new MyCustomProvider(/* config */));

const result = await abso.chat.create({
  model: "my-custom-model",
  messages: [{ role: "user", content: "Hello!" }],
});
```

## Observability

Abso integrates seamlessly with [Lunary](https://lunary.ai) for powerful observability and monitoring capabilities. This allows you to:

- Track usage and costs across all LLM providers
- Monitor performance and latency
- Debug failed requests
- Analyze prompt engineering effectiveness
- Get insights into token usage

To get started:

1. Create a free account at [Lunary](https://lunary.ai)
2. Get your project's public key from the Lunary dashboard
3. Add it to your environment:

```bash
LUNARY_PUBLIC_KEY=your_public_key
```

## Roadmap

- [ ] More providers
- [ ] Built in caching
- [ ] Tokenizer logic
- [ ] Cost calculation
