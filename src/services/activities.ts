import type { ApiClient } from "@/client.js";
import type { ActivityPage, CursorPagination } from "@/datatypes/index.js";

/**
 * Service for handling workspace activity operations
 */
export class Activities {
	#api: ApiClient;

	constructor(api: ApiClient) {
		this.#api = api;
	}

	/**
	 * List activities for a workspace
	 * @param workspaceSlug - Workspace slug
	 * @param query - Optional pagination parameters (limit, after)
	 * @returns Promise that resolves with a paginated list of activities
	 * @throws {ApiError} if the request fails
	 */
	async listActivities(
		workspaceSlug: string,
		query?: CursorPagination,
	): Promise<ActivityPage> {
		const { data } = await this.#api.GET(
			"/workspaces/{workspaceSlug}/activities/",
			{
				params: { path: { workspaceSlug }, query },
			},
		);
		return data!;
	}
}
