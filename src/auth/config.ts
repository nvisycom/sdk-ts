/**
 * @fileoverview Configuration types for standalone auth functions.
 *
 * This module provides configuration options for authentication operations
 * that don't require an existing API token.
 *
 * @module auth/config
 */

import type { ClientConfig } from "@/config.js";

/**
 * Configuration options for standalone authentication functions.
 *
 * This type omits `apiToken` from {@link ClientConfig} since auth functions
 * are used to obtain a token in the first place.
 *
 * @example
 * ```typescript
 * import { login } from "@nvisy/sdk/auth";
 *
 * const token = await login(
 *   { email: "user@example.com", password: "..." },
 *   { baseUrl: "https://api.nvisy.com" }
 * );
 * ```
 */
export type AuthConfig = Omit<ClientConfig, "apiToken">;
