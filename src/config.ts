/**
 * @fileoverview Configuration types and constants for the Nvisy SDK.
 *
 * This module provides configuration interfaces, default values, and environment
 * variable names used throughout the SDK.
 *
 * @module config
 */

/**
 * Compile-time version token, replaced with the `package.json` version by the
 * build (see `tsdown.config.ts`). Declared so it type-checks; the `typeof`
 * guard below keeps it safe when the define isn't applied (tests, direct `tsc`).
 */
declare const __SDK_VERSION__: string | undefined;

/**
 * Current SDK version.
 *
 * Injected from `package.json` at build time, so it always matches the
 * published version. Used in the default user agent string.
 */
export const VERSION =
	typeof __SDK_VERSION__ === "string" ? __SDK_VERSION__ : "0.0.0-dev";

/**
 * Configuration options for creating a Nvisy client.
 *
 * Authenticate one of two ways: pass an `apiToken` (sent as a bearer token on
 * every request), or use a browser session — sign in with the standalone
 * `login` / `signup`, then set `credentials: "include"` so the session cookies
 * are sent. All other fields are optional and use sensible defaults.
 *
 * @example
 * ```typescript
 * // API token
 * const client = new Client({ apiToken: "your-api-token" });
 *
 * // Browser session (after `login()` set the cookies)
 * const client = new Client({ credentials: "include" });
 * ```
 */
export interface ClientConfig {
	/**
	 * API token for authentication, sent as `Authorization: Bearer <token>`.
	 *
	 * Tokens can be obtained from the Nvisy dashboard or the api-tokens endpoint.
	 * Omit it to authenticate with a browser session instead (see `credentials`).
	 */
	apiToken?: string;

	/**
	 * Credentials mode for every request, forwarded to `fetch`.
	 *
	 * Set to `"include"` to send the session cookies established by the
	 * standalone `login` / `signup` (needed for cross-origin browser sessions).
	 * Defaults to the platform's `fetch` default when omitted.
	 */
	credentials?: RequestCredentials;

	/**
	 * Base URL for the Nvisy API.
	 *
	 * @default "https://api.nvisy.com"
	 */
	baseUrl?: string;

	/**
	 * Custom headers to include with every request.
	 *
	 * These headers are merged with the default headers (Content-Type, User-Agent,
	 * and Authorization). Custom headers take precedence over defaults if there
	 * are conflicts.
	 */
	headers?: Record<string, string>;

	/**
	 * Custom user agent string to identify your application.
	 *
	 * @default "@nvisy/sdk v.{version}"
	 */
	userAgent?: string;

	/**
	 * Enable logging for requests and responses.
	 *
	 * When enabled, logs request method, URL, status, and timing to console.
	 *
	 * @default false
	 */
	withLogging?: boolean;

	/**
	 * Custom fetch implementation used for every request. Must match the WHATWG
	 * `fetch` signature. Defaults to the global `fetch`.
	 *
	 * Lets a host swap in a non-browser transport — e.g. a desktop (Tauri) app
	 * passing `@tauri-apps/plugin-http`'s `fetch`, which performs the request in
	 * the native process and so is not subject to browser CORS.
	 */
	fetch?: typeof globalThis.fetch;
}

/**
 * Default configuration values used when options are not explicitly provided.
 */
export const DEFAULTS = {
	/**
	 * Default base URL for the Nvisy API.
	 */
	BASE_URL: "https://api.nvisy.com",

	/**
	 * Default user agent string.
	 */
	USER_AGENT: `@nvisy/sdk v.${VERSION}`,
} as const;
