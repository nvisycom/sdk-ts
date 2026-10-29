import type { ApiClient } from "@/client.js";
import type {
	ArtifactSet,
	Audit,
	CreateWorkspaceDetection,
	CursorPagination,
	DetectionStatusEvent,
	EditWorkspaceDetection,
	ExportQuery,
	WorkspaceDetection,
	WorkspaceDetectionArtifacts,
	WorkspaceDetectionPage,
	WorkspaceDetectionsQuery,
	WorkspaceRedactionResult,
	WorkspaceRedactionResultPage,
} from "@/datatypes/index.js";
import { NvisyError } from "@/errors.js";
import { parseSseStream } from "@/services/sse.js";

/**
 * Service for detections (one analysis pass of a document against policies)
 * and the redactions produced from them.
 */
export class Detections {
	#api: ApiClient;

	constructor(api: ApiClient) {
		this.#api = api;
	}

	/**
	 * List all detections in a workspace
	 * @param workspaceId - Workspace id
	 * @param query - Optional pagination and filters (status, documentId,
	 *   policyId, triggeredBy, limit, after)
	 * @returns Promise that resolves with a paginated list of detections
	 * @throws {ApiError} if the request fails
	 */
	async listDetections(
		workspaceId: string,
		query?: CursorPagination & WorkspaceDetectionsQuery,
	): Promise<WorkspaceDetectionPage> {
		const { data } = await this.#api.GET(
			"/workspaces/{workspaceId}/detections",
			{
				params: { path: { workspaceId }, query },
			},
		);
		return data!;
	}

	/**
	 * Start a new detection over a document, naming the policies to run against
	 * it by id.
	 * @param workspaceId - Workspace id
	 * @param detection - Detection creation request (`documentId`, `policyIds`,
	 *   optional `scope` and `retentionOverride`)
	 * @returns Promise that resolves with the created detection
	 * @throws {ApiError} if the request fails
	 */
	async createDetection(
		workspaceId: string,
		detection: CreateWorkspaceDetection,
	): Promise<WorkspaceDetection> {
		const { data } = await this.#api.POST(
			"/workspaces/{workspaceId}/detections",
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
			"/workspaces/{workspaceId}/detections/{detectionId}",
			{
				params: { path: { workspaceId, detectionId } },
			},
		);
		return data!;
	}

	/**
	 * Get a detection's input file, intermediate availability, and redacted output metadata.
	 * @param workspaceId - Workspace id
	 * @param detectionId - Detection ID
	 * @returns Promise that resolves with the detection artifact metadata
	 * @throws {ApiError} if the request fails
	 */
	async getArtifacts(
		workspaceId: string,
		detectionId: string,
	): Promise<WorkspaceDetectionArtifacts> {
		const { data } = await this.#api.GET(
			"/workspaces/{workspaceId}/detections/{detectionId}/artifacts",
			{
				params: { path: { workspaceId, detectionId } },
			},
		);
		return data!;
	}

	/**
	 * Set a detection's accumulated reviewer edits (suppress a false positive,
	 * retag a detection, or add one the analysis missed), or clear them by
	 * omitting `edits`. The edits persist on the detection and are layered over
	 * its analysis at redact time. Pass the `editSetRev` you last read; a stale
	 * value is rejected with 409.
	 * @param workspaceId - Workspace id
	 * @param detectionId - Detection ID
	 * @param edits - The expected `editSetRev` and the reviewer edits to
	 *   persist; omit `edits` to clear the detection's stored edits
	 * @returns Promise that resolves with the updated detection
	 * @throws {ApiError} if the request fails
	 */
	async editDetection(
		workspaceId: string,
		detectionId: string,
		edits: EditWorkspaceDetection,
	): Promise<WorkspaceDetection> {
		const { data } = await this.#api.PATCH(
			"/workspaces/{workspaceId}/detections/{detectionId}",
			{
				params: { path: { workspaceId, detectionId } },
				body: edits,
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
			"/workspaces/{workspaceId}/detections/{detectionId}/analysis",
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
			"/workspaces/{workspaceId}/detections/{detectionId}/intermediates",
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
			"/workspaces/{workspaceId}/detections/{detectionId}/audit",
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
			"/workspaces/{workspaceId}/detections/{detectionId}/events",
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
			"/workspaces/{workspaceId}/detections/{detectionId}/redactions",
			{
				params: { path: { workspaceId, detectionId }, query },
			},
		);
		return data!;
	}

	/**
	 * Redact a detection, producing a redaction result. Applies the detection's
	 * policies to its stored analysis, with the detection's accumulated reviewer
	 * edits (set via {@link editDetection}) layered on first. A detection can be
	 * redacted more than once.
	 * @param workspaceId - Workspace id
	 * @param detectionId - Detection ID
	 * @returns Promise that resolves with the created redaction result
	 * @throws {ApiError} if the request fails
	 */
	async createRedaction(
		workspaceId: string,
		detectionId: string,
	): Promise<WorkspaceRedactionResult> {
		const { data } = await this.#api.POST(
			"/workspaces/{workspaceId}/detections/{detectionId}/redactions",
			{
				params: { path: { workspaceId, detectionId } },
			},
		);
		return data!;
	}
}
