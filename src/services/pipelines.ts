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
	 * @param workspaceSlug - Workspace slug
	 * @param query - Optional query parameters (search, status, limit, after)
	 * @returns Promise that resolves with a paginated list of pipeline summaries
	 * @throws {ApiError} if the request fails
	 */
	async listPipelines(
		workspaceSlug: string,
		query?: CursorPagination & { search?: string; status?: PipelineStatus },
	): Promise<PipelineSummariesPage> {
		const { data } = await this.#api.GET(
			"/workspaces/{workspaceSlug}/pipelines/",
			{
				params: { path: { workspaceSlug }, query },
			},
		);
		return data!;
	}

	/**
	 * Create a pipeline in a workspace
	 * @param workspaceSlug - Workspace slug
	 * @param pipeline - Pipeline creation request
	 * @returns Promise that resolves with the created pipeline
	 * @throws {ApiError} if the request fails
	 */
	async createPipeline(
		workspaceSlug: string,
		pipeline: CreatePipeline,
	): Promise<Pipeline> {
		const { data } = await this.#api.POST(
			"/workspaces/{workspaceSlug}/pipelines/",
			{
				params: { path: { workspaceSlug } },
				body: pipeline,
			},
		);
		return data!;
	}

	/**
	 * Get pipeline details by slug
	 * @param workspaceSlug - Workspace slug
	 * @param pipelineSlug - Pipeline slug
	 * @returns Promise that resolves with the pipeline details
	 * @throws {ApiError} if the request fails
	 */
	async getPipeline(
		workspaceSlug: string,
		pipelineSlug: string,
	): Promise<Pipeline> {
		const { data } = await this.#api.GET(
			"/workspaces/{workspaceSlug}/pipelines/{pipelineSlug}/",
			{
				params: { path: { workspaceSlug, pipelineSlug } },
			},
		);
		return data!;
	}

	/**
	 * Update a pipeline
	 * @param workspaceSlug - Workspace slug
	 * @param pipelineSlug - Pipeline slug
	 * @param updates - Pipeline update request
	 * @returns Promise that resolves with the updated pipeline
	 * @throws {ApiError} if the request fails
	 */
	async updatePipeline(
		workspaceSlug: string,
		pipelineSlug: string,
		updates: UpdatePipeline,
	): Promise<Pipeline> {
		const { data } = await this.#api.PATCH(
			"/workspaces/{workspaceSlug}/pipelines/{pipelineSlug}/",
			{
				params: { path: { workspaceSlug, pipelineSlug } },
				body: updates,
			},
		);
		return data!;
	}

	/**
	 * Delete a pipeline
	 * @param workspaceSlug - Workspace slug
	 * @param pipelineSlug - Pipeline slug
	 * @returns Promise that resolves when the pipeline is deleted
	 * @throws {ApiError} if the request fails
	 */
	async deletePipeline(
		workspaceSlug: string,
		pipelineSlug: string,
	): Promise<void> {
		await this.#api.DELETE(
			"/workspaces/{workspaceSlug}/pipelines/{pipelineSlug}/",
			{
				params: { path: { workspaceSlug, pipelineSlug } },
			},
		);
	}
}
