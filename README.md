# abso

TypeScript framework for LLMs.

**Abso** is a TypeScript library that **unifies calls** under an OpenAI-compatible style interface.

It aims to make calling various Large Language Models—OpenAI, Anthropic, Bedrock, Azure, and more—**simple, typed, and extensible**.

## Features

- **OpenAI-compatible API** across multiple LLM providers
- **TypeScript-first**: strongly typed methods, requests, and responses
- **Streaming support** via both events and async iteration
- **Easy extensibility**: add new providers with minimal fuss

## Providers

| Provider | Chat | Streaming | Tool Calling | Embeddings | Tokenizer | Cost Calculation |
| -------- | ---- | --------- | ------------ | ---------- | --------- | ---------------- |
| OpenAI   | ✅   | ✅        | ✅           | 🚧         | 🚧        | 🚧               |

## Installation

```bash
npm install abso
```

## Usage

```ts
import { abso } from "abso";

const chatCompletion = await abso.chat.create({
  messages: [{ role: "user", content: "Say this is a test" }],
  model: "gpt-4o",
});

console.log(chatCompletion.choices[0].message.content);
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

## Tokenizers

```ts
const tokenizer = await abso.tokenize({
  messages: [{ role: "user", content: "Hello, world!" }],
  model: "gpt-4o",
});

console.log(tokenizer.tokens);
```

## Roadmap

- [ ] More providers
- [ ] Embeddings support
- [ ] Tokenizer logic
- [ ] Cost calculation

## Custom Providers

```ts
import { Abso } from "abso";
import { MyCoolProvider } from "./myCoolProvider";

const abso = new Abso([]);
abso.registerProvider(new MyCoolProvider(/* config */));

const result = await abso.chat.create({
  model: "my-cool-model",
  messages: [{ role: "user", content: "Hello!" }],
});
```
