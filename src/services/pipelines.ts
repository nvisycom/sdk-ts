import type { ApiClient } from "@/client.js";
import type { CreatePipeline, Pipeline } from "@/datatypes/index.js";

/**
 * Service for handling pipeline operations
 */
export class PipelinesService {
	#api: ApiClient;

	constructor(api: ApiClient) {
		this.#api = api;
	}

	/**
	 * List all pipelines in a project
	 * @param projectId - Project ID
	 * @returns Promise that resolves with the list of pipelines
	 * @throws {ApiError} if the request fails
	 */
	async list(projectId: string): Promise<Pipeline[]> {
		const { data } = await this.#api.GET("/projects/{project_id}/pipelines", {
			params: { path: { projectId } },
		});
		return data!;
	}

	/**
	 * Get a specific pipeline by ID
	 * @param projectId - Project ID
	 * @param pipelineId - Pipeline ID
	 * @returns Promise that resolves with the pipeline details
	 * @throws {ApiError} if the request fails
	 */
	async get(projectId: string, pipelineId: string): Promise<Pipeline> {
		const { data } = await this.#api.GET(
			"/projects/{project_id}/pipelines/{pipeline_id}",
			{
				params: { path: { projectId, pipelineId } },
			},
		);
		return data!;
	}

	/**
	 * Create a new pipeline
	 * @param projectId - Project ID
	 * @param pipeline - Pipeline creation request
	 * @returns Promise that resolves with the created pipeline
	 * @throws {ApiError} if the request fails
	 */
	async create(projectId: string, pipeline: CreatePipeline): Promise<Pipeline> {
		const { data } = await this.#api.POST("/projects/{project_id}/pipelines", {
			params: { path: { projectId } },
			body: pipeline,
		});
		return data!;
	}

	/**
	 * Update an existing pipeline
	 * @param projectId - Project ID
	 * @param pipelineId - Pipeline ID
	 * @param updates - Pipeline update request
	 * @returns Promise that resolves with the updated pipeline
	 * @throws {ApiError} if the request fails
	 */
	async update(
		projectId: string,
		pipelineId: string,
		updates: CreatePipeline,
	): Promise<Pipeline> {
		const { data } = await this.#api.PUT(
			"/projects/{project_id}/pipelines/{pipeline_id}",
			{
				params: { path: { projectId, pipelineId } },
				body: updates,
			},
		);
		return data!;
	}

	/**
	 * Delete a pipeline
	 * @param projectId - Project ID
	 * @param pipelineId - Pipeline ID
	 * @returns Promise that resolves when the pipeline is deleted
	 * @throws {ApiError} if the request fails
	 */
	async delete(projectId: string, pipelineId: string): Promise<void> {
		await this.#api.DELETE("/projects/{project_id}/pipelines/{pipeline_id}", {
			params: { path: { projectId, pipelineId } },
		});
	}
}
