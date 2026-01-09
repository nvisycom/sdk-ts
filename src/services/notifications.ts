import type { ApiClient } from "@/client.js";
import type {
	CursorPagination,
	NotificationsPage,
	UnreadStatus,
} from "@/datatypes/index.js";

/**
 * Service for handling account notification operations
 */
export class Notifications {
	#api: ApiClient;

	constructor(api: ApiClient) {
		this.#api = api;
	}

	/**
	 * List notifications for the authenticated account
	 * @param query - Optional pagination parameters (limit, after)
	 * @returns Promise that resolves with a paginated list of notifications
	 * @throws {ApiError} if the request fails
	 */
	async listNotifications(
		query?: CursorPagination,
	): Promise<NotificationsPage> {
		const { data } = await this.#api.GET("/notifications/", {
			params: { query },
		});
		return data!;
	}

	/**
	 * Get the unread notifications count for the authenticated account
	 * @returns Promise that resolves with the unread status
	 * @throws {ApiError} if the request fails
	 */
	async getUnreadNotificationsStatus(): Promise<UnreadStatus> {
		const { data } = await this.#api.GET("/notifications/unread");
		return data!;
	}
}
