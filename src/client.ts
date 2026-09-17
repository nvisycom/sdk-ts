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

import type { NvisyOptions } from "@/config.js";
import { NvisyError } from "@/errors.js";
import { type ApiClient, createApiClient, resolveDefaults } from "@/http.js";
import {
	Account,
	Activities,
	Analytics,
	ApiTokens,
	Auth,
	Capabilities,
	Connections,
	Detections,
	Documents,
	Invites,
	Members,
	Notifications,
	Pipelines,
	Policies,
	Providers,
	Redactions,
	Reviews,
	Status,
	Syncs,
	Webhooks,
	Workspaces,
} from "@/services/index.js";

/**
 * Typed openapi-fetch client for the Nvisy API. Exposed via {@link Nvisy.api}
 * for advanced use cases requiring direct API access.
 */
export type { ApiClient } from "@/http.js";

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
	/** The config this client was built from (for {@link withApiToken}). @internal */
	readonly #config: NvisyOptions;

	/** The resolved base URL. @internal */
	readonly #baseUrl: string;

	/**
	 * The underlying openapi-fetch client instance.
	 * @internal
	 */
	readonly #api: ApiClient;

	/**
	 * Creates a new authenticated Nvisy client.
	 *
	 * Authenticate with an `apiToken` (bearer) or `session: true` (the browser
	 * cookie session established by the guest client's login / signup). For the
	 * pre-auth surface (login / signup / OIDC start, auth capabilities, health),
	 * use {@link NvisyGuest} from `@nvisy/sdk/guest`.
	 *
	 * @param config - Configuration; provide either `apiToken` or `session: true`
	 * @throws {NvisyError} If an `apiToken` is provided but invalid
	 *
	 * @example
	 * ```typescript
	 * const nvisy = new Nvisy({ apiToken: "your-api-token" });
	 * // or, after a browser login:
	 * const nvisy = new Nvisy({ session: true });
	 * ```
	 */
	constructor(config: NvisyOptions) {
		this.#config = config;
		const resolved = resolveDefaults(config);
		this.#baseUrl = resolved.baseUrl;

		const usesSession = config.session === true;
		this.#api = createApiClient({
			apiToken: usesSession
				? undefined
				: this.#validateApiToken(config.apiToken),
			// Session auth sends cookies; default to "include" unless the caller
			// overrode `credentials` explicitly.
			credentials: usesSession
				? (config.credentials ?? "include")
				: config.credentials,
			fetch: config.fetch,
			...resolved,
		});
	}

	/**
	 * Validates an API token format.
	 *
	 * @param apiToken - The API token to validate
	 * @returns The trimmed API token if valid
	 * @throws {NvisyError} If the API token is invalid
	 * @internal
	 */
	#validateApiToken(apiToken: string | undefined): string {
		if (typeof apiToken !== "string" || apiToken.trim().length === 0) {
			throw new NvisyError("API token must be a non-empty string");
		}

		const trimmedToken = apiToken.trim();
		if (trimmedToken.length < 10) {
			throw new NvisyError("API token must be at least 10 characters");
		}

		if (!/^[a-zA-Z0-9_.-]+$/.test(trimmedToken)) {
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
		const { baseUrl, headers, userAgent, credentials, withLogging, fetch } =
			this.#config;
		return new Nvisy({
			apiToken,
			baseUrl,
			headers,
			userAgent,
			credentials,
			withLogging,
			fetch,
		});
	}

	/**
	 * The base URL used for API requests.
	 *
	 * @returns The configured base URL
	 */
	get baseUrl(): string {
		return this.#baseUrl;
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
	 * Service for authenticated auth operations (logout, desktop token). Pre-auth
	 * sign-in lives on {@link NvisyGuest}.
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
	 * Service for viewing workspace activities.
	 */
	get activities(): Activities {
		return new Activities(this.#api);
	}

	/**
	 * Service for workspace analytics.
	 */
	get analytics(): Analytics {
		return new Analytics(this.#api);
	}

	/**
	 * Service for managing API tokens.
	 */
	get apiTokens(): ApiTokens {
		return new ApiTokens(this.#api);
	}

	/**
	 * Service for managing connections.
	 */
	get connections(): Connections {
		return new Connections(this.#api);
	}

	/**
	 * Service for document operations (upload, download, delete, review).
	 */
	get documents(): Documents {
		return new Documents(this.#api);
	}

	/**
	 * Service for managing pipelines.
	 */
	get pipelines(): Pipelines {
		return new Pipelines(this.#api);
	}

	/**
	 * Service for managing policies.
	 */
	get policies(): Policies {
		return new Policies(this.#api);
	}

	/**
	 * Service for managing a workspace's inference providers.
	 */
	get providers(): Providers {
		return new Providers(this.#api);
	}

	/**
	 * Service for reading the deployment's capabilities (labels, recognizers,
	 * connectors, auth methods).
	 */
	get capabilities(): Capabilities {
		return new Capabilities(this.#api);
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
	 * Service for managing notifications.
	 */
	get notifications(): Notifications {
		return new Notifications(this.#api);
	}

	/**
	 * Service for pipeline detections and their redactions.
	 */
	get detections(): Detections {
		return new Detections(this.#api);
	}

	/**
	 * Service for workspace redactions.
	 */
	get redactions(): Redactions {
		return new Redactions(this.#api);
	}

	/**
	 * Service for document reviews (assigning documents to reviewers).
	 */
	get reviews(): Reviews {
		return new Reviews(this.#api);
	}

	/**
	 * Service for managing connection syncs.
	 */
	get syncs(): Syncs {
		return new Syncs(this.#api);
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
