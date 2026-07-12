import type { ApiClient } from "@/client.js";
import type {
	AnalyzedDocument,
	CreatePipelineRun,
	CursorPagination,
	PipelineRun,
	PipelineRunsPage,
} from "@/datatypes/index.js";

/**
 * Service for handling pipeline run operations
 */
export class Runs {
	#api: ApiClient;

	constructor(api: ApiClient) {
		this.#api = api;
	}

	/**
	 * List runs for a pipeline
	 * @param pipelineId - Pipeline ID
	 * @param query - Optional pagination parameters (limit, after)
	 * @returns Promise that resolves with a paginated list of pipeline runs
	 * @throws {ApiError} if the request fails
	 */
	async listRuns(
		pipelineId: string,
		query?: CursorPagination,
	): Promise<PipelineRunsPage> {
		const { data } = await this.#api.GET("/pipelines/{pipelineId}/runs/", {
			params: { path: { pipelineId }, query },
		});
		return data!;
	}

	/**
	 * Trigger a new run for a pipeline
	 * @param pipelineId - Pipeline ID
	 * @param run - Pipeline run creation request
	 * @returns Promise that resolves with the created pipeline run
	 * @throws {ApiError} if the request fails
	 */
	async createRun(
		pipelineId: string,
		run: CreatePipelineRun,
	): Promise<PipelineRun> {
		const { data } = await this.#api.POST("/pipelines/{pipelineId}/runs/", {
			params: { path: { pipelineId } },
			body: run,
		});
		return data!;
	}

	/**
	 * Get pipeline run details by ID
	 * @param runId - Run ID
	 * @returns Promise that resolves with the pipeline run details
	 * @throws {ApiError} if the request fails
	 */
	async getRun(runId: string): Promise<PipelineRun> {
		const { data } = await this.#api.GET("/runs/{runId}/", {
			params: { path: { runId } },
		});
		return data!;
	}

	/**
	 * Get the detections (analyzed document) for a pipeline run
	 * @param runId - Run ID
	 * @returns Promise that resolves with the analyzed document
	 * @throws {ApiError} if the request fails
	 */
	async getDetections(runId: string): Promise<AnalyzedDocument> {
		const { data } = await this.#api.GET("/runs/{runId}/detections/", {
			params: { path: { runId } },
		});
		return data!;
	}

	/**
	 * Apply redactions to a pipeline run
	 * @param runId - Run ID
	 * @returns Promise that resolves with the updated pipeline run
	 * @throws {ApiError} if the request fails
	 */
	async redact(runId: string): Promise<PipelineRun> {
		const { data } = await this.#api.POST("/runs/{runId}/redactions/", {
			params: { path: { runId } },
		});
		return data!;
	}
}
