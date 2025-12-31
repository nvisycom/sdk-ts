/**
 * @fileoverview Standalone password-based authentication functions.
 *
 * This module provides functions for login and signup that don't require
 * an existing API token. Use these to obtain an auth token, then create
 * an authenticated {@link Client} instance.
 *
 * @module auth/password
 *
 * @example
 * ```typescript
 * import { login, signup } from "@nvisy/sdk/auth";
 * import { Client } from "@nvisy/sdk";
 *
 * // Login to get a token
 * const token = await login({ email: "user@example.com", password: "..." });
 *
 * // Create authenticated client
 * const client = new Client({ apiToken: token.accessToken });
 * ```
 */

import createClient from "openapi-fetch";
import type { AuthConfig } from "@/auth/config.js";
import { DEFAULTS } from "@/config.js";
import type { AuthToken, Login, Signup } from "@/datatypes/index.js";
import { errorMiddleware } from "@/middleware/index.js";
import type { paths } from "@/schema/api.js";

/**
 * Creates an unauthenticated API client for auth operations.
 *
 * @param config - Optional configuration options
 * @returns A configured openapi-fetch client without authentication
 * @internal
 */
function createAuthClient(config?: AuthConfig) {
	const headers: Record<string, string> = {
		"Content-Type": "application/json",
		"User-Agent": config?.userAgent ?? DEFAULTS.USER_AGENT,
		...config?.headers,
	};

	const client = createClient<paths>({
		baseUrl: config?.baseUrl ?? DEFAULTS.BASE_URL,
		headers,
	});

	client.use(errorMiddleware);
	return client;
}

/**
 * Login with email and password to obtain an auth token.
 *
 * This is a standalone function that doesn't require an existing {@link Client}
 * instance. Use the returned token to create an authenticated client.
 *
 * @param credentials - Login credentials (email and password)
 * @param config - Optional configuration (baseUrl, headers, userAgent)
 * @returns Promise that resolves with the auth token
 * @throws {ApiError} If the credentials are invalid or the request fails
 *
 * @example
 * ```typescript
 * import { login } from "@nvisy/sdk/auth";
 * import { Client } from "@nvisy/sdk";
 *
 * const token = await login({
 *   email: "user@example.com",
 *   password: "your-password",
 * });
 *
 * const client = new Client({ apiToken: token.accessToken });
 * ```
 */
export async function login(
	credentials: Login,
	config?: AuthConfig,
): Promise<AuthToken> {
	const client = createAuthClient(config);
	const { data } = await client.POST("/auth/login", {
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
 * @param config - Optional configuration (baseUrl, headers, userAgent)
 * @returns Promise that resolves with the auth token
 * @throws {ApiError} If the signup fails (e.g., email already exists)
 *
 * @example
 * ```typescript
 * import { signup } from "@nvisy/sdk/auth";
 * import { Client } from "@nvisy/sdk";
 *
 * const token = await signup({
 *   name: "John Doe",
 *   email: "john@example.com",
 *   password: "secure-password",
 * });
 *
 * const client = new Client({ apiToken: token.accessToken });
 * ```
 */
export async function signup(
	details: Signup,
	config?: AuthConfig,
): Promise<AuthToken> {
	const client = createAuthClient(config);
	const { data } = await client.POST("/auth/signup", {
		body: details,
	});
	return data!;
}
