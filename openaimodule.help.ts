
================================================
File: src/index.ts
================================================
// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { type Agent, type RequestInit } from './_shims/index';
import * as qs from './internal/qs';
import * as Core from './core';
import * as Errors from './error';
import * as Pagination from './pagination';
import { type CursorPageParams, CursorPageResponse, PageResponse } from './pagination';
import * as Uploads from './uploads';
import * as API from './resources/index';
import {
  Batch,
  BatchCreateParams,
  BatchError,
  BatchListParams,
  BatchRequestCounts,
  Batches,
  BatchesPage,
} from './resources/batches';
import {
  Completion,
  CompletionChoice,
  CompletionCreateParams,
  CompletionCreateParamsNonStreaming,
  CompletionCreateParamsStreaming,
  CompletionUsage,
  Completions,
} from './resources/completions';
import {
  CreateEmbeddingResponse,
  Embedding,
  EmbeddingCreateParams,
  EmbeddingModel,
  Embeddings,
} from './resources/embeddings';
import {
  FileContent,
  FileCreateParams,
  FileDeleted,
  FileListParams,
  FileObject,
  FileObjectsPage,
  FilePurpose,
  Files,
} from './resources/files';
import {
  Image,
  ImageCreateVariationParams,
  ImageEditParams,
  ImageGenerateParams,
  ImageModel,
  Images,
  ImagesResponse,
} from './resources/images';
import { Model, ModelDeleted, Models, ModelsPage } from './resources/models';
import {
  Moderation,
  ModerationCreateParams,
  ModerationCreateResponse,
  ModerationImageURLInput,
  ModerationModel,
  ModerationMultiModalInput,
  ModerationTextInput,
  Moderations,
} from './resources/moderations';
import { Audio, AudioModel, AudioResponseFormat } from './resources/audio/audio';
import { Beta } from './resources/beta/beta';
import { Chat, ChatModel } from './resources/chat/chat';
import {
  ChatCompletion,
  ChatCompletionAssistantMessageParam,
  ChatCompletionAudio,
  ChatCompletionAudioParam,
  ChatCompletionChunk,
  ChatCompletionContentPart,
  ChatCompletionContentPartImage,
  ChatCompletionContentPartInputAudio,
  ChatCompletionContentPartRefusal,
  ChatCompletionContentPartText,
  ChatCompletionCreateParams,
  ChatCompletionCreateParamsNonStreaming,
  ChatCompletionCreateParamsStreaming,
  ChatCompletionDeveloperMessageParam,
  ChatCompletionFunctionCallOption,
  ChatCompletionFunctionMessageParam,
  ChatCompletionMessage,
  ChatCompletionMessageParam,
  ChatCompletionMessageToolCall,
  ChatCompletionModality,
  ChatCompletionNamedToolChoice,
  ChatCompletionPredictionContent,
  ChatCompletionReasoningEffort,
  ChatCompletionRole,
  ChatCompletionStreamOptions,
  ChatCompletionSystemMessageParam,
  ChatCompletionTokenLogprob,
  ChatCompletionTool,
  ChatCompletionToolChoiceOption,
  ChatCompletionToolMessageParam,
  ChatCompletionUserMessageParam,
} from './resources/chat/completions';
import { FineTuning } from './resources/fine-tuning/fine-tuning';
import {
  Upload,
  UploadCompleteParams,
  UploadCreateParams,
  Uploads as UploadsAPIUploads,
} from './resources/uploads/uploads';

export interface ClientOptions {
  /**
   * Defaults to process.env['OPENAI_API_KEY'].
   */
  apiKey?: string | undefined;

  /**
   * Defaults to process.env['OPENAI_ORG_ID'].
   */
  organization?: string | null | undefined;

  /**
   * Defaults to process.env['OPENAI_PROJECT_ID'].
   */
  project?: string | null | undefined;

  /**
   * Override the default base URL for the API, e.g., "https://api.example.com/v2/"
   *
   * Defaults to process.env['OPENAI_BASE_URL'].
   */
  baseURL?: string | null | undefined;

  /**
   * The maximum amount of time (in milliseconds) that the client should wait for a response
   * from the server before timing out a single request.
   *
   * Note that request timeouts are retried by default, so in a worst-case scenario you may wait
   * much longer than this timeout before the promise succeeds or fails.
   */
  timeout?: number | undefined;

  /**
   * An HTTP agent used to manage HTTP(S) connections.
   *
   * If not provided, an agent will be constructed by default in the Node.js environment,
   * otherwise no agent is used.
   */
  httpAgent?: Agent | undefined;

  /**
   * Specify a custom `fetch` function implementation.
   *
   * If not provided, we use `node-fetch` on Node.js and otherwise expect that `fetch` is
   * defined globally.
   */
  fetch?: Core.Fetch | undefined;

  /**
   * The maximum number of times that the client will retry a request in case of a
   * temporary failure, like a network error or a 5XX error from the server.
   *
   * @default 2
   */
  maxRetries?: number | undefined;

  /**
   * Default headers to include with every request to the API.
   *
   * These can be removed in individual requests by explicitly setting the
   * header to `undefined` or `null` in request options.
   */
  defaultHeaders?: Core.Headers | undefined;

  /**
   * Default query parameters to include with every request to the API.
   *
   * These can be removed in individual requests by explicitly setting the
   * param to `undefined` in request options.
   */
  defaultQuery?: Core.DefaultQuery | undefined;

  /**
   * By default, client-side use of this library is not allowed, as it risks exposing your secret API credentials to attackers.
   * Only set this option to `true` if you understand the risks and have appropriate mitigations in place.
   */
  dangerouslyAllowBrowser?: boolean | undefined;
}

/**
 * API Client for interfacing with the OpenAI API.
 */
export class OpenAI extends Core.APIClient {
  apiKey: string;
  organization: string | null;
  project: string | null;

  private _options: ClientOptions;

  /**
   * API Client for interfacing with the OpenAI API.
   *
   * @param {string | undefined} [opts.apiKey=process.env['OPENAI_API_KEY'] ?? undefined]
   * @param {string | null | undefined} [opts.organization=process.env['OPENAI_ORG_ID'] ?? null]
   * @param {string | null | undefined} [opts.project=process.env['OPENAI_PROJECT_ID'] ?? null]
   * @param {string} [opts.baseURL=process.env['OPENAI_BASE_URL'] ?? https://api.openai.com/v1] - Override the default base URL for the API.
   * @param {number} [opts.timeout=10 minutes] - The maximum amount of time (in milliseconds) the client will wait for a response before timing out.
   * @param {number} [opts.httpAgent] - An HTTP agent used to manage HTTP(s) connections.
   * @param {Core.Fetch} [opts.fetch] - Specify a custom `fetch` function implementation.
   * @param {number} [opts.maxRetries=2] - The maximum number of times the client will retry a request.
   * @param {Core.Headers} opts.defaultHeaders - Default headers to include with every request to the API.
   * @param {Core.DefaultQuery} opts.defaultQuery - Default query parameters to include with every request to the API.
   * @param {boolean} [opts.dangerouslyAllowBrowser=false] - By default, client-side use of this library is not allowed, as it risks exposing your secret API credentials to attackers.
   */
  constructor({
    baseURL = Core.readEnv('OPENAI_BASE_URL'),
    apiKey = Core.readEnv('OPENAI_API_KEY'),
    organization = Core.readEnv('OPENAI_ORG_ID') ?? null,
    project = Core.readEnv('OPENAI_PROJECT_ID') ?? null,
    ...opts
  }: ClientOptions = {}) {
    if (apiKey === undefined) {
      throw new Errors.OpenAIError(
        "The OPENAI_API_KEY environment variable is missing or empty; either provide it, or instantiate the OpenAI client with an apiKey option, like new OpenAI({ apiKey: 'My API Key' }).",
      );
    }

    const options: ClientOptions = {
      apiKey,
      organization,
      project,
      ...opts,
      baseURL: baseURL || `https://api.openai.com/v1`,
    };

    if (!options.dangerouslyAllowBrowser && Core.isRunningInBrowser()) {
      throw new Errors.OpenAIError(
        "It looks like you're running in a browser-like environment.\n\nThis is disabled by default, as it risks exposing your secret API credentials to attackers.\nIf you understand the risks and have appropriate mitigations in place,\nyou can set the `dangerouslyAllowBrowser` option to `true`, e.g.,\n\nnew OpenAI({ apiKey, dangerouslyAllowBrowser: true });\n\nhttps://help.openai.com/en/articles/5112595-best-practices-for-api-key-safety\n",
      );
    }

    super({
      baseURL: options.baseURL!,
      timeout: options.timeout ?? 600000 /* 10 minutes */,
      httpAgent: options.httpAgent,
      maxRetries: options.maxRetries,
      fetch: options.fetch,
    });

    this._options = options;

    this.apiKey = apiKey;
    this.organization = organization;
    this.project = project;
  }

  completions: API.Completions = new API.Completions(this);
  chat: API.Chat = new API.Chat(this);
  embeddings: API.Embeddings = new API.Embeddings(this);
  files: API.Files = new API.Files(this);
  images: API.Images = new API.Images(this);
  audio: API.Audio = new API.Audio(this);
  moderations: API.Moderations = new API.Moderations(this);
  models: API.Models = new API.Models(this);
  fineTuning: API.FineTuning = new API.FineTuning(this);
  beta: API.Beta = new API.Beta(this);
  batches: API.Batches = new API.Batches(this);
  uploads: API.Uploads = new API.Uploads(this);

  protected override defaultQuery(): Core.DefaultQuery | undefined {
    return this._options.defaultQuery;
  }

  protected override defaultHeaders(opts: Core.FinalRequestOptions): Core.Headers {
    return {
      ...super.defaultHeaders(opts),
      'OpenAI-Organization': this.organization,
      'OpenAI-Project': this.project,
      ...this._options.defaultHeaders,
    };
  }

  protected override authHeaders(opts: Core.FinalRequestOptions): Core.Headers {
    return { Authorization: `Bearer ${this.apiKey}` };
  }

  protected override stringifyQuery(query: Record<string, unknown>): string {
    return qs.stringify(query, { arrayFormat: 'brackets' });
  }

  static OpenAI = this;
  static DEFAULT_TIMEOUT = 600000; // 10 minutes

  static OpenAIError = Errors.OpenAIError;
  static APIError = Errors.APIError;
  static APIConnectionError = Errors.APIConnectionError;
  static APIConnectionTimeoutError = Errors.APIConnectionTimeoutError;
  static APIUserAbortError = Errors.APIUserAbortError;
  static NotFoundError = Errors.NotFoundError;
  static ConflictError = Errors.ConflictError;
  static RateLimitError = Errors.RateLimitError;
  static BadRequestError = Errors.BadRequestError;
  static AuthenticationError = Errors.AuthenticationError;
  static InternalServerError = Errors.InternalServerError;
  static PermissionDeniedError = Errors.PermissionDeniedError;
  static UnprocessableEntityError = Errors.UnprocessableEntityError;

  static toFile = Uploads.toFile;
  static fileFromPath = Uploads.fileFromPath;
}

OpenAI.Completions = Completions;
OpenAI.Chat = Chat;
OpenAI.Embeddings = Embeddings;
OpenAI.Files = Files;
OpenAI.FileObjectsPage = FileObjectsPage;
OpenAI.Images = Images;
OpenAI.Audio = Audio;
OpenAI.Moderations = Moderations;
OpenAI.Models = Models;
OpenAI.ModelsPage = ModelsPage;
OpenAI.FineTuning = FineTuning;
OpenAI.Beta = Beta;
OpenAI.Batches = Batches;
OpenAI.BatchesPage = BatchesPage;
OpenAI.Uploads = UploadsAPIUploads;
export declare namespace OpenAI {
  export type RequestOptions = Core.RequestOptions;

  export import Page = Pagination.Page;
  export { type PageResponse as PageResponse };

  export import CursorPage = Pagination.CursorPage;
  export { type CursorPageParams as CursorPageParams, type CursorPageResponse as CursorPageResponse };

  export {
    Completions as Completions,
    type Completion as Completion,
    type CompletionChoice as CompletionChoice,
    type CompletionUsage as CompletionUsage,
    type CompletionCreateParams as CompletionCreateParams,
    type CompletionCreateParamsNonStreaming as CompletionCreateParamsNonStreaming,
    type CompletionCreateParamsStreaming as CompletionCreateParamsStreaming,
  };

  export {
    Chat as Chat,
    type ChatModel as ChatModel,
    type ChatCompletion as ChatCompletion,
    type ChatCompletionAssistantMessageParam as ChatCompletionAssistantMessageParam,
    type ChatCompletionAudio as ChatCompletionAudio,
    type ChatCompletionAudioParam as ChatCompletionAudioParam,
    type ChatCompletionChunk as ChatCompletionChunk,
    type ChatCompletionContentPart as ChatCompletionContentPart,
    type ChatCompletionContentPartImage as ChatCompletionContentPartImage,
    type ChatCompletionContentPartInputAudio as ChatCompletionContentPartInputAudio,
    type ChatCompletionContentPartRefusal as ChatCompletionContentPartRefusal,
    type ChatCompletionContentPartText as ChatCompletionContentPartText,
    type ChatCompletionDeveloperMessageParam as ChatCompletionDeveloperMessageParam,
    type ChatCompletionFunctionCallOption as ChatCompletionFunctionCallOption,
    type ChatCompletionFunctionMessageParam as ChatCompletionFunctionMessageParam,
    type ChatCompletionMessage as ChatCompletionMessage,
    type ChatCompletionMessageParam as ChatCompletionMessageParam,
    type ChatCompletionMessageToolCall as ChatCompletionMessageToolCall,
    type ChatCompletionModality as ChatCompletionModality,
    type ChatCompletionNamedToolChoice as ChatCompletionNamedToolChoice,
    type ChatCompletionPredictionContent as ChatCompletionPredictionContent,
    type ChatCompletionReasoningEffort as ChatCompletionReasoningEffort,
    type ChatCompletionRole as ChatCompletionRole,
    type ChatCompletionStreamOptions as ChatCompletionStreamOptions,
    type ChatCompletionSystemMessageParam as ChatCompletionSystemMessageParam,
    type ChatCompletionTokenLogprob as ChatCompletionTokenLogprob,
    type ChatCompletionTool as ChatCompletionTool,
    type ChatCompletionToolChoiceOption as ChatCompletionToolChoiceOption,
    type ChatCompletionToolMessageParam as ChatCompletionToolMessageParam,
    type ChatCompletionUserMessageParam as ChatCompletionUserMessageParam,
    type ChatCompletionCreateParams as ChatCompletionCreateParams,
    type ChatCompletionCreateParamsNonStreaming as ChatCompletionCreateParamsNonStreaming,
    type ChatCompletionCreateParamsStreaming as ChatCompletionCreateParamsStreaming,
  };

  export {
    Embeddings as Embeddings,
    type CreateEmbeddingResponse as CreateEmbeddingResponse,
    type Embedding as Embedding,
    type EmbeddingModel as EmbeddingModel,
    type EmbeddingCreateParams as EmbeddingCreateParams,
  };

  export {
    Files as Files,
    type FileContent as FileContent,
    type FileDeleted as FileDeleted,
    type FileObject as FileObject,
    type FilePurpose as FilePurpose,
    FileObjectsPage as FileObjectsPage,
    type FileCreateParams as FileCreateParams,
    type FileListParams as FileListParams,
  };

  export {
    Images as Images,
    type Image as Image,
    type ImageModel as ImageModel,
    type ImagesResponse as ImagesResponse,
    type ImageCreateVariationParams as ImageCreateVariationParams,
    type ImageEditParams as ImageEditParams,
    type ImageGenerateParams as ImageGenerateParams,
  };

  export { Audio as Audio, type AudioModel as AudioModel, type AudioResponseFormat as AudioResponseFormat };

  export {
    Moderations as Moderations,
    type Moderation as Moderation,
    type ModerationImageURLInput as ModerationImageURLInput,
    type ModerationModel as ModerationModel,
    type ModerationMultiModalInput as ModerationMultiModalInput,
    type ModerationTextInput as ModerationTextInput,
    type ModerationCreateResponse as ModerationCreateResponse,
    type ModerationCreateParams as ModerationCreateParams,
  };

  export {
    Models as Models,
    type Model as Model,
    type ModelDeleted as ModelDeleted,
    ModelsPage as ModelsPage,
  };

  export { FineTuning as FineTuning };

  export { Beta as Beta };

  export {
    Batches as Batches,
    type Batch as Batch,
    type BatchError as BatchError,
    type BatchRequestCounts as BatchRequestCounts,
    BatchesPage as BatchesPage,
    type BatchCreateParams as BatchCreateParams,
    type BatchListParams as BatchListParams,
  };

  export {
    UploadsAPIUploads as Uploads,
    type Upload as Upload,
    type UploadCreateParams as UploadCreateParams,
    type UploadCompleteParams as UploadCompleteParams,
  };

  export type ErrorObject = API.ErrorObject;
  export type FunctionDefinition = API.FunctionDefinition;
  export type FunctionParameters = API.FunctionParameters;
  export type Metadata = API.Metadata;
  export type ResponseFormatJSONObject = API.ResponseFormatJSONObject;
  export type ResponseFormatJSONSchema = API.ResponseFormatJSONSchema;
  export type ResponseFormatText = API.ResponseFormatText;
}

// ---------------------- Azure ----------------------

/** API Client for interfacing with the Azure OpenAI API. */
export interface AzureClientOptions extends ClientOptions {
  /**
   * Defaults to process.env['OPENAI_API_VERSION'].
   */
  apiVersion?: string | undefined;

  /**
   * Your Azure endpoint, including the resource, e.g. `https://example-resource.azure.openai.com/`
   */
  endpoint?: string | undefined;

  /**
   * A model deployment, if given, sets the base client URL to include `/deployments/{deployment}`.
   * Note: this means you won't be able to use non-deployment endpoints. Not supported with Assistants APIs.
   */
  deployment?: string | undefined;

  /**
   * Defaults to process.env['AZURE_OPENAI_API_KEY'].
   */
  apiKey?: string | undefined;

  /**
   * A function that returns an access token for Microsoft Entra (formerly known as Azure Active Directory),
   * which will be invoked on every request.
   */
  azureADTokenProvider?: (() => Promise<string>) | undefined;
}

/** API Client for interfacing with the Azure OpenAI API. */
export class AzureOpenAI extends OpenAI {
  private _azureADTokenProvider: (() => Promise<string>) | undefined;
  deploymentName: string | undefined;
  apiVersion: string = '';
  /**
   * API Client for interfacing with the Azure OpenAI API.
   *
   * @param {string | undefined} [opts.apiVersion=process.env['OPENAI_API_VERSION'] ?? undefined]
   * @param {string | undefined} [opts.endpoint=process.env['AZURE_OPENAI_ENDPOINT'] ?? undefined] - Your Azure endpoint, including the resource, e.g. `https://example-resource.azure.openai.com/`
   * @param {string | undefined} [opts.apiKey=process.env['AZURE_OPENAI_API_KEY'] ?? undefined]
   * @param {string | undefined} opts.deployment - A model deployment, if given, sets the base client URL to include `/deployments/{deployment}`.
   * @param {string | null | undefined} [opts.organization=process.env['OPENAI_ORG_ID'] ?? null]
   * @param {string} [opts.baseURL=process.env['OPENAI_BASE_URL']] - Sets the base URL for the API, e.g. `https://example-resource.azure.openai.com/openai/`.
   * @param {number} [opts.timeout=10 minutes] - The maximum amount of time (in milliseconds) the client will wait for a response before timing out.
   * @param {number} [opts.httpAgent] - An HTTP agent used to manage HTTP(s) connections.
   * @param {Core.Fetch} [opts.fetch] - Specify a custom `fetch` function implementation.
   * @param {number} [opts.maxRetries=2] - The maximum number of times the client will retry a request.
   * @param {Core.Headers} opts.defaultHeaders - Default headers to include with every request to the API.
   * @param {Core.DefaultQuery} opts.defaultQuery - Default query parameters to include with every request to the API.
   * @param {boolean} [opts.dangerouslyAllowBrowser=false] - By default, client-side use of this library is not allowed, as it risks exposing your secret API credentials to attackers.
   */
  constructor({
    baseURL = Core.readEnv('OPENAI_BASE_URL'),
    apiKey = Core.readEnv('AZURE_OPENAI_API_KEY'),
    apiVersion = Core.readEnv('OPENAI_API_VERSION'),
    endpoint,
    deployment,
    azureADTokenProvider,
    dangerouslyAllowBrowser,
    ...opts
  }: AzureClientOptions = {}) {
    if (!apiVersion) {
      throw new Errors.OpenAIError(
        "The OPENAI_API_VERSION environment variable is missing or empty; either provide it, or instantiate the AzureOpenAI client with an apiVersion option, like new AzureOpenAI({ apiVersion: 'My API Version' }).",
      );
    }

    if (typeof azureADTokenProvider === 'function') {
      dangerouslyAllowBrowser = true;
    }

    if (!azureADTokenProvider && !apiKey) {
      throw new Errors.OpenAIError(
        'Missing credentials. Please pass one of `apiKey` and `azureADTokenProvider`, or set the `AZURE_OPENAI_API_KEY` environment variable.',
      );
    }

    if (azureADTokenProvider && apiKey) {
      throw new Errors.OpenAIError(
        'The `apiKey` and `azureADTokenProvider` arguments are mutually exclusive; only one can be passed at a time.',
      );
    }

    // define a sentinel value to avoid any typing issues
    apiKey ??= API_KEY_SENTINEL;

    opts.defaultQuery = { ...opts.defaultQuery, 'api-version': apiVersion };

    if (!baseURL) {
      if (!endpoint) {
        endpoint = process.env['AZURE_OPENAI_ENDPOINT'];
      }

      if (!endpoint) {
        throw new Errors.OpenAIError(
          'Must provide one of the `baseURL` or `endpoint` arguments, or the `AZURE_OPENAI_ENDPOINT` environment variable',
        );
      }

      baseURL = `${endpoint}/openai`;
    } else {
      if (endpoint) {
        throw new Errors.OpenAIError('baseURL and endpoint are mutually exclusive');
      }
    }

    super({
      apiKey,
      baseURL,
      ...opts,
      ...(dangerouslyAllowBrowser !== undefined ? { dangerouslyAllowBrowser } : {}),
    });

    this._azureADTokenProvider = azureADTokenProvider;
    this.apiVersion = apiVersion;
    this.deploymentName = deployment;
  }

  override buildRequest(
    options: Core.FinalRequestOptions<unknown>,
    props: { retryCount?: number } = {},
  ): {
    req: RequestInit;
    url: string;
    timeout: number;
  } {
    if (_deployments_endpoints.has(options.path) && options.method === 'post' && options.body !== undefined) {
      if (!Core.isObj(options.body)) {
        throw new Error('Expected request body to be an object');
      }
      const model = this.deploymentName || options.body['model'] || options.__metadata?.['model'];
      if (model !== undefined && !this.baseURL.includes('/deployments')) {
        options.path = `/deployments/${model}${options.path}`;
      }
    }
    return super.buildRequest(options, props);
  }

  async _getAzureADToken(): Promise<string | undefined> {
    if (typeof this._azureADTokenProvider === 'function') {
      const token = await this._azureADTokenProvider();
      if (!token || typeof token !== 'string') {
        throw new Errors.OpenAIError(
          `Expected 'azureADTokenProvider' argument to return a string but it returned ${token}`,
        );
      }
      return token;
    }
    return undefined;
  }

  protected override authHeaders(opts: Core.FinalRequestOptions): Core.Headers {
    return {};
  }

  protected override async prepareOptions(opts: Core.FinalRequestOptions<unknown>): Promise<void> {
    /**
     * The user should provide a bearer token provider if they want
     * to use Azure AD authentication. The user shouldn't set the
     * Authorization header manually because the header is overwritten
     * with the Azure AD token if a bearer token provider is provided.
     */
    if (opts.headers?.['api-key']) {
      return super.prepareOptions(opts);
    }
    const token = await this._getAzureADToken();
    opts.headers ??= {};
    if (token) {
      opts.headers['Authorization'] = `Bearer ${token}`;
    } else if (this.apiKey !== API_KEY_SENTINEL) {
      opts.headers['api-key'] = this.apiKey;
    } else {
      throw new Errors.OpenAIError('Unable to handle auth');
    }
    return super.prepareOptions(opts);
  }
}

const _deployments_endpoints = new Set([
  '/completions',
  '/chat/completions',
  '/embeddings',
  '/audio/transcriptions',
  '/audio/translations',
  '/audio/speech',
  '/images/generations',
]);

const API_KEY_SENTINEL = '<Missing Key>';

// ---------------------- End Azure ----------------------

export { toFile, fileFromPath } from './uploads';
export {
  OpenAIError,
  APIError,
  APIConnectionError,
  APIConnectionTimeoutError,
  APIUserAbortError,
  NotFoundError,
  ConflictError,
  RateLimitError,
  BadRequestError,
  AuthenticationError,
  InternalServerError,
  PermissionDeniedError,
  UnprocessableEntityError,
} from './error';

export default OpenAI;


================================================
File: src/streaming.ts
================================================
import { ReadableStream, type Response } from './_shims/index';
import { OpenAIError } from './error';
import { LineDecoder } from './internal/decoders/line';
import { ReadableStreamToAsyncIterable } from './internal/stream-utils';

import { APIError } from './error';

type Bytes = string | ArrayBuffer | Uint8Array | Buffer | null | undefined;

export type ServerSentEvent = {
  event: string | null;
  data: string;
  raw: string[];
};

export class Stream<Item> implements AsyncIterable<Item> {
  controller: AbortController;

  constructor(
    private iterator: () => AsyncIterator<Item>,
    controller: AbortController,
  ) {
    this.controller = controller;
  }

  static fromSSEResponse<Item>(response: Response, controller: AbortController): Stream<Item> {
    let consumed = false;

    async function* iterator(): AsyncIterator<Item, any, undefined> {
      if (consumed) {
        throw new Error('Cannot iterate over a consumed stream, use `.tee()` to split the stream.');
      }
      consumed = true;
      let done = false;
      try {
        for await (const sse of _iterSSEMessages(response, controller)) {
          if (done) continue;

          if (sse.data.startsWith('[DONE]')) {
            done = true;
            continue;
          }

          if (sse.event === null) {
            let data;

            try {
              data = JSON.parse(sse.data);
            } catch (e) {
              console.error(`Could not parse message into JSON:`, sse.data);
              console.error(`From chunk:`, sse.raw);
              throw e;
            }

            if (data && data.error) {
              throw new APIError(undefined, data.error, undefined, undefined);
            }

            yield data;
          } else {
            let data;
            try {
              data = JSON.parse(sse.data);
            } catch (e) {
              console.error(`Could not parse message into JSON:`, sse.data);
              console.error(`From chunk:`, sse.raw);
              throw e;
            }
            // TODO: Is this where the error should be thrown?
            if (sse.event == 'error') {
              throw new APIError(undefined, data.error, data.message, undefined);
            }
            yield { event: sse.event, data: data } as any;
          }
        }
        done = true;
      } catch (e) {
        // If the user calls `stream.controller.abort()`, we should exit without throwing.
        if (e instanceof Error && e.name === 'AbortError') return;
        throw e;
      } finally {
        // If the user `break`s, abort the ongoing request.
        if (!done) controller.abort();
      }
    }

    return new Stream(iterator, controller);
  }

  /**
   * Generates a Stream from a newline-separated ReadableStream
   * where each item is a JSON value.
   */
  static fromReadableStream<Item>(readableStream: ReadableStream, controller: AbortController): Stream<Item> {
    let consumed = false;

    async function* iterLines(): AsyncGenerator<string, void, unknown> {
      const lineDecoder = new LineDecoder();

      const iter = ReadableStreamToAsyncIterable<Bytes>(readableStream);
      for await (const chunk of iter) {
        for (const line of lineDecoder.decode(chunk)) {
          yield line;
        }
      }

      for (const line of lineDecoder.flush()) {
        yield line;
      }
    }

    async function* iterator(): AsyncIterator<Item, any, undefined> {
      if (consumed) {
        throw new Error('Cannot iterate over a consumed stream, use `.tee()` to split the stream.');
      }
      consumed = true;
      let done = false;
      try {
        for await (const line of iterLines()) {
          if (done) continue;
          if (line) yield JSON.parse(line);
        }
        done = true;
      } catch (e) {
        // If the user calls `stream.controller.abort()`, we should exit without throwing.
        if (e instanceof Error && e.name === 'AbortError') return;
        throw e;
      } finally {
        // If the user `break`s, abort the ongoing request.
        if (!done) controller.abort();
      }
    }

    return new Stream(iterator, controller);
  }

  [Symbol.asyncIterator](): AsyncIterator<Item> {
    return this.iterator();
  }

  /**
   * Splits the stream into two streams which can be
   * independently read from at different speeds.
   */
  tee(): [Stream<Item>, Stream<Item>] {
    const left: Array<Promise<IteratorResult<Item>>> = [];
    const right: Array<Promise<IteratorResult<Item>>> = [];
    const iterator = this.iterator();

    const teeIterator = (queue: Array<Promise<IteratorResult<Item>>>): AsyncIterator<Item> => {
      return {
        next: () => {
          if (queue.length === 0) {
            const result = iterator.next();
            left.push(result);
            right.push(result);
          }
          return queue.shift()!;
        },
      };
    };

    return [
      new Stream(() => teeIterator(left), this.controller),
      new Stream(() => teeIterator(right), this.controller),
    ];
  }

  /**
   * Converts this stream to a newline-separated ReadableStream of
   * JSON stringified values in the stream
   * which can be turned back into a Stream with `Stream.fromReadableStream()`.
   */
  toReadableStream(): ReadableStream {
    const self = this;
    let iter: AsyncIterator<Item>;
    const encoder = new TextEncoder();

    return new ReadableStream({
      async start() {
        iter = self[Symbol.asyncIterator]();
      },
      async pull(ctrl: any) {
        try {
          const { value, done } = await iter.next();
          if (done) return ctrl.close();

          const bytes = encoder.encode(JSON.stringify(value) + '\n');

          ctrl.enqueue(bytes);
        } catch (err) {
          ctrl.error(err);
        }
      },
      async cancel() {
        await iter.return?.();
      },
    });
  }
}

export async function* _iterSSEMessages(
  response: Response,
  controller: AbortController,
): AsyncGenerator<ServerSentEvent, void, unknown> {
  if (!response.body) {
    controller.abort();
    throw new OpenAIError(`Attempted to iterate over a response with no body`);
  }

  const sseDecoder = new SSEDecoder();
  const lineDecoder = new LineDecoder();

  const iter = ReadableStreamToAsyncIterable<Bytes>(response.body);
  for await (const sseChunk of iterSSEChunks(iter)) {
    for (const line of lineDecoder.decode(sseChunk)) {
      const sse = sseDecoder.decode(line);
      if (sse) yield sse;
    }
  }

  for (const line of lineDecoder.flush()) {
    const sse = sseDecoder.decode(line);
    if (sse) yield sse;
  }
}

/**
 * Given an async iterable iterator, iterates over it and yields full
 * SSE chunks, i.e. yields when a double new-line is encountered.
 */
async function* iterSSEChunks(iterator: AsyncIterableIterator<Bytes>): AsyncGenerator<Uint8Array> {
  let data = new Uint8Array();

  for await (const chunk of iterator) {
    if (chunk == null) {
      continue;
    }

    const binaryChunk =
      chunk instanceof ArrayBuffer ? new Uint8Array(chunk)
      : typeof chunk === 'string' ? new TextEncoder().encode(chunk)
      : chunk;

    let newData = new Uint8Array(data.length + binaryChunk.length);
    newData.set(data);
    newData.set(binaryChunk, data.length);
    data = newData;

    let patternIndex;
    while ((patternIndex = findDoubleNewlineIndex(data)) !== -1) {
      yield data.slice(0, patternIndex);
      data = data.slice(patternIndex);
    }
  }

  if (data.length > 0) {
    yield data;
  }
}

function findDoubleNewlineIndex(buffer: Uint8Array): number {
  // This function searches the buffer for the end patterns (\r\r, \n\n, \r\n\r\n)
  // and returns the index right after the first occurrence of any pattern,
  // or -1 if none of the patterns are found.
  const newline = 0x0a; // \n
  const carriage = 0x0d; // \r

  for (let i = 0; i < buffer.length - 2; i++) {
    if (buffer[i] === newline && buffer[i + 1] === newline) {
      // \n\n
      return i + 2;
    }
    if (buffer[i] === carriage && buffer[i + 1] === carriage) {
      // \r\r
      return i + 2;
    }
    if (
      buffer[i] === carriage &&
      buffer[i + 1] === newline &&
      i + 3 < buffer.length &&
      buffer[i + 2] === carriage &&
      buffer[i + 3] === newline
    ) {
      // \r\n\r\n
      return i + 4;
    }
  }

  return -1;
}

class SSEDecoder {
  private data: string[];
  private event: string | null;
  private chunks: string[];

  constructor() {
    this.event = null;
    this.data = [];
    this.chunks = [];
  }

  decode(line: string) {
    if (line.endsWith('\r')) {
      line = line.substring(0, line.length - 1);
    }

    if (!line) {
      // empty line and we didn't previously encounter any messages
      if (!this.event && !this.data.length) return null;

      const sse: ServerSentEvent = {
        event: this.event,
        data: this.data.join('\n'),
        raw: this.chunks,
      };

      this.event = null;
      this.data = [];
      this.chunks = [];

      return sse;
    }

    this.chunks.push(line);

    if (line.startsWith(':')) {
      return null;
    }

    let [fieldname, _, value] = partition(line, ':');

    if (value.startsWith(' ')) {
      value = value.substring(1);
    }

    if (fieldname === 'event') {
      this.event = value;
    } else if (fieldname === 'data') {
      this.data.push(value);
    }

    return null;
  }
}

/** This is an internal helper function that's just used for testing */
export function _decodeChunks(chunks: string[]): string[] {
  const decoder = new LineDecoder();
  const lines: string[] = [];
  for (const chunk of chunks) {
    lines.push(...decoder.decode(chunk));
  }

  return lines;
}

function partition(str: string, delimiter: string): [string, string, string] {
  const index = str.indexOf(delimiter);
  if (index !== -1) {
    return [str.substring(0, index), delimiter, str.substring(index + delimiter.length)];
  }

  return [str, '', ''];
}


================================================
File: src/internal/stream-utils.ts
================================================
/**
 * Most browsers don't yet have async iterable support for ReadableStream,
 * and Node has a very different way of reading bytes from its "ReadableStream".
 *
 * This polyfill was pulled from https://github.com/MattiasBuelens/web-streams-polyfill/pull/122#issuecomment-1627354490
 */
export function ReadableStreamToAsyncIterable<T>(stream: any): AsyncIterableIterator<T> {
  if (stream[Symbol.asyncIterator]) return stream;

  const reader = stream.getReader();
  return {
    async next() {
      try {
        const result = await reader.read();
        if (result?.done) reader.releaseLock(); // release lock when stream becomes closed
        return result;
      } catch (e) {
        reader.releaseLock(); // release lock when stream becomes errored
        throw e;
      }
    },
    async return() {
      const cancelPromise = reader.cancel();
      reader.releaseLock();
      await cancelPromise;
      return { done: true, value: undefined };
    },
    [Symbol.asyncIterator]() {
      return this;
    },
  };
}




================================================
File: src/lib/AbstractChatCompletionRunner.ts
================================================
import * as Core from '../core';
import { type CompletionUsage } from '../resources/completions';
import {
  type ChatCompletion,
  type ChatCompletionMessage,
  type ChatCompletionMessageParam,
  type ChatCompletionCreateParams,
  type ChatCompletionTool,
} from '../resources/chat/completions';
import { OpenAIError } from '../error';
import {
  type RunnableFunction,
  isRunnableFunctionWithParse,
  type BaseFunctionsArgs,
  RunnableToolFunction,
} from './RunnableFunction';
import { ChatCompletionFunctionRunnerParams, ChatCompletionToolRunnerParams } from './ChatCompletionRunner';
import {
  ChatCompletionStreamingFunctionRunnerParams,
  ChatCompletionStreamingToolRunnerParams,
} from './ChatCompletionStreamingRunner';
import { isAssistantMessage, isFunctionMessage, isToolMessage } from './chatCompletionUtils';
import { BaseEvents, EventStream } from './EventStream';
import { ParsedChatCompletion } from '../resources/beta/chat/completions';
import OpenAI from '../index';
import { isAutoParsableTool, parseChatCompletion } from '../lib/parser';

const DEFAULT_MAX_CHAT_COMPLETIONS = 10;
export interface RunnerOptions extends Core.RequestOptions {
  /** How many requests to make before canceling. Default 10. */
  maxChatCompletions?: number;
}

export class AbstractChatCompletionRunner<
  EventTypes extends AbstractChatCompletionRunnerEvents,
  ParsedT,
> extends EventStream<EventTypes> {
  protected _chatCompletions: ParsedChatCompletion<ParsedT>[] = [];
  messages: ChatCompletionMessageParam[] = [];

  protected _addChatCompletion(
    this: AbstractChatCompletionRunner<AbstractChatCompletionRunnerEvents, ParsedT>,
    chatCompletion: ParsedChatCompletion<ParsedT>,
  ): ParsedChatCompletion<ParsedT> {
    this._chatCompletions.push(chatCompletion);
    this._emit('chatCompletion', chatCompletion);
    const message = chatCompletion.choices[0]?.message;
    if (message) this._addMessage(message as ChatCompletionMessageParam);
    return chatCompletion;
  }

  protected _addMessage(
    this: AbstractChatCompletionRunner<AbstractChatCompletionRunnerEvents, ParsedT>,
    message: ChatCompletionMessageParam,
    emit = true,
  ) {
    if (!('content' in message)) message.content = null;

    this.messages.push(message);

    if (emit) {
      this._emit('message', message);
      if ((isFunctionMessage(message) || isToolMessage(message)) && message.content) {
        // Note, this assumes that {role: 'tool', content: …} is always the result of a call of tool of type=function.
        this._emit('functionCallResult', message.content as string);
      } else if (isAssistantMessage(message) && message.function_call) {
        this._emit('functionCall', message.function_call);
      } else if (isAssistantMessage(message) && message.tool_calls) {
        for (const tool_call of message.tool_calls) {
          if (tool_call.type === 'function') {
            this._emit('functionCall', tool_call.function);
          }
        }
      }
    }
  }

  /**
   * @returns a promise that resolves with the final ChatCompletion, or rejects
   * if an error occurred or the stream ended prematurely without producing a ChatCompletion.
   */
  async finalChatCompletion(): Promise<ParsedChatCompletion<ParsedT>> {
    await this.done();
    const completion = this._chatCompletions[this._chatCompletions.length - 1];
    if (!completion) throw new OpenAIError('stream ended without producing a ChatCompletion');
    return completion;
  }

  #getFinalContent(): string | null {
    return this.#getFinalMessage().content ?? null;
  }

  /**
   * @returns a promise that resolves with the content of the final ChatCompletionMessage, or rejects
   * if an error occurred or the stream ended prematurely without producing a ChatCompletionMessage.
   */
  async finalContent(): Promise<string | null> {
    await this.done();
    return this.#getFinalContent();
  }

  #getFinalMessage(): ChatCompletionMessage {
    let i = this.messages.length;
    while (i-- > 0) {
      const message = this.messages[i];
      if (isAssistantMessage(message)) {
        const { function_call, ...rest } = message;

        // TODO: support audio here
        const ret: Omit<ChatCompletionMessage, 'audio'> = {
          ...rest,
          content: (message as ChatCompletionMessage).content ?? null,
          refusal: (message as ChatCompletionMessage).refusal ?? null,
        };
        if (function_call) {
          ret.function_call = function_call;
        }
        return ret;
      }
    }
    throw new OpenAIError('stream ended without producing a ChatCompletionMessage with role=assistant');
  }

  /**
   * @returns a promise that resolves with the the final assistant ChatCompletionMessage response,
   * or rejects if an error occurred or the stream ended prematurely without producing a ChatCompletionMessage.
   */
  async finalMessage(): Promise<ChatCompletionMessage> {
    await this.done();
    return this.#getFinalMessage();
  }

  #getFinalFunctionCall(): ChatCompletionMessage.FunctionCall | undefined {
    for (let i = this.messages.length - 1; i >= 0; i--) {
      const message = this.messages[i];
      if (isAssistantMessage(message) && message?.function_call) {
        return message.function_call;
      }
      if (isAssistantMessage(message) && message?.tool_calls?.length) {
        return message.tool_calls.at(-1)?.function;
      }
    }

    return;
  }

  /**
   * @returns a promise that resolves with the content of the final FunctionCall, or rejects
   * if an error occurred or the stream ended prematurely without producing a ChatCompletionMessage.
   */
  async finalFunctionCall(): Promise<ChatCompletionMessage.FunctionCall | undefined> {
    await this.done();
    return this.#getFinalFunctionCall();
  }

  #getFinalFunctionCallResult(): string | undefined {
    for (let i = this.messages.length - 1; i >= 0; i--) {
      const message = this.messages[i];
      if (isFunctionMessage(message) && message.content != null) {
        return message.content;
      }
      if (
        isToolMessage(message) &&
        message.content != null &&
        typeof message.content === 'string' &&
        this.messages.some(
          (x) =>
            x.role === 'assistant' &&
            x.tool_calls?.some((y) => y.type === 'function' && y.id === message.tool_call_id),
        )
      ) {
        return message.content;
      }
    }

    return;
  }

  async finalFunctionCallResult(): Promise<string | undefined> {
    await this.done();
    return this.#getFinalFunctionCallResult();
  }

  #calculateTotalUsage(): CompletionUsage {
    const total: CompletionUsage = {
      completion_tokens: 0,
      prompt_tokens: 0,
      total_tokens: 0,
    };
    for (const { usage } of this._chatCompletions) {
      if (usage) {
        total.completion_tokens += usage.completion_tokens;
        total.prompt_tokens += usage.prompt_tokens;
        total.total_tokens += usage.total_tokens;
      }
    }
    return total;
  }

  async totalUsage(): Promise<CompletionUsage> {
    await this.done();
    return this.#calculateTotalUsage();
  }

  allChatCompletions(): ChatCompletion[] {
    return [...this._chatCompletions];
  }

  protected override _emitFinal(
    this: AbstractChatCompletionRunner<AbstractChatCompletionRunnerEvents, ParsedT>,
  ) {
    const completion = this._chatCompletions[this._chatCompletions.length - 1];
    if (completion) this._emit('finalChatCompletion', completion);
    const finalMessage = this.#getFinalMessage();
    if (finalMessage) this._emit('finalMessage', finalMessage);
    const finalContent = this.#getFinalContent();
    if (finalContent) this._emit('finalContent', finalContent);

    const finalFunctionCall = this.#getFinalFunctionCall();
    if (finalFunctionCall) this._emit('finalFunctionCall', finalFunctionCall);

    const finalFunctionCallResult = this.#getFinalFunctionCallResult();
    if (finalFunctionCallResult != null) this._emit('finalFunctionCallResult', finalFunctionCallResult);

    if (this._chatCompletions.some((c) => c.usage)) {
      this._emit('totalUsage', this.#calculateTotalUsage());
    }
  }

  #validateParams(params: ChatCompletionCreateParams): void {
    if (params.n != null && params.n > 1) {
      throw new OpenAIError(
        'ChatCompletion convenience helpers only support n=1 at this time. To use n>1, please use chat.completions.create() directly.',
      );
    }
  }

  protected async _createChatCompletion(
    client: OpenAI,
    params: ChatCompletionCreateParams,
    options?: Core.RequestOptions,
  ): Promise<ParsedChatCompletion<ParsedT>> {
    const signal = options?.signal;
    if (signal) {
      if (signal.aborted) this.controller.abort();
      signal.addEventListener('abort', () => this.controller.abort());
    }
    this.#validateParams(params);

    const chatCompletion = await client.chat.completions.create(
      { ...params, stream: false },
      { ...options, signal: this.controller.signal },
    );
    this._connected();
    return this._addChatCompletion(parseChatCompletion(chatCompletion, params));
  }

  protected async _runChatCompletion(
    client: OpenAI,
    params: ChatCompletionCreateParams,
    options?: Core.RequestOptions,
  ): Promise<ChatCompletion> {
    for (const message of params.messages) {
      this._addMessage(message, false);
    }
    return await this._createChatCompletion(client, params, options);
  }

  protected async _runFunctions<FunctionsArgs extends BaseFunctionsArgs>(
    client: OpenAI,
    params:
      | ChatCompletionFunctionRunnerParams<FunctionsArgs>
      | ChatCompletionStreamingFunctionRunnerParams<FunctionsArgs>,
    options?: RunnerOptions,
  ) {
    const role = 'function' as const;
    const { function_call = 'auto', stream, ...restParams } = params;
    const singleFunctionToCall = typeof function_call !== 'string' && function_call?.name;
    const { maxChatCompletions = DEFAULT_MAX_CHAT_COMPLETIONS } = options || {};

    const functionsByName: Record<string, RunnableFunction<any>> = {};
    for (const f of params.functions) {
      functionsByName[f.name || f.function.name] = f;
    }

    const functions: ChatCompletionCreateParams.Function[] = params.functions.map(
      (f): ChatCompletionCreateParams.Function => ({
        name: f.name || f.function.name,
        parameters: f.parameters as Record<string, unknown>,
        description: f.description,
      }),
    );

    for (const message of params.messages) {
      this._addMessage(message, false);
    }

    for (let i = 0; i < maxChatCompletions; ++i) {
      const chatCompletion: ChatCompletion = await this._createChatCompletion(
        client,
        {
          ...restParams,
          function_call,
          functions,
          messages: [...this.messages],
        },
        options,
      );
      const message = chatCompletion.choices[0]?.message;
      if (!message) {
        throw new OpenAIError(`missing message in ChatCompletion response`);
      }
      if (!message.function_call) return;
      const { name, arguments: args } = message.function_call;
      const fn = functionsByName[name];
      if (!fn) {
        const content = `Invalid function_call: ${JSON.stringify(name)}. Available options are: ${functions
          .map((f) => JSON.stringify(f.name))
          .join(', ')}. Please try again`;

        this._addMessage({ role, name, content });
        continue;
      } else if (singleFunctionToCall && singleFunctionToCall !== name) {
        const content = `Invalid function_call: ${JSON.stringify(name)}. ${JSON.stringify(
          singleFunctionToCall,
        )} requested. Please try again`;

        this._addMessage({ role, name, content });
        continue;
      }

      let parsed;
      try {
        parsed = isRunnableFunctionWithParse(fn) ? await fn.parse(args) : args;
      } catch (error) {
        this._addMessage({
          role,
          name,
          content: error instanceof Error ? error.message : String(error),
        });
        continue;
      }

      // @ts-expect-error it can't rule out `never` type.
      const rawContent = await fn.function(parsed, this);
      const content = this.#stringifyFunctionCallResult(rawContent);

      this._addMessage({ role, name, content });

      if (singleFunctionToCall) return;
    }
  }

  protected async _runTools<FunctionsArgs extends BaseFunctionsArgs>(
    client: OpenAI,
    params:
      | ChatCompletionToolRunnerParams<FunctionsArgs>
      | ChatCompletionStreamingToolRunnerParams<FunctionsArgs>,
    options?: RunnerOptions,
  ) {
    const role = 'tool' as const;
    const { tool_choice = 'auto', stream, ...restParams } = params;
    const singleFunctionToCall = typeof tool_choice !== 'string' && tool_choice?.function?.name;
    const { maxChatCompletions = DEFAULT_MAX_CHAT_COMPLETIONS } = options || {};

    // TODO(someday): clean this logic up
    const inputTools = params.tools.map((tool): RunnableToolFunction<any> => {
      if (isAutoParsableTool(tool)) {
        if (!tool.$callback) {
          throw new OpenAIError('Tool given to `.runTools()` that does not have an associated function');
        }

        return {
          type: 'function',
          function: {
            function: tool.$callback,
            name: tool.function.name,
            description: tool.function.description || '',
            parameters: tool.function.parameters as any,
            parse: tool.$parseRaw,
            strict: true,
          },
        };
      }

      return tool as any as RunnableToolFunction<any>;
    });

    const functionsByName: Record<string, RunnableFunction<any>> = {};
    for (const f of inputTools) {
      if (f.type === 'function') {
        functionsByName[f.function.name || f.function.function.name] = f.function;
      }
    }

    const tools: ChatCompletionTool[] =
      'tools' in params ?
        inputTools.map((t) =>
          t.type === 'function' ?
            {
              type: 'function',
              function: {
                name: t.function.name || t.function.function.name,
                parameters: t.function.parameters as Record<string, unknown>,
                description: t.function.description,
                strict: t.function.strict,
              },
            }
          : (t as unknown as ChatCompletionTool),
        )
      : (undefined as any);

    for (const message of params.messages) {
      this._addMessage(message, false);
    }

    for (let i = 0; i < maxChatCompletions; ++i) {
      const chatCompletion: ChatCompletion = await this._createChatCompletion(
        client,
        {
          ...restParams,
          tool_choice,
          tools,
          messages: [...this.messages],
        },
        options,
      );
      const message = chatCompletion.choices[0]?.message;
      if (!message) {
        throw new OpenAIError(`missing message in ChatCompletion response`);
      }
      if (!message.tool_calls?.length) {
        return;
      }

      for (const tool_call of message.tool_calls) {
        if (tool_call.type !== 'function') continue;
        const tool_call_id = tool_call.id;
        const { name, arguments: args } = tool_call.function;
        const fn = functionsByName[name];

        if (!fn) {
          const content = `Invalid tool_call: ${JSON.stringify(name)}. Available options are: ${Object.keys(
            functionsByName,
          )
            .map((name) => JSON.stringify(name))
            .join(', ')}. Please try again`;

          this._addMessage({ role, tool_call_id, content });
          continue;
        } else if (singleFunctionToCall && singleFunctionToCall !== name) {
          const content = `Invalid tool_call: ${JSON.stringify(name)}. ${JSON.stringify(
            singleFunctionToCall,
          )} requested. Please try again`;

          this._addMessage({ role, tool_call_id, content });
          continue;
        }

        let parsed;
        try {
          parsed = isRunnableFunctionWithParse(fn) ? await fn.parse(args) : args;
        } catch (error) {
          const content = error instanceof Error ? error.message : String(error);
          this._addMessage({ role, tool_call_id, content });
          continue;
        }

        // @ts-expect-error it can't rule out `never` type.
        const rawContent = await fn.function(parsed, this);
        const content = this.#stringifyFunctionCallResult(rawContent);
        this._addMessage({ role, tool_call_id, content });

        if (singleFunctionToCall) {
          return;
        }
      }
    }

    return;
  }

  #stringifyFunctionCallResult(rawContent: unknown): string {
    return (
      typeof rawContent === 'string' ? rawContent
      : rawContent === undefined ? 'undefined'
      : JSON.stringify(rawContent)
    );
  }
}

export interface AbstractChatCompletionRunnerEvents extends BaseEvents {
  functionCall: (functionCall: ChatCompletionMessage.FunctionCall) => void;
  message: (message: ChatCompletionMessageParam) => void;
  chatCompletion: (completion: ChatCompletion) => void;
  finalContent: (contentSnapshot: string) => void;
  finalMessage: (message: ChatCompletionMessageParam) => void;
  finalChatCompletion: (completion: ChatCompletion) => void;
  finalFunctionCall: (functionCall: ChatCompletionMessage.FunctionCall) => void;
  functionCallResult: (content: string) => void;
  finalFunctionCallResult: (content: string) => void;
  totalUsage: (usage: CompletionUsage) => void;
}


================================================
File: src/lib/AssistantStream.ts
================================================
import {
  TextContentBlock,
  ImageFileContentBlock,
  Message,
  MessageContentDelta,
  Text,
  ImageFile,
  TextDelta,
  MessageDelta,
  MessageContent,
} from '../resources/beta/threads/messages';
import * as Core from '../core';
import { RequestOptions } from '../core';
import {
  Run,
  RunCreateParamsBase,
  RunCreateParamsStreaming,
  Runs,
  RunSubmitToolOutputsParamsBase,
  RunSubmitToolOutputsParamsStreaming,
} from '../resources/beta/threads/runs/runs';
import { type ReadableStream } from '../_shims/index';
import { Stream } from '../streaming';
import { APIUserAbortError, OpenAIError } from '../error';
import {
  AssistantStreamEvent,
  MessageStreamEvent,
  RunStepStreamEvent,
  RunStreamEvent,
} from '../resources/beta/assistants';
import { RunStep, RunStepDelta, ToolCall, ToolCallDelta } from '../resources/beta/threads/runs/steps';
import { ThreadCreateAndRunParamsBase, Threads } from '../resources/beta/threads/threads';
import { BaseEvents, EventStream } from './EventStream';

export interface AssistantStreamEvents extends BaseEvents {
  run: (run: Run) => void;

  //New event structure
  messageCreated: (message: Message) => void;
  messageDelta: (message: MessageDelta, snapshot: Message) => void;
  messageDone: (message: Message) => void;

  runStepCreated: (runStep: RunStep) => void;
  runStepDelta: (delta: RunStepDelta, snapshot: Runs.RunStep) => void;
  runStepDone: (runStep: Runs.RunStep, snapshot: Runs.RunStep) => void;

  toolCallCreated: (toolCall: ToolCall) => void;
  toolCallDelta: (delta: ToolCallDelta, snapshot: ToolCall) => void;
  toolCallDone: (toolCall: ToolCall) => void;

  textCreated: (content: Text) => void;
  textDelta: (delta: TextDelta, snapshot: Text) => void;
  textDone: (content: Text, snapshot: Message) => void;

  //No created or delta as this is not streamed
  imageFileDone: (content: ImageFile, snapshot: Message) => void;

  event: (event: AssistantStreamEvent) => void;
}

export type ThreadCreateAndRunParamsBaseStream = Omit<ThreadCreateAndRunParamsBase, 'stream'> & {
  stream?: true;
};

export type RunCreateParamsBaseStream = Omit<RunCreateParamsBase, 'stream'> & {
  stream?: true;
};

export type RunSubmitToolOutputsParamsStream = Omit<RunSubmitToolOutputsParamsBase, 'stream'> & {
  stream?: true;
};

export class AssistantStream
  extends EventStream<AssistantStreamEvents>
  implements AsyncIterable<AssistantStreamEvent>
{
  //Track all events in a single list for reference
  #events: AssistantStreamEvent[] = [];

  //Used to accumulate deltas
  //We are accumulating many types so the value here is not strict
  #runStepSnapshots: { [id: string]: Runs.RunStep } = {};
  #messageSnapshots: { [id: string]: Message } = {};
  #messageSnapshot: Message | undefined;
  #finalRun: Run | undefined;
  #currentContentIndex: number | undefined;
  #currentContent: MessageContent | undefined;
  #currentToolCallIndex: number | undefined;
  #currentToolCall: ToolCall | undefined;

  //For current snapshot methods
  #currentEvent: AssistantStreamEvent | undefined;
  #currentRunSnapshot: Run | undefined;
  #currentRunStepSnapshot: Runs.RunStep | undefined;

  [Symbol.asyncIterator](): AsyncIterator<AssistantStreamEvent> {
    const pushQueue: AssistantStreamEvent[] = [];
    const readQueue: {
      resolve: (chunk: AssistantStreamEvent | undefined) => void;
      reject: (err: unknown) => void;
    }[] = [];
    let done = false;

    //Catch all for passing along all events
    this.on('event', (event) => {
      const reader = readQueue.shift();
      if (reader) {
        reader.resolve(event);
      } else {
        pushQueue.push(event);
      }
    });

    this.on('end', () => {
      done = true;
      for (const reader of readQueue) {
        reader.resolve(undefined);
      }
      readQueue.length = 0;
    });

    this.on('abort', (err) => {
      done = true;
      for (const reader of readQueue) {
        reader.reject(err);
      }
      readQueue.length = 0;
    });

    this.on('error', (err) => {
      done = true;
      for (const reader of readQueue) {
        reader.reject(err);
      }
      readQueue.length = 0;
    });

    return {
      next: async (): Promise<IteratorResult<AssistantStreamEvent>> => {
        if (!pushQueue.length) {
          if (done) {
            return { value: undefined, done: true };
          }
          return new Promise<AssistantStreamEvent | undefined>((resolve, reject) =>
            readQueue.push({ resolve, reject }),
          ).then((chunk) => (chunk ? { value: chunk, done: false } : { value: undefined, done: true }));
        }
        const chunk = pushQueue.shift()!;
        return { value: chunk, done: false };
      },
      return: async () => {
        this.abort();
        return { value: undefined, done: true };
      },
    };
  }

  static fromReadableStream(stream: ReadableStream): AssistantStream {
    const runner = new AssistantStream();
    runner._run(() => runner._fromReadableStream(stream));
    return runner;
  }

  protected async _fromReadableStream(
    readableStream: ReadableStream,
    options?: Core.RequestOptions,
  ): Promise<Run> {
    const signal = options?.signal;
    if (signal) {
      if (signal.aborted) this.controller.abort();
      signal.addEventListener('abort', () => this.controller.abort());
    }
    this._connected();
    const stream = Stream.fromReadableStream<AssistantStreamEvent>(readableStream, this.controller);
    for await (const event of stream) {
      this.#addEvent(event);
    }
    if (stream.controller.signal?.aborted) {
      throw new APIUserAbortError();
    }
    return this._addRun(this.#endRequest());
  }

  toReadableStream(): ReadableStream {
    const stream = new Stream(this[Symbol.asyncIterator].bind(this), this.controller);
    return stream.toReadableStream();
  }

  static createToolAssistantStream(
    threadId: string,
    runId: string,
    runs: Runs,
    params: RunSubmitToolOutputsParamsStream,
    options: RequestOptions | undefined,
  ): AssistantStream {
    const runner = new AssistantStream();
    runner._run(() =>
      runner._runToolAssistantStream(threadId, runId, runs, params, {
        ...options,
        headers: { ...options?.headers, 'X-Stainless-Helper-Method': 'stream' },
      }),
    );
    return runner;
  }

  protected async _createToolAssistantStream(
    run: Runs,
    threadId: string,
    runId: string,
    params: RunSubmitToolOutputsParamsStream,
    options?: Core.RequestOptions,
  ): Promise<Run> {
    const signal = options?.signal;
    if (signal) {
      if (signal.aborted) this.controller.abort();
      signal.addEventListener('abort', () => this.controller.abort());
    }

    const body: RunSubmitToolOutputsParamsStreaming = { ...params, stream: true };
    const stream = await run.submitToolOutputs(threadId, runId, body, {
      ...options,
      signal: this.controller.signal,
    });

    this._connected();

    for await (const event of stream) {
      this.#addEvent(event);
    }
    if (stream.controller.signal?.aborted) {
      throw new APIUserAbortError();
    }

    return this._addRun(this.#endRequest());
  }

  static createThreadAssistantStream(
    params: ThreadCreateAndRunParamsBaseStream,
    thread: Threads,
    options?: RequestOptions,
  ): AssistantStream {
    const runner = new AssistantStream();
    runner._run(() =>
      runner._threadAssistantStream(params, thread, {
        ...options,
        headers: { ...options?.headers, 'X-Stainless-Helper-Method': 'stream' },
      }),
    );
    return runner;
  }

  static createAssistantStream(
    threadId: string,
    runs: Runs,
    params: RunCreateParamsBaseStream,
    options?: RequestOptions,
  ): AssistantStream {
    const runner = new AssistantStream();
    runner._run(() =>
      runner._runAssistantStream(threadId, runs, params, {
        ...options,
        headers: { ...options?.headers, 'X-Stainless-Helper-Method': 'stream' },
      }),
    );
    return runner;
  }

  currentEvent(): AssistantStreamEvent | undefined {
    return this.#currentEvent;
  }

  currentRun(): Run | undefined {
    return this.#currentRunSnapshot;
  }

  currentMessageSnapshot(): Message | undefined {
    return this.#messageSnapshot;
  }

  currentRunStepSnapshot(): Runs.RunStep | undefined {
    return this.#currentRunStepSnapshot;
  }

  async finalRunSteps(): Promise<Runs.RunStep[]> {
    await this.done();

    return Object.values(this.#runStepSnapshots);
  }

  async finalMessages(): Promise<Message[]> {
    await this.done();

    return Object.values(this.#messageSnapshots);
  }

  async finalRun(): Promise<Run> {
    await this.done();
    if (!this.#finalRun) throw Error('Final run was not received.');

    return this.#finalRun;
  }

  protected async _createThreadAssistantStream(
    thread: Threads,
    params: ThreadCreateAndRunParamsBase,
    options?: Core.RequestOptions,
  ): Promise<Run> {
    const signal = options?.signal;
    if (signal) {
      if (signal.aborted) this.controller.abort();
      signal.addEventListener('abort', () => this.controller.abort());
    }

    const body: RunCreateParamsStreaming = { ...params, stream: true };
    const stream = await thread.createAndRun(body, { ...options, signal: this.controller.signal });

    this._connected();

    for await (const event of stream) {
      this.#addEvent(event);
    }
    if (stream.controller.signal?.aborted) {
      throw new APIUserAbortError();
    }

    return this._addRun(this.#endRequest());
  }

  protected async _createAssistantStream(
    run: Runs,
    threadId: string,
    params: RunCreateParamsBase,
    options?: Core.RequestOptions,
  ): Promise<Run> {
    const signal = options?.signal;
    if (signal) {
      if (signal.aborted) this.controller.abort();
      signal.addEventListener('abort', () => this.controller.abort());
    }

    const body: RunCreateParamsStreaming = { ...params, stream: true };
    const stream = await run.create(threadId, body, { ...options, signal: this.controller.signal });

    this._connected();

    for await (const event of stream) {
      this.#addEvent(event);
    }
    if (stream.controller.signal?.aborted) {
      throw new APIUserAbortError();
    }

    return this._addRun(this.#endRequest());
  }

  #addEvent(event: AssistantStreamEvent) {
    if (this.ended) return;

    this.#currentEvent = event;

    this.#handleEvent(event);

    switch (event.event) {
      case 'thread.created':
        //No action on this event.
        break;

      case 'thread.run.created':
      case 'thread.run.queued':
      case 'thread.run.in_progress':
      case 'thread.run.requires_action':
      case 'thread.run.completed':
      case 'thread.run.failed':
      case 'thread.run.cancelling':
      case 'thread.run.cancelled':
      case 'thread.run.expired':
        this.#handleRun(event);
        break;

      case 'thread.run.step.created':
      case 'thread.run.step.in_progress':
      case 'thread.run.step.delta':
      case 'thread.run.step.completed':
      case 'thread.run.step.failed':
      case 'thread.run.step.cancelled':
      case 'thread.run.step.expired':
        this.#handleRunStep(event);
        break;

      case 'thread.message.created':
      case 'thread.message.in_progress':
      case 'thread.message.delta':
      case 'thread.message.completed':
      case 'thread.message.incomplete':
        this.#handleMessage(event);
        break;

      case 'error':
        //This is included for completeness, but errors are processed in the SSE event processing so this should not occur
        throw new Error(
          'Encountered an error event in event processing - errors should be processed earlier',
        );
    }
  }

  #endRequest(): Run {
    if (this.ended) {
      throw new OpenAIError(`stream has ended, this shouldn't happen`);
    }

    if (!this.#finalRun) throw Error('Final run has not been received');

    return this.#finalRun;
  }

  #handleMessage(this: AssistantStream, event: MessageStreamEvent) {
    const [accumulatedMessage, newContent] = this.#accumulateMessage(event, this.#messageSnapshot);
    this.#messageSnapshot = accumulatedMessage;
    this.#messageSnapshots[accumulatedMessage.id] = accumulatedMessage;

    for (const content of newContent) {
      const snapshotContent = accumulatedMessage.content[content.index];
      if (snapshotContent?.type == 'text') {
        this._emit('textCreated', snapshotContent.text);
      }
    }

    switch (event.event) {
      case 'thread.message.created':
        this._emit('messageCreated', event.data);
        break;

      case 'thread.message.in_progress':
        break;

      case 'thread.message.delta':
        this._emit('messageDelta', event.data.delta, accumulatedMessage);

        if (event.data.delta.content) {
          for (const content of event.data.delta.content) {
            //If it is text delta, emit a text delta event
            if (content.type == 'text' && content.text) {
              let textDelta = content.text;
              let snapshot = accumulatedMessage.content[content.index];
              if (snapshot && snapshot.type == 'text') {
                this._emit('textDelta', textDelta, snapshot.text);
              } else {
                throw Error('The snapshot associated with this text delta is not text or missing');
              }
            }

            if (content.index != this.#currentContentIndex) {
              //See if we have in progress content
              if (this.#currentContent) {
                switch (this.#currentContent.type) {
                  case 'text':
                    this._emit('textDone', this.#currentContent.text, this.#messageSnapshot);
                    break;
                  case 'image_file':
                    this._emit('imageFileDone', this.#currentContent.image_file, this.#messageSnapshot);
                    break;
                }
              }

              this.#currentContentIndex = content.index;
            }

            this.#currentContent = accumulatedMessage.content[content.index];
          }
        }

        break;

      case 'thread.message.completed':
      case 'thread.message.incomplete':
        //We emit the latest content we were working on on completion (including incomplete)
        if (this.#currentContentIndex !== undefined) {
          const currentContent = event.data.content[this.#currentContentIndex];
          if (currentContent) {
            switch (currentContent.type) {
              case 'image_file':
                this._emit('imageFileDone', currentContent.image_file, this.#messageSnapshot);
                break;
              case 'text':
                this._emit('textDone', currentContent.text, this.#messageSnapshot);
                break;
            }
          }
        }

        if (this.#messageSnapshot) {
          this._emit('messageDone', event.data);
        }

        this.#messageSnapshot = undefined;
    }
  }

  #handleRunStep(this: AssistantStream, event: RunStepStreamEvent) {
    const accumulatedRunStep = this.#accumulateRunStep(event);
    this.#currentRunStepSnapshot = accumulatedRunStep;

    switch (event.event) {
      case 'thread.run.step.created':
        this._emit('runStepCreated', event.data);
        break;
      case 'thread.run.step.delta':
        const delta = event.data.delta;
        if (
          delta.step_details &&
          delta.step_details.type == 'tool_calls' &&
          delta.step_details.tool_calls &&
          accumulatedRunStep.step_details.type == 'tool_calls'
        ) {
          for (const toolCall of delta.step_details.tool_calls) {
            if (toolCall.index == this.#currentToolCallIndex) {
              this._emit(
                'toolCallDelta',
                toolCall,
                accumulatedRunStep.step_details.tool_calls[toolCall.index] as ToolCall,
              );
            } else {
              if (this.#currentToolCall) {
                this._emit('toolCallDone', this.#currentToolCall);
              }

              this.#currentToolCallIndex = toolCall.index;
              this.#currentToolCall = accumulatedRunStep.step_details.tool_calls[toolCall.index];
              if (this.#currentToolCall) this._emit('toolCallCreated', this.#currentToolCall);
            }
          }
        }

        this._emit('runStepDelta', event.data.delta, accumulatedRunStep);
        break;
      case 'thread.run.step.completed':
      case 'thread.run.step.failed':
      case 'thread.run.step.cancelled':
      case 'thread.run.step.expired':
        this.#currentRunStepSnapshot = undefined;
        const details = event.data.step_details;
        if (details.type == 'tool_calls') {
          if (this.#currentToolCall) {
            this._emit('toolCallDone', this.#currentToolCall as ToolCall);
            this.#currentToolCall = undefined;
          }
        }
        this._emit('runStepDone', event.data, accumulatedRunStep);
        break;
      case 'thread.run.step.in_progress':
        break;
    }
  }

  #handleEvent(this: AssistantStream, event: AssistantStreamEvent) {
    this.#events.push(event);
    this._emit('event', event);
  }

  #accumulateRunStep(event: RunStepStreamEvent): Runs.RunStep {
    switch (event.event) {
      case 'thread.run.step.created':
        this.#runStepSnapshots[event.data.id] = event.data;
        return event.data;

      case 'thread.run.step.delta':
        let snapshot = this.#runStepSnapshots[event.data.id] as Runs.RunStep;
        if (!snapshot) {
          throw Error('Received a RunStepDelta before creation of a snapshot');
        }

        let data = event.data;

        if (data.delta) {
          const accumulated = AssistantStream.accumulateDelta(snapshot, data.delta) as Runs.RunStep;
          this.#runStepSnapshots[event.data.id] = accumulated;
        }

        return this.#runStepSnapshots[event.data.id] as Runs.RunStep;

      case 'thread.run.step.completed':
      case 'thread.run.step.failed':
      case 'thread.run.step.cancelled':
      case 'thread.run.step.expired':
      case 'thread.run.step.in_progress':
        this.#runStepSnapshots[event.data.id] = event.data;
        break;
    }

    if (this.#runStepSnapshots[event.data.id]) return this.#runStepSnapshots[event.data.id] as Runs.RunStep;
    throw new Error('No snapshot available');
  }

  #accumulateMessage(
    event: AssistantStreamEvent,
    snapshot: Message | undefined,
  ): [Message, MessageContentDelta[]] {
    let newContent: MessageContentDelta[] = [];

    switch (event.event) {
      case 'thread.message.created':
        //On creation the snapshot is just the initial message
        return [event.data, newContent];

      case 'thread.message.delta':
        if (!snapshot) {
          throw Error(
            'Received a delta with no existing snapshot (there should be one from message creation)',
          );
        }

        let data = event.data;

        //If this delta does not have content, nothing to process
        if (data.delta.content) {
          for (const contentElement of data.delta.content) {
            if (contentElement.index in snapshot.content) {
              let currentContent = snapshot.content[contentElement.index];
              snapshot.content[contentElement.index] = this.#accumulateContent(
                contentElement,
                currentContent,
              );
            } else {
              snapshot.content[contentElement.index] = contentElement as MessageContent;
              // This is a new element
              newContent.push(contentElement);
            }
          }
        }

        return [snapshot, newContent];

      case 'thread.message.in_progress':
      case 'thread.message.completed':
      case 'thread.message.incomplete':
        //No changes on other thread events
        if (snapshot) {
          return [snapshot, newContent];
        } else {
          throw Error('Received thread message event with no existing snapshot');
        }
    }
    throw Error('Tried to accumulate a non-message event');
  }

  #accumulateContent(
    contentElement: MessageContentDelta,
    currentContent: MessageContent | undefined,
  ): TextContentBlock | ImageFileContentBlock {
    return AssistantStream.accumulateDelta(currentContent as unknown as Record<any, any>, contentElement) as
      | TextContentBlock
      | ImageFileContentBlock;
  }

  static accumulateDelta(acc: Record<string, any>, delta: Record<string, any>): Record<string, any> {
    for (const [key, deltaValue] of Object.entries(delta)) {
      if (!acc.hasOwnProperty(key)) {
        acc[key] = deltaValue;
        continue;
      }

      let accValue = acc[key];
      if (accValue === null || accValue === undefined) {
        acc[key] = deltaValue;
        continue;
      }

      // We don't accumulate these special properties
      if (key === 'index' || key === 'type') {
        acc[key] = deltaValue;
        continue;
      }

      // Type-specific accumulation logic
      if (typeof accValue === 'string' && typeof deltaValue === 'string') {
        accValue += deltaValue;
      } else if (typeof accValue === 'number' && typeof deltaValue === 'number') {
        accValue += deltaValue;
      } else if (Core.isObj(accValue) && Core.isObj(deltaValue)) {
        accValue = this.accumulateDelta(accValue as Record<string, any>, deltaValue as Record<string, any>);
      } else if (Array.isArray(accValue) && Array.isArray(deltaValue)) {
        if (accValue.every((x) => typeof x === 'string' || typeof x === 'number')) {
          accValue.push(...deltaValue); // Use spread syntax for efficient addition
          continue;
        }

        for (const deltaEntry of deltaValue) {
          if (!Core.isObj(deltaEntry)) {
            throw new Error(`Expected array delta entry to be an object but got: ${deltaEntry}`);
          }

          const index = deltaEntry['index'];
          if (index == null) {
            console.error(deltaEntry);
            throw new Error('Expected array delta entry to have an `index` property');
          }

          if (typeof index !== 'number') {
            throw new Error(`Expected array delta entry \`index\` property to be a number but got ${index}`);
          }

          const accEntry = accValue[index];
          if (accEntry == null) {
            accValue.push(deltaEntry);
          } else {
            accValue[index] = this.accumulateDelta(accEntry, deltaEntry);
          }
        }
        continue;
      } else {
        throw Error(`Unhandled record type: ${key}, deltaValue: ${deltaValue}, accValue: ${accValue}`);
      }
      acc[key] = accValue;
    }

    return acc;
  }

  #handleRun(this: AssistantStream, event: RunStreamEvent) {
    this.#currentRunSnapshot = event.data;
    switch (event.event) {
      case 'thread.run.created':
        break;
      case 'thread.run.queued':
        break;
      case 'thread.run.in_progress':
        break;
      case 'thread.run.requires_action':
      case 'thread.run.cancelled':
      case 'thread.run.failed':
      case 'thread.run.completed':
      case 'thread.run.expired':
        this.#finalRun = event.data;
        if (this.#currentToolCall) {
          this._emit('toolCallDone', this.#currentToolCall);
          this.#currentToolCall = undefined;
        }
        break;
      case 'thread.run.cancelling':
        break;
    }
  }

  protected _addRun(run: Run): Run {
    return run;
  }

  protected async _threadAssistantStream(
    params: ThreadCreateAndRunParamsBase,
    thread: Threads,
    options?: Core.RequestOptions,
  ): Promise<Run> {
    return await this._createThreadAssistantStream(thread, params, options);
  }

  protected async _runAssistantStream(
    threadId: string,
    runs: Runs,
    params: RunCreateParamsBase,
    options?: Core.RequestOptions,
  ): Promise<Run> {
    return await this._createAssistantStream(runs, threadId, params, options);
  }

  protected async _runToolAssistantStream(
    threadId: string,
    runId: string,
    runs: Runs,
    params: RunSubmitToolOutputsParamsStream,
    options?: Core.RequestOptions,
  ): Promise<Run> {
    return await this._createToolAssistantStream(runs, threadId, runId, params, options);
  }
}


================================================
File: src/lib/ChatCompletionRunner.ts
================================================
import {
  type ChatCompletionMessageParam,
  type ChatCompletionCreateParamsNonStreaming,
} from '../resources/chat/completions';
import { type RunnableFunctions, type BaseFunctionsArgs, RunnableTools } from './RunnableFunction';
import {
  AbstractChatCompletionRunner,
  AbstractChatCompletionRunnerEvents,
  RunnerOptions,
} from './AbstractChatCompletionRunner';
import { isAssistantMessage } from './chatCompletionUtils';
import OpenAI from '../index';
import { AutoParseableTool } from '../lib/parser';

export interface ChatCompletionRunnerEvents extends AbstractChatCompletionRunnerEvents {
  content: (content: string) => void;
}

export type ChatCompletionFunctionRunnerParams<FunctionsArgs extends BaseFunctionsArgs> = Omit<
  ChatCompletionCreateParamsNonStreaming,
  'functions'
> & {
  functions: RunnableFunctions<FunctionsArgs>;
};

export type ChatCompletionToolRunnerParams<FunctionsArgs extends BaseFunctionsArgs> = Omit<
  ChatCompletionCreateParamsNonStreaming,
  'tools'
> & {
  tools: RunnableTools<FunctionsArgs> | AutoParseableTool<any, true>[];
};

export class ChatCompletionRunner<ParsedT = null> extends AbstractChatCompletionRunner<
  ChatCompletionRunnerEvents,
  ParsedT
> {
  /** @deprecated - please use `runTools` instead. */
  static runFunctions(
    client: OpenAI,
    params: ChatCompletionFunctionRunnerParams<any[]>,
    options?: RunnerOptions,
  ): ChatCompletionRunner<null> {
    const runner = new ChatCompletionRunner();
    const opts = {
      ...options,
      headers: { ...options?.headers, 'X-Stainless-Helper-Method': 'runFunctions' },
    };
    runner._run(() => runner._runFunctions(client, params, opts));
    return runner;
  }

  static runTools<ParsedT>(
    client: OpenAI,
    params: ChatCompletionToolRunnerParams<any[]>,
    options?: RunnerOptions,
  ): ChatCompletionRunner<ParsedT> {
    const runner = new ChatCompletionRunner<ParsedT>();
    const opts = {
      ...options,
      headers: { ...options?.headers, 'X-Stainless-Helper-Method': 'runTools' },
    };
    runner._run(() => runner._runTools(client, params, opts));
    return runner;
  }

  override _addMessage(
    this: ChatCompletionRunner<ParsedT>,
    message: ChatCompletionMessageParam,
    emit: boolean = true,
  ) {
    super._addMessage(message, emit);
    if (isAssistantMessage(message) && message.content) {
      this._emit('content', message.content as string);
    }
  }
}


================================================
File: src/lib/ChatCompletionStream.ts
================================================
import * as Core from '../core';
import {
  OpenAIError,
  APIUserAbortError,
  LengthFinishReasonError,
  ContentFilterFinishReasonError,
} from '../error';
import {
  ChatCompletionTokenLogprob,
  type ChatCompletion,
  type ChatCompletionChunk,
  type ChatCompletionCreateParams,
  type ChatCompletionCreateParamsStreaming,
  type ChatCompletionCreateParamsBase,
  type ChatCompletionRole,
} from '../resources/chat/completions';
import {
  AbstractChatCompletionRunner,
  type AbstractChatCompletionRunnerEvents,
} from './AbstractChatCompletionRunner';
import { type ReadableStream } from '../_shims/index';
import { Stream } from '../streaming';
import OpenAI from '../index';
import { ParsedChatCompletion } from '../resources/beta/chat/completions';
import {
  AutoParseableResponseFormat,
  hasAutoParseableInput,
  isAutoParsableResponseFormat,
  isAutoParsableTool,
  maybeParseChatCompletion,
  shouldParseToolCall,
} from '../lib/parser';
import { partialParse } from '../_vendor/partial-json-parser/parser';

export interface ContentDeltaEvent {
  delta: string;
  snapshot: string;
  parsed: unknown | null;
}

export interface ContentDoneEvent<ParsedT = null> {
  content: string;
  parsed: ParsedT | null;
}

export interface RefusalDeltaEvent {
  delta: string;
  snapshot: string;
}

export interface RefusalDoneEvent {
  refusal: string;
}

export interface FunctionToolCallArgumentsDeltaEvent {
  name: string;

  index: number;

  arguments: string;

  parsed_arguments: unknown;

  arguments_delta: string;
}

export interface FunctionToolCallArgumentsDoneEvent {
  name: string;

  index: number;

  arguments: string;

  parsed_arguments: unknown;
}

export interface LogProbsContentDeltaEvent {
  content: Array<ChatCompletionTokenLogprob>;
  snapshot: Array<ChatCompletionTokenLogprob>;
}

export interface LogProbsContentDoneEvent {
  content: Array<ChatCompletionTokenLogprob>;
}

export interface LogProbsRefusalDeltaEvent {
  refusal: Array<ChatCompletionTokenLogprob>;
  snapshot: Array<ChatCompletionTokenLogprob>;
}

export interface LogProbsRefusalDoneEvent {
  refusal: Array<ChatCompletionTokenLogprob>;
}

export interface ChatCompletionStreamEvents<ParsedT = null> extends AbstractChatCompletionRunnerEvents {
  content: (contentDelta: string, contentSnapshot: string) => void;
  chunk: (chunk: ChatCompletionChunk, snapshot: ChatCompletionSnapshot) => void;

  'content.delta': (props: ContentDeltaEvent) => void;
  'content.done': (props: ContentDoneEvent<ParsedT>) => void;

  'refusal.delta': (props: RefusalDeltaEvent) => void;
  'refusal.done': (props: RefusalDoneEvent) => void;

  'tool_calls.function.arguments.delta': (props: FunctionToolCallArgumentsDeltaEvent) => void;
  'tool_calls.function.arguments.done': (props: FunctionToolCallArgumentsDoneEvent) => void;

  'logprobs.content.delta': (props: LogProbsContentDeltaEvent) => void;
  'logprobs.content.done': (props: LogProbsContentDoneEvent) => void;

  'logprobs.refusal.delta': (props: LogProbsRefusalDeltaEvent) => void;
  'logprobs.refusal.done': (props: LogProbsRefusalDoneEvent) => void;
}

export type ChatCompletionStreamParams = Omit<ChatCompletionCreateParamsBase, 'stream'> & {
  stream?: true;
};

interface ChoiceEventState {
  content_done: boolean;
  refusal_done: boolean;
  logprobs_content_done: boolean;
  logprobs_refusal_done: boolean;
  current_tool_call_index: number | null;
  done_tool_calls: Set<number>;
}

export class ChatCompletionStream<ParsedT = null>
  extends AbstractChatCompletionRunner<ChatCompletionStreamEvents<ParsedT>, ParsedT>
  implements AsyncIterable<ChatCompletionChunk>
{
  #params: ChatCompletionCreateParams | null;
  #choiceEventStates: ChoiceEventState[];
  #currentChatCompletionSnapshot: ChatCompletionSnapshot | undefined;

  constructor(params: ChatCompletionCreateParams | null) {
    super();
    this.#params = params;
    this.#choiceEventStates = [];
  }

  get currentChatCompletionSnapshot(): ChatCompletionSnapshot | undefined {
    return this.#currentChatCompletionSnapshot;
  }

  /**
   * Intended for use on the frontend, consuming a stream produced with
   * `.toReadableStream()` on the backend.
   *
   * Note that messages sent to the model do not appear in `.on('message')`
   * in this context.
   */
  static fromReadableStream(stream: ReadableStream): ChatCompletionStream<null> {
    const runner = new ChatCompletionStream(null);
    runner._run(() => runner._fromReadableStream(stream));
    return runner;
  }

  static createChatCompletion<ParsedT>(
    client: OpenAI,
    params: ChatCompletionStreamParams,
    options?: Core.RequestOptions,
  ): ChatCompletionStream<ParsedT> {
    const runner = new ChatCompletionStream<ParsedT>(params as ChatCompletionCreateParamsStreaming);
    runner._run(() =>
      runner._runChatCompletion(
        client,
        { ...params, stream: true },
        { ...options, headers: { ...options?.headers, 'X-Stainless-Helper-Method': 'stream' } },
      ),
    );
    return runner;
  }

  #beginRequest() {
    if (this.ended) return;
    this.#currentChatCompletionSnapshot = undefined;
  }

  #getChoiceEventState(choice: ChatCompletionSnapshot.Choice): ChoiceEventState {
    let state = this.#choiceEventStates[choice.index];
    if (state) {
      return state;
    }

    state = {
      content_done: false,
      refusal_done: false,
      logprobs_content_done: false,
      logprobs_refusal_done: false,
      done_tool_calls: new Set(),
      current_tool_call_index: null,
    };
    this.#choiceEventStates[choice.index] = state;
    return state;
  }

  #addChunk(this: ChatCompletionStream<ParsedT>, chunk: ChatCompletionChunk) {
    if (this.ended) return;

    const completion = this.#accumulateChatCompletion(chunk);
    this._emit('chunk', chunk, completion);

    for (const choice of chunk.choices) {
      const choiceSnapshot = completion.choices[choice.index]!;

      if (
        choice.delta.content != null &&
        choiceSnapshot.message?.role === 'assistant' &&
        choiceSnapshot.message?.content
      ) {
        this._emit('content', choice.delta.content, choiceSnapshot.message.content);
        this._emit('content.delta', {
          delta: choice.delta.content,
          snapshot: choiceSnapshot.message.content,
          parsed: choiceSnapshot.message.parsed,
        });
      }

      if (
        choice.delta.refusal != null &&
        choiceSnapshot.message?.role === 'assistant' &&
        choiceSnapshot.message?.refusal
      ) {
        this._emit('refusal.delta', {
          delta: choice.delta.refusal,
          snapshot: choiceSnapshot.message.refusal,
        });
      }

      if (choice.logprobs?.content != null && choiceSnapshot.message?.role === 'assistant') {
        this._emit('logprobs.content.delta', {
          content: choice.logprobs?.content,
          snapshot: choiceSnapshot.logprobs?.content ?? [],
        });
      }

      if (choice.logprobs?.refusal != null && choiceSnapshot.message?.role === 'assistant') {
        this._emit('logprobs.refusal.delta', {
          refusal: choice.logprobs?.refusal,
          snapshot: choiceSnapshot.logprobs?.refusal ?? [],
        });
      }

      const state = this.#getChoiceEventState(choiceSnapshot);

      if (choiceSnapshot.finish_reason) {
        this.#emitContentDoneEvents(choiceSnapshot);

        if (state.current_tool_call_index != null) {
          this.#emitToolCallDoneEvent(choiceSnapshot, state.current_tool_call_index);
        }
      }

      for (const toolCall of choice.delta.tool_calls ?? []) {
        if (state.current_tool_call_index !== toolCall.index) {
          this.#emitContentDoneEvents(choiceSnapshot);

          // new tool call started, the previous one is done
          if (state.current_tool_call_index != null) {
            this.#emitToolCallDoneEvent(choiceSnapshot, state.current_tool_call_index);
          }
        }

        state.current_tool_call_index = toolCall.index;
      }

      for (const toolCallDelta of choice.delta.tool_calls ?? []) {
        const toolCallSnapshot = choiceSnapshot.message.tool_calls?.[toolCallDelta.index];
        if (!toolCallSnapshot?.type) {
          continue;
        }

        if (toolCallSnapshot?.type === 'function') {
          this._emit('tool_calls.function.arguments.delta', {
            name: toolCallSnapshot.function?.name,
            index: toolCallDelta.index,
            arguments: toolCallSnapshot.function.arguments,
            parsed_arguments: toolCallSnapshot.function.parsed_arguments,
            arguments_delta: toolCallDelta.function?.arguments ?? '',
          });
        } else {
          assertNever(toolCallSnapshot?.type);
        }
      }
    }
  }

  #emitToolCallDoneEvent(choiceSnapshot: ChatCompletionSnapshot.Choice, toolCallIndex: number) {
    const state = this.#getChoiceEventState(choiceSnapshot);
    if (state.done_tool_calls.has(toolCallIndex)) {
      // we've already fired the done event
      return;
    }

    const toolCallSnapshot = choiceSnapshot.message.tool_calls?.[toolCallIndex];
    if (!toolCallSnapshot) {
      throw new Error('no tool call snapshot');
    }
    if (!toolCallSnapshot.type) {
      throw new Error('tool call snapshot missing `type`');
    }

    if (toolCallSnapshot.type === 'function') {
      const inputTool = this.#params?.tools?.find(
        (tool) => tool.type === 'function' && tool.function.name === toolCallSnapshot.function.name,
      );

      this._emit('tool_calls.function.arguments.done', {
        name: toolCallSnapshot.function.name,
        index: toolCallIndex,
        arguments: toolCallSnapshot.function.arguments,
        parsed_arguments:
          isAutoParsableTool(inputTool) ? inputTool.$parseRaw(toolCallSnapshot.function.arguments)
          : inputTool?.function.strict ? JSON.parse(toolCallSnapshot.function.arguments)
          : null,
      });
    } else {
      assertNever(toolCallSnapshot.type);
    }
  }

  #emitContentDoneEvents(choiceSnapshot: ChatCompletionSnapshot.Choice) {
    const state = this.#getChoiceEventState(choiceSnapshot);

    if (choiceSnapshot.message.content && !state.content_done) {
      state.content_done = true;

      const responseFormat = this.#getAutoParseableResponseFormat();

      this._emit('content.done', {
        content: choiceSnapshot.message.content,
        parsed: responseFormat ? responseFormat.$parseRaw(choiceSnapshot.message.content) : (null as any),
      });
    }

    if (choiceSnapshot.message.refusal && !state.refusal_done) {
      state.refusal_done = true;

      this._emit('refusal.done', { refusal: choiceSnapshot.message.refusal });
    }

    if (choiceSnapshot.logprobs?.content && !state.logprobs_content_done) {
      state.logprobs_content_done = true;

      this._emit('logprobs.content.done', { content: choiceSnapshot.logprobs.content });
    }

    if (choiceSnapshot.logprobs?.refusal && !state.logprobs_refusal_done) {
      state.logprobs_refusal_done = true;

      this._emit('logprobs.refusal.done', { refusal: choiceSnapshot.logprobs.refusal });
    }
  }

  #endRequest(): ParsedChatCompletion<ParsedT> {
    if (this.ended) {
      throw new OpenAIError(`stream has ended, this shouldn't happen`);
    }
    const snapshot = this.#currentChatCompletionSnapshot;
    if (!snapshot) {
      throw new OpenAIError(`request ended without sending any chunks`);
    }
    this.#currentChatCompletionSnapshot = undefined;
    this.#choiceEventStates = [];
    return finalizeChatCompletion(snapshot, this.#params);
  }

  protected override async _createChatCompletion(
    client: OpenAI,
    params: ChatCompletionCreateParams,
    options?: Core.RequestOptions,
  ): Promise<ParsedChatCompletion<ParsedT>> {
    super._createChatCompletion;
    const signal = options?.signal;
    if (signal) {
      if (signal.aborted) this.controller.abort();
      signal.addEventListener('abort', () => this.controller.abort());
    }
    this.#beginRequest();

    const stream = await client.chat.completions.create(
      { ...params, stream: true },
      { ...options, signal: this.controller.signal },
    );
    this._connected();
    for await (const chunk of stream) {
      this.#addChunk(chunk);
    }
    if (stream.controller.signal?.aborted) {
      throw new APIUserAbortError();
    }
    return this._addChatCompletion(this.#endRequest());
  }

  protected async _fromReadableStream(
    readableStream: ReadableStream,
    options?: Core.RequestOptions,
  ): Promise<ChatCompletion> {
    const signal = options?.signal;
    if (signal) {
      if (signal.aborted) this.controller.abort();
      signal.addEventListener('abort', () => this.controller.abort());
    }
    this.#beginRequest();
    this._connected();
    const stream = Stream.fromReadableStream<ChatCompletionChunk>(readableStream, this.controller);
    let chatId;
    for await (const chunk of stream) {
      if (chatId && chatId !== chunk.id) {
        // A new request has been made.
        this._addChatCompletion(this.#endRequest());
      }

      this.#addChunk(chunk);
      chatId = chunk.id;
    }
    if (stream.controller.signal?.aborted) {
      throw new APIUserAbortError();
    }
    return this._addChatCompletion(this.#endRequest());
  }

  #getAutoParseableResponseFormat(): AutoParseableResponseFormat<ParsedT> | null {
    const responseFormat = this.#params?.response_format;
    if (isAutoParsableResponseFormat<ParsedT>(responseFormat)) {
      return responseFormat;
    }

    return null;
  }

  #accumulateChatCompletion(chunk: ChatCompletionChunk): ChatCompletionSnapshot {
    let snapshot = this.#currentChatCompletionSnapshot;
    const { choices, ...rest } = chunk;
    if (!snapshot) {
      snapshot = this.#currentChatCompletionSnapshot = {
        ...rest,
        choices: [],
      };
    } else {
      Object.assign(snapshot, rest);
    }

    for (const { delta, finish_reason, index, logprobs = null, ...other } of chunk.choices) {
      let choice = snapshot.choices[index];
      if (!choice) {
        choice = snapshot.choices[index] = { finish_reason, index, message: {}, logprobs, ...other };
      }

      if (logprobs) {
        if (!choice.logprobs) {
          choice.logprobs = Object.assign({}, logprobs);
        } else {
          const { content, refusal, ...rest } = logprobs;
          assertIsEmpty(rest);
          Object.assign(choice.logprobs, rest);

          if (content) {
            choice.logprobs.content ??= [];
            choice.logprobs.content.push(...content);
          }

          if (refusal) {
            choice.logprobs.refusal ??= [];
            choice.logprobs.refusal.push(...refusal);
          }
        }
      }

      if (finish_reason) {
        choice.finish_reason = finish_reason;

        if (this.#params && hasAutoParseableInput(this.#params)) {
          if (finish_reason === 'length') {
            throw new LengthFinishReasonError();
          }

          if (finish_reason === 'content_filter') {
            throw new ContentFilterFinishReasonError();
          }
        }
      }

      Object.assign(choice, other);

      if (!delta) continue; // Shouldn't happen; just in case.

      const { content, refusal, function_call, role, tool_calls, ...rest } = delta;
      assertIsEmpty(rest);
      Object.assign(choice.message, rest);

      if (refusal) {
        choice.message.refusal = (choice.message.refusal || '') + refusal;
      }

      if (role) choice.message.role = role;
      if (function_call) {
        if (!choice.message.function_call) {
          choice.message.function_call = function_call;
        } else {
          if (function_call.name) choice.message.function_call.name = function_call.name;
          if (function_call.arguments) {
            choice.message.function_call.arguments ??= '';
            choice.message.function_call.arguments += function_call.arguments;
          }
        }
      }
      if (content) {
        choice.message.content = (choice.message.content || '') + content;

        if (!choice.message.refusal && this.#getAutoParseableResponseFormat()) {
          choice.message.parsed = partialParse(choice.message.content);
        }
      }

      if (tool_calls) {
        if (!choice.message.tool_calls) choice.message.tool_calls = [];

        for (const { index, id, type, function: fn, ...rest } of tool_calls) {
          const tool_call = (choice.message.tool_calls[index] ??=
            {} as ChatCompletionSnapshot.Choice.Message.ToolCall);
          Object.assign(tool_call, rest);
          if (id) tool_call.id = id;
          if (type) tool_call.type = type;
          if (fn) tool_call.function ??= { name: fn.name ?? '', arguments: '' };
          if (fn?.name) tool_call.function!.name = fn.name;
          if (fn?.arguments) {
            tool_call.function!.arguments += fn.arguments;

            if (shouldParseToolCall(this.#params, tool_call)) {
              tool_call.function!.parsed_arguments = partialParse(tool_call.function!.arguments);
            }
          }
        }
      }
    }
    return snapshot;
  }

  [Symbol.asyncIterator](this: ChatCompletionStream<ParsedT>): AsyncIterator<ChatCompletionChunk> {
    const pushQueue: ChatCompletionChunk[] = [];
    const readQueue: {
      resolve: (chunk: ChatCompletionChunk | undefined) => void;
      reject: (err: unknown) => void;
    }[] = [];
    let done = false;

    this.on('chunk', (chunk) => {
      const reader = readQueue.shift();
      if (reader) {
        reader.resolve(chunk);
      } else {
        pushQueue.push(chunk);
      }
    });

    this.on('end', () => {
      done = true;
      for (const reader of readQueue) {
        reader.resolve(undefined);
      }
      readQueue.length = 0;
    });

    this.on('abort', (err) => {
      done = true;
      for (const reader of readQueue) {
        reader.reject(err);
      }
      readQueue.length = 0;
    });

    this.on('error', (err) => {
      done = true;
      for (const reader of readQueue) {
        reader.reject(err);
      }
      readQueue.length = 0;
    });

    return {
      next: async (): Promise<IteratorResult<ChatCompletionChunk>> => {
        if (!pushQueue.length) {
          if (done) {
            return { value: undefined, done: true };
          }
          return new Promise<ChatCompletionChunk | undefined>((resolve, reject) =>
            readQueue.push({ resolve, reject }),
          ).then((chunk) => (chunk ? { value: chunk, done: false } : { value: undefined, done: true }));
        }
        const chunk = pushQueue.shift()!;
        return { value: chunk, done: false };
      },
      return: async () => {
        this.abort();
        return { value: undefined, done: true };
      },
    };
  }

  toReadableStream(): ReadableStream {
    const stream = new Stream(this[Symbol.asyncIterator].bind(this), this.controller);
    return stream.toReadableStream();
  }
}

function finalizeChatCompletion<ParsedT>(
  snapshot: ChatCompletionSnapshot,
  params: ChatCompletionCreateParams | null,
): ParsedChatCompletion<ParsedT> {
  const { id, choices, created, model, system_fingerprint, ...rest } = snapshot;
  const completion: ChatCompletion = {
    ...rest,
    id,
    choices: choices.map(
      ({ message, finish_reason, index, logprobs, ...choiceRest }): ChatCompletion.Choice => {
        if (!finish_reason) {
          throw new OpenAIError(`missing finish_reason for choice ${index}`);
        }

        const { content = null, function_call, tool_calls, ...messageRest } = message;
        const role = message.role as 'assistant'; // this is what we expect; in theory it could be different which would make our types a slight lie but would be fine.
        if (!role) {
          throw new OpenAIError(`missing role for choice ${index}`);
        }

        if (function_call) {
          const { arguments: args, name } = function_call;
          if (args == null) {
            throw new OpenAIError(`missing function_call.arguments for choice ${index}`);
          }

          if (!name) {
            throw new OpenAIError(`missing function_call.name for choice ${index}`);
          }

          return {
            ...choiceRest,
            message: {
              content,
              function_call: { arguments: args, name },
              role,
              refusal: message.refusal ?? null,
            },
            finish_reason,
            index,
            logprobs,
          };
        }

        if (tool_calls) {
          return {
            ...choiceRest,
            index,
            finish_reason,
            logprobs,
            message: {
              ...messageRest,
              role,
              content,
              refusal: message.refusal ?? null,
              tool_calls: tool_calls.map((tool_call, i) => {
                const { function: fn, type, id, ...toolRest } = tool_call;
                const { arguments: args, name, ...fnRest } = fn || {};
                if (id == null) {
                  throw new OpenAIError(`missing choices[${index}].tool_calls[${i}].id\n${str(snapshot)}`);
                }
                if (type == null) {
                  throw new OpenAIError(`missing choices[${index}].tool_calls[${i}].type\n${str(snapshot)}`);
                }
                if (name == null) {
                  throw new OpenAIError(
                    `missing choices[${index}].tool_calls[${i}].function.name\n${str(snapshot)}`,
                  );
                }
                if (args == null) {
                  throw new OpenAIError(
                    `missing choices[${index}].tool_calls[${i}].function.arguments\n${str(snapshot)}`,
                  );
                }

                return { ...toolRest, id, type, function: { ...fnRest, name, arguments: args } };
              }),
            },
          };
        }
        return {
          ...choiceRest,
          message: { ...messageRest, content, role, refusal: message.refusal ?? null },
          finish_reason,
          index,
          logprobs,
        };
      },
    ),
    created,
    model,
    object: 'chat.completion',
    ...(system_fingerprint ? { system_fingerprint } : {}),
  };

  return maybeParseChatCompletion(completion, params);
}

function str(x: unknown) {
  return JSON.stringify(x);
}

/**
 * Represents a streamed chunk of a chat completion response returned by model,
 * based on the provided input.
 */
export interface ChatCompletionSnapshot {
  /**
   * A unique identifier for the chat completion.
   */
  id: string;

  /**
   * A list of chat completion choices. Can be more than one if `n` is greater
   * than 1.
   */
  choices: Array<ChatCompletionSnapshot.Choice>;

  /**
   * The Unix timestamp (in seconds) of when the chat completion was created.
   */
  created: number;

  /**
   * The model to generate the completion.
   */
  model: string;

  // Note we do not include an "object" type on the snapshot,
  // because the object is not a valid "chat.completion" until finalized.
  // object: 'chat.completion';

  /**
   * This fingerprint represents the backend configuration that the model runs with.
   *
   * Can be used in conjunction with the `seed` request parameter to understand when
   * backend changes have been made that might impact determinism.
   */
  system_fingerprint?: string;
}

export namespace ChatCompletionSnapshot {
  export interface Choice {
    /**
     * A chat completion delta generated by streamed model responses.
     */
    message: Choice.Message;

    /**
     * The reason the model stopped generating tokens. This will be `stop` if the model
     * hit a natural stop point or a provided stop sequence, `length` if the maximum
     * number of tokens specified in the request was reached, `content_filter` if
     * content was omitted due to a flag from our content filters, or `function_call`
     * if the model called a function.
     */
    finish_reason: ChatCompletion.Choice['finish_reason'] | null;

    /**
     * Log probability information for the choice.
     */
    logprobs: ChatCompletion.Choice.Logprobs | null;

    /**
     * The index of the choice in the list of choices.
     */
    index: number;
  }

  export namespace Choice {
    /**
     * A chat completion delta generated by streamed model responses.
     */
    export interface Message {
      /**
       * The contents of the chunk message.
       */
      content?: string | null;

      refusal?: string | null;

      parsed?: unknown | null;

      /**
       * The name and arguments of a function that should be called, as generated by the
       * model.
       */
      function_call?: Message.FunctionCall;

      tool_calls?: Array<Message.ToolCall>;

      /**
       * The role of the author of this message.
       */
      role?: ChatCompletionRole;
    }

    export namespace Message {
      export interface ToolCall {
        /**
         * The ID of the tool call.
         */
        id: string;

        function: ToolCall.Function;

        /**
         * The type of the tool.
         */
        type: 'function';
      }

      export namespace ToolCall {
        export interface Function {
          /**
           * The arguments to call the function with, as generated by the model in JSON
           * format. Note that the model does not always generate valid JSON, and may
           * hallucinate parameters not defined by your function schema. Validate the
           * arguments in your code before calling your function.
           */
          arguments: string;

          parsed_arguments?: unknown;

          /**
           * The name of the function to call.
           */
          name: string;
        }
      }

      /**
       * The name and arguments of a function that should be called, as generated by the
       * model.
       */
      export interface FunctionCall {
        /**
         * The arguments to call the function with, as generated by the model in JSON
         * format. Note that the model does not always generate valid JSON, and may
         * hallucinate parameters not defined by your function schema. Validate the
         * arguments in your code before calling your function.
         */
        arguments?: string;

        /**
         * The name of the function to call.
         */
        name?: string;
      }
    }
  }
}

type AssertIsEmpty<T extends {}> = keyof T extends never ? T : never;

/**
 * Ensures the given argument is an empty object, useful for
 * asserting that all known properties on an object have been
 * destructured.
 */
function assertIsEmpty<T extends {}>(obj: AssertIsEmpty<T>): asserts obj is AssertIsEmpty<T> {
  return;
}

function assertNever(_x: never) {}


================================================
File: src/lib/ChatCompletionStreamingRunner.ts
================================================
import {
  type ChatCompletionChunk,
  type ChatCompletionCreateParamsStreaming,
} from '../resources/chat/completions';
import { RunnerOptions, type AbstractChatCompletionRunnerEvents } from './AbstractChatCompletionRunner';
import { type ReadableStream } from '../_shims/index';
import { RunnableTools, type BaseFunctionsArgs, type RunnableFunctions } from './RunnableFunction';
import { ChatCompletionSnapshot, ChatCompletionStream } from './ChatCompletionStream';
import OpenAI from '../index';
import { AutoParseableTool } from '../lib/parser';

export interface ChatCompletionStreamEvents extends AbstractChatCompletionRunnerEvents {
  content: (contentDelta: string, contentSnapshot: string) => void;
  chunk: (chunk: ChatCompletionChunk, snapshot: ChatCompletionSnapshot) => void;
}

export type ChatCompletionStreamingFunctionRunnerParams<FunctionsArgs extends BaseFunctionsArgs> = Omit<
  ChatCompletionCreateParamsStreaming,
  'functions'
> & {
  functions: RunnableFunctions<FunctionsArgs>;
};

export type ChatCompletionStreamingToolRunnerParams<FunctionsArgs extends BaseFunctionsArgs> = Omit<
  ChatCompletionCreateParamsStreaming,
  'tools'
> & {
  tools: RunnableTools<FunctionsArgs> | AutoParseableTool<any, true>[];
};

export class ChatCompletionStreamingRunner<ParsedT = null>
  extends ChatCompletionStream<ParsedT>
  implements AsyncIterable<ChatCompletionChunk>
{
  static override fromReadableStream(stream: ReadableStream): ChatCompletionStreamingRunner<null> {
    const runner = new ChatCompletionStreamingRunner(null);
    runner._run(() => runner._fromReadableStream(stream));
    return runner;
  }

  /** @deprecated - please use `runTools` instead. */
  static runFunctions<T extends (string | object)[]>(
    client: OpenAI,
    params: ChatCompletionStreamingFunctionRunnerParams<T>,
    options?: RunnerOptions,
  ): ChatCompletionStreamingRunner<null> {
    const runner = new ChatCompletionStreamingRunner(null);
    const opts = {
      ...options,
      headers: { ...options?.headers, 'X-Stainless-Helper-Method': 'runFunctions' },
    };
    runner._run(() => runner._runFunctions(client, params, opts));
    return runner;
  }

  static runTools<T extends (string | object)[], ParsedT = null>(
    client: OpenAI,
    params: ChatCompletionStreamingToolRunnerParams<T>,
    options?: RunnerOptions,
  ): ChatCompletionStreamingRunner<ParsedT> {
    const runner = new ChatCompletionStreamingRunner<ParsedT>(
      // @ts-expect-error TODO these types are incompatible
      params,
    );
    const opts = {
      ...options,
      headers: { ...options?.headers, 'X-Stainless-Helper-Method': 'runTools' },
    };
    runner._run(() => runner._runTools(client, params, opts));
    return runner;
  }
}


================================================
File: src/lib/EventEmitter.ts
================================================
type EventListener<Events, EventType extends keyof Events> = Events[EventType];

type EventListeners<Events, EventType extends keyof Events> = Array<{
  listener: EventListener<Events, EventType>;
  once?: boolean;
}>;

export type EventParameters<Events, EventType extends keyof Events> = {
  [Event in EventType]: EventListener<Events, EventType> extends (...args: infer P) => any ? P : never;
}[EventType];

export class EventEmitter<EventTypes extends Record<string, (...args: any) => any>> {
  #listeners: {
    [Event in keyof EventTypes]?: EventListeners<EventTypes, Event>;
  } = {};

  /**
   * Adds the listener function to the end of the listeners array for the event.
   * No checks are made to see if the listener has already been added. Multiple calls passing
   * the same combination of event and listener will result in the listener being added, and
   * called, multiple times.
   * @returns this, so that calls can be chained
   */
  on<Event extends keyof EventTypes>(event: Event, listener: EventListener<EventTypes, Event>): this {
    const listeners: EventListeners<EventTypes, Event> =
      this.#listeners[event] || (this.#listeners[event] = []);
    listeners.push({ listener });
    return this;
  }

  /**
   * Removes the specified listener from the listener array for the event.
   * off() will remove, at most, one instance of a listener from the listener array. If any single
   * listener has been added multiple times to the listener array for the specified event, then
   * off() must be called multiple times to remove each instance.
   * @returns this, so that calls can be chained
   */
  off<Event extends keyof EventTypes>(event: Event, listener: EventListener<EventTypes, Event>): this {
    const listeners = this.#listeners[event];
    if (!listeners) return this;
    const index = listeners.findIndex((l) => l.listener === listener);
    if (index >= 0) listeners.splice(index, 1);
    return this;
  }

  /**
   * Adds a one-time listener function for the event. The next time the event is triggered,
   * this listener is removed and then invoked.
   * @returns this, so that calls can be chained
   */
  once<Event extends keyof EventTypes>(event: Event, listener: EventListener<EventTypes, Event>): this {
    const listeners: EventListeners<EventTypes, Event> =
      this.#listeners[event] || (this.#listeners[event] = []);
    listeners.push({ listener, once: true });
    return this;
  }

  /**
   * This is similar to `.once()`, but returns a Promise that resolves the next time
   * the event is triggered, instead of calling a listener callback.
   * @returns a Promise that resolves the next time given event is triggered,
   * or rejects if an error is emitted.  (If you request the 'error' event,
   * returns a promise that resolves with the error).
   *
   * Example:
   *
   *   const message = await stream.emitted('message') // rejects if the stream errors
   */
  emitted<Event extends keyof EventTypes>(
    event: Event,
  ): Promise<
    EventParameters<EventTypes, Event> extends [infer Param] ? Param
    : EventParameters<EventTypes, Event> extends [] ? void
    : EventParameters<EventTypes, Event>
  > {
    return new Promise((resolve, reject) => {
      // TODO: handle errors
      this.once(event, resolve as any);
    });
  }

  protected _emit<Event extends keyof EventTypes>(
    this: EventEmitter<EventTypes>,
    event: Event,
    ...args: EventParameters<EventTypes, Event>
  ) {
    const listeners: EventListeners<EventTypes, Event> | undefined = this.#listeners[event];
    if (listeners) {
      this.#listeners[event] = listeners.filter((l) => !l.once) as any;
      listeners.forEach(({ listener }: any) => listener(...(args as any)));
    }
  }

  protected _hasListener(event: keyof EventTypes): boolean {
    const listeners = this.#listeners[event];
    return listeners && listeners.length > 0;
  }
}


================================================
File: src/lib/EventStream.ts
================================================
import { APIUserAbortError, OpenAIError } from '../error';

export class EventStream<EventTypes extends BaseEvents> {
  controller: AbortController = new AbortController();

  #connectedPromise: Promise<void>;
  #resolveConnectedPromise: () => void = () => {};
  #rejectConnectedPromise: (error: OpenAIError) => void = () => {};

  #endPromise: Promise<void>;
  #resolveEndPromise: () => void = () => {};
  #rejectEndPromise: (error: OpenAIError) => void = () => {};

  #listeners: {
    [Event in keyof EventTypes]?: EventListeners<EventTypes, Event>;
  } = {};

  #ended = false;
  #errored = false;
  #aborted = false;
  #catchingPromiseCreated = false;

  constructor() {
    this.#connectedPromise = new Promise<void>((resolve, reject) => {
      this.#resolveConnectedPromise = resolve;
      this.#rejectConnectedPromise = reject;
    });

    this.#endPromise = new Promise<void>((resolve, reject) => {
      this.#resolveEndPromise = resolve;
      this.#rejectEndPromise = reject;
    });

    // Don't let these promises cause unhandled rejection errors.
    // we will manually cause an unhandled rejection error later
    // if the user hasn't registered any error listener or called
    // any promise-returning method.
    this.#connectedPromise.catch(() => {});
    this.#endPromise.catch(() => {});
  }

  protected _run(this: EventStream<EventTypes>, executor: () => Promise<any>) {
    // Unfortunately if we call `executor()` immediately we get runtime errors about
    // references to `this` before the `super()` constructor call returns.
    setTimeout(() => {
      executor().then(() => {
        this._emitFinal();
        this._emit('end');
      }, this.#handleError.bind(this));
    }, 0);
  }

  protected _connected(this: EventStream<EventTypes>) {
    if (this.ended) return;
    this.#resolveConnectedPromise();
    this._emit('connect');
  }

  get ended(): boolean {
    return this.#ended;
  }

  get errored(): boolean {
    return this.#errored;
  }

  get aborted(): boolean {
    return this.#aborted;
  }

  abort() {
    this.controller.abort();
  }

  /**
   * Adds the listener function to the end of the listeners array for the event.
   * No checks are made to see if the listener has already been added. Multiple calls passing
   * the same combination of event and listener will result in the listener being added, and
   * called, multiple times.
   * @returns this ChatCompletionStream, so that calls can be chained
   */
  on<Event extends keyof EventTypes>(event: Event, listener: EventListener<EventTypes, Event>): this {
    const listeners: EventListeners<EventTypes, Event> =
      this.#listeners[event] || (this.#listeners[event] = []);
    listeners.push({ listener });
    return this;
  }

  /**
   * Removes the specified listener from the listener array for the event.
   * off() will remove, at most, one instance of a listener from the listener array. If any single
   * listener has been added multiple times to the listener array for the specified event, then
   * off() must be called multiple times to remove each instance.
   * @returns this ChatCompletionStream, so that calls can be chained
   */
  off<Event extends keyof EventTypes>(event: Event, listener: EventListener<EventTypes, Event>): this {
    const listeners = this.#listeners[event];
    if (!listeners) return this;
    const index = listeners.findIndex((l) => l.listener === listener);
    if (index >= 0) listeners.splice(index, 1);
    return this;
  }

  /**
   * Adds a one-time listener function for the event. The next time the event is triggered,
   * this listener is removed and then invoked.
   * @returns this ChatCompletionStream, so that calls can be chained
   */
  once<Event extends keyof EventTypes>(event: Event, listener: EventListener<EventTypes, Event>): this {
    const listeners: EventListeners<EventTypes, Event> =
      this.#listeners[event] || (this.#listeners[event] = []);
    listeners.push({ listener, once: true });
    return this;
  }

  /**
   * This is similar to `.once()`, but returns a Promise that resolves the next time
   * the event is triggered, instead of calling a listener callback.
   * @returns a Promise that resolves the next time given event is triggered,
   * or rejects if an error is emitted.  (If you request the 'error' event,
   * returns a promise that resolves with the error).
   *
   * Example:
   *
   *   const message = await stream.emitted('message') // rejects if the stream errors
   */
  emitted<Event extends keyof EventTypes>(
    event: Event,
  ): Promise<
    EventParameters<EventTypes, Event> extends [infer Param] ? Param
    : EventParameters<EventTypes, Event> extends [] ? void
    : EventParameters<EventTypes, Event>
  > {
    return new Promise((resolve, reject) => {
      this.#catchingPromiseCreated = true;
      if (event !== 'error') this.once('error', reject);
      this.once(event, resolve as any);
    });
  }

  async done(): Promise<void> {
    this.#catchingPromiseCreated = true;
    await this.#endPromise;
  }

  #handleError(this: EventStream<EventTypes>, error: unknown) {
    this.#errored = true;
    if (error instanceof Error && error.name === 'AbortError') {
      error = new APIUserAbortError();
    }
    if (error instanceof APIUserAbortError) {
      this.#aborted = true;
      return this._emit('abort', error);
    }
    if (error instanceof OpenAIError) {
      return this._emit('error', error);
    }
    if (error instanceof Error) {
      const openAIError: OpenAIError = new OpenAIError(error.message);
      // @ts-ignore
      openAIError.cause = error;
      return this._emit('error', openAIError);
    }
    return this._emit('error', new OpenAIError(String(error)));
  }

  _emit<Event extends keyof BaseEvents>(event: Event, ...args: EventParameters<BaseEvents, Event>): void;
  _emit<Event extends keyof EventTypes>(event: Event, ...args: EventParameters<EventTypes, Event>): void;
  _emit<Event extends keyof EventTypes>(
    this: EventStream<EventTypes>,
    event: Event,
    ...args: EventParameters<EventTypes, Event>
  ) {
    // make sure we don't emit any events after end
    if (this.#ended) {
      return;
    }

    if (event === 'end') {
      this.#ended = true;
      this.#resolveEndPromise();
    }

    const listeners: EventListeners<EventTypes, Event> | undefined = this.#listeners[event];
    if (listeners) {
      this.#listeners[event] = listeners.filter((l) => !l.once) as any;
      listeners.forEach(({ listener }: any) => listener(...(args as any)));
    }

    if (event === 'abort') {
      const error = args[0] as APIUserAbortError;
      if (!this.#catchingPromiseCreated && !listeners?.length) {
        Promise.reject(error);
      }
      this.#rejectConnectedPromise(error);
      this.#rejectEndPromise(error);
      this._emit('end');
      return;
    }

    if (event === 'error') {
      // NOTE: _emit('error', error) should only be called from #handleError().

      const error = args[0] as OpenAIError;
      if (!this.#catchingPromiseCreated && !listeners?.length) {
        // Trigger an unhandled rejection if the user hasn't registered any error handlers.
        // If you are seeing stack traces here, make sure to handle errors via either:
        // - runner.on('error', () => ...)
        // - await runner.done()
        // - await runner.finalChatCompletion()
        // - etc.
        Promise.reject(error);
      }
      this.#rejectConnectedPromise(error);
      this.#rejectEndPromise(error);
      this._emit('end');
    }
  }

  protected _emitFinal(): void {}
}

type EventListener<Events, EventType extends keyof Events> = Events[EventType];

type EventListeners<Events, EventType extends keyof Events> = Array<{
  listener: EventListener<Events, EventType>;
  once?: boolean;
}>;

export type EventParameters<Events, EventType extends keyof Events> = {
  [Event in EventType]: EventListener<Events, EventType> extends (...args: infer P) => any ? P : never;
}[EventType];

export interface BaseEvents {
  connect: () => void;
  error: (error: OpenAIError) => void;
  abort: (error: APIUserAbortError) => void;
  end: () => void;
}


================================================
File: src/lib/RunnableFunction.ts
================================================
import { type ChatCompletionRunner } from './ChatCompletionRunner';
import { type ChatCompletionStreamingRunner } from './ChatCompletionStreamingRunner';
import { JSONSchema } from './jsonschema';

type PromiseOrValue<T> = T | Promise<T>;

export type RunnableFunctionWithParse<Args extends object> = {
  /**
   * @param args the return value from `parse`.
   * @param runner the runner evaluating this callback.
   * @returns a string to send back to OpenAI.
   */
  function: (
    args: Args,
    runner: ChatCompletionRunner<unknown> | ChatCompletionStreamingRunner<unknown>,
  ) => PromiseOrValue<unknown>;
  /**
   * @param input the raw args from the OpenAI function call.
   * @returns the parsed arguments to pass to `function`
   */
  parse: (input: string) => PromiseOrValue<Args>;
  /**
   * The parameters the function accepts, describes as a JSON Schema object.
   */
  parameters: JSONSchema;
  /**
   * A description of what the function does, used by the model to choose when and how to call the function.
   */
  description: string;
  /**
   * The name of the function to be called. Will default to function.name if omitted.
   */
  name?: string | undefined;
  strict?: boolean | undefined;
};

export type RunnableFunctionWithoutParse = {
  /**
   * @param args the raw args from the OpenAI function call.
   * @returns a string to send back to OpenAI
   */
  function: (
    args: string,
    runner: ChatCompletionRunner<unknown> | ChatCompletionStreamingRunner<unknown>,
  ) => PromiseOrValue<unknown>;
  /**
   * The parameters the function accepts, describes as a JSON Schema object.
   */
  parameters: JSONSchema;
  /**
   * A description of what the function does, used by the model to choose when and how to call the function.
   */
  description: string;
  /**
   * The name of the function to be called. Will default to function.name if omitted.
   */
  name?: string | undefined;
  strict?: boolean | undefined;
};

export type RunnableFunction<Args extends object | string> =
  Args extends string ? RunnableFunctionWithoutParse
  : Args extends object ? RunnableFunctionWithParse<Args>
  : never;

export type RunnableToolFunction<Args extends object | string> =
  Args extends string ? RunnableToolFunctionWithoutParse
  : Args extends object ? RunnableToolFunctionWithParse<Args>
  : never;

export type RunnableToolFunctionWithoutParse = {
  type: 'function';
  function: RunnableFunctionWithoutParse;
};
export type RunnableToolFunctionWithParse<Args extends object> = {
  type: 'function';
  function: RunnableFunctionWithParse<Args>;
};

export function isRunnableFunctionWithParse<Args extends object>(
  fn: any,
): fn is RunnableFunctionWithParse<Args> {
  return typeof (fn as any).parse === 'function';
}

export type BaseFunctionsArgs = readonly (object | string)[];

export type RunnableFunctions<FunctionsArgs extends BaseFunctionsArgs> =
  [any[]] extends [FunctionsArgs] ? readonly RunnableFunction<any>[]
  : {
      [Index in keyof FunctionsArgs]: Index extends number ? RunnableFunction<FunctionsArgs[Index]>
      : FunctionsArgs[Index];
    };

export type RunnableTools<FunctionsArgs extends BaseFunctionsArgs> =
  [any[]] extends [FunctionsArgs] ? readonly RunnableToolFunction<any>[]
  : {
      [Index in keyof FunctionsArgs]: Index extends number ? RunnableToolFunction<FunctionsArgs[Index]>
      : FunctionsArgs[Index];
    };

/**
 * This is helper class for passing a `function` and `parse` where the `function`
 * argument type matches the `parse` return type.
 *
 * @deprecated - please use ParsingToolFunction instead.
 */
export class ParsingFunction<Args extends object> {
  function: RunnableFunctionWithParse<Args>['function'];
  parse: RunnableFunctionWithParse<Args>['parse'];
  parameters: RunnableFunctionWithParse<Args>['parameters'];
  description: RunnableFunctionWithParse<Args>['description'];
  name?: RunnableFunctionWithParse<Args>['name'];

  constructor(input: RunnableFunctionWithParse<Args>) {
    this.function = input.function;
    this.parse = input.parse;
    this.parameters = input.parameters;
    this.description = input.description;
    this.name = input.name;
  }
}

/**
 * This is helper class for passing a `function` and `parse` where the `function`
 * argument type matches the `parse` return type.
 */
export class ParsingToolFunction<Args extends object> {
  type: 'function';
  function: RunnableFunctionWithParse<Args>;

  constructor(input: RunnableFunctionWithParse<Args>) {
    this.type = 'function';
    this.function = input;
  }
}


================================================
File: src/lib/Util.ts
================================================
/**
 * Like `Promise.allSettled()` but throws an error if any promises are rejected.
 */
export const allSettledWithThrow = async <R>(promises: Promise<R>[]): Promise<R[]> => {
  const results = await Promise.allSettled(promises);
  const rejected = results.filter((result): result is PromiseRejectedResult => result.status === 'rejected');
  if (rejected.length) {
    for (const result of rejected) {
      console.error(result.reason);
    }

    throw new Error(`${rejected.length} promise(s) failed - see the above errors`);
  }

  // Note: TS was complaining about using `.filter().map()` here for some reason
  const values: R[] = [];
  for (const result of results) {
    if (result.status === 'fulfilled') {
      values.push(result.value);
    }
  }
  return values;
};


================================================
File: src/lib/chatCompletionUtils.ts
================================================
import {
  type ChatCompletionAssistantMessageParam,
  type ChatCompletionFunctionMessageParam,
  type ChatCompletionMessageParam,
  type ChatCompletionToolMessageParam,
} from '../resources';

export const isAssistantMessage = (
  message: ChatCompletionMessageParam | null | undefined,
): message is ChatCompletionAssistantMessageParam => {
  return message?.role === 'assistant';
};

export const isFunctionMessage = (
  message: ChatCompletionMessageParam | null | undefined,
): message is ChatCompletionFunctionMessageParam => {
  return message?.role === 'function';
};

export const isToolMessage = (
  message: ChatCompletionMessageParam | null | undefined,
): message is ChatCompletionToolMessageParam => {
  return message?.role === 'tool';
};

export function isPresent<T>(obj: T | null | undefined): obj is T {
  return obj != null;
}


================================================
File: src/lib/jsonschema.ts
================================================
// File mostly copied from @types/json-schema, but stripped down a bit for brevity
// https://github.com/DefinitelyTyped/DefinitelyTyped/blob/817274f3280152ba2929a6067c93df8b34c4c9aa/types/json-schema/index.d.ts
//
// ==================================================================================================
// JSON Schema Draft 07
// ==================================================================================================
// https://tools.ietf.org/html/draft-handrews-json-schema-validation-01
// --------------------------------------------------------------------------------------------------

/**
 * Primitive type
 * @see https://tools.ietf.org/html/draft-handrews-json-schema-validation-01#section-6.1.1
 */
export type JSONSchemaTypeName =
  | ({} & string)
  | 'string'
  | 'number'
  | 'integer'
  | 'boolean'
  | 'object'
  | 'array'
  | 'null';

/**
 * Primitive type
 * @see https://tools.ietf.org/html/draft-handrews-json-schema-validation-01#section-6.1.1
 */
export type JSONSchemaType =
  | string //
  | number
  | boolean
  | JSONSchemaObject
  | JSONSchemaArray
  | null;

// Workaround for infinite type recursion
export interface JSONSchemaObject {
  [key: string]: JSONSchemaType;
}

// Workaround for infinite type recursion
// https://github.com/Microsoft/TypeScript/issues/3496#issuecomment-128553540
export interface JSONSchemaArray extends Array<JSONSchemaType> {}

/**
 * Meta schema
 *
 * Recommended values:
 * - 'http://json-schema.org/schema#'
 * - 'http://json-schema.org/hyper-schema#'
 * - 'http://json-schema.org/draft-07/schema#'
 * - 'http://json-schema.org/draft-07/hyper-schema#'
 *
 * @see https://tools.ietf.org/html/draft-handrews-json-schema-validation-01#section-5
 */
export type JSONSchemaVersion = string;

/**
 * JSON Schema v7
 * @see https://tools.ietf.org/html/draft-handrews-json-schema-validation-01
 */
export type JSONSchemaDefinition = JSONSchema | boolean;
export interface JSONSchema {
  $id?: string | undefined;
  $comment?: string | undefined;

  /**
   * @see https://tools.ietf.org/html/draft-handrews-json-schema-validation-01#section-6.1
   */
  type?: JSONSchemaTypeName | JSONSchemaTypeName[] | undefined;
  enum?: JSONSchemaType[] | undefined;
  const?: JSONSchemaType | undefined;

  /**
   * @see https://tools.ietf.org/html/draft-handrews-json-schema-validation-01#section-6.2
   */
  multipleOf?: number | undefined;
  maximum?: number | undefined;
  exclusiveMaximum?: number | undefined;
  minimum?: number | undefined;
  exclusiveMinimum?: number | undefined;

  /**
   * @see https://tools.ietf.org/html/draft-handrews-json-schema-validation-01#section-6.3
   */
  maxLength?: number | undefined;
  minLength?: number | undefined;
  pattern?: string | undefined;

  /**
   * @see https://tools.ietf.org/html/draft-handrews-json-schema-validation-01#section-6.4
   */
  items?: JSONSchemaDefinition | JSONSchemaDefinition[] | undefined;
  additionalItems?: JSONSchemaDefinition | undefined;
  maxItems?: number | undefined;
  minItems?: number | undefined;
  uniqueItems?: boolean | undefined;
  contains?: JSONSchemaDefinition | undefined;

  /**
   * @see https://tools.ietf.org/html/draft-handrews-json-schema-validation-01#section-6.5
   */
  maxProperties?: number | undefined;
  minProperties?: number | undefined;
  required?: string[] | undefined;
  properties?:
    | {
        [key: string]: JSONSchemaDefinition;
      }
    | undefined;
  patternProperties?:
    | {
        [key: string]: JSONSchemaDefinition;
      }
    | undefined;
  additionalProperties?: JSONSchemaDefinition | undefined;
  propertyNames?: JSONSchemaDefinition | undefined;

  /**
   * @see https://tools.ietf.org/html/draft-handrews-json-schema-validation-01#section-6.6
   */
  if?: JSONSchemaDefinition | undefined;
  then?: JSONSchemaDefinition | undefined;
  else?: JSONSchemaDefinition | undefined;

  /**
   * @see https://tools.ietf.org/html/draft-handrews-json-schema-validation-01#section-6.7
   */
  allOf?: JSONSchemaDefinition[] | undefined;
  anyOf?: JSONSchemaDefinition[] | undefined;
  oneOf?: JSONSchemaDefinition[] | undefined;
  not?: JSONSchemaDefinition | undefined;

  /**
   * @see https://tools.ietf.org/html/draft-handrews-json-schema-validation-01#section-7
   */
  format?: string | undefined;

  /**
   * @see https://tools.ietf.org/html/draft-handrews-json-schema-validation-01#section-10
   */
  title?: string | undefined;
  description?: string | undefined;
  default?: JSONSchemaType | undefined;
  readOnly?: boolean | undefined;
  writeOnly?: boolean | undefined;
  examples?: JSONSchemaType | undefined;
}


================================================
File: src/lib/parser.ts
================================================
import {
  ChatCompletion,
  ChatCompletionCreateParams,
  ChatCompletionMessageToolCall,
  ChatCompletionTool,
} from '../resources/chat/completions';
import {
  ChatCompletionStreamingToolRunnerParams,
  ChatCompletionStreamParams,
  ChatCompletionToolRunnerParams,
  ParsedChatCompletion,
  ParsedChoice,
  ParsedFunctionToolCall,
} from '../resources/beta/chat/completions';
import { ResponseFormatJSONSchema } from '../resources/shared';
import { ContentFilterFinishReasonError, LengthFinishReasonError, OpenAIError } from '../error';

type AnyChatCompletionCreateParams =
  | ChatCompletionCreateParams
  | ChatCompletionToolRunnerParams<any>
  | ChatCompletionStreamingToolRunnerParams<any>
  | ChatCompletionStreamParams;

export type ExtractParsedContentFromParams<Params extends AnyChatCompletionCreateParams> =
  Params['response_format'] extends AutoParseableResponseFormat<infer P> ? P : null;

export type AutoParseableResponseFormat<ParsedT> = ResponseFormatJSONSchema & {
  __output: ParsedT; // type-level only

  $brand: 'auto-parseable-response-format';
  $parseRaw(content: string): ParsedT;
};

export function makeParseableResponseFormat<ParsedT>(
  response_format: ResponseFormatJSONSchema,
  parser: (content: string) => ParsedT,
): AutoParseableResponseFormat<ParsedT> {
  const obj = { ...response_format };

  Object.defineProperties(obj, {
    $brand: {
      value: 'auto-parseable-response-format',
      enumerable: false,
    },
    $parseRaw: {
      value: parser,
      enumerable: false,
    },
  });

  return obj as AutoParseableResponseFormat<ParsedT>;
}

export function isAutoParsableResponseFormat<ParsedT>(
  response_format: any,
): response_format is AutoParseableResponseFormat<ParsedT> {
  return response_format?.['$brand'] === 'auto-parseable-response-format';
}

type ToolOptions = {
  name: string;
  arguments: any;
  function?: ((args: any) => any) | undefined;
};

export type AutoParseableTool<
  OptionsT extends ToolOptions,
  HasFunction = OptionsT['function'] extends Function ? true : false,
> = ChatCompletionTool & {
  __arguments: OptionsT['arguments']; // type-level only
  __name: OptionsT['name']; // type-level only
  __hasFunction: HasFunction; // type-level only

  $brand: 'auto-parseable-tool';
  $callback: ((args: OptionsT['arguments']) => any) | undefined;
  $parseRaw(args: string): OptionsT['arguments'];
};

export function makeParseableTool<OptionsT extends ToolOptions>(
  tool: ChatCompletionTool,
  {
    parser,
    callback,
  }: {
    parser: (content: string) => OptionsT['arguments'];
    callback: ((args: any) => any) | undefined;
  },
): AutoParseableTool<OptionsT['arguments']> {
  const obj = { ...tool };

  Object.defineProperties(obj, {
    $brand: {
      value: 'auto-parseable-tool',
      enumerable: false,
    },
    $parseRaw: {
      value: parser,
      enumerable: false,
    },
    $callback: {
      value: callback,
      enumerable: false,
    },
  });

  return obj as AutoParseableTool<OptionsT['arguments']>;
}

export function isAutoParsableTool(tool: any): tool is AutoParseableTool<any> {
  return tool?.['$brand'] === 'auto-parseable-tool';
}

export function maybeParseChatCompletion<
  Params extends ChatCompletionCreateParams | null,
  ParsedT = Params extends null ? null : ExtractParsedContentFromParams<NonNullable<Params>>,
>(completion: ChatCompletion, params: Params): ParsedChatCompletion<ParsedT> {
  if (!params || !hasAutoParseableInput(params)) {
    return {
      ...completion,
      choices: completion.choices.map((choice) => ({
        ...choice,
        message: { ...choice.message, parsed: null, tool_calls: choice.message.tool_calls ?? [] },
      })),
    };
  }

  return parseChatCompletion(completion, params);
}

export function parseChatCompletion<
  Params extends ChatCompletionCreateParams,
  ParsedT = ExtractParsedContentFromParams<Params>,
>(completion: ChatCompletion, params: Params): ParsedChatCompletion<ParsedT> {
  const choices: Array<ParsedChoice<ParsedT>> = completion.choices.map((choice): ParsedChoice<ParsedT> => {
    if (choice.finish_reason === 'length') {
      throw new LengthFinishReasonError();
    }

    if (choice.finish_reason === 'content_filter') {
      throw new ContentFilterFinishReasonError();
    }

    return {
      ...choice,
      message: {
        ...choice.message,
        tool_calls: choice.message.tool_calls?.map((toolCall) => parseToolCall(params, toolCall)) ?? [],
        parsed:
          choice.message.content && !choice.message.refusal ?
            parseResponseFormat(params, choice.message.content)
          : null,
      },
    };
  });

  return { ...completion, choices };
}

function parseResponseFormat<
  Params extends ChatCompletionCreateParams,
  ParsedT = ExtractParsedContentFromParams<Params>,
>(params: Params, content: string): ParsedT | null {
  if (params.response_format?.type !== 'json_schema') {
    return null;
  }

  if (params.response_format?.type === 'json_schema') {
    if ('$parseRaw' in params.response_format) {
      const response_format = params.response_format as AutoParseableResponseFormat<ParsedT>;

      return response_format.$parseRaw(content);
    }

    return JSON.parse(content);
  }

  return null;
}

function parseToolCall<Params extends ChatCompletionCreateParams>(
  params: Params,
  toolCall: ChatCompletionMessageToolCall,
): ParsedFunctionToolCall {
  const inputTool = params.tools?.find((inputTool) => inputTool.function?.name === toolCall.function.name);
  return {
    ...toolCall,
    function: {
      ...toolCall.function,
      parsed_arguments:
        isAutoParsableTool(inputTool) ? inputTool.$parseRaw(toolCall.function.arguments)
        : inputTool?.function.strict ? JSON.parse(toolCall.function.arguments)
        : null,
    },
  };
}

export function shouldParseToolCall(
  params: ChatCompletionCreateParams | null | undefined,
  toolCall: ChatCompletionMessageToolCall,
): boolean {
  if (!params) {
    return false;
  }

  const inputTool = params.tools?.find((inputTool) => inputTool.function?.name === toolCall.function.name);
  return isAutoParsableTool(inputTool) || inputTool?.function.strict || false;
}

export function hasAutoParseableInput(params: AnyChatCompletionCreateParams): boolean {
  if (isAutoParsableResponseFormat(params.response_format)) {
    return true;
  }

  return (
    params.tools?.some(
      (t) => isAutoParsableTool(t) || (t.type === 'function' && t.function.strict === true),
    ) ?? false
  );
}

export function validateInputTools(tools: ChatCompletionTool[] | undefined) {
  for (const tool of tools ?? []) {
    if (tool.type !== 'function') {
      throw new OpenAIError(
        `Currently only \`function\` tool types support auto-parsing; Received \`${tool.type}\``,
      );
    }

    if (tool.function.strict !== true) {
      throw new OpenAIError(
        `The \`${tool.function.name}\` tool is not marked with \`strict: true\`. Only strict function tools can be auto-parsed`,
      );
    }
  }
}


================================================
File: src/lib/.keep
================================================
File generated from our OpenAPI spec by Stainless.

This directory can be used to store custom files to expand the SDK.
It is ignored by Stainless code generation and its content (other than this keep file) won't be touched.


================================================
File: src/resources/batches.ts
================================================
// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../resource';
import { isRequestOptions } from '../core';
import * as Core from '../core';
import * as BatchesAPI from './batches';
import * as Shared from './shared';
import { CursorPage, type CursorPageParams } from '../pagination';

export class Batches extends APIResource {
  /**
   * Creates and executes a batch from an uploaded file of requests
   */
  create(body: BatchCreateParams, options?: Core.RequestOptions): Core.APIPromise<Batch> {
    return this._client.post('/batches', { body, ...options });
  }

  /**
   * Retrieves a batch.
   */
  retrieve(batchId: string, options?: Core.RequestOptions): Core.APIPromise<Batch> {
    return this._client.get(`/batches/${batchId}`, options);
  }

  /**
   * List your organization's batches.
   */
  list(query?: BatchListParams, options?: Core.RequestOptions): Core.PagePromise<BatchesPage, Batch>;
  list(options?: Core.RequestOptions): Core.PagePromise<BatchesPage, Batch>;
  list(
    query: BatchListParams | Core.RequestOptions = {},
    options?: Core.RequestOptions,
  ): Core.PagePromise<BatchesPage, Batch> {
    if (isRequestOptions(query)) {
      return this.list({}, query);
    }
    return this._client.getAPIList('/batches', BatchesPage, { query, ...options });
  }

  /**
   * Cancels an in-progress batch. The batch will be in status `cancelling` for up to
   * 10 minutes, before changing to `cancelled`, where it will have partial results
   * (if any) available in the output file.
   */
  cancel(batchId: string, options?: Core.RequestOptions): Core.APIPromise<Batch> {
    return this._client.post(`/batches/${batchId}/cancel`, options);
  }
}

export class BatchesPage extends CursorPage<Batch> {}

export interface Batch {
  id: string;

  /**
   * The time frame within which the batch should be processed.
   */
  completion_window: string;

  /**
   * The Unix timestamp (in seconds) for when the batch was created.
   */
  created_at: number;

  /**
   * The OpenAI API endpoint used by the batch.
   */
  endpoint: string;

  /**
   * The ID of the input file for the batch.
   */
  input_file_id: string;

  /**
   * The object type, which is always `batch`.
   */
  object: 'batch';

  /**
   * The current status of the batch.
   */
  status:
    | 'validating'
    | 'failed'
    | 'in_progress'
    | 'finalizing'
    | 'completed'
    | 'expired'
    | 'cancelling'
    | 'cancelled';

  /**
   * The Unix timestamp (in seconds) for when the batch was cancelled.
   */
  cancelled_at?: number;

  /**
   * The Unix timestamp (in seconds) for when the batch started cancelling.
   */
  cancelling_at?: number;

  /**
   * The Unix timestamp (in seconds) for when the batch was completed.
   */
  completed_at?: number;

  /**
   * The ID of the file containing the outputs of requests with errors.
   */
  error_file_id?: string;

  errors?: Batch.Errors;

  /**
   * The Unix timestamp (in seconds) for when the batch expired.
   */
  expired_at?: number;

  /**
   * The Unix timestamp (in seconds) for when the batch will expire.
   */
  expires_at?: number;

  /**
   * The Unix timestamp (in seconds) for when the batch failed.
   */
  failed_at?: number;

  /**
   * The Unix timestamp (in seconds) for when the batch started finalizing.
   */
  finalizing_at?: number;

  /**
   * The Unix timestamp (in seconds) for when the batch started processing.
   */
  in_progress_at?: number;

  /**
   * Set of 16 key-value pairs that can be attached to an object. This can be useful
   * for storing additional information about the object in a structured format, and
   * querying for objects via API or the dashboard.
   *
   * Keys are strings with a maximum length of 64 characters. Values are strings with
   * a maximum length of 512 characters.
   */
  metadata?: Shared.Metadata | null;

  /**
   * The ID of the file containing the outputs of successfully executed requests.
   */
  output_file_id?: string;

  /**
   * The request counts for different statuses within the batch.
   */
  request_counts?: BatchRequestCounts;
}

export namespace Batch {
  export interface Errors {
    data?: Array<BatchesAPI.BatchError>;

    /**
     * The object type, which is always `list`.
     */
    object?: string;
  }
}

export interface BatchError {
  /**
   * An error code identifying the error type.
   */
  code?: string;

  /**
   * The line number of the input file where the error occurred, if applicable.
   */
  line?: number | null;

  /**
   * A human-readable message providing more details about the error.
   */
  message?: string;

  /**
   * The name of the parameter that caused the error, if applicable.
   */
  param?: string | null;
}

/**
 * The request counts for different statuses within the batch.
 */
export interface BatchRequestCounts {
  /**
   * Number of requests that have been completed successfully.
   */
  completed: number;

  /**
   * Number of requests that have failed.
   */
  failed: number;

  /**
   * Total number of requests in the batch.
   */
  total: number;
}

export interface BatchCreateParams {
  /**
   * The time frame within which the batch should be processed. Currently only `24h`
   * is supported.
   */
  completion_window: '24h';

  /**
   * The endpoint to be used for all requests in the batch. Currently
   * `/v1/chat/completions`, `/v1/embeddings`, and `/v1/completions` are supported.
   * Note that `/v1/embeddings` batches are also restricted to a maximum of 50,000
   * embedding inputs across all requests in the batch.
   */
  endpoint: '/v1/chat/completions' | '/v1/embeddings' | '/v1/completions';

  /**
   * The ID of an uploaded file that contains requests for the new batch.
   *
   * See [upload file](https://platform.openai.com/docs/api-reference/files/create)
   * for how to upload a file.
   *
   * Your input file must be formatted as a
   * [JSONL file](https://platform.openai.com/docs/api-reference/batch/request-input),
   * and must be uploaded with the purpose `batch`. The file can contain up to 50,000
   * requests, and can be up to 200 MB in size.
   */
  input_file_id: string;

  /**
   * Set of 16 key-value pairs that can be attached to an object. This can be useful
   * for storing additional information about the object in a structured format, and
   * querying for objects via API or the dashboard.
   *
   * Keys are strings with a maximum length of 64 characters. Values are strings with
   * a maximum length of 512 characters.
   */
  metadata?: Shared.Metadata | null;
}

export interface BatchListParams extends CursorPageParams {}

Batches.BatchesPage = BatchesPage;

export declare namespace Batches {
  export {
    type Batch as Batch,
    type BatchError as BatchError,
    type BatchRequestCounts as BatchRequestCounts,
    BatchesPage as BatchesPage,
    type BatchCreateParams as BatchCreateParams,
    type BatchListParams as BatchListParams,
  };
}


================================================
File: src/resources/completions.ts
================================================
// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../resource';
import { APIPromise } from '../core';
import * as Core from '../core';
import * as CompletionsAPI from './completions';
import * as ChatCompletionsAPI from './chat/completions';
import { Stream } from '../streaming';

export class Completions extends APIResource {
  /**
   * Creates a completion for the provided prompt and parameters.
   */
  create(body: CompletionCreateParamsNonStreaming, options?: Core.RequestOptions): APIPromise<Completion>;
  create(
    body: CompletionCreateParamsStreaming,
    options?: Core.RequestOptions,
  ): APIPromise<Stream<Completion>>;
  create(
    body: CompletionCreateParamsBase,
    options?: Core.RequestOptions,
  ): APIPromise<Stream<Completion> | Completion>;
  create(
    body: CompletionCreateParams,
    options?: Core.RequestOptions,
  ): APIPromise<Completion> | APIPromise<Stream<Completion>> {
    return this._client.post('/completions', { body, ...options, stream: body.stream ?? false }) as
      | APIPromise<Completion>
      | APIPromise<Stream<Completion>>;
  }
}

/**
 * Represents a completion response from the API. Note: both the streamed and
 * non-streamed response objects share the same shape (unlike the chat endpoint).
 */
export interface Completion {
  /**
   * A unique identifier for the completion.
   */
  id: string;

  /**
   * The list of completion choices the model generated for the input prompt.
   */
  choices: Array<CompletionChoice>;

  /**
   * The Unix timestamp (in seconds) of when the completion was created.
   */
  created: number;

  /**
   * The model used for completion.
   */
  model: string;

  /**
   * The object type, which is always "text_completion"
   */
  object: 'text_completion';

  /**
   * This fingerprint represents the backend configuration that the model runs with.
   *
   * Can be used in conjunction with the `seed` request parameter to understand when
   * backend changes have been made that might impact determinism.
   */
  system_fingerprint?: string;

  /**
   * Usage statistics for the completion request.
   */
  usage?: CompletionUsage;
}

export interface CompletionChoice {
  /**
   * The reason the model stopped generating tokens. This will be `stop` if the model
   * hit a natural stop point or a provided stop sequence, `length` if the maximum
   * number of tokens specified in the request was reached, or `content_filter` if
   * content was omitted due to a flag from our content filters.
   */
  finish_reason: 'stop' | 'length' | 'content_filter';

  index: number;

  logprobs: CompletionChoice.Logprobs | null;

  text: string;
}

export namespace CompletionChoice {
  export interface Logprobs {
    text_offset?: Array<number>;

    token_logprobs?: Array<number>;

    tokens?: Array<string>;

    top_logprobs?: Array<Record<string, number>>;
  }
}

/**
 * Usage statistics for the completion request.
 */
export interface CompletionUsage {
  /**
   * Number of tokens in the generated completion.
   */
  completion_tokens: number;

  /**
   * Number of tokens in the prompt.
   */
  prompt_tokens: number;

  /**
   * Total number of tokens used in the request (prompt + completion).
   */
  total_tokens: number;

  /**
   * Breakdown of tokens used in a completion.
   */
  completion_tokens_details?: CompletionUsage.CompletionTokensDetails;

  /**
   * Breakdown of tokens used in the prompt.
   */
  prompt_tokens_details?: CompletionUsage.PromptTokensDetails;
}

export namespace CompletionUsage {
  /**
   * Breakdown of tokens used in a completion.
   */
  export interface CompletionTokensDetails {
    /**
     * When using Predicted Outputs, the number of tokens in the prediction that
     * appeared in the completion.
     */
    accepted_prediction_tokens?: number;

    /**
     * Audio input tokens generated by the model.
     */
    audio_tokens?: number;

    /**
     * Tokens generated by the model for reasoning.
     */
    reasoning_tokens?: number;

    /**
     * When using Predicted Outputs, the number of tokens in the prediction that did
     * not appear in the completion. However, like reasoning tokens, these tokens are
     * still counted in the total completion tokens for purposes of billing, output,
     * and context window limits.
     */
    rejected_prediction_tokens?: number;
  }

  /**
   * Breakdown of tokens used in the prompt.
   */
  export interface PromptTokensDetails {
    /**
     * Audio input tokens present in the prompt.
     */
    audio_tokens?: number;

    /**
     * Cached tokens present in the prompt.
     */
    cached_tokens?: number;
  }
}

export type CompletionCreateParams = CompletionCreateParamsNonStreaming | CompletionCreateParamsStreaming;

export interface CompletionCreateParamsBase {
  /**
   * ID of the model to use. You can use the
   * [List models](https://platform.openai.com/docs/api-reference/models/list) API to
   * see all of your available models, or see our
   * [Model overview](https://platform.openai.com/docs/models) for descriptions of
   * them.
   */
  model: (string & {}) | 'gpt-3.5-turbo-instruct' | 'davinci-002' | 'babbage-002';

  /**
   * The prompt(s) to generate completions for, encoded as a string, array of
   * strings, array of tokens, or array of token arrays.
   *
   * Note that <|endoftext|> is the document separator that the model sees during
   * training, so if a prompt is not specified the model will generate as if from the
   * beginning of a new document.
   */
  prompt: string | Array<string> | Array<number> | Array<Array<number>> | null;

  /**
   * Generates `best_of` completions server-side and returns the "best" (the one with
   * the highest log probability per token). Results cannot be streamed.
   *
   * When used with `n`, `best_of` controls the number of candidate completions and
   * `n` specifies how many to return – `best_of` must be greater than `n`.
   *
   * **Note:** Because this parameter generates many completions, it can quickly
   * consume your token quota. Use carefully and ensure that you have reasonable
   * settings for `max_tokens` and `stop`.
   */
  best_of?: number | null;

  /**
   * Echo back the prompt in addition to the completion
   */
  echo?: boolean | null;

  /**
   * Number between -2.0 and 2.0. Positive values penalize new tokens based on their
   * existing frequency in the text so far, decreasing the model's likelihood to
   * repeat the same line verbatim.
   *
   * [See more information about frequency and presence penalties.](https://platform.openai.com/docs/guides/text-generation)
   */
  frequency_penalty?: number | null;

  /**
   * Modify the likelihood of specified tokens appearing in the completion.
   *
   * Accepts a JSON object that maps tokens (specified by their token ID in the GPT
   * tokenizer) to an associated bias value from -100 to 100. You can use this
   * [tokenizer tool](/tokenizer?view=bpe) to convert text to token IDs.
   * Mathematically, the bias is added to the logits generated by the model prior to
   * sampling. The exact effect will vary per model, but values between -1 and 1
   * should decrease or increase likelihood of selection; values like -100 or 100
   * should result in a ban or exclusive selection of the relevant token.
   *
   * As an example, you can pass `{"50256": -100}` to prevent the <|endoftext|> token
   * from being generated.
   */
  logit_bias?: Record<string, number> | null;

  /**
   * Include the log probabilities on the `logprobs` most likely output tokens, as
   * well the chosen tokens. For example, if `logprobs` is 5, the API will return a
   * list of the 5 most likely tokens. The API will always return the `logprob` of
   * the sampled token, so there may be up to `logprobs+1` elements in the response.
   *
   * The maximum value for `logprobs` is 5.
   */
  logprobs?: number | null;

  /**
   * The maximum number of [tokens](/tokenizer) that can be generated in the
   * completion.
   *
   * The token count of your prompt plus `max_tokens` cannot exceed the model's
   * context length.
   * [Example Python code](https://cookbook.openai.com/examples/how_to_count_tokens_with_tiktoken)
   * for counting tokens.
   */
  max_tokens?: number | null;

  /**
   * How many completions to generate for each prompt.
   *
   * **Note:** Because this parameter generates many completions, it can quickly
   * consume your token quota. Use carefully and ensure that you have reasonable
   * settings for `max_tokens` and `stop`.
   */
  n?: number | null;

  /**
   * Number between -2.0 and 2.0. Positive values penalize new tokens based on
   * whether they appear in the text so far, increasing the model's likelihood to
   * talk about new topics.
   *
   * [See more information about frequency and presence penalties.](https://platform.openai.com/docs/guides/text-generation)
   */
  presence_penalty?: number | null;

  /**
   * If specified, our system will make a best effort to sample deterministically,
   * such that repeated requests with the same `seed` and parameters should return
   * the same result.
   *
   * Determinism is not guaranteed, and you should refer to the `system_fingerprint`
   * response parameter to monitor changes in the backend.
   */
  seed?: number | null;

  /**
   * Up to 4 sequences where the API will stop generating further tokens. The
   * returned text will not contain the stop sequence.
   */
  stop?: string | null | Array<string>;

  /**
   * Whether to stream back partial progress. If set, tokens will be sent as
   * data-only
   * [server-sent events](https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events/Using_server-sent_events#Event_stream_format)
   * as they become available, with the stream terminated by a `data: [DONE]`
   * message.
   * [Example Python code](https://cookbook.openai.com/examples/how_to_stream_completions).
   */
  stream?: boolean | null;

  /**
   * Options for streaming response. Only set this when you set `stream: true`.
   */
  stream_options?: ChatCompletionsAPI.ChatCompletionStreamOptions | null;

  /**
   * The suffix that comes after a completion of inserted text.
   *
   * This parameter is only supported for `gpt-3.5-turbo-instruct`.
   */
  suffix?: string | null;

  /**
   * What sampling temperature to use, between 0 and 2. Higher values like 0.8 will
   * make the output more random, while lower values like 0.2 will make it more
   * focused and deterministic.
   *
   * We generally recommend altering this or `top_p` but not both.
   */
  temperature?: number | null;

  /**
   * An alternative to sampling with temperature, called nucleus sampling, where the
   * model considers the results of the tokens with top_p probability mass. So 0.1
   * means only the tokens comprising the top 10% probability mass are considered.
   *
   * We generally recommend altering this or `temperature` but not both.
   */
  top_p?: number | null;

  /**
   * A unique identifier representing your end-user, which can help OpenAI to monitor
   * and detect abuse.
   * [Learn more](https://platform.openai.com/docs/guides/safety-best-practices#end-user-ids).
   */
  user?: string;
}

export namespace CompletionCreateParams {
  export type CompletionCreateParamsNonStreaming = CompletionsAPI.CompletionCreateParamsNonStreaming;
  export type CompletionCreateParamsStreaming = CompletionsAPI.CompletionCreateParamsStreaming;
}

export interface CompletionCreateParamsNonStreaming extends CompletionCreateParamsBase {
  /**
   * Whether to stream back partial progress. If set, tokens will be sent as
   * data-only
   * [server-sent events](https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events/Using_server-sent_events#Event_stream_format)
   * as they become available, with the stream terminated by a `data: [DONE]`
   * message.
   * [Example Python code](https://cookbook.openai.com/examples/how_to_stream_completions).
   */
  stream?: false | null;
}

export interface CompletionCreateParamsStreaming extends CompletionCreateParamsBase {
  /**
   * Whether to stream back partial progress. If set, tokens will be sent as
   * data-only
   * [server-sent events](https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events/Using_server-sent_events#Event_stream_format)
   * as they become available, with the stream terminated by a `data: [DONE]`
   * message.
   * [Example Python code](https://cookbook.openai.com/examples/how_to_stream_completions).
   */
  stream: true;
}

export declare namespace Completions {
  export {
    type Completion as Completion,
    type CompletionChoice as CompletionChoice,
    type CompletionUsage as CompletionUsage,
    type CompletionCreateParams as CompletionCreateParams,
    type CompletionCreateParamsNonStreaming as CompletionCreateParamsNonStreaming,
    type CompletionCreateParamsStreaming as CompletionCreateParamsStreaming,
  };
}


================================================
File: src/resources/embeddings.ts
================================================
// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../resource';
import * as Core from '../core';

export class Embeddings extends APIResource {
  /**
   * Creates an embedding vector representing the input text.
   */
  create(
    body: EmbeddingCreateParams,
    options?: Core.RequestOptions,
  ): Core.APIPromise<CreateEmbeddingResponse> {
    return this._client.post('/embeddings', { body, ...options });
  }
}

export interface CreateEmbeddingResponse {
  /**
   * The list of embeddings generated by the model.
   */
  data: Array<Embedding>;

  /**
   * The name of the model used to generate the embedding.
   */
  model: string;

  /**
   * The object type, which is always "list".
   */
  object: 'list';

  /**
   * The usage information for the request.
   */
  usage: CreateEmbeddingResponse.Usage;
}

export namespace CreateEmbeddingResponse {
  /**
   * The usage information for the request.
   */
  export interface Usage {
    /**
     * The number of tokens used by the prompt.
     */
    prompt_tokens: number;

    /**
     * The total number of tokens used by the request.
     */
    total_tokens: number;
  }
}

/**
 * Represents an embedding vector returned by embedding endpoint.
 */
export interface Embedding {
  /**
   * The embedding vector, which is a list of floats. The length of vector depends on
   * the model as listed in the
   * [embedding guide](https://platform.openai.com/docs/guides/embeddings).
   */
  embedding: Array<number>;

  /**
   * The index of the embedding in the list of embeddings.
   */
  index: number;

  /**
   * The object type, which is always "embedding".
   */
  object: 'embedding';
}

export type EmbeddingModel = 'text-embedding-ada-002' | 'text-embedding-3-small' | 'text-embedding-3-large';

export interface EmbeddingCreateParams {
  /**
   * Input text to embed, encoded as a string or array of tokens. To embed multiple
   * inputs in a single request, pass an array of strings or array of token arrays.
   * The input must not exceed the max input tokens for the model (8192 tokens for
   * `text-embedding-ada-002`), cannot be an empty string, and any array must be 2048
   * dimensions or less.
   * [Example Python code](https://cookbook.openai.com/examples/how_to_count_tokens_with_tiktoken)
   * for counting tokens. Some models may also impose a limit on total number of
   * tokens summed across inputs.
   */
  input: string | Array<string> | Array<number> | Array<Array<number>>;

  /**
   * ID of the model to use. You can use the
   * [List models](https://platform.openai.com/docs/api-reference/models/list) API to
   * see all of your available models, or see our
   * [Model overview](https://platform.openai.com/docs/models) for descriptions of
   * them.
   */
  model: (string & {}) | EmbeddingModel;

  /**
   * The number of dimensions the resulting output embeddings should have. Only
   * supported in `text-embedding-3` and later models.
   */
  dimensions?: number;

  /**
   * The format to return the embeddings in. Can be either `float` or
   * [`base64`](https://pypi.org/project/pybase64/).
   */
  encoding_format?: 'float' | 'base64';

  /**
   * A unique identifier representing your end-user, which can help OpenAI to monitor
   * and detect abuse.
   * [Learn more](https://platform.openai.com/docs/guides/safety-best-practices#end-user-ids).
   */
  user?: string;
}

export declare namespace Embeddings {
  export {
    type CreateEmbeddingResponse as CreateEmbeddingResponse,
    type Embedding as Embedding,
    type EmbeddingModel as EmbeddingModel,
    type EmbeddingCreateParams as EmbeddingCreateParams,
  };
}


================================================
File: src/resources/files.ts
================================================
// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../resource';
import { isRequestOptions } from '../core';
import { sleep } from '../core';
import { APIConnectionTimeoutError } from '../error';
import * as Core from '../core';
import { CursorPage, type CursorPageParams } from '../pagination';
import { type Response } from '../_shims/index';

export class Files extends APIResource {
  /**
   * Upload a file that can be used across various endpoints. Individual files can be
   * up to 512 MB, and the size of all files uploaded by one organization can be up
   * to 100 GB.
   *
   * The Assistants API supports files up to 2 million tokens and of specific file
   * types. See the
   * [Assistants Tools guide](https://platform.openai.com/docs/assistants/tools) for
   * details.
   *
   * The Fine-tuning API only supports `.jsonl` files. The input also has certain
   * required formats for fine-tuning
   * [chat](https://platform.openai.com/docs/api-reference/fine-tuning/chat-input) or
   * [completions](https://platform.openai.com/docs/api-reference/fine-tuning/completions-input)
   * models.
   *
   * The Batch API only supports `.jsonl` files up to 200 MB in size. The input also
   * has a specific required
   * [format](https://platform.openai.com/docs/api-reference/batch/request-input).
   *
   * Please [contact us](https://help.openai.com/) if you need to increase these
   * storage limits.
   */
  create(body: FileCreateParams, options?: Core.RequestOptions): Core.APIPromise<FileObject> {
    return this._client.post('/files', Core.multipartFormRequestOptions({ body, ...options }));
  }

  /**
   * Returns information about a specific file.
   */
  retrieve(fileId: string, options?: Core.RequestOptions): Core.APIPromise<FileObject> {
    return this._client.get(`/files/${fileId}`, options);
  }

  /**
   * Returns a list of files.
   */
  list(query?: FileListParams, options?: Core.RequestOptions): Core.PagePromise<FileObjectsPage, FileObject>;
  list(options?: Core.RequestOptions): Core.PagePromise<FileObjectsPage, FileObject>;
  list(
    query: FileListParams | Core.RequestOptions = {},
    options?: Core.RequestOptions,
  ): Core.PagePromise<FileObjectsPage, FileObject> {
    if (isRequestOptions(query)) {
      return this.list({}, query);
    }
    return this._client.getAPIList('/files', FileObjectsPage, { query, ...options });
  }

  /**
   * Delete a file.
   */
  del(fileId: string, options?: Core.RequestOptions): Core.APIPromise<FileDeleted> {
    return this._client.delete(`/files/${fileId}`, options);
  }

  /**
   * Returns the contents of the specified file.
   */
  content(fileId: string, options?: Core.RequestOptions): Core.APIPromise<Response> {
    return this._client.get(`/files/${fileId}/content`, {
      ...options,
      headers: { Accept: 'application/binary', ...options?.headers },
      __binaryResponse: true,
    });
  }

  /**
   * Returns the contents of the specified file.
   *
   * @deprecated The `.content()` method should be used instead
   */
  retrieveContent(fileId: string, options?: Core.RequestOptions): Core.APIPromise<string> {
    return this._client.get(`/files/${fileId}/content`, options);
  }

  /**
   * Waits for the given file to be processed, default timeout is 30 mins.
   */
  async waitForProcessing(
    id: string,
    { pollInterval = 5000, maxWait = 30 * 60 * 1000 }: { pollInterval?: number; maxWait?: number } = {},
  ): Promise<FileObject> {
    const TERMINAL_STATES = new Set(['processed', 'error', 'deleted']);

    const start = Date.now();
    let file = await this.retrieve(id);

    while (!file.status || !TERMINAL_STATES.has(file.status)) {
      await sleep(pollInterval);

      file = await this.retrieve(id);
      if (Date.now() - start > maxWait) {
        throw new APIConnectionTimeoutError({
          message: `Giving up on waiting for file ${id} to finish processing after ${maxWait} milliseconds.`,
        });
      }
    }

    return file;
  }
}

export class FileObjectsPage extends CursorPage<FileObject> {}

export type FileContent = string;

export interface FileDeleted {
  id: string;

  deleted: boolean;

  object: 'file';
}

/**
 * The `File` object represents a document that has been uploaded to OpenAI.
 */
export interface FileObject {
  /**
   * The file identifier, which can be referenced in the API endpoints.
   */
  id: string;

  /**
   * The size of the file, in bytes.
   */
  bytes: number;

  /**
   * The Unix timestamp (in seconds) for when the file was created.
   */
  created_at: number;

  /**
   * The name of the file.
   */
  filename: string;

  /**
   * The object type, which is always `file`.
   */
  object: 'file';

  /**
   * The intended purpose of the file. Supported values are `assistants`,
   * `assistants_output`, `batch`, `batch_output`, `fine-tune`, `fine-tune-results`
   * and `vision`.
   */
  purpose:
    | 'assistants'
    | 'assistants_output'
    | 'batch'
    | 'batch_output'
    | 'fine-tune'
    | 'fine-tune-results'
    | 'vision';

  /**
   * @deprecated Deprecated. The current status of the file, which can be either
   * `uploaded`, `processed`, or `error`.
   */
  status: 'uploaded' | 'processed' | 'error';

  /**
   * @deprecated Deprecated. For details on why a fine-tuning training file failed
   * validation, see the `error` field on `fine_tuning.job`.
   */
  status_details?: string;
}

/**
 * The intended purpose of the uploaded file.
 *
 * Use "assistants" for
 * [Assistants](https://platform.openai.com/docs/api-reference/assistants) and
 * [Message](https://platform.openai.com/docs/api-reference/messages) files,
 * "vision" for Assistants image file inputs, "batch" for
 * [Batch API](https://platform.openai.com/docs/guides/batch), and "fine-tune" for
 * [Fine-tuning](https://platform.openai.com/docs/api-reference/fine-tuning).
 */
export type FilePurpose = 'assistants' | 'batch' | 'fine-tune' | 'vision';

export interface FileCreateParams {
  /**
   * The File object (not file name) to be uploaded.
   */
  file: Core.Uploadable;

  /**
   * The intended purpose of the uploaded file.
   *
   * Use "assistants" for
   * [Assistants](https://platform.openai.com/docs/api-reference/assistants) and
   * [Message](https://platform.openai.com/docs/api-reference/messages) files,
   * "vision" for Assistants image file inputs, "batch" for
   * [Batch API](https://platform.openai.com/docs/guides/batch), and "fine-tune" for
   * [Fine-tuning](https://platform.openai.com/docs/api-reference/fine-tuning).
   */
  purpose: FilePurpose;
}

export interface FileListParams extends CursorPageParams {
  /**
   * Sort order by the `created_at` timestamp of the objects. `asc` for ascending
   * order and `desc` for descending order.
   */
  order?: 'asc' | 'desc';

  /**
   * Only return files with the given purpose.
   */
  purpose?: string;
}

Files.FileObjectsPage = FileObjectsPage;

export declare namespace Files {
  export {
    type FileContent as FileContent,
    type FileDeleted as FileDeleted,
    type FileObject as FileObject,
    type FilePurpose as FilePurpose,
    FileObjectsPage as FileObjectsPage,
    type FileCreateParams as FileCreateParams,
    type FileListParams as FileListParams,
  };
}


================================================
File: src/resources/images.ts
================================================
// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../resource';
import * as Core from '../core';

export class Images extends APIResource {
  /**
   * Creates a variation of a given image.
   */
  createVariation(
    body: ImageCreateVariationParams,
    options?: Core.RequestOptions,
  ): Core.APIPromise<ImagesResponse> {
    return this._client.post('/images/variations', Core.multipartFormRequestOptions({ body, ...options }));
  }

  /**
   * Creates an edited or extended image given an original image and a prompt.
   */
  edit(body: ImageEditParams, options?: Core.RequestOptions): Core.APIPromise<ImagesResponse> {
    return this._client.post('/images/edits', Core.multipartFormRequestOptions({ body, ...options }));
  }

  /**
   * Creates an image given a prompt.
   */
  generate(body: ImageGenerateParams, options?: Core.RequestOptions): Core.APIPromise<ImagesResponse> {
    return this._client.post('/images/generations', { body, ...options });
  }
}

/**
 * Represents the url or the content of an image generated by the OpenAI API.
 */
export interface Image {
  /**
   * The base64-encoded JSON of the generated image, if `response_format` is
   * `b64_json`.
   */
  b64_json?: string;

  /**
   * The prompt that was used to generate the image, if there was any revision to the
   * prompt.
   */
  revised_prompt?: string;

  /**
   * The URL of the generated image, if `response_format` is `url` (default).
   */
  url?: string;
}

export type ImageModel = 'dall-e-2' | 'dall-e-3';

export interface ImagesResponse {
  created: number;

  data: Array<Image>;
}

export interface ImageCreateVariationParams {
  /**
   * The image to use as the basis for the variation(s). Must be a valid PNG file,
   * less than 4MB, and square.
   */
  image: Core.Uploadable;

  /**
   * The model to use for image generation. Only `dall-e-2` is supported at this
   * time.
   */
  model?: (string & {}) | ImageModel | null;

  /**
   * The number of images to generate. Must be between 1 and 10. For `dall-e-3`, only
   * `n=1` is supported.
   */
  n?: number | null;

  /**
   * The format in which the generated images are returned. Must be one of `url` or
   * `b64_json`. URLs are only valid for 60 minutes after the image has been
   * generated.
   */
  response_format?: 'url' | 'b64_json' | null;

  /**
   * The size of the generated images. Must be one of `256x256`, `512x512`, or
   * `1024x1024`.
   */
  size?: '256x256' | '512x512' | '1024x1024' | null;

  /**
   * A unique identifier representing your end-user, which can help OpenAI to monitor
   * and detect abuse.
   * [Learn more](https://platform.openai.com/docs/guides/safety-best-practices#end-user-ids).
   */
  user?: string;
}

export interface ImageEditParams {
  /**
   * The image to edit. Must be a valid PNG file, less than 4MB, and square. If mask
   * is not provided, image must have transparency, which will be used as the mask.
   */
  image: Core.Uploadable;

  /**
   * A text description of the desired image(s). The maximum length is 1000
   * characters.
   */
  prompt: string;

  /**
   * An additional image whose fully transparent areas (e.g. where alpha is zero)
   * indicate where `image` should be edited. Must be a valid PNG file, less than
   * 4MB, and have the same dimensions as `image`.
   */
  mask?: Core.Uploadable;

  /**
   * The model to use for image generation. Only `dall-e-2` is supported at this
   * time.
   */
  model?: (string & {}) | ImageModel | null;

  /**
   * The number of images to generate. Must be between 1 and 10.
   */
  n?: number | null;

  /**
   * The format in which the generated images are returned. Must be one of `url` or
   * `b64_json`. URLs are only valid for 60 minutes after the image has been
   * generated.
   */
  response_format?: 'url' | 'b64_json' | null;

  /**
   * The size of the generated images. Must be one of `256x256`, `512x512`, or
   * `1024x1024`.
   */
  size?: '256x256' | '512x512' | '1024x1024' | null;

  /**
   * A unique identifier representing your end-user, which can help OpenAI to monitor
   * and detect abuse.
   * [Learn more](https://platform.openai.com/docs/guides/safety-best-practices#end-user-ids).
   */
  user?: string;
}

export interface ImageGenerateParams {
  /**
   * A text description of the desired image(s). The maximum length is 1000
   * characters for `dall-e-2` and 4000 characters for `dall-e-3`.
   */
  prompt: string;

  /**
   * The model to use for image generation.
   */
  model?: (string & {}) | ImageModel | null;

  /**
   * The number of images to generate. Must be between 1 and 10. For `dall-e-3`, only
   * `n=1` is supported.
   */
  n?: number | null;

  /**
   * The quality of the image that will be generated. `hd` creates images with finer
   * details and greater consistency across the image. This param is only supported
   * for `dall-e-3`.
   */
  quality?: 'standard' | 'hd';

  /**
   * The format in which the generated images are returned. Must be one of `url` or
   * `b64_json`. URLs are only valid for 60 minutes after the image has been
   * generated.
   */
  response_format?: 'url' | 'b64_json' | null;

  /**
   * The size of the generated images. Must be one of `256x256`, `512x512`, or
   * `1024x1024` for `dall-e-2`. Must be one of `1024x1024`, `1792x1024`, or
   * `1024x1792` for `dall-e-3` models.
   */
  size?: '256x256' | '512x512' | '1024x1024' | '1792x1024' | '1024x1792' | null;

  /**
   * The style of the generated images. Must be one of `vivid` or `natural`. Vivid
   * causes the model to lean towards generating hyper-real and dramatic images.
   * Natural causes the model to produce more natural, less hyper-real looking
   * images. This param is only supported for `dall-e-3`.
   */
  style?: 'vivid' | 'natural' | null;

  /**
   * A unique identifier representing your end-user, which can help OpenAI to monitor
   * and detect abuse.
   * [Learn more](https://platform.openai.com/docs/guides/safety-best-practices#end-user-ids).
   */
  user?: string;
}

export declare namespace Images {
  export {
    type Image as Image,
    type ImageModel as ImageModel,
    type ImagesResponse as ImagesResponse,
    type ImageCreateVariationParams as ImageCreateVariationParams,
    type ImageEditParams as ImageEditParams,
    type ImageGenerateParams as ImageGenerateParams,
  };
}


================================================
File: src/resources/index.ts
================================================
// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

export * from './chat/index';
export * from './shared';
export { Audio, type AudioModel, type AudioResponseFormat } from './audio/audio';
export {
  BatchesPage,
  Batches,
  type Batch,
  type BatchError,
  type BatchRequestCounts,
  type BatchCreateParams,
  type BatchListParams,
} from './batches';
export { Beta } from './beta/beta';
export {
  Completions,
  type Completion,
  type CompletionChoice,
  type CompletionUsage,
  type CompletionCreateParams,
  type CompletionCreateParamsNonStreaming,
  type CompletionCreateParamsStreaming,
} from './completions';
export {
  Embeddings,
  type CreateEmbeddingResponse,
  type Embedding,
  type EmbeddingModel,
  type EmbeddingCreateParams,
} from './embeddings';
export {
  FileObjectsPage,
  Files,
  type FileContent,
  type FileDeleted,
  type FileObject,
  type FilePurpose,
  type FileCreateParams,
  type FileListParams,
} from './files';
export { FineTuning } from './fine-tuning/fine-tuning';
export {
  Images,
  type Image,
  type ImageModel,
  type ImagesResponse,
  type ImageCreateVariationParams,
  type ImageEditParams,
  type ImageGenerateParams,
} from './images';
export { ModelsPage, Models, type Model, type ModelDeleted } from './models';
export {
  Moderations,
  type Moderation,
  type ModerationImageURLInput,
  type ModerationModel,
  type ModerationMultiModalInput,
  type ModerationTextInput,
  type ModerationCreateResponse,
  type ModerationCreateParams,
} from './moderations';
export { Uploads, type Upload, type UploadCreateParams, type UploadCompleteParams } from './uploads/uploads';


================================================
File: src/resources/models.ts
================================================
// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../resource';
import * as Core from '../core';
import { Page } from '../pagination';

export class Models extends APIResource {
  /**
   * Retrieves a model instance, providing basic information about the model such as
   * the owner and permissioning.
   */
  retrieve(model: string, options?: Core.RequestOptions): Core.APIPromise<Model> {
    return this._client.get(`/models/${model}`, options);
  }

  /**
   * Lists the currently available models, and provides basic information about each
   * one such as the owner and availability.
   */
  list(options?: Core.RequestOptions): Core.PagePromise<ModelsPage, Model> {
    return this._client.getAPIList('/models', ModelsPage, options);
  }

  /**
   * Delete a fine-tuned model. You must have the Owner role in your organization to
   * delete a model.
   */
  del(model: string, options?: Core.RequestOptions): Core.APIPromise<ModelDeleted> {
    return this._client.delete(`/models/${model}`, options);
  }
}

/**
 * Note: no pagination actually occurs yet, this is for forwards-compatibility.
 */
export class ModelsPage extends Page<Model> {}

/**
 * Describes an OpenAI model offering that can be used with the API.
 */
export interface Model {
  /**
   * The model identifier, which can be referenced in the API endpoints.
   */
  id: string;

  /**
   * The Unix timestamp (in seconds) when the model was created.
   */
  created: number;

  /**
   * The object type, which is always "model".
   */
  object: 'model';

  /**
   * The organization that owns the model.
   */
  owned_by: string;
}

export interface ModelDeleted {
  id: string;

  deleted: boolean;

  object: string;
}

Models.ModelsPage = ModelsPage;

export declare namespace Models {
  export { type Model as Model, type ModelDeleted as ModelDeleted, ModelsPage as ModelsPage };
}


================================================
File: src/resources/shared.ts
================================================
// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

export interface ErrorObject {
  code: string | null;

  message: string;

  param: string | null;

  type: string;
}

export interface FunctionDefinition {
  /**
   * The name of the function to be called. Must be a-z, A-Z, 0-9, or contain
   * underscores and dashes, with a maximum length of 64.
   */
  name: string;

  /**
   * A description of what the function does, used by the model to choose when and
   * how to call the function.
   */
  description?: string;

  /**
   * The parameters the functions accepts, described as a JSON Schema object. See the
   * [guide](https://platform.openai.com/docs/guides/function-calling) for examples,
   * and the
   * [JSON Schema reference](https://json-schema.org/understanding-json-schema/) for
   * documentation about the format.
   *
   * Omitting `parameters` defines a function with an empty parameter list.
   */
  parameters?: FunctionParameters;

  /**
   * Whether to enable strict schema adherence when generating the function call. If
   * set to true, the model will follow the exact schema defined in the `parameters`
   * field. Only a subset of JSON Schema is supported when `strict` is `true`. Learn
   * more about Structured Outputs in the
   * [function calling guide](docs/guides/function-calling).
   */
  strict?: boolean | null;
}

/**
 * The parameters the functions accepts, described as a JSON Schema object. See the
 * [guide](https://platform.openai.com/docs/guides/function-calling) for examples,
 * and the
 * [JSON Schema reference](https://json-schema.org/understanding-json-schema/) for
 * documentation about the format.
 *
 * Omitting `parameters` defines a function with an empty parameter list.
 */
export type FunctionParameters = Record<string, unknown>;

/**
 * Set of 16 key-value pairs that can be attached to an object. This can be useful
 * for storing additional information about the object in a structured format, and
 * querying for objects via API or the dashboard.
 *
 * Keys are strings with a maximum length of 64 characters. Values are strings with
 * a maximum length of 512 characters.
 */
export type Metadata = Record<string, string>;

export interface ResponseFormatJSONObject {
  /**
   * The type of response format being defined: `json_object`
   */
  type: 'json_object';
}

export interface ResponseFormatJSONSchema {
  json_schema: ResponseFormatJSONSchema.JSONSchema;

  /**
   * The type of response format being defined: `json_schema`
   */
  type: 'json_schema';
}

export namespace ResponseFormatJSONSchema {
  export interface JSONSchema {
    /**
     * The name of the response format. Must be a-z, A-Z, 0-9, or contain underscores
     * and dashes, with a maximum length of 64.
     */
    name: string;

    /**
     * A description of what the response format is for, used by the model to determine
     * how to respond in the format.
     */
    description?: string;

    /**
     * The schema for the response format, described as a JSON Schema object.
     */
    schema?: Record<string, unknown>;

    /**
     * Whether to enable strict schema adherence when generating the output. If set to
     * true, the model will always follow the exact schema defined in the `schema`
     * field. Only a subset of JSON Schema is supported when `strict` is `true`. To
     * learn more, read the
     * [Structured Outputs guide](https://platform.openai.com/docs/guides/structured-outputs).
     */
    strict?: boolean | null;
  }
}

export interface ResponseFormatText {
  /**
   * The type of response format being defined: `text`
   */
  type: 'text';
}


================================================
File: src/resources/beta/beta.ts
================================================
// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../../resource';
import * as AssistantsAPI from './assistants';
import * as ChatAPI from './chat/chat';
import {
  Assistant,
  AssistantCreateParams,
  AssistantDeleted,
  AssistantListParams,
  AssistantStreamEvent,
  AssistantTool,
  AssistantUpdateParams,
  Assistants,
  AssistantsPage,
  CodeInterpreterTool,
  FileSearchTool,
  FunctionTool,
  MessageStreamEvent,
  RunStepStreamEvent,
  RunStreamEvent,
  ThreadStreamEvent,
} from './assistants';
import * as RealtimeAPI from './realtime/realtime';
import { Realtime } from './realtime/realtime';
import * as ThreadsAPI from './threads/threads';
import {
  AssistantResponseFormatOption,
  AssistantToolChoice,
  AssistantToolChoiceFunction,
  AssistantToolChoiceOption,
  Thread,
  ThreadCreateAndRunParams,
  ThreadCreateAndRunParamsNonStreaming,
  ThreadCreateAndRunParamsStreaming,
  ThreadCreateAndRunPollParams,
  ThreadCreateAndRunStreamParams,
  ThreadCreateParams,
  ThreadDeleted,
  ThreadUpdateParams,
  Threads,
} from './threads/threads';
import * as VectorStoresAPI from './vector-stores/vector-stores';
import {
  AutoFileChunkingStrategyParam,
  FileChunkingStrategy,
  FileChunkingStrategyParam,
  OtherFileChunkingStrategyObject,
  StaticFileChunkingStrategy,
  StaticFileChunkingStrategyObject,
  StaticFileChunkingStrategyObjectParam,
  VectorStore,
  VectorStoreCreateParams,
  VectorStoreDeleted,
  VectorStoreListParams,
  VectorStoreUpdateParams,
  VectorStores,
  VectorStoresPage,
} from './vector-stores/vector-stores';
import { Chat } from './chat/chat';

export class Beta extends APIResource {
  realtime: RealtimeAPI.Realtime = new RealtimeAPI.Realtime(this._client);
  vectorStores: VectorStoresAPI.VectorStores = new VectorStoresAPI.VectorStores(this._client);
  chat: ChatAPI.Chat = new ChatAPI.Chat(this._client);
  assistants: AssistantsAPI.Assistants = new AssistantsAPI.Assistants(this._client);
  threads: ThreadsAPI.Threads = new ThreadsAPI.Threads(this._client);
}

Beta.Realtime = Realtime;
Beta.VectorStores = VectorStores;
Beta.VectorStoresPage = VectorStoresPage;
Beta.Assistants = Assistants;
Beta.AssistantsPage = AssistantsPage;
Beta.Threads = Threads;

export declare namespace Beta {
  export { Realtime as Realtime };

  export {
    VectorStores as VectorStores,
    type AutoFileChunkingStrategyParam as AutoFileChunkingStrategyParam,
    type FileChunkingStrategy as FileChunkingStrategy,
    type FileChunkingStrategyParam as FileChunkingStrategyParam,
    type OtherFileChunkingStrategyObject as OtherFileChunkingStrategyObject,
    type StaticFileChunkingStrategy as StaticFileChunkingStrategy,
    type StaticFileChunkingStrategyObject as StaticFileChunkingStrategyObject,
    type StaticFileChunkingStrategyObjectParam as StaticFileChunkingStrategyObjectParam,
    type VectorStore as VectorStore,
    type VectorStoreDeleted as VectorStoreDeleted,
    VectorStoresPage as VectorStoresPage,
    type VectorStoreCreateParams as VectorStoreCreateParams,
    type VectorStoreUpdateParams as VectorStoreUpdateParams,
    type VectorStoreListParams as VectorStoreListParams,
  };

  export { Chat };

  export {
    Assistants as Assistants,
    type Assistant as Assistant,
    type AssistantDeleted as AssistantDeleted,
    type AssistantStreamEvent as AssistantStreamEvent,
    type AssistantTool as AssistantTool,
    type CodeInterpreterTool as CodeInterpreterTool,
    type FileSearchTool as FileSearchTool,
    type FunctionTool as FunctionTool,
    type MessageStreamEvent as MessageStreamEvent,
    type RunStepStreamEvent as RunStepStreamEvent,
    type RunStreamEvent as RunStreamEvent,
    type ThreadStreamEvent as ThreadStreamEvent,
    AssistantsPage as AssistantsPage,
    type AssistantCreateParams as AssistantCreateParams,
    type AssistantUpdateParams as AssistantUpdateParams,
    type AssistantListParams as AssistantListParams,
  };

  export {
    Threads as Threads,
    type AssistantResponseFormatOption as AssistantResponseFormatOption,
    type AssistantToolChoice as AssistantToolChoice,
    type AssistantToolChoiceFunction as AssistantToolChoiceFunction,
    type AssistantToolChoiceOption as AssistantToolChoiceOption,
    type Thread as Thread,
    type ThreadDeleted as ThreadDeleted,
    type ThreadCreateParams as ThreadCreateParams,
    type ThreadUpdateParams as ThreadUpdateParams,
    type ThreadCreateAndRunParams as ThreadCreateAndRunParams,
    type ThreadCreateAndRunParamsNonStreaming as ThreadCreateAndRunParamsNonStreaming,
    type ThreadCreateAndRunParamsStreaming as ThreadCreateAndRunParamsStreaming,
    type ThreadCreateAndRunPollParams,
    type ThreadCreateAndRunStreamParams,
  };
}


================================================
File: src/resources/beta/index.ts
================================================
// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

export {
  AssistantsPage,
  Assistants,
  type Assistant,
  type AssistantDeleted,
  type AssistantStreamEvent,
  type AssistantTool,
  type CodeInterpreterTool,
  type FileSearchTool,
  type FunctionTool,
  type MessageStreamEvent,
  type RunStepStreamEvent,
  type RunStreamEvent,
  type ThreadStreamEvent,
  type AssistantCreateParams,
  type AssistantUpdateParams,
  type AssistantListParams,
} from './assistants';
export { Beta } from './beta';
export { Realtime } from './realtime/index';
export { Chat } from './chat/index';
export {
  Threads,
  type AssistantResponseFormatOption,
  type AssistantToolChoice,
  type AssistantToolChoiceFunction,
  type AssistantToolChoiceOption,
  type Thread,
  type ThreadDeleted,
  type ThreadCreateParams,
  type ThreadUpdateParams,
  type ThreadCreateAndRunParams,
  type ThreadCreateAndRunParamsNonStreaming,
  type ThreadCreateAndRunParamsStreaming,
  type ThreadCreateAndRunPollParams,
  type ThreadCreateAndRunStreamParams,
} from './threads/index';
export {
  VectorStoresPage,
  VectorStores,
  type AutoFileChunkingStrategyParam,
  type FileChunkingStrategy,
  type FileChunkingStrategyParam,
  type OtherFileChunkingStrategyObject,
  type StaticFileChunkingStrategy,
  type StaticFileChunkingStrategyObject,
  type StaticFileChunkingStrategyObjectParam,
  type VectorStore,
  type VectorStoreDeleted,
  type VectorStoreCreateParams,
  type VectorStoreUpdateParams,
  type VectorStoreListParams,
} from './vector-stores/index';


================================================
File: src/resources/beta/chat/chat.ts
================================================
// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../../../resource';
import * as CompletionsAPI from './completions';

export class Chat extends APIResource {
  completions: CompletionsAPI.Completions = new CompletionsAPI.Completions(this._client);
}

export namespace Chat {
  export import Completions = CompletionsAPI.Completions;
}


================================================
File: src/resources/beta/chat/completions.ts
================================================
// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import * as Core from '../../../core';
import { APIResource } from '../../../resource';
import { ChatCompletionRunner, ChatCompletionFunctionRunnerParams } from '../../../lib/ChatCompletionRunner';
import {
  ChatCompletionStreamingRunner,
  ChatCompletionStreamingFunctionRunnerParams,
} from '../../../lib/ChatCompletionStreamingRunner';
import { BaseFunctionsArgs } from '../../../lib/RunnableFunction';
import { RunnerOptions } from '../../../lib/AbstractChatCompletionRunner';
import { ChatCompletionToolRunnerParams } from '../../../lib/ChatCompletionRunner';
import { ChatCompletionStreamingToolRunnerParams } from '../../../lib/ChatCompletionStreamingRunner';
import { ChatCompletionStream, type ChatCompletionStreamParams } from '../../../lib/ChatCompletionStream';
import {
  ChatCompletion,
  ChatCompletionCreateParamsNonStreaming,
  ChatCompletionMessage,
  ChatCompletionMessageToolCall,
} from '../../chat/completions';
import { ExtractParsedContentFromParams, parseChatCompletion, validateInputTools } from '../../../lib/parser';

export {
  ChatCompletionStreamingRunner,
  type ChatCompletionStreamingFunctionRunnerParams,
} from '../../../lib/ChatCompletionStreamingRunner';
export {
  type RunnableFunction,
  type RunnableFunctions,
  type RunnableFunctionWithParse,
  type RunnableFunctionWithoutParse,
  ParsingFunction,
  ParsingToolFunction,
} from '../../../lib/RunnableFunction';
export { type ChatCompletionToolRunnerParams } from '../../../lib/ChatCompletionRunner';
export { type ChatCompletionStreamingToolRunnerParams } from '../../../lib/ChatCompletionStreamingRunner';
export { ChatCompletionStream, type ChatCompletionStreamParams } from '../../../lib/ChatCompletionStream';
export {
  ChatCompletionRunner,
  type ChatCompletionFunctionRunnerParams,
} from '../../../lib/ChatCompletionRunner';

export interface ParsedFunction extends ChatCompletionMessageToolCall.Function {
  parsed_arguments?: unknown;
}

export interface ParsedFunctionToolCall extends ChatCompletionMessageToolCall {
  function: ParsedFunction;
}

export interface ParsedChatCompletionMessage<ParsedT> extends ChatCompletionMessage {
  parsed: ParsedT | null;
  tool_calls: Array<ParsedFunctionToolCall>;
}

export interface ParsedChoice<ParsedT> extends ChatCompletion.Choice {
  message: ParsedChatCompletionMessage<ParsedT>;
}

export interface ParsedChatCompletion<ParsedT> extends ChatCompletion {
  choices: Array<ParsedChoice<ParsedT>>;
}

export type ChatCompletionParseParams = ChatCompletionCreateParamsNonStreaming;

export class Completions extends APIResource {
  parse<Params extends ChatCompletionParseParams, ParsedT = ExtractParsedContentFromParams<Params>>(
    body: Params,
    options?: Core.RequestOptions,
  ): Core.APIPromise<ParsedChatCompletion<ParsedT>> {
    validateInputTools(body.tools);

    return this._client.chat.completions
      .create(body, {
        ...options,
        headers: {
          ...options?.headers,
          'X-Stainless-Helper-Method': 'beta.chat.completions.parse',
        },
      })
      ._thenUnwrap((completion) => parseChatCompletion(completion, body));
  }

  /**
   * @deprecated - use `runTools` instead.
   */
  runFunctions<FunctionsArgs extends BaseFunctionsArgs>(
    body: ChatCompletionFunctionRunnerParams<FunctionsArgs>,
    options?: Core.RequestOptions,
  ): ChatCompletionRunner<null>;
  runFunctions<FunctionsArgs extends BaseFunctionsArgs>(
    body: ChatCompletionStreamingFunctionRunnerParams<FunctionsArgs>,
    options?: Core.RequestOptions,
  ): ChatCompletionStreamingRunner<null>;
  runFunctions<FunctionsArgs extends BaseFunctionsArgs>(
    body:
      | ChatCompletionFunctionRunnerParams<FunctionsArgs>
      | ChatCompletionStreamingFunctionRunnerParams<FunctionsArgs>,
    options?: Core.RequestOptions,
  ): ChatCompletionRunner<null> | ChatCompletionStreamingRunner<null> {
    if (body.stream) {
      return ChatCompletionStreamingRunner.runFunctions(
        this._client,
        body as ChatCompletionStreamingFunctionRunnerParams<FunctionsArgs>,
        options,
      );
    }
    return ChatCompletionRunner.runFunctions(
      this._client,
      body as ChatCompletionFunctionRunnerParams<FunctionsArgs>,
      options,
    );
  }

  /**
   * A convenience helper for using tool calls with the /chat/completions endpoint
   * which automatically calls the JavaScript functions you provide and sends their
   * results back to the /chat/completions endpoint, looping as long as the model
   * requests function calls.
   *
   * For more details and examples, see
   * [the docs](https://github.com/openai/openai-node#automated-function-calls)
   */
  runTools<
    Params extends ChatCompletionToolRunnerParams<any>,
    ParsedT = ExtractParsedContentFromParams<Params>,
  >(body: Params, options?: RunnerOptions): ChatCompletionRunner<ParsedT>;

  runTools<
    Params extends ChatCompletionStreamingToolRunnerParams<any>,
    ParsedT = ExtractParsedContentFromParams<Params>,
  >(body: Params, options?: RunnerOptions): ChatCompletionStreamingRunner<ParsedT>;

  runTools<
    Params extends ChatCompletionToolRunnerParams<any> | ChatCompletionStreamingToolRunnerParams<any>,
    ParsedT = ExtractParsedContentFromParams<Params>,
  >(
    body: Params,
    options?: RunnerOptions,
  ): ChatCompletionRunner<ParsedT> | ChatCompletionStreamingRunner<ParsedT> {
    if (body.stream) {
      return ChatCompletionStreamingRunner.runTools(
        this._client,
        body as ChatCompletionStreamingToolRunnerParams<any>,
        options,
      );
    }

    return ChatCompletionRunner.runTools(this._client, body as ChatCompletionToolRunnerParams<any>, options);
  }

  /**
   * Creates a chat completion stream
   */
  stream<Params extends ChatCompletionStreamParams, ParsedT = ExtractParsedContentFromParams<Params>>(
    body: Params,
    options?: Core.RequestOptions,
  ): ChatCompletionStream<ParsedT> {
    return ChatCompletionStream.createChatCompletion(this._client, body, options);
  }
}


================================================
File: src/resources/beta/chat/index.ts
================================================
// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

export { Chat } from './chat';
export { Completions } from './completions';


================================================
File: src/resources/beta/realtime/index.ts
================================================
// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

export { Realtime } from './realtime';
export { Sessions, type Session, type SessionCreateResponse, type SessionCreateParams } from './sessions';


================================================
File: src/resources/beta/realtime/sessions.ts
================================================
// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../../../resource';
import * as Core from '../../../core';

export class Sessions extends APIResource {
  /**
   * Create an ephemeral API token for use in client-side applications with the
   * Realtime API. Can be configured with the same session parameters as the
   * `session.update` client event.
   *
   * It responds with a session object, plus a `client_secret` key which contains a
   * usable ephemeral API token that can be used to authenticate browser clients for
   * the Realtime API.
   */
  create(body: SessionCreateParams, options?: Core.RequestOptions): Core.APIPromise<SessionCreateResponse> {
    return this._client.post('/realtime/sessions', {
      body,
      ...options,
      headers: { 'OpenAI-Beta': 'assistants=v2', ...options?.headers },
    });
  }
}

/**
 * Realtime session object configuration.
 */
export interface Session {
  /**
   * Unique identifier for the session object.
   */
  id?: string;

  /**
   * The format of input audio. Options are `pcm16`, `g711_ulaw`, or `g711_alaw`. For
   * `pcm16`, input audio must be 16-bit PCM at a 24kHz sample rate, single channel
   * (mono), and little-endian byte order.
   */
  input_audio_format?: 'pcm16' | 'g711_ulaw' | 'g711_alaw';

  /**
   * Configuration for input audio transcription, defaults to off and can be set to
   * `null` to turn off once on. Input audio transcription is not native to the
   * model, since the model consumes audio directly. Transcription runs
   * asynchronously through Whisper and should be treated as rough guidance rather
   * than the representation understood by the model.
   */
  input_audio_transcription?: Session.InputAudioTranscription;

  /**
   * The default system instructions (i.e. system message) prepended to model calls.
   * This field allows the client to guide the model on desired responses. The model
   * can be instructed on response content and format, (e.g. "be extremely succinct",
   * "act friendly", "here are examples of good responses") and on audio behavior
   * (e.g. "talk quickly", "inject emotion into your voice", "laugh frequently"). The
   * instructions are not guaranteed to be followed by the model, but they provide
   * guidance to the model on the desired behavior.
   *
   * Note that the server sets default instructions which will be used if this field
   * is not set and are visible in the `session.created` event at the start of the
   * session.
   */
  instructions?: string;

  /**
   * Maximum number of output tokens for a single assistant response, inclusive of
   * tool calls. Provide an integer between 1 and 4096 to limit output tokens, or
   * `inf` for the maximum available tokens for a given model. Defaults to `inf`.
   */
  max_response_output_tokens?: number | 'inf';

  /**
   * The set of modalities the model can respond with. To disable audio, set this to
   * ["text"].
   */
  modalities?: Array<'text' | 'audio'>;

  /**
   * The Realtime model used for this session.
   */
  model?:
    | (string & {})
    | 'gpt-4o-realtime-preview'
    | 'gpt-4o-realtime-preview-2024-10-01'
    | 'gpt-4o-realtime-preview-2024-12-17'
    | 'gpt-4o-mini-realtime-preview'
    | 'gpt-4o-mini-realtime-preview-2024-12-17';

  /**
   * The format of output audio. Options are `pcm16`, `g711_ulaw`, or `g711_alaw`.
   * For `pcm16`, output audio is sampled at a rate of 24kHz.
   */
  output_audio_format?: 'pcm16' | 'g711_ulaw' | 'g711_alaw';

  /**
   * Sampling temperature for the model, limited to [0.6, 1.2]. Defaults to 0.8.
   */
  temperature?: number;

  /**
   * How the model chooses tools. Options are `auto`, `none`, `required`, or specify
   * a function.
   */
  tool_choice?: string;

  /**
   * Tools (functions) available to the model.
   */
  tools?: Array<Session.Tool>;

  /**
   * Configuration for turn detection. Can be set to `null` to turn off. Server VAD
   * means that the model will detect the start and end of speech based on audio
   * volume and respond at the end of user speech.
   */
  turn_detection?: Session.TurnDetection | null;

  /**
   * The voice the model uses to respond. Voice cannot be changed during the session
   * once the model has responded with audio at least once. Current voice options are
   * `alloy`, `ash`, `ballad`, `coral`, `echo` `sage`, `shimmer` and `verse`.
   */
  voice?: 'alloy' | 'ash' | 'ballad' | 'coral' | 'echo' | 'sage' | 'shimmer' | 'verse';
}

export namespace Session {
  /**
   * Configuration for input audio transcription, defaults to off and can be set to
   * `null` to turn off once on. Input audio transcription is not native to the
   * model, since the model consumes audio directly. Transcription runs
   * asynchronously through Whisper and should be treated as rough guidance rather
   * than the representation understood by the model.
   */
  export interface InputAudioTranscription {
    /**
     * The model to use for transcription, `whisper-1` is the only currently supported
     * model.
     */
    model?: string;
  }

  export interface Tool {
    /**
     * The description of the function, including guidance on when and how to call it,
     * and guidance about what to tell the user when calling (if anything).
     */
    description?: string;

    /**
     * The name of the function.
     */
    name?: string;

    /**
     * Parameters of the function in JSON Schema.
     */
    parameters?: unknown;

    /**
     * The type of the tool, i.e. `function`.
     */
    type?: 'function';
  }

  /**
   * Configuration for turn detection. Can be set to `null` to turn off. Server VAD
   * means that the model will detect the start and end of speech based on audio
   * volume and respond at the end of user speech.
   */
  export interface TurnDetection {
    /**
     * Amount of audio to include before the VAD detected speech (in milliseconds).
     * Defaults to 300ms.
     */
    prefix_padding_ms?: number;

    /**
     * Duration of silence to detect speech stop (in milliseconds). Defaults to 500ms.
     * With shorter values the model will respond more quickly, but may jump in on
     * short pauses from the user.
     */
    silence_duration_ms?: number;

    /**
     * Activation threshold for VAD (0.0 to 1.0), this defaults to 0.5. A higher
     * threshold will require louder audio to activate the model, and thus might
     * perform better in noisy environments.
     */
    threshold?: number;

    /**
     * Type of turn detection, only `server_vad` is currently supported.
     */
    type?: 'server_vad';
  }
}

/**
 * A new Realtime session configuration, with an ephermeral key. Default TTL for
 * keys is one minute.
 */
export interface SessionCreateResponse {
  /**
   * Ephemeral key returned by the API.
   */
  client_secret: SessionCreateResponse.ClientSecret;

  /**
   * The format of input audio. Options are `pcm16`, `g711_ulaw`, or `g711_alaw`.
   */
  input_audio_format?: string;

  /**
   * Configuration for input audio transcription, defaults to off and can be set to
   * `null` to turn off once on. Input audio transcription is not native to the
   * model, since the model consumes audio directly. Transcription runs
   * asynchronously through Whisper and should be treated as rough guidance rather
   * than the representation understood by the model.
   */
  input_audio_transcription?: SessionCreateResponse.InputAudioTranscription;

  /**
   * The default system instructions (i.e. system message) prepended to model calls.
   * This field allows the client to guide the model on desired responses. The model
   * can be instructed on response content and format, (e.g. "be extremely succinct",
   * "act friendly", "here are examples of good responses") and on audio behavior
   * (e.g. "talk quickly", "inject emotion into your voice", "laugh frequently"). The
   * instructions are not guaranteed to be followed by the model, but they provide
   * guidance to the model on the desired behavior.
   *
   * Note that the server sets default instructions which will be used if this field
   * is not set and are visible in the `session.created` event at the start of the
   * session.
   */
  instructions?: string;

  /**
   * Maximum number of output tokens for a single assistant response, inclusive of
   * tool calls. Provide an integer between 1 and 4096 to limit output tokens, or
   * `inf` for the maximum available tokens for a given model. Defaults to `inf`.
   */
  max_response_output_tokens?: number | 'inf';

  /**
   * The set of modalities the model can respond with. To disable audio, set this to
   * ["text"].
   */
  modalities?: Array<'text' | 'audio'>;

  /**
   * The format of output audio. Options are `pcm16`, `g711_ulaw`, or `g711_alaw`.
   */
  output_audio_format?: string;

  /**
   * Sampling temperature for the model, limited to [0.6, 1.2]. Defaults to 0.8.
   */
  temperature?: number;

  /**
   * How the model chooses tools. Options are `auto`, `none`, `required`, or specify
   * a function.
   */
  tool_choice?: string;

  /**
   * Tools (functions) available to the model.
   */
  tools?: Array<SessionCreateResponse.Tool>;

  /**
   * Configuration for turn detection. Can be set to `null` to turn off. Server VAD
   * means that the model will detect the start and end of speech based on audio
   * volume and respond at the end of user speech.
   */
  turn_detection?: SessionCreateResponse.TurnDetection;

  /**
   * The voice the model uses to respond. Voice cannot be changed during the session
   * once the model has responded with audio at least once. Current voice options are
   * `alloy`, `ash`, `ballad`, `coral`, `echo` `sage`, `shimmer` and `verse`.
   */
  voice?: 'alloy' | 'ash' | 'ballad' | 'coral' | 'echo' | 'sage' | 'shimmer' | 'verse';
}

export namespace SessionCreateResponse {
  /**
   * Ephemeral key returned by the API.
   */
  export interface ClientSecret {
    /**
     * Timestamp for when the token expires. Currently, all tokens expire after one
     * minute.
     */
    expires_at: number;

    /**
     * Ephemeral key usable in client environments to authenticate connections to the
     * Realtime API. Use this in client-side environments rather than a standard API
     * token, which should only be used server-side.
     */
    value: string;
  }

  /**
   * Configuration for input audio transcription, defaults to off and can be set to
   * `null` to turn off once on. Input audio transcription is not native to the
   * model, since the model consumes audio directly. Transcription runs
   * asynchronously through Whisper and should be treated as rough guidance rather
   * than the representation understood by the model.
   */
  export interface InputAudioTranscription {
    /**
     * The model to use for transcription, `whisper-1` is the only currently supported
     * model.
     */
    model?: string;
  }

  export interface Tool {
    /**
     * The description of the function, including guidance on when and how to call it,
     * and guidance about what to tell the user when calling (if anything).
     */
    description?: string;

    /**
     * The name of the function.
     */
    name?: string;

    /**
     * Parameters of the function in JSON Schema.
     */
    parameters?: unknown;

    /**
     * The type of the tool, i.e. `function`.
     */
    type?: 'function';
  }

  /**
   * Configuration for turn detection. Can be set to `null` to turn off. Server VAD
   * means that the model will detect the start and end of speech based on audio
   * volume and respond at the end of user speech.
   */
  export interface TurnDetection {
    /**
     * Amount of audio to include before the VAD detected speech (in milliseconds).
     * Defaults to 300ms.
     */
    prefix_padding_ms?: number;

    /**
     * Duration of silence to detect speech stop (in milliseconds). Defaults to 500ms.
     * With shorter values the model will respond more quickly, but may jump in on
     * short pauses from the user.
     */
    silence_duration_ms?: number;

    /**
     * Activation threshold for VAD (0.0 to 1.0), this defaults to 0.5. A higher
     * threshold will require louder audio to activate the model, and thus might
     * perform better in noisy environments.
     */
    threshold?: number;

    /**
     * Type of turn detection, only `server_vad` is currently supported.
     */
    type?: string;
  }
}

export interface SessionCreateParams {
  /**
   * The format of input audio. Options are `pcm16`, `g711_ulaw`, or `g711_alaw`. For
   * `pcm16`, input audio must be 16-bit PCM at a 24kHz sample rate, single channel
   * (mono), and little-endian byte order.
   */
  input_audio_format?: 'pcm16' | 'g711_ulaw' | 'g711_alaw';

  /**
   * Configuration for input audio transcription, defaults to off and can be set to
   * `null` to turn off once on. Input audio transcription is not native to the
   * model, since the model consumes audio directly. Transcription runs
   * asynchronously through
   * [OpenAI Whisper transcription](https://platform.openai.com/docs/api-reference/audio/createTranscription)
   * and should be treated as rough guidance rather than the representation
   * understood by the model. The client can optionally set the language and prompt
   * for transcription, these fields will be passed to the Whisper API.
   */
  input_audio_transcription?: SessionCreateParams.InputAudioTranscription;

  /**
   * The default system instructions (i.e. system message) prepended to model calls.
   * This field allows the client to guide the model on desired responses. The model
   * can be instructed on response content and format, (e.g. "be extremely succinct",
   * "act friendly", "here are examples of good responses") and on audio behavior
   * (e.g. "talk quickly", "inject emotion into your voice", "laugh frequently"). The
   * instructions are not guaranteed to be followed by the model, but they provide
   * guidance to the model on the desired behavior.
   *
   * Note that the server sets default instructions which will be used if this field
   * is not set and are visible in the `session.created` event at the start of the
   * session.
   */
  instructions?: string;

  /**
   * Maximum number of output tokens for a single assistant response, inclusive of
   * tool calls. Provide an integer between 1 and 4096 to limit output tokens, or
   * `inf` for the maximum available tokens for a given model. Defaults to `inf`.
   */
  max_response_output_tokens?: number | 'inf';

  /**
   * The set of modalities the model can respond with. To disable audio, set this to
   * ["text"].
   */
  modalities?: Array<'text' | 'audio'>;

  /**
   * The Realtime model used for this session.
   */
  model?:
    | 'gpt-4o-realtime-preview'
    | 'gpt-4o-realtime-preview-2024-10-01'
    | 'gpt-4o-realtime-preview-2024-12-17'
    | 'gpt-4o-mini-realtime-preview'
    | 'gpt-4o-mini-realtime-preview-2024-12-17';

  /**
   * The format of output audio. Options are `pcm16`, `g711_ulaw`, or `g711_alaw`.
   * For `pcm16`, output audio is sampled at a rate of 24kHz.
   */
  output_audio_format?: 'pcm16' | 'g711_ulaw' | 'g711_alaw';

  /**
   * Sampling temperature for the model, limited to [0.6, 1.2]. Defaults to 0.8.
   */
  temperature?: number;

  /**
   * How the model chooses tools. Options are `auto`, `none`, `required`, or specify
   * a function.
   */
  tool_choice?: string;

  /**
   * Tools (functions) available to the model.
   */
  tools?: Array<SessionCreateParams.Tool>;

  /**
   * Configuration for turn detection. Can be set to `null` to turn off. Server VAD
   * means that the model will detect the start and end of speech based on audio
   * volume and respond at the end of user speech.
   */
  turn_detection?: SessionCreateParams.TurnDetection;

  /**
   * The voice the model uses to respond. Voice cannot be changed during the session
   * once the model has responded with audio at least once. Current voice options are
   * `alloy`, `ash`, `ballad`, `coral`, `echo` `sage`, `shimmer` and `verse`.
   */
  voice?: 'alloy' | 'ash' | 'ballad' | 'coral' | 'echo' | 'sage' | 'shimmer' | 'verse';
}

export namespace SessionCreateParams {
  /**
   * Configuration for input audio transcription, defaults to off and can be set to
   * `null` to turn off once on. Input audio transcription is not native to the
   * model, since the model consumes audio directly. Transcription runs
   * asynchronously through
   * [OpenAI Whisper transcription](https://platform.openai.com/docs/api-reference/audio/createTranscription)
   * and should be treated as rough guidance rather than the representation
   * understood by the model. The client can optionally set the language and prompt
   * for transcription, these fields will be passed to the Whisper API.
   */
  export interface InputAudioTranscription {
    /**
     * The language of the input audio. Supplying the input language in
     * [ISO-639-1](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes) (e.g. `en`)
     * format will improve accuracy and latency.
     */
    language?: string;

    /**
     * The model to use for transcription, `whisper-1` is the only currently supported
     * model.
     */
    model?: string;

    /**
     * An optional text to guide the model's style or continue a previous audio
     * segment. The
     * [prompt](https://platform.openai.com/docs/guides/speech-to-text#prompting)
     * should match the audio language.
     */
    prompt?: string;
  }

  export interface Tool {
    /**
     * The description of the function, including guidance on when and how to call it,
     * and guidance about what to tell the user when calling (if anything).
     */
    description?: string;

    /**
     * The name of the function.
     */
    name?: string;

    /**
     * Parameters of the function in JSON Schema.
     */
    parameters?: unknown;

    /**
     * The type of the tool, i.e. `function`.
     */
    type?: 'function';
  }

  /**
   * Configuration for turn detection. Can be set to `null` to turn off. Server VAD
   * means that the model will detect the start and end of speech based on audio
   * volume and respond at the end of user speech.
   */
  export interface TurnDetection {
    /**
     * Whether or not to automatically generate a response when VAD is enabled. `true`
     * by default.
     */
    create_response?: boolean;

    /**
     * Amount of audio to include before the VAD detected speech (in milliseconds).
     * Defaults to 300ms.
     */
    prefix_padding_ms?: number;

    /**
     * Duration of silence to detect speech stop (in milliseconds). Defaults to 500ms.
     * With shorter values the model will respond more quickly, but may jump in on
     * short pauses from the user.
     */
    silence_duration_ms?: number;

    /**
     * Activation threshold for VAD (0.0 to 1.0), this defaults to 0.5. A higher
     * threshold will require louder audio to activate the model, and thus might
     * perform better in noisy environments.
     */
    threshold?: number;

    /**
     * Type of turn detection, only `server_vad` is currently supported.
     */
    type?: string;
  }
}

export declare namespace Sessions {
  export {
    type Session as Session,
    type SessionCreateResponse as SessionCreateResponse,
    type SessionCreateParams as SessionCreateParams,
  };
}


================================================
File: src/resources/chat/chat.ts
================================================
// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../../resource';
import * as CompletionsAPI from './completions';
import {
  ChatCompletion,
  ChatCompletionAssistantMessageParam,
  ChatCompletionAudio,
  ChatCompletionAudioParam,
  ChatCompletionChunk,
  ChatCompletionContentPart,
  ChatCompletionContentPartImage,
  ChatCompletionContentPartInputAudio,
  ChatCompletionContentPartRefusal,
  ChatCompletionContentPartText,
  ChatCompletionCreateParams,
  ChatCompletionCreateParamsNonStreaming,
  ChatCompletionCreateParamsStreaming,
  ChatCompletionDeveloperMessageParam,
  ChatCompletionFunctionCallOption,
  ChatCompletionFunctionMessageParam,
  ChatCompletionMessage,
  ChatCompletionMessageParam,
  ChatCompletionMessageToolCall,
  ChatCompletionModality,
  ChatCompletionNamedToolChoice,
  ChatCompletionPredictionContent,
  ChatCompletionReasoningEffort,
  ChatCompletionRole,
  ChatCompletionStreamOptions,
  ChatCompletionSystemMessageParam,
  ChatCompletionTokenLogprob,
  ChatCompletionTool,
  ChatCompletionToolChoiceOption,
  ChatCompletionToolMessageParam,
  ChatCompletionUserMessageParam,
  CompletionCreateParams,
  CompletionCreateParamsNonStreaming,
  CompletionCreateParamsStreaming,
  Completions,
  CreateChatCompletionRequestMessage,
} from './completions';

export class Chat extends APIResource {
  completions: CompletionsAPI.Completions = new CompletionsAPI.Completions(this._client);
}

export type ChatModel =
  | 'o3-mini'
  | 'o3-mini-2025-01-31'
  | 'o1'
  | 'o1-2024-12-17'
  | 'o1-preview'
  | 'o1-preview-2024-09-12'
  | 'o1-mini'
  | 'o1-mini-2024-09-12'
  | 'gpt-4o'
  | 'gpt-4o-2024-11-20'
  | 'gpt-4o-2024-08-06'
  | 'gpt-4o-2024-05-13'
  | 'gpt-4o-audio-preview'
  | 'gpt-4o-audio-preview-2024-10-01'
  | 'gpt-4o-audio-preview-2024-12-17'
  | 'gpt-4o-mini-audio-preview'
  | 'gpt-4o-mini-audio-preview-2024-12-17'
  | 'chatgpt-4o-latest'
  | 'gpt-4o-mini'
  | 'gpt-4o-mini-2024-07-18'
  | 'gpt-4-turbo'
  | 'gpt-4-turbo-2024-04-09'
  | 'gpt-4-0125-preview'
  | 'gpt-4-turbo-preview'
  | 'gpt-4-1106-preview'
  | 'gpt-4-vision-preview'
  | 'gpt-4'
  | 'gpt-4-0314'
  | 'gpt-4-0613'
  | 'gpt-4-32k'
  | 'gpt-4-32k-0314'
  | 'gpt-4-32k-0613'
  | 'gpt-3.5-turbo'
  | 'gpt-3.5-turbo-16k'
  | 'gpt-3.5-turbo-0301'
  | 'gpt-3.5-turbo-0613'
  | 'gpt-3.5-turbo-1106'
  | 'gpt-3.5-turbo-0125'
  | 'gpt-3.5-turbo-16k-0613';

Chat.Completions = Completions;

export declare namespace Chat {
  export { type ChatModel as ChatModel };

  export {
    Completions as Completions,
    type ChatCompletion as ChatCompletion,
    type ChatCompletionAssistantMessageParam as ChatCompletionAssistantMessageParam,
    type ChatCompletionAudio as ChatCompletionAudio,
    type ChatCompletionAudioParam as ChatCompletionAudioParam,
    type ChatCompletionChunk as ChatCompletionChunk,
    type ChatCompletionContentPart as ChatCompletionContentPart,
    type ChatCompletionContentPartImage as ChatCompletionContentPartImage,
    type ChatCompletionContentPartInputAudio as ChatCompletionContentPartInputAudio,
    type ChatCompletionContentPartRefusal as ChatCompletionContentPartRefusal,
    type ChatCompletionContentPartText as ChatCompletionContentPartText,
    type ChatCompletionDeveloperMessageParam as ChatCompletionDeveloperMessageParam,
    type ChatCompletionFunctionCallOption as ChatCompletionFunctionCallOption,
    type ChatCompletionFunctionMessageParam as ChatCompletionFunctionMessageParam,
    type ChatCompletionMessage as ChatCompletionMessage,
    type ChatCompletionMessageParam as ChatCompletionMessageParam,
    type ChatCompletionMessageToolCall as ChatCompletionMessageToolCall,
    type ChatCompletionModality as ChatCompletionModality,
    type ChatCompletionNamedToolChoice as ChatCompletionNamedToolChoice,
    type ChatCompletionPredictionContent as ChatCompletionPredictionContent,
    type ChatCompletionReasoningEffort as ChatCompletionReasoningEffort,
    type ChatCompletionRole as ChatCompletionRole,
    type ChatCompletionStreamOptions as ChatCompletionStreamOptions,
    type ChatCompletionSystemMessageParam as ChatCompletionSystemMessageParam,
    type ChatCompletionTokenLogprob as ChatCompletionTokenLogprob,
    type ChatCompletionTool as ChatCompletionTool,
    type ChatCompletionToolChoiceOption as ChatCompletionToolChoiceOption,
    type ChatCompletionToolMessageParam as ChatCompletionToolMessageParam,
    type ChatCompletionUserMessageParam as ChatCompletionUserMessageParam,
    type CreateChatCompletionRequestMessage as CreateChatCompletionRequestMessage,
    type ChatCompletionCreateParams as ChatCompletionCreateParams,
    type CompletionCreateParams as CompletionCreateParams,
    type ChatCompletionCreateParamsNonStreaming as ChatCompletionCreateParamsNonStreaming,
    type CompletionCreateParamsNonStreaming as CompletionCreateParamsNonStreaming,
    type ChatCompletionCreateParamsStreaming as ChatCompletionCreateParamsStreaming,
    type CompletionCreateParamsStreaming as CompletionCreateParamsStreaming,
  };
}


================================================
File: src/resources/chat/index.ts
================================================
// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

export { Chat, type ChatModel } from './chat';
export {
  Completions,
  type ChatCompletion,
  type ChatCompletionAssistantMessageParam,
  type ChatCompletionAudio,
  type ChatCompletionAudioParam,
  type ChatCompletionChunk,
  type ChatCompletionContentPart,
  type ChatCompletionContentPartImage,
  type ChatCompletionContentPartInputAudio,
  type ChatCompletionContentPartRefusal,
  type ChatCompletionContentPartText,
  type ChatCompletionDeveloperMessageParam,
  type ChatCompletionFunctionCallOption,
  type ChatCompletionFunctionMessageParam,
  type ChatCompletionMessage,
  type ChatCompletionMessageParam,
  type ChatCompletionMessageToolCall,
  type ChatCompletionModality,
  type ChatCompletionNamedToolChoice,
  type ChatCompletionPredictionContent,
  type ChatCompletionReasoningEffort,
  type ChatCompletionRole,
  type ChatCompletionStreamOptions,
  type ChatCompletionSystemMessageParam,
  type ChatCompletionTokenLogprob,
  type ChatCompletionTool,
  type ChatCompletionToolChoiceOption,
  type ChatCompletionToolMessageParam,
  type ChatCompletionUserMessageParam,
  type CreateChatCompletionRequestMessage,
  type ChatCompletionCreateParams,
  type CompletionCreateParams,
  type ChatCompletionCreateParamsNonStreaming,
  type CompletionCreateParamsNonStreaming,
  type ChatCompletionCreateParamsStreaming,
  type CompletionCreateParamsStreaming,
} from './completions';

