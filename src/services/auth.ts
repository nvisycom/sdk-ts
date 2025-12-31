import type { ApiClient } from "@/client.js";
import type { AuthToken, Login, Signup } from "@/datatypes/index.js";

/**
 * Service for handling authentication operations
 */
export class AuthService {
	#api: ApiClient;

	constructor(api: ApiClient) {
		this.#api = api;
	}

	/**
	 * Login with email and password
	 * @param credentials - Login credentials
	 * @returns Promise that resolves with the auth response containing access token
	 * @throws {ApiError} if the request fails
	 */
	async loginAccount(credentials: Login): Promise<AuthToken> {
		const { data } = await this.#api.POST("/auth/login", {
			body: credentials,
		});
		return data!;
	}

	/**
	 * Sign up a new account
	 * @param details - Signup details
	 * @returns Promise that resolves with the auth response containing access token
	 * @throws {ApiError} if the request fails
	 */
	async signupAccount(details: Signup): Promise<AuthToken> {
		const { data } = await this.#api.POST("/auth/signup", {
			body: details,
		});
		return data!;
	}

	/**
	 * Logout and invalidate the current access token
	 * @returns Promise that resolves when logout is complete
	 * @throws {ApiError} if the request fails
	 */
	async logoutAccount(): Promise<void> {
		await this.#api.POST("/auth/logout");
	}
}
