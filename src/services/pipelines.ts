import type { ApiClient } from "@/client.js";
import type {
	CreatePipeline,
	CursorPagination,
	Pipeline,
	PipelineStatus,
	PipelineSummariesPage,
	UpdatePipeline,
} from "@/datatypes/index.js";

/**
 * Service for handling pipeline operations
 */
export class Pipelines {
	#api: ApiClient;

	constructor(api: ApiClient) {
		this.#api = api;
	}

	/**
	 * List pipelines in a workspace
	 * @param workspaceId - Workspace ID
	 * @param query - Optional query parameters (search, status, limit, after)
	 * @returns Promise that resolves with a paginated list of pipeline summaries
	 * @throws {ApiError} if the request fails
	 */
	async listPipelines(
		workspaceId: string,
		query?: CursorPagination & { search?: string; status?: PipelineStatus },
	): Promise<PipelineSummariesPage> {
		const { data } = await this.#api.GET(
			"/workspaces/{workspaceId}/pipelines/",
			{
				params: { path: { workspaceId }, query },
			},
		);
		return data!;
	}

	/**
	 * Create a pipeline in a workspace
	 * @param workspaceId - Workspace ID
	 * @param pipeline - Pipeline creation request
	 * @returns Promise that resolves with the created pipeline
	 * @throws {ApiError} if the request fails
	 */
	async createPipeline(
		workspaceId: string,
		pipeline: CreatePipeline,
	): Promise<Pipeline> {
		const { data } = await this.#api.POST(
			"/workspaces/{workspaceId}/pipelines/",
			{
				params: { path: { workspaceId } },
				body: pipeline,
			},
		);
		return data!;
	}

	/**
	 * Get pipeline details by ID
	 * @param pipelineId - Pipeline ID
	 * @returns Promise that resolves with the pipeline details
	 * @throws {ApiError} if the request fails
	 */
	async getPipeline(pipelineId: string): Promise<Pipeline> {
		const { data } = await this.#api.GET("/pipelines/{pipelineId}/", {
			params: { path: { pipelineId } },
		});
		return data!;
	}

	/**
	 * Update a pipeline
	 * @param pipelineId - Pipeline ID
	 * @param updates - Pipeline update request
	 * @returns Promise that resolves with the updated pipeline
	 * @throws {ApiError} if the request fails
	 */
	async updatePipeline(
		pipelineId: string,
		updates: UpdatePipeline,
	): Promise<Pipeline> {
		const { data } = await this.#api.PATCH("/pipelines/{pipelineId}/", {
			params: { path: { pipelineId } },
			body: updates,
		});
		return data!;
	}

	/**
	 * Delete a pipeline
	 * @param pipelineId - Pipeline ID
	 * @returns Promise that resolves when the pipeline is deleted
	 * @throws {ApiError} if the request fails
	 */
	async deletePipeline(pipelineId: string): Promise<void> {
		await this.#api.DELETE("/pipelines/{pipelineId}/", {
			params: { path: { pipelineId } },
		});
	}
}
