/**
 * @fileoverview Shared openapi-fetch client factory for the SDK's standalone
 * operations (auth, health) that run before a {@link Nvisy} client exists.
 *
 * @module http
 * @internal
 */

import createClient from "openapi-fetch";
import type { ClientConfig } from "@/config.js";
import { DEFAULTS } from "@/config.js";
import { errorMiddleware } from "@/middleware/index.js";
import type { paths } from "@/schema/api.js";

/** Config accepted by a standalone (unauthenticated) client. */
export type PublicConfig = Omit<ClientConfig, "apiToken">;

interface PublicClientOptions {
	/** Send a JSON `Content-Type` header (for requests with a body). */
	json?: boolean;
	/**
	 * Throw {@link NvisyApiError} / {@link NvisyError} on non-2xx responses and
	 * network failures. Off for endpoints where a non-2xx body is a valid
	 * result (e.g. health `503`).
	 *
	 * @default true
	 */
	errorHandling?: boolean;
}

/**
 * Build an unauthenticated openapi-fetch client from a {@link PublicConfig}.
 *
 * Applies the shared base URL / user-agent / header / fetch resolution used by
 * both the auth helpers and the health check.
 */
export function createPublicClient(
	config?: PublicConfig,
	{ json = false, errorHandling = true }: PublicClientOptions = {},
) {
	const headers: Record<string, string> = {
		"User-Agent": config?.userAgent ?? DEFAULTS.USER_AGENT,
		...(json ? { "Content-Type": "application/json" } : {}),
		...config?.headers,
	};

	const client = createClient<paths>({
		baseUrl: config?.baseUrl ?? DEFAULTS.BASE_URL,
		headers,
		// `undefined` falls back to the global fetch inside openapi-fetch.
		fetch: config?.fetch,
	});

	if (errorHandling) client.use(errorMiddleware);
	return client;
}
