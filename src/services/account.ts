import type { ApiClient } from "@/client.js";
import type {
	Account as AccountData,
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
		const { data } = await this.#api.GET("/account");
		return data!;
	}

	/**
	 * Update the authenticated user's account details
	 * @param updates - Account update request
	 * @returns Promise that resolves with the updated account
	 * @throws {ApiError} if the request fails
	 */
	async updateAccount(updates: UpdateAccount): Promise<AccountData> {
		const { data } = await this.#api.PATCH("/account", {
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
		await this.#api.DELETE("/account");
	}
}
