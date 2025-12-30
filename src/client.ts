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
 * const client = new Client({ apiToken: "your-api-token" });
 * const account = await client.account.get();
 * ```
 */

import createClient, { type Client as OpenApiClient } from "openapi-fetch";
import { type ClientConfig, DEFAULTS } from "@/config.js";
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
	StatusService,
	WebhooksService,
	WorkspacesService,
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
 * @example
 * ```typescript
 * const client = new Client({ apiToken: "your-api-token" });
 * const account = await client.account.get();
 * const workspaces = await client.workspaces.list();
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
			userAgent: config.userAgent ?? DEFAULTS.USER_AGENT,
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
			throw ConfigError.invalidField(
				"apiToken",
				"must be at least 10 characters",
			);
		}

		if (!/^[a-zA-Z0-9_-]+$/.test(trimmedToken)) {
			throw ConfigError.invalidField("apiToken", "contains invalid characters");
		}

		return trimmedToken;
	}

	/**
	 * Creates a new client with a different API token.
	 *
	 * Returns a new client instance with the new token. The original client
	 * remains unchanged. All other configuration (base URL, headers, etc.)
	 * is preserved in the new client.
	 *
	 * @param apiToken - The new API token
	 * @returns A new Client instance with the new token
	 * @throws {ConfigError} If the API token is invalid
	 *
	 * @example
	 * ```typescript
	 * const client = new Client({ apiToken: "original-token" });
	 * const newClient = client.withApiToken("new-token");
	 *
	 * // newClient uses the new token
	 * // client still uses the original token
	 * ```
	 */
	withApiToken(apiToken: string): Client {
		return new Client({ ...this.#config, apiToken });
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
	 * Service for managing workspace invitations.
	 *
	 * @returns The InvitesService instance
	 */
	get invites(): InvitesService {
		return new InvitesService(this.#api);
	}

	/**
	 * Service for managing workspace members.
	 *
	 * @returns The MembersService instance
	 */
	get members(): MembersService {
		return new MembersService(this.#api);
	}

	/**
	 * Service for managing webhooks.
	 *
	 * @returns The WebhooksService instance
	 */
	get webhooks(): WebhooksService {
		return new WebhooksService(this.#api);
	}

	/**
	 * Service for managing workspaces.
	 *
	 * @returns The WorkspacesService instance
	 */
	get workspaces(): WorkspacesService {
		return new WorkspacesService(this.#api);
	}
}
