import type { ApiClient } from "@/client.js";
import type { Account, UpdateAccount } from "@/datatypes/index.js";
import { unwrap } from "@/errors.js";

/**
 * Service for handling account operations
 */
export class AccountService {
	#api: ApiClient;

	constructor(api: ApiClient) {
		this.#api = api;
	}

	/**
	 * Get the authenticated user's account details
	 * @returns Promise that resolves with the account details
	 * @throws {ApiError} if the request fails
	 */
	async get(): Promise<Account> {
		const result = await this.#api.GET("/account");
		return unwrap(result);
	}

	/**
	 * Update the authenticated user's account details
	 * @param updates - Account update request
	 * @returns Promise that resolves with the updated account
	 * @throws {ApiError} if the request fails
	 */
	async update(updates: UpdateAccount): Promise<Account> {
		const result = await this.#api.PATCH("/account", {
			body: updates,
		});
		return unwrap(result);
	}

	/**
	 * Delete the authenticated user's account
	 * @returns Promise that resolves when the account is deleted
	 * @throws {ApiError} if the request fails
	 */
	async delete(): Promise<void> {
		const result = await this.#api.DELETE("/account");
		unwrap(result);
	}
}
