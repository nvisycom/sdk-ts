/**
 * @fileoverview Main client for the Nvisy SDK.
 *
 * This module exports the {@link Client} class, which is the primary entry point
 * for interacting with the Nvisy document processing API.
 *
 * @module client
 *
 * @example
 * ```typescript
 * // Create client with API token
 * const client = new Client({ apiToken: "your-api-token" });
 * const account = await client.account.get();
 *
 * // Or create from environment variables
 * const client = Client.fromEnvironment();
 * ```
 */

import createClient, { type Client as OpenApiClient } from "openapi-fetch";
import { buildUserAgent, type ClientConfig, DEFAULTS, ENV_VARS } from "@/config.js";
import { ConfigError } from "@/errors.js";
import { errorMiddleware } from "@/middleware/index.js";
import type { paths } from "@/schema/api.js";
import {
  AccountService,
  ApiTokensService,
  AuthService,
  CommentsService,
  DocumentsService,
  FilesService,
  IntegrationsService,
  InvitesService,
  MembersService,
  PipelinesService,
  ProjectsService,
  StatusService,
  TemplatesService,
  WebhooksService,
} from "@/services/index.js";

/**
 * Typed openapi-fetch client for the Nvisy API.
 *
 * This type represents the low-level HTTP client configured with the Nvisy API schema.
 * It's exposed via {@link Client.api} for advanced use cases requiring direct API access.
 */
export type ApiClient = OpenApiClient<paths>;

/**
 * Internal configuration state for the client with all fields resolved.
 *
 * @internal
 */
type ResolvedConfig = Required<ClientConfig>;

/**
 * Main client class for interacting with the Nvisy document processing API.
 *
 * Create a client by providing an API token directly or by using
 * {@link fromEnvironment} to read configuration from environment variables.
 *
 * @example
 * ```typescript
 * // Create client with API token
 * const client = new Client({ apiToken: "your-api-token" });
 * const account = await client.account.get();
 *
 * // Create client from environment variables
 * const client = Client.fromEnvironment();
 * const projects = await client.projects.list();
 * ```
 */
export class Client {
  /**
   * The resolved client configuration with defaults applied.
   * @internal
   */
  readonly #config: ResolvedConfig;

  /**
   * The underlying openapi-fetch client instance.
   * @internal
   */
  readonly #api: ApiClient;

  /**
   * Creates a client from environment variables.
   *
   * This factory method reads configuration from environment variables:
   * - `NVISY_API_TOKEN` (required): The API token for authentication
   * - `NVISY_BASE_URL` (optional): Custom base URL for the API
   * - `NVISY_USER_AGENT` (optional): Custom user agent string
   *
   * @returns A Client instance
   * @throws {ConfigError} If `NVISY_API_TOKEN` environment variable is not set
   *
   * @example
   * ```typescript
   * // Set environment variables:
   * // NVISY_API_TOKEN=your-api-token
   * // NVISY_BASE_URL=https://api.nvisy.com (optional)
   *
   * const client = Client.fromEnvironment();
   * const account = await client.account.get();
   * ```
   */
  static fromEnvironment(): Client {
    const apiToken = process.env[ENV_VARS.API_TOKEN];
    if (!apiToken) {
      throw ConfigError.missingField(ENV_VARS.API_TOKEN);
    }

    return new Client({
      apiToken,
      baseUrl: process.env[ENV_VARS.BASE_URL],
      userAgent: process.env[ENV_VARS.USER_AGENT],
    });
  }

  /**
   * Creates a new Nvisy client instance.
   *
   * @param config - Configuration options with required `apiToken`
   * @throws {ConfigError} If the API token is invalid
   *
   * @example
   * ```typescript
   * const client = new Client({
   *   apiToken: "your-api-token",
   *   baseUrl: "https://custom.api.nvisy.com",
   * });
   * const account = await client.account.get();
   * ```
   */
  constructor(config: ClientConfig) {
    const validatedToken = this.#validateApiToken(config.apiToken);

    this.#config = {
      apiToken: validatedToken,
      baseUrl: config.baseUrl ?? DEFAULTS.BASE_URL,
      headers: config.headers ?? {},
      userAgent: config.userAgent ?? buildUserAgent(),
    };

    this.#api = this.#createApiClient();
  }

  /**
   * Creates and configures the underlying openapi-fetch client.
   *
   * @returns A configured ApiClient instance
   * @internal
   */
  #createApiClient(): ApiClient {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      "User-Agent": this.#config.userAgent,
      Authorization: `Bearer ${this.#config.apiToken}`,
      ...this.#config.headers,
    };

    const api = createClient<paths>({
      baseUrl: this.#config.baseUrl,
      headers,
    });

    api.use(errorMiddleware);
    return api;
  }

  /**
   * Validates an API token format.
   *
   * @param apiToken - The API token to validate
   * @returns The trimmed API token if valid
   * @throws {ConfigError} If the API token is invalid
   * @internal
   */
  #validateApiToken(apiToken: string): string {
    if (typeof apiToken !== "string" || apiToken.trim().length === 0) {
      throw ConfigError.invalidField("apiToken", "must be a non-empty string");
    }

    const trimmedToken = apiToken.trim();
    if (trimmedToken.length < 10) {
      throw ConfigError.invalidField("apiToken", "must be at least 10 characters");
    }

    if (!/^[a-zA-Z0-9_-]+$/.test(trimmedToken)) {
      throw ConfigError.invalidField("apiToken", "contains invalid characters");
    }

    return trimmedToken;
  }

  /**
   * The base URL used for API requests.
   *
   * @returns The configured base URL
   */
  get baseUrl(): string {
    return this.#config.baseUrl;
  }

  /**
   * The underlying openapi-fetch client for direct API access.
   *
   * Use this for advanced scenarios where you need direct access to the
   * HTTP client, such as calling endpoints not covered by the service classes.
   *
   * @returns The configured ApiClient instance
   */
  get api(): ApiClient {
    return this.#api;
  }

  /**
   * Service for authentication operations (login, signup, logout).
   *
   * @returns The AuthService instance
   */
  get auth(): AuthService {
    return new AuthService(this.#api);
  }

  /**
   * Service for API status and health checks.
   *
   * @returns The StatusService instance
   */
  get status(): StatusService {
    return new StatusService(this.#api);
  }

  /**
   * Service for managing the authenticated user's account.
   *
   * @returns The AccountService instance
   */
  get account(): AccountService {
    return new AccountService(this.#api);
  }

  /**
   * Service for managing API tokens.
   *
   * @returns The ApiTokensService instance
   */
  get apiTokens(): ApiTokensService {
    return new ApiTokensService(this.#api);
  }

  /**
   * Service for managing file comments.
   *
   * @returns The CommentsService instance
   */
  get comments(): CommentsService {
    return new CommentsService(this.#api);
  }

  /**
   * Service for document operations.
   *
   * @returns The DocumentsService instance
   */
  get documents(): DocumentsService {
    return new DocumentsService(this.#api);
  }

  /**
   * Service for file operations (upload, download, delete).
   *
   * @returns The FilesService instance
   */
  get files(): FilesService {
    return new FilesService(this.#api);
  }

  /**
   * Service for managing integrations.
   *
   * @returns The IntegrationsService instance
   */
  get integrations(): IntegrationsService {
    return new IntegrationsService(this.#api);
  }

  /**
   * Service for managing project invitations.
   *
   * @returns The InvitesService instance
   */
  get invites(): InvitesService {
    return new InvitesService(this.#api);
  }

  /**
   * Service for managing project members.
   *
   * @returns The MembersService instance
   */
  get members(): MembersService {
    return new MembersService(this.#api);
  }

  /**
   * Service for managing processing pipelines.
   *
   * @returns The PipelinesService instance
   */
  get pipelines(): PipelinesService {
    return new PipelinesService(this.#api);
  }

  /**
   * Service for managing projects.
   *
   * @returns The ProjectsService instance
   */
  get projects(): ProjectsService {
    return new ProjectsService(this.#api);
  }

  /**
   * Service for managing processing templates.
   *
   * @returns The TemplatesService instance
   */
  get templates(): TemplatesService {
    return new TemplatesService(this.#api);
  }

  /**
   * Service for managing webhooks.
   *
   * @returns The WebhooksService instance
   */
  get webhooks(): WebhooksService {
    return new WebhooksService(this.#api);
  }
}
