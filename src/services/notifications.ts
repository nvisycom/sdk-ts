import type { ApiClient } from "@/client.js";
import type { Notification, Pagination } from "@/datatypes/index.js";

/**
 * Service for handling account notification operations
 */
export class NotificationsService {
	#api: ApiClient;

	constructor(api: ApiClient) {
		this.#api = api;
	}

	/**
	 * List notifications for the authenticated account
	 * @param query - Optional query parameters (offset, limit)
	 * @returns Promise that resolves with the list of notifications
	 * @throws {ApiError} if the request fails
	 */
	async list(query?: Pagination): Promise<Notification[]> {
		const { data } = await this.#api.GET("/notifications/", {
			params: { query },
		});
		return data!;
	}
}
