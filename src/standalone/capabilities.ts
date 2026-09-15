/**
 * @fileoverview Standalone auth-capabilities read.
 *
 * Provides `getAuthCapabilities`, which does not require an API token or a
 * {@link Nvisy} client. Use it pre-auth to render a login screen with the
 * sign-in methods the deployment offers.
 *
 * @module standalone/capabilities
 *
 * @example
 * ```typescript
 * import { getAuthCapabilities } from "@nvisy/sdk/standalone";
 *
 * const auth = await getAuthCapabilities();
 * // render password / OIDC buttons based on `auth`
 * ```
 */

import type { AuthCapabilities } from "@/datatypes/index.js";
import type { AuthConfig } from "@/standalone/config.js";
import { createPublicClient } from "@/standalone/http.js";

/**
 * Get the deployment's available sign-in methods, without an API token or a
 * client.
 *
 * The endpoint is public: it reports whether password sign-in is enabled and
 * which OIDC providers are configured, so a login screen can render the right
 * buttons before anyone signs in.
 *
 * @param config - Optional configuration (baseUrl, headers, userAgent, fetch)
 * @returns Promise that resolves with the auth capabilities
 * @throws {ApiError} if the request fails
 */
export async function getAuthCapabilities(
	config?: AuthConfig,
): Promise<AuthCapabilities> {
	const client = createPublicClient(config, { json: true });
	const { data } = await client.GET("/capabilities/auth");
	return data!;
}
