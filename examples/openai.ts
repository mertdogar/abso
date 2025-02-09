import { abso } from "../src"

const stream = await abso.chat.stream({
  model: "gpt-4o",

  messages: [{ role: "user", content: "Hello, world!" }],
})

for await (const chunk of stream) {
  console.log(chunk)
}
