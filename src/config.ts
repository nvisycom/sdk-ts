/**
 * @fileoverview Configuration types and constants for the Nvisy SDK.
 *
 * This module provides configuration interfaces, default values, and environment
 * variable names used throughout the SDK. It also exports utility functions for
 * building request metadata like user agent strings.
 *
 * @module config
 */

/**
 * Configuration options for creating a Nvisy client.
 *
 * The `apiToken` field is required for authentication. All other fields are optional
 * and will use sensible defaults when omitted.
 *
 * @example
 * ```typescript
 * const config: ClientConfig = {
 *   apiToken: "your-api-token",
 *   baseUrl: "https://api.nvisy.com",
 *   headers: { "X-Custom-Header": "value" },
 * };
 * const client = new Client(config);
 * ```
 */
export interface ClientConfig {
  /**
   * API token for authentication.
   *
   * Tokens can be obtained from the Nvisy dashboard or via the auth endpoints.
   */
  apiToken: string;

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
   * @default Auto-generated string in format: "@nvisy/sdk v.{version} ({platform}; Node.js {nodeVersion})"
   */
  userAgent?: string;
}

/**
 * Default configuration values used when options are not explicitly provided.
 *
 * @internal
 */
export const DEFAULTS = {
  /**
   * Default base URL for the Nvisy API.
   */
  BASE_URL: "https://api.nvisy.com",
} as const;

/**
 * Environment variable names recognized by the SDK.
 *
 * These variables are read by {@link Client.fromEnvironment} to configure
 * the client without hardcoding sensitive values in source code.
 *
 * @example
 * ```bash
 * export NVISY_API_TOKEN="your-api-token"
 * export NVISY_BASE_URL="https://api.nvisy.com"
 * export NVISY_USER_AGENT="my-app/1.0.0"
 * ```
 */
export const ENV_VARS = {
  /**
   * Environment variable for the API token.
   * Required when using {@link Client.fromEnvironment}.
   */
  API_TOKEN: "NVISY_API_TOKEN",

  /**
   * Environment variable for the base URL.
   * Optional; defaults to {@link DEFAULTS.BASE_URL} if not set.
   */
  BASE_URL: "NVISY_BASE_URL",

  /**
   * Environment variable for a custom user agent string.
   * Optional; defaults to auto-generated value if not set.
   */
  USER_AGENT: "NVISY_USER_AGENT",
} as const;

/**
 * Current SDK version.
 *
 * Used in the default user agent string and for version tracking.
 *
 * @internal
 */
export const VERSION = "0.2.0";

/**
 * Builds the default user agent string for SDK requests.
 *
 * The user agent includes the SDK version, platform, and Node.js version
 * to help with debugging and analytics on the server side.
 *
 * @returns A formatted user agent string
 *
 * @example
 * ```typescript
 * const userAgent = buildUserAgent();
 * // Returns: "@nvisy/sdk v.0.2.0 (darwin; Node.js v20.10.0)"
 * ```
 *
 * @internal
 */
export function buildUserAgent(): string {
  const nodeVersion = process.version || "unknown";
  const platform = process.platform || "unknown";
  return `@nvisy/sdk v.${VERSION} (${platform}; Node.js ${nodeVersion})`;
}
