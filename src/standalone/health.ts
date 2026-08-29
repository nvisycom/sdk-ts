/**
 * @fileoverview Standalone API health check.
 *
 * This module provides a `checkHealth` function that does not require an API
 * token or a {@link Nvisy} client. Use it as a pre-auth liveness probe.
 *
 * @module standalone/health
 *
 * @example
 * ```typescript
 * import { checkHealth } from "@nvisy/sdk/standalone";
 *
 * const health = await checkHealth();
 * if (health.status !== "healthy") {
 *   // back off, retry, alert, ...
 * }
 * ```
 */

import type { Health } from "@/datatypes/index.js";
import type { HealthConfig } from "@/standalone/config.js";
import { createPublicClient } from "@/standalone/http.js";

/**
 * Check the health status of the API, without an API token or a client.
 *
 * The health endpoint is public: an unauthenticated request returns a cached
 * status, an authenticated one performs a real-time check. This function sends
 * no token; pass one via `config.headers` if a real-time check is desired.
 *
 * @param config - Optional configuration (baseUrl, headers, userAgent, fetch,
 *   version)
 * @returns Promise that resolves with the API health status (for both the
 *   healthy `200` and degraded `503` responses)
 */
export async function checkHealth(config?: HealthConfig): Promise<Health> {
	// `errorHandling: false` — the health endpoint returns a `Health` body on
	// both `200` (healthy) and `503` (degraded); a degraded status is a valid
	// result to return, not an error to throw.
	const client = createPublicClient(config, { errorHandling: false });

	const { data, error } = await client.GET("/health/", {
		params: { path: { version: config?.version ?? "v1" } },
	});
	// `data` on 200, `error` on 503 — both carry a `Health` body.
	return (data ?? error) as Health;
}
