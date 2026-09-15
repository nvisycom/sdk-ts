import type { ApiClient } from "@/client.js";
import type { AuthCapabilities } from "@/datatypes/index.js";

/**
 * The pre-auth subset of the deployment's capabilities: the sign-in methods it
 * offers. The label / recognizer / connector capability reads require an
 * authenticated client and live on {@link Capabilities}.
 */
export class GuestCapabilities {
	#api: ApiClient;

	constructor(api: ApiClient) {
		this.#api = api;
	}

	/**
	 * Get the deployment's available sign-in methods.
	 *
	 * Public: reports whether password sign-in is enabled and which OIDC
	 * providers are configured, so a login screen can render the right buttons
	 * before anyone signs in.
	 *
	 * @returns Promise that resolves with the auth capabilities.
	 * @throws {ApiError} if the request fails
	 */
	async getAuthCapabilities(): Promise<AuthCapabilities> {
		const { data } = await this.#api.GET("/capabilities/auth");
		return data!;
	}
}
