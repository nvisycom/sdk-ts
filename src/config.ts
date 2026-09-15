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
 * Options for the pre-auth {@link NvisyGuest} client — the transport settings
 * shared by every client, with no authentication. All fields are optional and
 * use sensible defaults.
 */
export interface NvisyGuestOptions {
	/**
	 * Base URL for the Nvisy API.
	 *
	 * @default "https://api.nvisy.com"
	 */
	baseUrl?: string;

	/**
	 * Custom headers to include with every request.
	 *
	 * Merged over the default headers (Content-Type, User-Agent, and, for token
	 * auth, Authorization). Custom headers take precedence on conflict.
	 */
	headers?: Record<string, string>;

	/**
	 * Custom user agent string to identify your application.
	 *
	 * @default "@nvisy/sdk v.{version}"
	 */
	userAgent?: string;

	/**
	 * Credentials mode forwarded to `fetch`. Session auth sets this to
	 * `"include"` automatically; set it here only to override the transport
	 * behaviour (e.g. a same-origin app that wants a different mode).
	 */
	credentials?: RequestCredentials;

	/**
	 * Enable logging for requests and responses.
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
 * Configuration for the authenticated {@link Nvisy} client. Authenticate one of
 * two ways, chosen explicitly:
 *
 * - `apiToken` — send an API token as `Authorization: Bearer <token>`.
 * - `session: true` — use the browser cookie session established by the guest
 *   client's `login` / `signup`; requests are sent credentialed
 *   (`credentials: "include"`).
 *
 * The two are mutually exclusive.
 *
 * @example
 * ```typescript
 * // API token
 * new Nvisy({ apiToken: "your-api-token" });
 *
 * // Browser cookie session (after the guest client logged in)
 * new Nvisy({ session: true });
 * ```
 */
export type NvisyOptions = NvisyGuestOptions &
	({ apiToken: string; session?: never } | { session: true; apiToken?: never });

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
