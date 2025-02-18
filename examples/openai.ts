import { abso } from "../src"

const stream = await abso.chat.completions.create({
  model: "gpt-4o",
  tags: ["test"],
  stream: true,
  messages: [{ role: "user", content: "Hello! Tell me something fun." }],
})

for await (const chunk of stream) {
  console.log(chunk.choices[0].delta.content)
}

const fullResult = await stream.finalChatCompletion()

console.log(fullResult)

// const embeddings = await abso.embed({
//   model: "text-embedding-3-small",
//   input: ["A cat was playing with a ball on the floor"],
// })

// console.log(embeddings.data[0].embedding)
