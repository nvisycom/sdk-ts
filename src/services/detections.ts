import type { ApiClient } from "@/client.js";
import type {
	ArtifactSet,
	Audit,
	CreateAdhocWorkspaceDetection,
	CreateWorkspaceDetection,
	CursorPagination,
	DetectionStatusEvent,
	ExportQuery,
	RedactWorkspaceDetection,
	WorkspaceDetection,
	WorkspaceDetectionPage,
	WorkspaceDetectionsQuery,
	WorkspacePipelineDetectionsQuery,
	WorkspaceRedactionResult,
	WorkspaceRedactionResultPage,
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
	 * @param workspaceId - Workspace id
	 * @param query - Optional pagination and filters (status, fileId,
	 *   pipelineId, triggerType, triggeredBy, limit, after)
	 * @returns Promise that resolves with a paginated list of detections
	 * @throws {ApiError} if the request fails
	 */
	async listDetections(
		workspaceId: string,
		query?: CursorPagination & WorkspaceDetectionsQuery,
	): Promise<WorkspaceDetectionPage> {
		const { data } = await this.#api.GET(
			"/workspaces/{workspaceId}/pipelines/detections/",
			{
				params: { path: { workspaceId }, query },
			},
		);
		return data!;
	}

	/**
	 * List detections for a specific pipeline
	 * @param workspaceId - Workspace id
	 * @param pipelineId - Pipeline id
	 * @param query - Optional pagination and filters (status, fileId,
	 *   triggerType, triggeredBy, limit, after)
	 * @returns Promise that resolves with a paginated list of detections
	 * @throws {ApiError} if the request fails
	 */
	async listPipelineDetections(
		workspaceId: string,
		pipelineId: string,
		query?: CursorPagination & WorkspacePipelineDetectionsQuery,
	): Promise<WorkspaceDetectionPage> {
		const { data } = await this.#api.GET(
			"/workspaces/{workspaceId}/pipelines/{pipelineId}/detections/",
			{
				params: { path: { workspaceId, pipelineId }, query },
			},
		);
		return data!;
	}

	/**
	 * Start a new detection over a file for a pipeline
	 * @param workspaceId - Workspace id
	 * @param pipelineId - Pipeline id
	 * @param detection - Detection creation request
	 * @returns Promise that resolves with the created detection
	 * @throws {ApiError} if the request fails
	 */
	async createDetection(
		workspaceId: string,
		pipelineId: string,
		detection: CreateWorkspaceDetection,
	): Promise<WorkspaceDetection> {
		const { data } = await this.#api.POST(
			"/workspaces/{workspaceId}/pipelines/{pipelineId}/detections/",
			{
				params: { path: { workspaceId, pipelineId } },
				body: detection,
			},
		);
		return data!;
	}

	/**
	 * Start an ad-hoc detection over a document without a saved pipeline.
	 * @param workspaceId - Workspace id
	 * @param detection - Ad-hoc detection creation request
	 * @returns Promise that resolves with the created detection
	 * @throws {ApiError} if the request fails
	 */
	async createAdhocDetection(
		workspaceId: string,
		detection: CreateAdhocWorkspaceDetection,
	): Promise<WorkspaceDetection> {
		const { data } = await this.#api.POST(
			"/workspaces/{workspaceId}/detections/",
			{
				params: { path: { workspaceId } },
				body: detection,
			},
		);
		return data!;
	}

	/**
	 * Get detection details by ID
	 * @param workspaceId - Workspace id
	 * @param detectionId - Detection ID
	 * @returns Promise that resolves with the detection details
	 * @throws {ApiError} if the request fails
	 */
	async getDetection(
		workspaceId: string,
		detectionId: string,
	): Promise<WorkspaceDetection> {
		const { data } = await this.#api.GET(
			"/workspaces/{workspaceId}/detections/{detectionId}/",
			{
				params: { path: { workspaceId, detectionId } },
			},
		);
		return data!;
	}

	/**
	 * Get a detection's analysis (audit)
	 * @param workspaceId - Workspace id
	 * @param detectionId - Detection ID
	 * @returns Promise that resolves with the audit
	 * @throws {ApiError} if the request fails
	 */
	async getAnalysis(workspaceId: string, detectionId: string): Promise<Audit> {
		const { data } = await this.#api.GET(
			"/workspaces/{workspaceId}/detections/{detectionId}/analysis/",
			{
				params: { path: { workspaceId, detectionId } },
			},
		);
		return data!;
	}

	/**
	 * Get a detection's enrichment intermediates.
	 *
	 * Returns an `ArtifactSet` — the modality-tagged `parts`, each an image's
	 * OCR layout, an audio clip's transcript, or tokenized text — so a client
	 * can search the extracted content and add entities the analysis missed. A
	 * detection whose analysis ran no enricher has no intermediates and 404s.
	 *
	 * @param workspaceId - Workspace id
	 * @param detectionId - Detection ID
	 * @returns Promise that resolves with the artifact set
	 * @throws {ApiError} if the request fails (404 when there are none)
	 */
	async getIntermediates(
		workspaceId: string,
		detectionId: string,
	): Promise<ArtifactSet> {
		const { data } = await this.#api.GET(
			"/workspaces/{workspaceId}/detections/{detectionId}/intermediates/",
			{
				params: { path: { workspaceId, detectionId } },
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
	 * @param workspaceId - Workspace id
	 * @param detectionId - Detection ID
	 * @param query - Optional output format (`csv` default, or `json`)
	 * @returns Promise that resolves with the file response
	 * @throws {ApiError} if the request fails
	 */
	async downloadAudit(
		workspaceId: string,
		detectionId: string,
		query?: ExportQuery,
	): Promise<Response> {
		const { response } = await this.#api.GET(
			"/workspaces/{workspaceId}/detections/{detectionId}/audit/",
			{
				params: { path: { workspaceId, detectionId }, query },
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
	 * @param workspaceId - Workspace id
	 * @param detectionId - Detection ID
	 * @returns Promise that resolves with the event-stream response
	 * @throws {ApiError} if the request fails
	 */
	async events(workspaceId: string, detectionId: string): Promise<Response> {
		const { response } = await this.#api.GET(
			"/workspaces/{workspaceId}/detections/{detectionId}/events/",
			{
				params: { path: { workspaceId, detectionId } },
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
	 * @param workspaceId - Workspace id
	 * @param detectionId - Detection ID
	 * @yields each {@link DetectionStatusEvent} as it arrives
	 * @throws {ApiError} if the request fails to open
	 * @throws {NvisyError} if the response has no readable body
	 */
	async *streamEvents(
		workspaceId: string,
		detectionId: string,
	): AsyncGenerator<DetectionStatusEvent> {
		const response = await this.events(workspaceId, detectionId);
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
	 * @param workspaceId - Workspace id
	 * @param detectionId - Detection ID
	 * @param query - Optional pagination (limit, after)
	 * @returns Promise that resolves with a paginated list of redactions
	 * @throws {ApiError} if the request fails
	 */
	async listRedactions(
		workspaceId: string,
		detectionId: string,
		query?: CursorPagination,
	): Promise<WorkspaceRedactionResultPage> {
		const { data } = await this.#api.GET(
			"/workspaces/{workspaceId}/detections/{detectionId}/redactions/",
			{
				params: { path: { workspaceId, detectionId }, query },
			},
		);
		return data!;
	}

	/**
	 * Redact a detection, producing a redaction result
	 * @param workspaceId - Workspace id
	 * @param detectionId - Detection ID
	 * @param redaction - Redaction request (optional reviewer edits)
	 * @returns Promise that resolves with the created redaction result
	 * @throws {ApiError} if the request fails
	 */
	async createRedaction(
		workspaceId: string,
		detectionId: string,
		redaction: RedactWorkspaceDetection,
	): Promise<WorkspaceRedactionResult> {
		const { data } = await this.#api.POST(
			"/workspaces/{workspaceId}/detections/{detectionId}/redactions/",
			{
				params: { path: { workspaceId, detectionId } },
				body: redaction,
			},
		);
		return data!;
	}
}
