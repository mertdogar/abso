<div align="center">

<p align="center">
  <img src="https://github.com/user-attachments/assets/cfec6d10-7e1e-4412-bd4b-edb3df45fe99" alt="Abso banner" width=1040 />
</p>

**TypeScript LLM client**

[![npm version](https://badge.fury.io/js/abso-ai.svg)](https://badge.fury.io/js/abso-ai) ![GitHub last commit (by committer)](https://img.shields.io/github/last-commit/lunary-ai/abso) ![GitHub commit activity (branch)](https://img.shields.io/github/commit-activity/w/lunary-ai/abso)

**Abso** provides a unified interface for calling various LLMs while maintaining full type safety.

</div>

## Features

- **OpenAI-compatible API 🔁**
- **Lightweight & Fast ⚡**
- **Embeddings support 🧮**
- **Unified tool calling 🛠️**
- **Tokenizer and cost calculation (soon) 🔢** for accurate token counting and cost estimation
- **Smart routing (soon)** to the best model for your request

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
import { abso } from "abso-ai"

const result = await abso.chat.create({
  messages: [{ role: "user", content: "Say this is a test" }],
  model: "gpt-4o",
})

console.log(result.choices[0].message.content)
```

## Manually selecting a provider

Abso tries to infer the best provider for a given model, but you can also manually select a provider.

```ts
const result = await abso.chat.create({
  messages: [{ role: "user", content: "Say this is a test" }],
  model: "openai/gpt-4o",
  provider: "openrouter",
})

console.log(result.choices[0].message.content)
```

## Streaming

```ts
const stream = await abso.chat.stream({
  messages: [{ role: "user", content: "Say this is a test" }],
  model: "gpt-4o",
})

for await (const chunk of stream) {
  console.log(chunk)
}
```

## Embeddings

```ts
const embeddings = await abso.embed({
  model: "text-embedding-3-small",
  input: ["A cat was playing with a ball on the floor"],
})

console.log(embeddings.data[0].embedding)
```

## Tokenizers (soon)

```ts
const tokens = await abso.tokenize({
  messages: [{ role: "user", content: "Hello, world!" }],
  model: "gpt-4o",
})

console.log(`${tokens.count} tokens`)
```

## Custom Providers

```ts
import { Abso } from "abso"
import { MyCustomProvider } from "./myCustomProvider"

const abso = new Abso([])
abso.registerProvider(new MyCustomProvider(/* config */))

const result = await abso.chat.create({
  model: "my-custom-model",
  messages: [{ role: "user", content: "Hello!" }],
})
```

## Ollama

```ts
import { abso } from "abso-ai"

const result = await abso.chat.create({
  messages: [{ role: "user", content: "Hi, what's up?" }],
  model: "llama3.2",
  provider: "ollama",
})

console.log(result.choices[0].message.content)
```

## Contributing

See our [Contributing Guide](CONTRIBUTING.md).

## Roadmap

- [ ] More providers
- [ ] Built in caching
- [ ] Tokenizers
- [ ] Cost calculation
- [ ] Smart routing
