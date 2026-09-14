import type { ApiClient } from "@/client.js";
import type {
	CursorPagination,
	DateWindow,
	WorkspaceActivityExportOptions,
	WorkspaceActivityFilterQuery,
	WorkspaceActivityPage,
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
	 * @param workspaceId - Workspace id
	 * @param query - Optional filters and pagination (type, actor, from, to,
	 *   limit, after, includeCount)
	 * @returns Promise that resolves with a paginated list of activities
	 * @throws {ApiError} if the request fails
	 */
	async listActivities(
		workspaceId: string,
		query?: WorkspaceActivityFilterQuery & DateWindow & CursorPagination,
	): Promise<WorkspaceActivityPage> {
		const { data } = await this.#api.GET(
			"/workspaces/{workspaceId}/activities",
			{
				params: { path: { workspaceId }, query },
			},
		);
		return data!;
	}

	/**
	 * Export the workspace's activity log as a file.
	 * @param workspaceId - Workspace id
	 * @param query - Optional filters (type, actor), date window (from, to), and
	 *   output format (`csv` default, or `json`)
	 * @returns Promise that resolves with the file response
	 * @throws {ApiError} if the request fails
	 */
	async exportActivities(
		workspaceId: string,
		query?: WorkspaceActivityFilterQuery &
			DateWindow &
			WorkspaceActivityExportOptions,
	): Promise<Response> {
		const { response } = await this.#api.GET(
			"/workspaces/{workspaceId}/activities/export",
			{
				params: { path: { workspaceId }, query },
				parseAs: "stream",
			},
		);
		return response;
	}
}
