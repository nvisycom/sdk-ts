/**
 * @fileoverview Standalone password-based authentication functions.
 *
 * This module provides functions for login and signup that don't require
 * an existing API token. Use these to obtain an auth token, then create
 * an authenticated {@link Client} instance.
 *
 * @module standalone/auth
 *
 * @example
 * ```typescript
 * import { login, signup } from "@nvisy/sdk/standalone";
 * import { Nvisy } from "@nvisy/sdk";
 *
 * // Login to get a token
 * const token = await login({ email: "user@example.com", password: "..." });
 *
 * // Create authenticated client
 * const nvisy = new Nvisy({ apiToken: token.accessToken });
 * ```
 */

import type { AuthToken, Login, Signup } from "@/datatypes/index.js";
import type { AuthConfig } from "@/standalone/config.js";
import { createPublicClient } from "@/standalone/http.js";

/**
 * Creates an unauthenticated API client for auth operations.
 *
 * @param config - Optional configuration options
 * @returns A configured openapi-fetch client without authentication
 * @internal
 */
function createAuthClient(config?: AuthConfig) {
	return createPublicClient(config, { json: true });
}

/**
 * Login with email and password to obtain an auth token.
 *
 * This is a standalone function that doesn't require an existing {@link Client}
 * instance. Use the returned token to create an authenticated client.
 *
 * @param credentials - Login credentials (email and password)
 * @param config - Optional configuration (baseUrl, headers, userAgent, fetch)
 * @returns Promise that resolves with the auth token
 * @throws {ApiError} If the credentials are invalid or the request fails
 *
 * @example
 * ```typescript
 * import { login } from "@nvisy/sdk/standalone";
 * import { Nvisy } from "@nvisy/sdk";
 *
 * const token = await login({
 *   email: "user@example.com",
 *   password: "your-password",
 * });
 *
 * const nvisy = new Nvisy({ apiToken: token.accessToken });
 * ```
 */
export async function login(
	credentials: Login,
	config?: AuthConfig,
): Promise<AuthToken> {
	const client = createAuthClient(config);
	const { data } = await client.POST("/auth/login/", {
		body: credentials,
	});
	return data!;
}

/**
 * Sign up a new account to obtain an auth token.
 *
 * This is a standalone function that doesn't require an existing {@link Client}
 * instance. Use the returned token to create an authenticated client.
 *
 * @param details - Signup details (name, email, password, etc.)
 * @param config - Optional configuration (baseUrl, headers, userAgent, fetch)
 * @returns Promise that resolves with the auth token
 * @throws {ApiError} If the signup fails (e.g., email already exists)
 *
 * @example
 * ```typescript
 * import { signup } from "@nvisy/sdk/standalone";
 * import { Nvisy } from "@nvisy/sdk";
 *
 * const token = await signup({
 *   name: "John Doe",
 *   email: "john@example.com",
 *   password: "secure-password",
 * });
 *
 * const nvisy = new Nvisy({ apiToken: token.accessToken });
 * ```
 */
export async function signup(
	details: Signup,
	config?: AuthConfig,
): Promise<AuthToken> {
	const client = createAuthClient(config);
	const { data } = await client.POST("/auth/signup/", {
		body: details,
	});
	return data!;
}
