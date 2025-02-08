import { abso } from "../src";

const result = await abso.chat.create({
  model: "claude-3-5-sonnet-latest",
  messages: [
    {
      role: "user",
      content: "What is the weather in San Francisco?",
    },
  ],
  tools: [
    {
      type: "function",
      function: {
        name: "get_weather_forecast",
        description: "Get the weather forecast for a specific location.",
        parameters: {
          type: "object",
          properties: {
            city: {
              type: "string",
              description:
                "The city for which to get the weather forecast. Example: 'San Francisco'.",
            },
          },
          required: ["city"],
        },
      },
    },
  ],
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
