import { abso } from "../src"

const stream = await abso.chat.stream({
  model: "gpt-4o",

  messages: [{ role: "user", content: "Hello, world!" }],
})

for await (const chunk of stream) {
  console.log(chunk)
}

const embeddings = await abso.embed({
  model: "text-embedding-3-small",
  input: ["A cat was playing with a ball on the floor"],
})

console.log(embeddings.data[0].embedding)
