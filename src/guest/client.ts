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

import type { NvisyGuestOptions } from "@/config.js";
import { type ApiClient, createApiClient, resolveDefaults } from "@/http.js";
import { GuestAuth, GuestCapabilities, Status } from "@/services/index.js";

/**
 * Pre-auth Nvisy client. Wraps a token-less {@link ApiClient} and exposes the
 * public surface: {@link GuestAuth}, {@link GuestCapabilities}, and
 * {@link Status}. Configured with the shared {@link NvisyGuestOptions} (no auth); a
 * guest client never sends a token. Pass `credentials: "include"` to send the
 * session cookies set by login / signup on a cross-origin app.
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
	constructor(config: NvisyGuestOptions = {}) {
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
	 * The pre-auth capabilities read: `getAuthCapabilities()`. The label /
	 * recognizer / connector reads require an authenticated {@link Nvisy} client.
	 */
	get capabilities(): GuestCapabilities {
		return new GuestCapabilities(this.#api);
	}

	/** Health checks (liveness / readiness). */
	get health(): Status {
		return new Status(this.#api);
	}
}
