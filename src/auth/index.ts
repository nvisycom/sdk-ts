/**
 * @fileoverview Standalone authentication module for the Nvisy SDK.
 *
 * This module provides authentication functions that don't require an existing
 * API token. Use these to obtain a token, then create an authenticated client.
 *
 * @module auth
 *
 * @example
 * ```typescript
 * import { login, signup } from "@nvisy/sdk/auth";
 * import { Client } from "@nvisy/sdk";
 *
 * // Login with existing account
 * const token = await login({
 *   email: "user@example.com",
 *   password: "your-password",
 * });
 *
 * // Or sign up a new account
 * const token = await signup({
 *   name: "John Doe",
 *   email: "john@example.com",
 *   password: "secure-password",
 * });
 *
 * // Create authenticated client
 * const client = new Client({ apiToken: token.accessToken });
 * ```
 */

// Configuration
export type { AuthConfig } from "@/auth/config.js";

// Password-based authentication
export { login, signup } from "@/auth/password.js";
