import { ChatCompletionCreateParams as ChatCompletionCreateParams$1, ChatCompletionChunk, ChatCompletion } from 'openai/resources/chat/completions';
export { ChatCompletion, ChatCompletionChunk, ChatCompletionMessage } from 'openai/resources/chat/completions';
export { CompletionUsage } from 'openai/resources/completions';
import { EmbeddingCreateParams as EmbeddingCreateParams$1, CreateEmbeddingResponse } from 'openai/resources/embeddings';
export { CreateEmbeddingResponse } from 'openai/resources/embeddings';

type ChatCompletionCreateParams = ChatCompletionCreateParams$1 & {
    provider?: string;
    tags?: string[];
    userId?: string;
    userProps?: Record<string, any>;
};
type EmbeddingCreateParams = EmbeddingCreateParams$1 & {
    provider?: string;
};

interface ChatCompletionStream extends AsyncIterable<ChatCompletionChunk> {
    controller: AbortController;
    abort: () => void;
    finalChatCompletion: () => Promise<ChatCompletion>;
}
interface ProviderChatCompletionStream extends AsyncIterable<ChatCompletionChunk> {
    controller: AbortController;
}
/**
 * Our provider interface. Each provider maps from a ChatCompletionRequest
 * to a ChatCompletion or ChatCompletionStream, but always in terms of
 * "OpenAI-compatible" types.
 */
interface IProvider {
    name: string;
    matchesModel(model: string): boolean;
    /**
     * Validates the provider's configuration.
     * Throws an error if the configuration is invalid.
     */
    validateConfig?(): void;
    /**
     * Sanitizes a request before it is sent to the provider.
     */
    sanitizeRequest?(request: ChatCompletionCreateParams): ChatCompletionCreateParams;
    createCompletion?(request: ChatCompletionCreateParams): Promise<ChatCompletion>;
    /**
     * Takes a ChatCompletionRequest (potentially with `stream: true`) plus a
     * streaming class. Returns an object that implements ChatCompletionStream.
     */
    createCompletionStream?(request: ChatCompletionCreateParams): Promise<ProviderChatCompletionStream>;
    embed?(request: EmbeddingCreateParams): Promise<CreateEmbeddingResponse>;
    tokenize?(request: ChatCompletionCreateParams): Promise<{
        count: number;
        tokens: number[];
    }>;
}
interface AbsoCallback {
    onChatStart(id: string, request: ChatCompletionCreateParams): void;
    onChatEnd(id: string, result: ChatCompletion | string): void;
    onChatError(id: string, error: Error): void;
}
interface AbsoOptions {
    providers?: IProvider[];
    callbacks?: AbsoCallback[];
    [key: string]: any;
}

export type { AbsoCallback, AbsoOptions, ChatCompletionCreateParams, ChatCompletionStream, EmbeddingCreateParams, IProvider, ProviderChatCompletionStream };
