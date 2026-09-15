import type { ApiClient } from "@/client.js";
import type {
	AccountDesktopToken,
	DesktopTokenRequest,
} from "@/datatypes/index.js";

/**
 * Authenticated auth operations: ending the current session and minting a
 * desktop token from it. Pre-auth sign-in (login / signup / OIDC start) lives on
 * the guest client ({@link NvisyGuest}).
 */
export class Auth {
	#api: ApiClient;

	constructor(api: ApiClient) {
		this.#api = api;
	}

	/**
	 * Logout, invalidating the current session and clearing its cookies.
	 * @returns Promise that resolves when logout is complete
	 * @throws {ApiError} if the request fails
	 */
	async logoutAccount(): Promise<void> {
		await this.#api.POST("/auth/logout");
	}

	/**
	 * Mint a long-lived native-app token for a desktop app.
	 *
	 * Requires an active browser session (the desktop login completes in the
	 * browser first). Exchanges that session for an `app` token to hand to the
	 * desktop app via the given deep-link `redirectUri`, which must be a
	 * configured desktop scheme; it is echoed back in the response.
	 *
	 * @param request - The desktop deep-link to deliver the token on
	 * @returns Promise that resolves with the minted token and redirect URI
	 * @throws {ApiError} if the request fails
	 */
	async mintDesktopToken(
		request: DesktopTokenRequest,
	): Promise<AccountDesktopToken> {
		const { data } = await this.#api.POST("/auth/desktop/token", {
			body: request,
		});
		return data!;
	}
}
