import type { ApiClient } from "@/client.js";
import type {
	CursorPagination,
	IntegrationRun,
	IntegrationRunsPage,
} from "@/datatypes/index.js";

/**
 * Service for handling integration run operations
 */
export class Runs {
	#api: ApiClient;

	constructor(api: ApiClient) {
		this.#api = api;
	}

	/**
	 * List integration runs for a workspace
	 * @param workspaceId - Workspace ID
	 * @param query - Optional pagination parameters (limit, after)
	 * @returns Promise that resolves with a paginated list of integration runs
	 * @throws {ApiError} if the request fails
	 */
	async listRuns(
		workspaceId: string,
		query?: CursorPagination,
	): Promise<IntegrationRunsPage> {
		const { data } = await this.#api.GET("/workspaces/{workspaceId}/runs/", {
			params: { path: { workspaceId }, query },
		});
		return data!;
	}

	/**
	 * Get integration run details by ID
	 * @param runId - Run ID
	 * @returns Promise that resolves with the integration run details
	 * @throws {ApiError} if the request fails
	 */
	async getRun(runId: string): Promise<IntegrationRun> {
		const { data } = await this.#api.GET("/runs/{runId}", {
			params: { path: { runId } },
		});
		return data!;
	}
}
