import type { ApiClient } from "@/client.js";
import type {
	Account as AccountData,
	AccountIdentities,
	IdentityProvider,
	OidcStartResponse,
	PublicAccount,
	SetPassword,
	UpdateAccount,
} from "@/datatypes/index.js";

/**
 * Service for handling account operations
 */
export class Account {
	#api: ApiClient;

	constructor(api: ApiClient) {
		this.#api = api;
	}

	/**
	 * Get the authenticated user's account details
	 * @returns Promise that resolves with the account details
	 * @throws {ApiError} if the request fails
	 */
	async getAccount(): Promise<AccountData> {
		const { data } = await this.#api.GET("/account/");
		return data!;
	}

	/**
	 * Update the authenticated user's account details
	 * @param updates - Account update request
	 * @returns Promise that resolves with the updated account
	 * @throws {ApiError} if the request fails
	 */
	async updateAccount(updates: UpdateAccount): Promise<AccountData> {
		const { data } = await this.#api.PATCH("/account/", {
			body: updates,
		});
		return data!;
	}

	/**
	 * Delete the authenticated user's account
	 * @returns Promise that resolves when the account is deleted
	 * @throws {ApiError} if the request fails
	 */
	async deleteAccount(): Promise<void> {
		await this.#api.DELETE("/account/");
	}

	/**
	 * Get a public account profile by username
	 * @param username - Account username
	 * @returns Promise that resolves with the public account details
	 * @throws {ApiError} if the request fails
	 */
	async getPublicAccount(username: string): Promise<PublicAccount> {
		const { data } = await this.#api.GET("/accounts/{username}/", {
			params: { path: { username } },
		});
		return data!;
	}

	/**
	 * Upload an account's avatar image
	 * @param username - Account username
	 * @param avatar - Avatar image to upload
	 * @returns Promise that resolves with the updated account
	 * @throws {ApiError} if the request fails
	 */
	async uploadAvatar(username: string, avatar: Blob): Promise<AccountData> {
		const formData = new FormData();
		const name = avatar instanceof File ? avatar.name : "avatar";
		formData.append("avatar", avatar, name);

		const { data } = await this.#api.PUT("/accounts/{username}/avatar/", {
			params: { path: { username } },
			// Schema types multipart as unknown[], but openapi-fetch needs FormData.
			body: formData as unknown as unknown[],
			bodySerializer: (formData) => formData,
			// Remove Content-Type so browser sets multipart/form-data with boundary.
			headers: { "Content-Type": null } as unknown as HeadersInit,
		});
		return data!;
	}

	/**
	 * Delete an account's avatar image
	 * @param username - Account username
	 * @returns Promise that resolves when the avatar is deleted
	 * @throws {ApiError} if the request fails
	 */
	async deleteAvatar(username: string): Promise<void> {
		await this.#api.DELETE("/accounts/{username}/avatar/", {
			params: { path: { username } },
		});
	}

	/**
	 * List the account's sign-in methods: its password and linked providers.
	 * @returns Promise that resolves with the account's identities
	 * @throws {ApiError} if the request fails
	 */
	async listIdentities(): Promise<AccountIdentities> {
		const { data } = await this.#api.GET("/account/identities/");
		return data!;
	}

	/**
	 * Set or change the account's password.
	 *
	 * Changing an existing password requires the current one; setting a first
	 * password on a provider-only account requires a step-up `reauthProof` (see
	 * {@link reauth}) instead.
	 *
	 * @param request - The password change (current/new password or reauth proof)
	 * @returns Promise that resolves when the password is set
	 * @throws {ApiError} if the request fails
	 */
	async setPassword(request: SetPassword): Promise<void> {
		await this.#api.PUT("/account/identities/password/", { body: request });
	}

	/**
	 * Remove the account's password, leaving only its linked providers.
	 *
	 * Refused if the password is the account's only sign-in method.
	 *
	 * @returns Promise that resolves when the password is removed
	 * @throws {ApiError} if the request fails
	 */
	async removePassword(): Promise<void> {
		await this.#api.DELETE("/account/identities/password/");
	}

	/**
	 * Begin linking an OIDC provider to the account.
	 *
	 * Requires a step-up `reauthProof` (from {@link reauth}). Returns the
	 * provider authorize URL to send the user to; on consent the callback
	 * attaches the verified identity to the account.
	 *
	 * @param provider - The identity provider to link
	 * @param query - The reauth proof and optional post-flow redirect URI
	 * @returns Promise that resolves with the provider authorize URL
	 * @throws {ApiError} if the request fails
	 */
	async linkIdentity(
		provider: IdentityProvider,
		query?: { reauthProof?: string; redirectUri?: string },
	): Promise<OidcStartResponse> {
		const { data } = await this.#api.POST("/account/identities/{provider}/", {
			params: { path: { provider }, query },
		});
		return data!;
	}

	/**
	 * Unlink an OIDC provider from the account.
	 *
	 * Refused if the provider is the account's only sign-in method.
	 *
	 * @param provider - The identity provider to unlink
	 * @returns Promise that resolves when the provider is unlinked
	 * @throws {ApiError} if the request fails
	 */
	async unlinkIdentity(provider: IdentityProvider): Promise<void> {
		await this.#api.DELETE("/account/identities/{provider}/", {
			params: { path: { provider } },
		});
	}

	/**
	 * Begin a step-up re-authentication with an already-linked provider.
	 *
	 * Returns the provider authorize URL to send the user to; on consent the
	 * callback mints a short-lived, single-use proof required to add a credential
	 * ({@link setPassword} for a first password, or {@link linkIdentity}).
	 *
	 * @param provider - The linked identity provider to re-authenticate with
	 * @param query - Optional post-flow redirect URI
	 * @returns Promise that resolves with the provider authorize URL
	 * @throws {ApiError} if the request fails
	 */
	async reauth(
		provider: IdentityProvider,
		query?: { redirectUri?: string },
	): Promise<OidcStartResponse> {
		const { data } = await this.#api.GET("/auth/{provider}/reauth/", {
			params: { path: { provider }, query },
		});
		return data!;
	}
}
