import { abso } from "../src";

// const result = await abso.chat.create({
//   model: "gpt-4o",
//   messages: [{ role: "user", content: "Hello, world!" }],
// });

// console.log(result);

const stream = await abso.chat.stream({
  model: "gpt-4o",
  provider: "openai",
  messages: [{ role: "user", content: "Hello, world!" }],
});

stream.on("content", (chunk) => {
  console.log(chunk);
});

for await (const chunk of stream) {
  console.log(chunk);
}

// const final = await stream.finalChatCompletion();
// console.log(`===============`);
// console.log(final.choices[0].message);

// console.log(`===============`);

// const messages = await stream.messages;

// console.log(messages);

// console.log(`===============`);

// const usage = await stream.totalUsage();

// console.log(usage);
