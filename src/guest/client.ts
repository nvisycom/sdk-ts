/**
 * @fileoverview The pre-auth ("guest") Nvisy client.
 *
 * {@link NvisyGuest} exposes only the endpoints that work without an API token:
 * sign-in (login / signup / OIDC start), the deployment's auth capabilities, and
 * health checks. Use it to power a login screen before anyone has authenticated;
 * for the authenticated API, use {@link Nvisy} from `@nvisy/sdk`.
 *
 * @module guest
 *
 * @example
 * ```typescript
 * import { NvisyGuest } from "@nvisy/sdk/guest";
 *
 * const guest = new NvisyGuest({ baseUrl: "https://api.nvisy.com" });
 * const auth = await guest.capabilities.getAuthCapabilities();
 * await guest.auth.loginAccount({ identifier: "user@example.com", password: "..." });
 * ```
 */

import type { ClientConfig } from "@/config.js";
import { type ApiClient, createApiClient, resolveDefaults } from "@/http.js";
import { Capabilities, GuestAuth, Status } from "@/services/index.js";

/**
 * Configuration for {@link NvisyGuest}. Same as {@link ClientConfig} but without
 * `apiToken` — a guest client never authenticates with a bearer token. Pass
 * `credentials: "include"` to send the session cookies set by login / signup.
 */
export type GuestConfig = Omit<ClientConfig, "apiToken">;

/**
 * Pre-auth Nvisy client. Wraps a token-less {@link ApiClient} and exposes the
 * public surface: {@link GuestAuth}, {@link Capabilities}, and {@link Status}.
 */
export class NvisyGuest {
	/** The resolved base URL. @internal */
	readonly #baseUrl: string;

	/** The underlying openapi-fetch client instance. @internal */
	readonly #api: ApiClient;

	/**
	 * Creates a new pre-auth Nvisy client (no API token).
	 *
	 * @param config - Optional configuration (baseUrl, credentials, headers,
	 *   userAgent, fetch)
	 */
	constructor(config: GuestConfig = {}) {
		const resolved = resolveDefaults(config);
		this.#baseUrl = resolved.baseUrl;
		this.#api = createApiClient({
			credentials: config.credentials,
			fetch: config.fetch,
			...resolved,
		});
	}

	/** The base URL used for API requests. */
	get baseUrl(): string {
		return this.#baseUrl;
	}

	/** The underlying openapi-fetch client for direct API access. */
	get api(): ApiClient {
		return this.#api;
	}

	/** Pre-auth sign-in: login, signup, and OIDC start. */
	get auth(): GuestAuth {
		return new GuestAuth(this.#api);
	}

	/**
	 * The deployment's capabilities. Pre-auth, only `getAuthCapabilities()` is
	 * public; the other reads require an authenticated {@link Nvisy} client.
	 */
	get capabilities(): Capabilities {
		return new Capabilities(this.#api);
	}

	/** Health checks (liveness / readiness). */
	get health(): Status {
		return new Status(this.#api);
	}
}
