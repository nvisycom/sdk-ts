import type { ApiClient } from "@/client.js";
import type { IntegrationRun, Pagination } from "@/datatypes/index.js";

/**
 * Service for handling integration run operations
 */
export class RunsService {
	#api: ApiClient;

	constructor(api: ApiClient) {
		this.#api = api;
	}

	/**
	 * List integration runs for a workspace
	 * @param workspaceId - Workspace ID
	 * @param query - Optional query parameters (offset, limit)
	 * @returns Promise that resolves with the list of integration runs
	 * @throws {ApiError} if the request fails
	 */
	async list(
		workspaceId: string,
		query?: Pagination,
	): Promise<IntegrationRun[]> {
		const { data } = await this.#api.GET("/workspaces/{workspace_id}/runs/", {
			params: { path: { workspace_id: workspaceId }, query },
		});
		return data!;
	}

	/**
	 * Get integration run details by ID
	 * @param runId - Run ID
	 * @returns Promise that resolves with the integration run details
	 * @throws {ApiError} if the request fails
	 */
	async get(runId: string): Promise<IntegrationRun> {
		const { data } = await this.#api.GET("/runs/{run_id}", {
			params: { path: { run_id: runId } },
		});
		return data!;
	}
}
