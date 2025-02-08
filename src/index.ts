import { Abso } from "./abso";
import { OpenAIProvider } from "./providers/openai";
import { IProvider } from "./types";

// You can construct a default instance of Abso here, pre-registered
// with certain providers (like OpenAI). The user can also construct
// their own instance if they want a custom set of providers.

const defaultProviders: IProvider[] = [
  new OpenAIProvider({
    apiKey: process.env.OPENAI_API_KEY || "",
  }),
];

export const abso = new Abso(defaultProviders);

// Re-export any useful types and classes
export * from "./abso";
export * from "./types";
export * from "./providers/openai";
