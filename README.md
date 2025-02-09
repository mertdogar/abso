<p align=center>
  <img src="https://github.com/user-attachments/assets/cfec6d10-7e1e-4412-bd4b-edb3df45fe99" alt="Abso banner" width=1040 />
</p>

**Abso** makes calling various LLMs—**simple, typed, and extensible**. It provides a unified interface while maintaining full type safety and streaming capabilities.

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
| Gemini     | ✅   | ✅        | ✅           | ❌         | ❌        | ❌               |

## Installation

```bash
npm install abso-ai
```

## Usage

```ts
import { abso } from "abso-ai";

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

## Contributing

See our [Contributing Guide](CONTRIBUTING.md).

## Roadmap

- [ ] More providers
- [ ] Built in caching
- [ ] Tokenizers
- [ ] Cost calculation
