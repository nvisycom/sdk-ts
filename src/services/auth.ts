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
	async login(credentials: Login): Promise<AuthToken> {
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
	async signup(details: Signup): Promise<AuthToken> {
		const { data } = await this.#api.POST("/auth/signup", {
			body: details,
		});
		return data!;
	}
}
