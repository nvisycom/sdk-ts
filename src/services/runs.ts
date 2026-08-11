import type { ApiClient } from "@/client.js";
import type {
	Audit,
	CreatePipelineRun,
	CursorPagination,
	PipelineRun,
	PipelineRunPage,
	PipelineRunStatus,
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
	 * List all pipeline runs in a workspace
	 * @param workspaceSlug - Workspace slug
	 * @param query - Optional query parameters (status, limit, after)
	 * @returns Promise that resolves with a paginated list of pipeline runs
	 * @throws {ApiError} if the request fails
	 */
	async listRuns(
		workspaceSlug: string,
		query?: CursorPagination & { status?: PipelineRunStatus },
	): Promise<PipelineRunPage> {
		const { data } = await this.#api.GET(
			"/workspaces/{workspaceSlug}/pipelines/runs/",
			{
				params: { path: { workspaceSlug }, query },
			},
		);
		return data!;
	}

	/**
	 * List runs for a specific pipeline
	 * @param workspaceSlug - Workspace slug
	 * @param pipelineSlug - Pipeline slug
	 * @param query - Optional pagination parameters (limit, after)
	 * @returns Promise that resolves with a paginated list of pipeline runs
	 * @throws {ApiError} if the request fails
	 */
	async listPipelineRuns(
		workspaceSlug: string,
		pipelineSlug: string,
		query?: CursorPagination,
	): Promise<PipelineRunPage> {
		const { data } = await this.#api.GET(
			"/workspaces/{workspaceSlug}/pipelines/{pipelineSlug}/runs/",
			{
				params: { path: { workspaceSlug, pipelineSlug }, query },
			},
		);
		return data!;
	}

	/**
	 * Trigger a new run for a pipeline
	 * @param workspaceSlug - Workspace slug
	 * @param pipelineSlug - Pipeline slug
	 * @param run - Pipeline run creation request
	 * @returns Promise that resolves with the created pipeline run
	 * @throws {ApiError} if the request fails
	 */
	async createRun(
		workspaceSlug: string,
		pipelineSlug: string,
		run: CreatePipelineRun,
	): Promise<PipelineRun> {
		const { data } = await this.#api.POST(
			"/workspaces/{workspaceSlug}/pipelines/{pipelineSlug}/runs/",
			{
				params: { path: { workspaceSlug, pipelineSlug } },
				body: run,
			},
		);
		return data!;
	}

	/**
	 * Get pipeline run details by ID
	 * @param workspaceSlug - Workspace slug
	 * @param runId - Run ID
	 * @returns Promise that resolves with the pipeline run details
	 * @throws {ApiError} if the request fails
	 */
	async getRun(workspaceSlug: string, runId: string): Promise<PipelineRun> {
		const { data } = await this.#api.GET(
			"/workspaces/{workspaceSlug}/runs/{runId}/",
			{
				params: { path: { workspaceSlug, runId } },
			},
		);
		return data!;
	}

	/**
	 * Get the detections (audit) for a pipeline run
	 * @param workspaceSlug - Workspace slug
	 * @param runId - Run ID
	 * @returns Promise that resolves with the audit
	 * @throws {ApiError} if the request fails
	 */
	async getDetections(workspaceSlug: string, runId: string): Promise<Audit> {
		const { data } = await this.#api.GET(
			"/workspaces/{workspaceSlug}/runs/{runId}/detections/",
			{
				params: { path: { workspaceSlug, runId } },
			},
		);
		return data!;
	}

	/**
	 * Download a run's audit as a pretty-printed JSON file
	 * @param workspaceSlug - Workspace slug
	 * @param runId - Run ID
	 * @returns Promise that resolves with the file response
	 * @throws {ApiError} if the request fails
	 */
	async downloadAuditJson(
		workspaceSlug: string,
		runId: string,
	): Promise<Response> {
		const { response } = await this.#api.GET(
			"/workspaces/{workspaceSlug}/runs/{runId}/audit/json",
			{
				params: { path: { workspaceSlug, runId } },
				parseAs: "stream",
			},
		);
		return response;
	}

	/**
	 * Download a run's audit as a zip of entities.csv, provenance.csv, and
	 * reviews.csv
	 * @param workspaceSlug - Workspace slug
	 * @param runId - Run ID
	 * @returns Promise that resolves with the file response
	 * @throws {ApiError} if the request fails
	 */
	async downloadAuditCsv(
		workspaceSlug: string,
		runId: string,
	): Promise<Response> {
		const { response } = await this.#api.GET(
			"/workspaces/{workspaceSlug}/runs/{runId}/audit/csv",
			{
				params: { path: { workspaceSlug, runId } },
				parseAs: "stream",
			},
		);
		return response;
	}

	/**
	 * Apply redactions to a pipeline run
	 * @param workspaceSlug - Workspace slug
	 * @param runId - Run ID
	 * @returns Promise that resolves with the updated pipeline run
	 * @throws {ApiError} if the request fails
	 */
	async redact(workspaceSlug: string, runId: string): Promise<PipelineRun> {
		const { data } = await this.#api.POST(
			"/workspaces/{workspaceSlug}/runs/{runId}/redactions/",
			{
				params: { path: { workspaceSlug, runId } },
			},
		);
		return data!;
	}
}
