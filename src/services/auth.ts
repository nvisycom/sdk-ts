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
	 * @returns Promise that resolves with the auth token
	 * @throws {ApiError} if the request fails
	 */
	async login(credentials: Login): Promise<AuthToken> {
		const { data } = await this.#api.POST("/auth/login", {
			body: credentials,
		});
		return data!;
	}

	/**
	 * Create a new account
	 * @param registration - Signup details
	 * @returns Promise that resolves with the auth token
	 * @throws {ApiError} if the request fails
	 */
	async signup(registration: Signup): Promise<AuthToken> {
		const { data } = await this.#api.POST("/auth/signup", {
			body: registration,
		});
		return data!;
	}

	/**
	 * Logout the current session
	 * @returns Promise that resolves when logged out
	 * @throws {ApiError} if the request fails
	 */
	async logout(): Promise<void> {
		await this.#api.POST("/auth/logout");
	}
}
