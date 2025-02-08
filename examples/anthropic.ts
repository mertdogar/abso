import { abso } from "../src";

const result = await abso.chat.create({
  model: "claude-3-5-sonnet-latest",
  messages: [
    {
      role: "system",
      content: "You speak like a pirate.",
    },
    {
      role: "user",
      content: "What is the population in San Francisco? Reply with a JSON.",
    },
  ],
  response_format: { type: "json_object" },
});

console.log(result.choices[0].message);

// const stream = await abso.chat.stream({
//   model: "gpt-4o",
//   messages: [{ role: "user", content: "Hello, world!" }],
// });

// stream.on("content", (chunk) => {
//   console.log(chunk);
// });

// for await (const chunk of stream) {
//   console.log(chunk);
// }

// const final = await stream.finalChatCompletion();
// console.log(`===============`);
// console.log(final.choices[0].message);

// console.log(`===============`);

// const messages = await stream.messages;

// console.log(messages);

// console.log(`===============`);

// const usage = await stream.totalUsage();

// console.log(usage);
