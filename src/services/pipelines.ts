import type { ApiClient } from "@/client.js";
import type {
	CreateWorkspacePipeline,
	CursorPagination,
	PipelineStatus,
	UpdateWorkspacePipeline,
	WorkspacePipeline,
	WorkspacePipelineSummaryPage,
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
	 * @param workspaceId - Workspace id
	 * @param query - Optional query parameters (search, status, limit, after)
	 * @returns Promise that resolves with a paginated list of pipeline summaries
	 * @throws {ApiError} if the request fails
	 */
	async listPipelines(
		workspaceId: string,
		query?: CursorPagination & { search?: string; status?: PipelineStatus },
	): Promise<WorkspacePipelineSummaryPage> {
		const { data } = await this.#api.GET(
			"/workspaces/{workspaceId}/pipelines",
			{
				params: { path: { workspaceId }, query },
			},
		);
		return data!;
	}

	/**
	 * Create a pipeline in a workspace
	 * @param workspaceId - Workspace id
	 * @param pipeline - Pipeline creation request
	 * @returns Promise that resolves with the created pipeline
	 * @throws {ApiError} if the request fails
	 */
	async createPipeline(
		workspaceId: string,
		pipeline: CreateWorkspacePipeline,
	): Promise<WorkspacePipeline> {
		const { data } = await this.#api.POST(
			"/workspaces/{workspaceId}/pipelines",
			{
				params: { path: { workspaceId } },
				body: pipeline,
			},
		);
		return data!;
	}

	/**
	 * Get pipeline details by id
	 * @param workspaceId - Workspace id
	 * @param pipelineId - Pipeline id
	 * @returns Promise that resolves with the pipeline details
	 * @throws {ApiError} if the request fails
	 */
	async getPipeline(
		workspaceId: string,
		pipelineId: string,
	): Promise<WorkspacePipeline> {
		const { data } = await this.#api.GET(
			"/workspaces/{workspaceId}/pipelines/{pipelineId}",
			{
				params: { path: { workspaceId, pipelineId } },
			},
		);
		return data!;
	}

	/**
	 * Update a pipeline
	 * @param workspaceId - Workspace id
	 * @param pipelineId - Pipeline id
	 * @param updates - Pipeline update request
	 * @returns Promise that resolves with the updated pipeline
	 * @throws {ApiError} if the request fails
	 */
	async updatePipeline(
		workspaceId: string,
		pipelineId: string,
		updates: UpdateWorkspacePipeline,
	): Promise<WorkspacePipeline> {
		const { data } = await this.#api.PATCH(
			"/workspaces/{workspaceId}/pipelines/{pipelineId}",
			{
				params: { path: { workspaceId, pipelineId } },
				body: updates,
			},
		);
		return data!;
	}

	/**
	 * Delete a pipeline
	 * @param workspaceId - Workspace id
	 * @param pipelineId - Pipeline id
	 * @returns Promise that resolves when the pipeline is deleted
	 * @throws {ApiError} if the request fails
	 */
	async deletePipeline(workspaceId: string, pipelineId: string): Promise<void> {
		await this.#api.DELETE("/workspaces/{workspaceId}/pipelines/{pipelineId}", {
			params: { path: { workspaceId, pipelineId } },
		});
	}
}
