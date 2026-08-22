import type { ApiClient } from "@/client.js";
import type {
	ActivityExportQuery,
	ActivityListQuery,
	ActivityPage,
} from "@/datatypes/index.js";

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
	 * @param query - Optional filters and pagination (type, actor, from, to,
	 *   limit, after, includeCount)
	 * @returns Promise that resolves with a paginated list of activities
	 * @throws {ApiError} if the request fails
	 */
	async listActivities(
		workspaceSlug: string,
		query?: ActivityListQuery,
	): Promise<ActivityPage> {
		const { data } = await this.#api.GET(
			"/workspaces/{workspaceSlug}/activities/",
			{
				params: { path: { workspaceSlug }, query },
			},
		);
		return data!;
	}

	/**
	 * Export the workspace's activity log over a date window as a file.
	 * @param workspaceSlug - Workspace slug
	 * @param query - Optional date window and output format (`csv` default, or `json`)
	 * @returns Promise that resolves with the file response
	 * @throws {ApiError} if the request fails
	 */
	async exportActivities(
		workspaceSlug: string,
		query?: ActivityExportQuery,
	): Promise<Response> {
		const { response } = await this.#api.GET(
			"/workspaces/{workspaceSlug}/activities/export",
			{
				params: { path: { workspaceSlug }, query },
				parseAs: "stream",
			},
		);
		return response;
	}
}
