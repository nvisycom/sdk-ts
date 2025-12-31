/**
 * @fileoverview Main client for the Nvisy SDK.
 *
 * This module exports the {@link Nvisy} class, which is the primary entry point
 * for interacting with the Nvisy document processing API.
 *
 * @module client
 *
 * @example
 * ```typescript
 * const nvisy = new Nvisy({ apiToken: "your-api-token" });
 * const account = await nvisy.account.getAccount();
 * ```
 */

import createClient, { type Client as OpenApiClient } from "openapi-fetch";
import { type ClientConfig, DEFAULTS } from "@/config.js";
import { NvisyError } from "@/errors.js";
import {
	createLoggingMiddleware,
	errorMiddleware,
} from "@/middleware/index.js";
import type { paths } from "@/schema/api.js";
import {
	Account,
	ApiTokens,
	Auth,
	Comments,
	Documents,
	Files,
	Integrations,
	Invites,
	Members,
	Status,
	Webhooks,
	Workspaces,
} from "@/services/index.js";

/**
 * Typed openapi-fetch client for the Nvisy API.
 *
 * This type represents the low-level HTTP client configured with the Nvisy API schema.
 * It's exposed via {@link Nvisy.api} for advanced use cases requiring direct API access.
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
 * const nvisy = new Nvisy({ apiToken: "your-api-token" });
 * const account = await nvisy.account.getAccount();
 * const workspaces = await nvisy.workspaces.listWorkspaces();
 * ```
 */
export class Nvisy {
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
	 * @throws {NvisyError} If the API token is invalid
	 *
	 * @example
	 * ```typescript
	 * const nvisy = new Nvisy({
	 *   apiToken: "your-api-token",
	 *   baseUrl: "https://custom.api.nvisy.com",
	 * });
	 * const account = await nvisy.account.getAccount();
	 * ```
	 */
	constructor(config: ClientConfig) {
		const validatedToken = this.#validateApiToken(config.apiToken);

		this.#config = {
			apiToken: validatedToken,
			baseUrl: config.baseUrl ?? DEFAULTS.BASE_URL,
			headers: config.headers ?? {},
			userAgent: config.userAgent ?? DEFAULTS.USER_AGENT,
			withLogging: config.withLogging ?? false,
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

		if (this.#config.withLogging) {
			api.use(createLoggingMiddleware());
		}

		api.use(errorMiddleware);
		return api;
	}

	/**
	 * Validates an API token format.
	 *
	 * @param apiToken - The API token to validate
	 * @returns The trimmed API token if valid
	 * @throws {NvisyError} If the API token is invalid
	 * @internal
	 */
	#validateApiToken(apiToken: string): string {
		if (typeof apiToken !== "string" || apiToken.trim().length === 0) {
			throw new NvisyError("API token must be a non-empty string");
		}

		const trimmedToken = apiToken.trim();
		if (trimmedToken.length < 10) {
			throw new NvisyError("API token must be at least 10 characters");
		}

		if (!/^[a-zA-Z0-9_.\-]+$/.test(trimmedToken)) {
			throw new NvisyError("API token contains invalid characters");
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
	 * @returns A new Nvisy instance with the new token
	 * @throws {NvisyError} If the API token is invalid
	 *
	 * @example
	 * ```typescript
	 * const nvisy = new Nvisy({ apiToken: "original-token" });
	 * const newNvisy = nvisy.withApiToken("new-token");
	 *
	 * // newNvisy uses the new token
	 * // nvisy still uses the original token
	 * ```
	 */
	withApiToken(apiToken: string): Nvisy {
		return new Nvisy({ ...this.#config, apiToken });
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
	 */
	get auth(): Auth {
		return new Auth(this.#api);
	}

	/**
	 * Service for API status and health checks.
	 */
	get status(): Status {
		return new Status(this.#api);
	}

	/**
	 * Service for managing the authenticated user's account.
	 */
	get account(): Account {
		return new Account(this.#api);
	}

	/**
	 * Service for managing API tokens.
	 */
	get apiTokens(): ApiTokens {
		return new ApiTokens(this.#api);
	}

	/**
	 * Service for managing file comments.
	 */
	get comments(): Comments {
		return new Comments(this.#api);
	}

	/**
	 * Service for document operations.
	 */
	get documents(): Documents {
		return new Documents(this.#api);
	}

	/**
	 * Service for file operations (upload, download, delete).
	 */
	get files(): Files {
		return new Files(this.#api);
	}

	/**
	 * Service for managing integrations.
	 */
	get integrations(): Integrations {
		return new Integrations(this.#api);
	}

	/**
	 * Service for managing workspace invitations.
	 */
	get invites(): Invites {
		return new Invites(this.#api);
	}

	/**
	 * Service for managing workspace members.
	 */
	get members(): Members {
		return new Members(this.#api);
	}

	/**
	 * Service for managing webhooks.
	 */
	get webhooks(): Webhooks {
		return new Webhooks(this.#api);
	}

	/**
	 * Service for managing workspaces.
	 */
	get workspaces(): Workspaces {
		return new Workspaces(this.#api);
	}
}
