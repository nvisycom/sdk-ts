import type { ApiClient } from "@/client.js";
import type {
	IdentityProvider,
	Login,
	OidcStartResponse,
	Signup,
} from "@/datatypes/index.js";

/**
 * Service for handling authentication operations
 */
export class Auth {
	#api: ApiClient;

	constructor(api: ApiClient) {
		this.#api = api;
	}

	/**
	 * Login with email and password, starting a browser session.
	 *
	 * Sets HttpOnly session and CSRF cookies; returns no body. Programmatic
	 * clients should instead create an API token via {@link ApiTokens} and pass
	 * it as `apiToken` when constructing the client.
	 *
	 * @param credentials - Login credentials
	 * @returns Promise that resolves once the session is started
	 * @throws {ApiError} if the request fails
	 */
	async loginAccount(credentials: Login): Promise<void> {
		await this.#api.POST("/auth/login/", {
			body: credentials,
		});
	}

	/**
	 * Sign up a new account, starting a browser session.
	 *
	 * Sets HttpOnly session and CSRF cookies; returns no body. Programmatic
	 * clients should instead create an API token via {@link ApiTokens} and pass
	 * it as `apiToken` when constructing the client.
	 *
	 * @param credentials - Signup details
	 * @returns Promise that resolves once the session is started
	 * @throws {ApiError} if the request fails
	 */
	async signupAccount(credentials: Signup): Promise<void> {
		await this.#api.POST("/auth/signup/", {
			body: credentials,
		});
	}

	/**
	 * Logout and invalidate the current access token
	 * @returns Promise that resolves when logout is complete
	 * @throws {ApiError} if the request fails
	 */
	async logoutAccount(): Promise<void> {
		await this.#api.POST("/auth/logout/");
	}

	/**
	 * Begin an OpenID Connect sign-in with a provider.
	 *
	 * Returns the provider authorize URL to redirect the user to; on consent the
	 * provider redirects to the callback, which signs the user in. Also available
	 * as the standalone `startOidcSignIn` for use without a client.
	 *
	 * @param provider - The identity provider to sign in with
	 * @param query - Optional frontend URL to return to once done
	 * @returns Promise that resolves with the provider authorize URL
	 * @throws {ApiError} if the request fails
	 */
	async startOidcSignIn(
		provider: IdentityProvider,
		query?: { redirectUri?: string },
	): Promise<OidcStartResponse> {
		const { data } = await this.#api.GET("/auth/{provider}/start/", {
			params: { path: { provider }, query },
		});
		return data!;
	}
}
