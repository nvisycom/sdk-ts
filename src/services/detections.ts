import type { ApiClient } from "@/client.js";
import type {
	ArtifactSet,
	Audit,
	CreateDetection,
	CursorPagination,
	Detection,
	DetectionPage,
	DetectionStatusEvent,
	ExportQuery,
	PipelineDetectionsQuery,
	RedactDetection,
	RedactionResult,
	RedactionResultPage,
	WorkspaceDetectionsQuery,
} from "@/datatypes/index.js";
import { NvisyError } from "@/errors.js";
import { parseSseStream } from "@/services/sse.js";

/**
 * Service for pipeline detections (one analysis pass of a file) and the
 * redactions produced from them.
 */
export class Detections {
	#api: ApiClient;

	constructor(api: ApiClient) {
		this.#api = api;
	}

	/**
	 * List all detections in a workspace
	 * @param workspaceSlug - Workspace slug
	 * @param query - Optional pagination and filters (status, fileId,
	 *   pipelineId, triggerType, triggeredBy, limit, after)
	 * @returns Promise that resolves with a paginated list of detections
	 * @throws {ApiError} if the request fails
	 */
	async listDetections(
		workspaceSlug: string,
		query?: CursorPagination & WorkspaceDetectionsQuery,
	): Promise<DetectionPage> {
		const { data } = await this.#api.GET(
			"/workspaces/{workspaceSlug}/pipelines/detections/",
			{
				params: { path: { workspaceSlug }, query },
			},
		);
		return data!;
	}

	/**
	 * List detections for a specific pipeline
	 * @param workspaceSlug - Workspace slug
	 * @param pipelineSlug - Pipeline slug
	 * @param query - Optional pagination and filters (status, fileId,
	 *   triggerType, triggeredBy, limit, after)
	 * @returns Promise that resolves with a paginated list of detections
	 * @throws {ApiError} if the request fails
	 */
	async listPipelineDetections(
		workspaceSlug: string,
		pipelineSlug: string,
		query?: CursorPagination & PipelineDetectionsQuery,
	): Promise<DetectionPage> {
		const { data } = await this.#api.GET(
			"/workspaces/{workspaceSlug}/pipelines/{pipelineSlug}/detections/",
			{
				params: { path: { workspaceSlug, pipelineSlug }, query },
			},
		);
		return data!;
	}

	/**
	 * Start a new detection over a file for a pipeline
	 * @param workspaceSlug - Workspace slug
	 * @param pipelineSlug - Pipeline slug
	 * @param detection - Detection creation request
	 * @returns Promise that resolves with the created detection
	 * @throws {ApiError} if the request fails
	 */
	async createDetection(
		workspaceSlug: string,
		pipelineSlug: string,
		detection: CreateDetection,
	): Promise<Detection> {
		const { data } = await this.#api.POST(
			"/workspaces/{workspaceSlug}/pipelines/{pipelineSlug}/detections/",
			{
				params: { path: { workspaceSlug, pipelineSlug } },
				body: detection,
			},
		);
		return data!;
	}

	/**
	 * Get detection details by ID
	 * @param workspaceSlug - Workspace slug
	 * @param detectionId - Detection ID
	 * @returns Promise that resolves with the detection details
	 * @throws {ApiError} if the request fails
	 */
	async getDetection(
		workspaceSlug: string,
		detectionId: string,
	): Promise<Detection> {
		const { data } = await this.#api.GET(
			"/workspaces/{workspaceSlug}/detections/{detectionId}/",
			{
				params: { path: { workspaceSlug, detectionId } },
			},
		);
		return data!;
	}

	/**
	 * Get a detection's analysis (audit)
	 * @param workspaceSlug - Workspace slug
	 * @param detectionId - Detection ID
	 * @returns Promise that resolves with the audit
	 * @throws {ApiError} if the request fails
	 */
	async getAnalysis(
		workspaceSlug: string,
		detectionId: string,
	): Promise<Audit> {
		const { data } = await this.#api.GET(
			"/workspaces/{workspaceSlug}/detections/{detectionId}/analysis/",
			{
				params: { path: { workspaceSlug, detectionId } },
			},
		);
		return data!;
	}

	/**
	 * Get a detection's enrichment intermediates.
	 *
	 * Returns `{ body, parts }` — an image's OCR layout, an audio clip's
	 * transcript, or tokenized text — so a client can search the extracted
	 * content and add entities the analysis missed. A detection whose analysis
	 * ran no enricher has no intermediates and 404s.
	 *
	 * @param workspaceSlug - Workspace slug
	 * @param detectionId - Detection ID
	 * @returns Promise that resolves with the artifact set
	 * @throws {ApiError} if the request fails (404 when there are none)
	 */
	async getIntermediates(
		workspaceSlug: string,
		detectionId: string,
	): Promise<ArtifactSet> {
		const { data } = await this.#api.GET(
			"/workspaces/{workspaceSlug}/detections/{detectionId}/intermediates/",
			{
				params: { path: { workspaceSlug, detectionId } },
			},
		);
		return data!;
	}

	/**
	 * Download a detection's audit as a file.
	 *
	 * `format` is `csv` (default) — a zip of entities.csv, provenance.csv, and
	 * reviews.csv — or `json`, a pretty-printed JSON file.
	 *
	 * @param workspaceSlug - Workspace slug
	 * @param detectionId - Detection ID
	 * @param query - Optional output format (`csv` default, or `json`)
	 * @returns Promise that resolves with the file response
	 * @throws {ApiError} if the request fails
	 */
	async downloadAudit(
		workspaceSlug: string,
		detectionId: string,
		query?: ExportQuery,
	): Promise<Response> {
		const { response } = await this.#api.GET(
			"/workspaces/{workspaceSlug}/detections/{detectionId}/audit/",
			{
				params: { path: { workspaceSlug, detectionId }, query },
				parseAs: "stream",
			},
		);
		return response;
	}

	/**
	 * Open the raw Server-Sent Events stream of a detection's status changes.
	 *
	 * Returns the underlying `Response` so callers can handle the
	 * `text/event-stream` body themselves. Most callers want
	 * {@link streamEvents}, which parses each frame into a typed
	 * {@link DetectionStatusEvent}.
	 *
	 * @param workspaceSlug - Workspace slug
	 * @param detectionId - Detection ID
	 * @returns Promise that resolves with the event-stream response
	 * @throws {ApiError} if the request fails
	 */
	async events(workspaceSlug: string, detectionId: string): Promise<Response> {
		const { response } = await this.#api.GET(
			"/workspaces/{workspaceSlug}/detections/{detectionId}/events/",
			{
				params: { path: { workspaceSlug, detectionId } },
				parseAs: "stream",
			},
		);
		return response;
	}

	/**
	 * Stream a detection's status changes as Server-Sent Events.
	 *
	 * Yields the current status immediately, then each transition, and ends
	 * once the detection settles. Break out of the loop to close the stream
	 * early. For the raw response, use {@link events}.
	 *
	 * @param workspaceSlug - Workspace slug
	 * @param detectionId - Detection ID
	 * @yields each {@link DetectionStatusEvent} as it arrives
	 * @throws {ApiError} if the request fails to open
	 * @throws {NvisyError} if the response has no readable body
	 */
	async *streamEvents(
		workspaceSlug: string,
		detectionId: string,
	): AsyncGenerator<DetectionStatusEvent> {
		const response = await this.events(workspaceSlug, detectionId);
		if (!response.body) {
			throw new NvisyError("Event stream response has no body");
		}
		for await (const event of parseSseStream(response.body)) {
			// The server names every frame `status`; ignore anything else.
			if (event.event === "status") {
				yield JSON.parse(event.data) as DetectionStatusEvent;
			}
		}
	}

	/**
	 * List the redactions produced from a detection
	 * @param workspaceSlug - Workspace slug
	 * @param detectionId - Detection ID
	 * @param query - Optional pagination (limit, after)
	 * @returns Promise that resolves with a paginated list of redactions
	 * @throws {ApiError} if the request fails
	 */
	async listRedactions(
		workspaceSlug: string,
		detectionId: string,
		query?: CursorPagination,
	): Promise<RedactionResultPage> {
		const { data } = await this.#api.GET(
			"/workspaces/{workspaceSlug}/detections/{detectionId}/redactions/",
			{
				params: { path: { workspaceSlug, detectionId }, query },
			},
		);
		return data!;
	}

	/**
	 * Redact a detection, producing a redaction result
	 * @param workspaceSlug - Workspace slug
	 * @param detectionId - Detection ID
	 * @param redaction - Redaction request (optional reviewer edits)
	 * @returns Promise that resolves with the created redaction result
	 * @throws {ApiError} if the request fails
	 */
	async createRedaction(
		workspaceSlug: string,
		detectionId: string,
		redaction: RedactDetection,
	): Promise<RedactionResult> {
		const { data } = await this.#api.POST(
			"/workspaces/{workspaceSlug}/detections/{detectionId}/redactions/",
			{
				params: { path: { workspaceSlug, detectionId } },
				body: redaction,
			},
		);
		return data!;
	}
}
