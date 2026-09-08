/**
 * @fileoverview Standalone authentication functions.
 *
 * These functions start a browser session without an existing client: login
 * and signup set HttpOnly session and CSRF cookies (they return no body), and
 * `startOidcSignIn` returns a provider authorize URL to redirect to.
 *
 * For a programmatic (non-browser) client, do not use these to obtain a
 * credential — a cookie session is not replayed across SDK calls. Instead
 * create an API token (via the account's api-tokens endpoint) and pass it as
 * `apiToken` when constructing a {@link Client}.
 *
 * @module standalone/auth
 *
 * @example
 * ```typescript
 * import { login } from "@nvisy/sdk/standalone";
 *
 * // Browser: start a cookie session
 * await login({ email: "user@example.com", password: "..." });
 * ```
 */

import type {
	IdentityProvider,
	Login,
	OidcStartResponse,
	Signup,
} from "@/datatypes/index.js";
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
 * Login with email and password, starting a browser session.
 *
 * A standalone function that needs no existing {@link Client}. Sets HttpOnly
 * session and CSRF cookies; returns no body. For a programmatic client, create
 * an API token instead and pass it as `apiToken` when constructing the client.
 *
 * @param credentials - Login credentials (email and password)
 * @param config - Optional configuration (baseUrl, headers, userAgent, fetch)
 * @returns Promise that resolves once the session is started
 * @throws {ApiError} If the credentials are invalid or the request fails
 *
 * @example
 * ```typescript
 * import { login } from "@nvisy/sdk/standalone";
 *
 * await login({ email: "user@example.com", password: "your-password" });
 * ```
 */
export async function login(
	credentials: Login,
	config?: AuthConfig,
): Promise<void> {
	const client = createAuthClient(config);
	await client.POST("/auth/login/", {
		body: credentials,
	});
}

/**
 * Sign up a new account, starting a browser session.
 *
 * A standalone function that needs no existing {@link Client}. Sets HttpOnly
 * session and CSRF cookies; returns no body. For a programmatic client, create
 * an API token instead and pass it as `apiToken` when constructing the client.
 *
 * @param details - Signup details (name, email, password, etc.)
 * @param config - Optional configuration (baseUrl, headers, userAgent, fetch)
 * @returns Promise that resolves once the session is started
 * @throws {ApiError} If the signup fails (e.g., email already exists)
 *
 * @example
 * ```typescript
 * import { signup } from "@nvisy/sdk/standalone";
 *
 * await signup({
 *   name: "John Doe",
 *   email: "john@example.com",
 *   password: "secure-password",
 * });
 * ```
 */
export async function signup(
	details: Signup,
	config?: AuthConfig,
): Promise<void> {
	const client = createAuthClient(config);
	await client.POST("/auth/signup/", {
		body: details,
	});
}

/**
 * Begin an OpenID Connect sign-in with a provider.
 *
 * A standalone function that needs no existing {@link Client}. Returns the
 * provider authorize URL to redirect the user to; on consent the provider
 * redirects to the callback, which signs the user in.
 *
 * @param provider - The identity provider to sign in with
 * @param query - Optional frontend URL to return to once done
 * @param config - Optional configuration (baseUrl, headers, userAgent, fetch)
 * @returns Promise that resolves with the provider authorize URL
 * @throws {ApiError} If the request fails
 *
 * @example
 * ```typescript
 * import { startOidcSignIn } from "@nvisy/sdk/standalone";
 *
 * const { authorizeUrl } = await startOidcSignIn("google", {
 *   redirectUri: "https://app.example.com/after-login",
 * });
 * window.location.href = authorizeUrl;
 * ```
 */
export async function startOidcSignIn(
	provider: IdentityProvider,
	query?: { redirectUri?: string },
	config?: AuthConfig,
): Promise<OidcStartResponse> {
	const client = createAuthClient(config);
	const { data } = await client.GET("/auth/{provider}/start/", {
		params: { path: { provider }, query },
	});
	return data!;
}
