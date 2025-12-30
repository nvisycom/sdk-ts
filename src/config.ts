/**
 * @fileoverview Configuration types and constants for the Nvisy SDK.
 *
 * This module provides configuration interfaces, default values, and environment
 * variable names used throughout the SDK.
 *
 * @module config
 */

/**
 * Current SDK version.
 *
 * Used in the default user agent string and for version tracking.
 */
export const VERSION = "0.2.0";

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
   * @default "@nvisy/sdk v.{version}"
   */
  userAgent?: string;
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
