import type { ApiClient } from "@/client.js";
import type {
	Audit,
	CreatePipelineRun,
	CursorPagination,
	PipelineRun,
	PipelineRunPage,
	PipelineRunStatus,
	RunStatusEvent,
} from "@/datatypes/index.js";
import { NvisyError } from "@/errors.js";
import { parseSseStream } from "@/services/sse.js";

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
	 * Open the raw Server-Sent Events stream of a run's status changes.
	 *
	 * Returns the underlying `Response` so callers can handle the
	 * `text/event-stream` body themselves. Most callers want
	 * {@link streamEvents}, which parses each frame into a typed
	 * {@link RunStatusEvent}.
	 *
	 * @param workspaceSlug - Workspace slug
	 * @param runId - Run ID
	 * @returns Promise that resolves with the event-stream response
	 * @throws {ApiError} if the request fails
	 */
	async streamEventsResponse(
		workspaceSlug: string,
		runId: string,
	): Promise<Response> {
		const { response } = await this.#api.GET(
			"/workspaces/{workspaceSlug}/runs/{runId}/events",
			{
				params: { path: { workspaceSlug, runId } },
				parseAs: "stream",
			},
		);
		return response;
	}

	/**
	 * Stream a run's status changes as Server-Sent Events.
	 *
	 * Yields the current status immediately, then each transition, and ends
	 * once the run settles (analyzed, completed, failed, or cancelled). Break
	 * out of the loop to close the stream early. For the raw response, use
	 * {@link streamEventsResponse}.
	 *
	 * @param workspaceSlug - Workspace slug
	 * @param runId - Run ID
	 * @yields each {@link RunStatusEvent} as it arrives
	 * @throws {ApiError} if the request fails to open
	 * @throws {NvisyError} if the response has no readable body
	 */
	async *streamEvents(
		workspaceSlug: string,
		runId: string,
	): AsyncGenerator<RunStatusEvent> {
		const response = await this.streamEventsResponse(workspaceSlug, runId);
		if (!response.body) {
			throw new NvisyError("Event stream response has no body");
		}
		for await (const event of parseSseStream(response.body)) {
			// The server names every frame `status`; ignore anything else
			// (e.g. keep-alive comments never reach here).
			if (event.event === "status") {
				yield JSON.parse(event.data) as RunStatusEvent;
			}
		}
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
