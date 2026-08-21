import type { ApiClient } from "@/client.js";
import type {
	RunTimeSeries,
	WorkspaceAnalytics,
} from "@/datatypes/index.js";

/**
 * Service for workspace analytics: aggregate totals and run time series.
 */
export class Analytics {
	#api: ApiClient;

	constructor(api: ApiClient) {
		this.#api = api;
	}

	/**
	 * Get aggregate analytics for a workspace: storage, run health, and usage.
	 * @param workspaceSlug - Workspace slug
	 * @returns Promise that resolves with the workspace analytics
	 * @throws {ApiError} if the request fails
	 */
	async getAnalytics(workspaceSlug: string): Promise<WorkspaceAnalytics> {
		const { data } = await this.#api.GET(
			"/workspaces/{workspaceSlug}/analytics/",
			{
				params: { path: { workspaceSlug } },
			},
		);
		return data!;
	}

	/**
	 * Get a workspace's daily pipeline-run activity over a date window.
	 * @param workspaceSlug - Workspace slug
	 * @param query - Optional date window (`from` / `to`, YYYY-MM-DD)
	 * @returns Promise that resolves with the run time series
	 * @throws {ApiError} if the request fails
	 */
	async getRunTimeSeries(
		workspaceSlug: string,
		query?: { from?: string; to?: string },
	): Promise<RunTimeSeries> {
		const { data } = await this.#api.GET(
			"/workspaces/{workspaceSlug}/analytics/runs/timeseries/",
			{
				params: { path: { workspaceSlug }, query },
			},
		);
		return data!;
	}
}
