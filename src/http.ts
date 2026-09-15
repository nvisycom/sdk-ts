/**
 * @fileoverview Shared openapi-fetch client factory used by both the
 * authenticated {@link Nvisy} client and the pre-auth {@link NvisyGuest} client.
 *
 * @module http
 * @internal
 */

import createClient, { type Client as OpenApiClient } from "openapi-fetch";
import { DEFAULTS } from "@/config.js";
import {
	createLoggingMiddleware,
	errorMiddleware,
} from "@/middleware/index.js";
import type { paths } from "@/schema/api.js";

/** Typed openapi-fetch client for the Nvisy API. */
export type ApiClient = OpenApiClient<paths>;

/** Resolved options for building an {@link ApiClient}. */
export interface ApiClientOptions {
	/** Bearer token to send as `Authorization`; omit for an unauthenticated client. */
	apiToken?: string;
	/** Base URL for the API. */
	baseUrl: string;
	/** Custom headers merged over the defaults. */
	headers: Record<string, string>;
	/** User-agent string. */
	userAgent: string;
	/** Credentials mode forwarded to `fetch` (e.g. `"include"` for cookies). */
	credentials?: RequestCredentials;
	/** Whether to log requests/responses. */
	withLogging: boolean;
	/** Custom fetch implementation; `undefined` uses the global fetch. */
	fetch?: typeof globalThis.fetch;
}

/**
 * Build a configured openapi-fetch client. A bearer `Authorization` header is
 * sent only when `apiToken` is provided, so the same factory serves the
 * authenticated and guest clients.
 */
export function createApiClient(options: ApiClientOptions): ApiClient {
	const headers: Record<string, string> = {
		"Content-Type": "application/json",
		"User-Agent": options.userAgent,
		// Send a bearer token only when configured; a guest client authenticates
		// with cookies (or not at all) instead.
		...(options.apiToken
			? { Authorization: `Bearer ${options.apiToken}` }
			: {}),
		...options.headers,
	};

	const api = createClient<paths>({
		baseUrl: options.baseUrl,
		headers,
		// `undefined` falls back to the global fetch inside openapi-fetch.
		fetch: options.fetch,
		// Omitted `credentials` uses the platform default.
		...(options.credentials ? { credentials: options.credentials } : {}),
	});

	if (options.withLogging) {
		api.use(createLoggingMiddleware());
	}

	api.use(errorMiddleware);
	return api;
}

/** Apply the shared defaults (base URL, user agent) to a config's optionals. */
export function resolveDefaults<
	T extends {
		baseUrl?: string;
		headers?: Record<string, string>;
		userAgent?: string;
		withLogging?: boolean;
	},
>(config: T) {
	return {
		baseUrl: config.baseUrl ?? DEFAULTS.BASE_URL,
		headers: config.headers ?? {},
		userAgent: config.userAgent ?? DEFAULTS.USER_AGENT,
		withLogging: config.withLogging ?? false,
	};
}
