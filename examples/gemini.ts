import { abso } from "../src"

const stream = await abso.chat.stream({
  model: "gemini-1.5-flash",
  // provider: "xai",
  messages: [{ role: "user", content: "How are you?" }],
})

for await (const chunk of stream) {
  console.log(chunk.choices[0].delta.content)
}
