import type { ApiClient } from "@/client.js";
import type {
	Account as AccountData,
	PublicAccount,
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
}
