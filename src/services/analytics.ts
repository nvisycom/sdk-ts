import type { ApiClient } from "@/client.js";
import type {
	DateWindow,
	WorkspaceAnalytics,
	WorkspaceDetectionTimeSeries,
} from "@/datatypes/index.js";

/**
 * Service for workspace analytics: aggregate totals and detection time series.
 */
export class Analytics {
	#api: ApiClient;

	constructor(api: ApiClient) {
		this.#api = api;
	}

	/**
	 * Get aggregate analytics for a workspace: storage, detection health, usage.
	 * @param workspaceId - Workspace id
	 * @returns Promise that resolves with the workspace analytics
	 * @throws {ApiError} if the request fails
	 */
	async getAnalytics(workspaceId: string): Promise<WorkspaceAnalytics> {
		const { data } = await this.#api.GET(
			"/workspaces/{workspaceId}/analytics/",
			{
				params: { path: { workspaceId } },
			},
		);
		return data!;
	}

	/**
	 * Get a workspace's daily detection activity over a date window.
	 * @param workspaceId - Workspace id
	 * @param query - Optional date window (`from` / `to`, YYYY-MM-DD)
	 * @returns Promise that resolves with the detection time series
	 * @throws {ApiError} if the request fails
	 */
	async getDetectionTimeSeries(
		workspaceId: string,
		query?: DateWindow,
	): Promise<WorkspaceDetectionTimeSeries> {
		const { data } = await this.#api.GET(
			"/workspaces/{workspaceId}/analytics/detections/timeseries/",
			{
				params: { path: { workspaceId }, query },
			},
		);
		return data!;
	}
}
