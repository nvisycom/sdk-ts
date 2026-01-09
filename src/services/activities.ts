import type { ApiClient } from "@/client.js";
import type { ActivitiesPage, CursorPagination } from "@/datatypes/index.js";

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
	 * @param workspaceId - Workspace ID
	 * @param query - Optional pagination parameters (limit, after)
	 * @returns Promise that resolves with a paginated list of activities
	 * @throws {ApiError} if the request fails
	 */
	async listActivities(
		workspaceId: string,
		query?: CursorPagination,
	): Promise<ActivitiesPage> {
		const { data } = await this.#api.GET(
			"/workspaces/{workspaceId}/activities/",
			{
				params: { path: { workspaceId }, query },
			},
		);
		return data!;
	}
}
