import type { ApiClient } from "@/client.js";
import type {
	CursorPagination,
	MarkedReadStatus,
	NotificationPage,
	UnreadCountEvent,
	UnreadStatus,
} from "@/datatypes/index.js";
import { NvisyError } from "@/errors.js";
import { parseSseStream } from "@/services/sse.js";

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
	async listNotifications(query?: CursorPagination): Promise<NotificationPage> {
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
		const { data } = await this.#api.GET("/notifications/unread/");
		return data!;
	}

	/**
	 * Mark every unread notification for the authenticated account as read
	 * @returns Promise that resolves with how many were marked read
	 * @throws {ApiError} if the request fails
	 */
	async markAllRead(): Promise<MarkedReadStatus> {
		const { data } = await this.#api.POST("/notifications/read/");
		return data!;
	}

	/**
	 * Mark a single notification as read
	 * @param notificationId - Notification ID
	 * @throws {ApiError} if the request fails
	 */
	async markRead(notificationId: string): Promise<void> {
		await this.#api.POST("/notifications/{notificationId}/read/", {
			params: { path: { notificationId } },
		});
	}

	/**
	 * Open the raw Server-Sent Events stream of the account's unread count.
	 *
	 * Returns the underlying `Response` so callers can handle the
	 * `text/event-stream` body themselves. Most callers want
	 * {@link streamEvents}, which parses each frame into a typed
	 * {@link UnreadCountEvent}.
	 *
	 * @returns Promise that resolves with the event-stream response
	 * @throws {ApiError} if the request fails
	 */
	async events(): Promise<Response> {
		const { response } = await this.#api.GET("/notifications/unread/events/", {
			parseAs: "stream",
		});
		return response;
	}

	/**
	 * Stream the account's unread notification count as Server-Sent Events.
	 *
	 * Yields the current count immediately, then each change as notifications
	 * arrive or are marked read, until the client disconnects. Break out of the
	 * loop to close the stream. For the raw response, use {@link events}.
	 *
	 * @yields each {@link UnreadCountEvent} as it arrives
	 * @throws {ApiError} if the request fails to open
	 * @throws {NvisyError} if the response has no readable body
	 */
	async *streamEvents(): AsyncGenerator<UnreadCountEvent> {
		const response = await this.events();
		if (!response.body) {
			throw new NvisyError("Event stream response has no body");
		}
		for await (const event of parseSseStream(response.body)) {
			// The server names every frame `unread`; ignore anything else.
			if (event.event === "unread") {
				yield JSON.parse(event.data) as UnreadCountEvent;
			}
		}
	}
}
