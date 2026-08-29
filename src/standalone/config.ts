/**
 * @fileoverview Configuration types for the standalone SDK functions (auth,
 * health) that run before a {@link Nvisy} client exists.
 *
 * @module standalone/config
 */

import type { PublicConfig } from "@/standalone/http.js";

/**
 * Configuration for the standalone authentication functions.
 *
 * Omits `apiToken` — these functions exist to obtain a token in the first
 * place.
 */
export type AuthConfig = PublicConfig;

/**
 * Configuration for the standalone {@link checkHealth} function.
 *
 * Omits `apiToken`: the health endpoint is public. Adds the API `version`
 * segment of the health route.
 */
export type HealthConfig = PublicConfig & {
	/**
	 * API version segment of the health route.
	 *
	 * @default "v1"
	 */
	version?: string;
};
