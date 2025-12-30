import type { ApiClient } from "@/client.js";
import type { Activity, Pagination } from "@/datatypes/index.js";

/**
 * Service for handling workspace activity operations
 */
export class ActivitiesService {
	#api: ApiClient;

	constructor(api: ApiClient) {
		this.#api = api;
	}

	/**
	 * List activities for a workspace
	 * @param workspaceId - Workspace ID
	 * @param query - Optional query parameters (offset, limit)
	 * @returns Promise that resolves with the list of activities
	 * @throws {ApiError} if the request fails
	 */
	async list(workspaceId: string, query?: Pagination): Promise<Activity[]> {
		const { data } = await this.#api.GET(
			"/workspaces/{workspace_id}/activities/",
			{
				params: { path: { workspaceId }, query },
			},
		);
		return data!;
	}
}
