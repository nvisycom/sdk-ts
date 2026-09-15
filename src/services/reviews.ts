import type { ApiClient } from "@/client.js";
import type {
	AssignWorkspaceReview,
	CreateWorkspaceReview,
	CursorPagination,
	WorkspaceReview,
	WorkspaceReviewEventPage,
	WorkspaceReviewPage,
	WorkspaceReviewsQuery,
} from "@/datatypes/index.js";

/**
 * Service for document reviews: assigning a document to a reviewer and tracking
 * the review through its lifecycle, with a timeline of events.
 */
export class Reviews {
	#api: ApiClient;

	constructor(api: ApiClient) {
		this.#api = api;
	}

	/**
	 * List the reviews on a document, most recent first.
	 * @param workspaceId - Workspace id
	 * @param documentId - Document ID
	 * @returns Promise that resolves with the document's reviews
	 * @throws {ApiError} if the request fails
	 */
	async listForDocument(
		workspaceId: string,
		documentId: string,
	): Promise<WorkspaceReview[]> {
		const { data } = await this.#api.GET(
			"/workspaces/{workspaceId}/documents/{documentId}/reviews",
			{
				params: { path: { workspaceId, documentId } },
			},
		);
		return data!;
	}

	/**
	 * Open a review on a document.
	 * @param workspaceId - Workspace id
	 * @param documentId - Document ID
	 * @param review - Review creation request
	 * @returns Promise that resolves with the created review
	 * @throws {ApiError} if the request fails
	 */
	async createForDocument(
		workspaceId: string,
		documentId: string,
		review: CreateWorkspaceReview,
	): Promise<WorkspaceReview> {
		const { data } = await this.#api.POST(
			"/workspaces/{workspaceId}/documents/{documentId}/reviews",
			{
				params: { path: { workspaceId, documentId } },
				body: review,
			},
		);
		return data!;
	}

	/**
	 * List a workspace's reviews.
	 * @param workspaceId - Workspace id
	 * @param query - Optional pagination and filters (assignee, documentId,
	 *   reviewStatus, limit, after)
	 * @returns Promise that resolves with a paginated list of reviews
	 * @throws {ApiError} if the request fails
	 */
	async listReviews(
		workspaceId: string,
		query?: CursorPagination & WorkspaceReviewsQuery,
	): Promise<WorkspaceReviewPage> {
		const { data } = await this.#api.GET("/workspaces/{workspaceId}/reviews", {
			params: { path: { workspaceId }, query },
		});
		return data!;
	}

	/**
	 * Get review details by ID.
	 * @param workspaceId - Workspace id
	 * @param reviewId - Review ID
	 * @returns Promise that resolves with the review details
	 * @throws {ApiError} if the request fails
	 */
	async getReview(
		workspaceId: string,
		reviewId: string,
	): Promise<WorkspaceReview> {
		const { data } = await this.#api.GET(
			"/workspaces/{workspaceId}/reviews/{reviewId}",
			{
				params: { path: { workspaceId, reviewId } },
			},
		);
		return data!;
	}

	/**
	 * Assign (or reassign) a review to a reviewer.
	 * @param workspaceId - Workspace id
	 * @param reviewId - Review ID
	 * @param assignment - Review assignment request (assignee)
	 * @returns Promise that resolves with the updated review
	 * @throws {ApiError} if the request fails
	 */
	async assignReview(
		workspaceId: string,
		reviewId: string,
		assignment: AssignWorkspaceReview,
	): Promise<WorkspaceReview> {
		const { data } = await this.#api.PUT(
			"/workspaces/{workspaceId}/reviews/{reviewId}/assign",
			{
				params: { path: { workspaceId, reviewId } },
				body: assignment,
			},
		);
		return data!;
	}

	/**
	 * Verify (resolve) a review.
	 * @param workspaceId - Workspace id
	 * @param reviewId - Review ID
	 * @returns Promise that resolves with the updated review
	 * @throws {ApiError} if the request fails
	 */
	async verifyReview(
		workspaceId: string,
		reviewId: string,
	): Promise<WorkspaceReview> {
		const { data } = await this.#api.POST(
			"/workspaces/{workspaceId}/reviews/{reviewId}/verify",
			{
				params: { path: { workspaceId, reviewId } },
			},
		);
		return data!;
	}

	/**
	 * Reopen a resolved review.
	 * @param workspaceId - Workspace id
	 * @param reviewId - Review ID
	 * @returns Promise that resolves with the updated review
	 * @throws {ApiError} if the request fails
	 */
	async reopenReview(
		workspaceId: string,
		reviewId: string,
	): Promise<WorkspaceReview> {
		const { data } = await this.#api.POST(
			"/workspaces/{workspaceId}/reviews/{reviewId}/reopen",
			{
				params: { path: { workspaceId, reviewId } },
			},
		);
		return data!;
	}

	/**
	 * Get a review's timeline: the events in its life.
	 * @param workspaceId - Workspace id
	 * @param reviewId - Review ID
	 * @param query - Optional pagination (limit, after)
	 * @returns Promise that resolves with a paginated list of review events
	 * @throws {ApiError} if the request fails
	 */
	async getTimeline(
		workspaceId: string,
		reviewId: string,
		query?: CursorPagination,
	): Promise<WorkspaceReviewEventPage> {
		const { data } = await this.#api.GET(
			"/workspaces/{workspaceId}/reviews/{reviewId}/timeline",
			{
				params: { path: { workspaceId, reviewId }, query },
			},
		);
		return data!;
	}

	/**
	 * Link a detection to a review (idempotent).
	 * @param workspaceId - Workspace id
	 * @param reviewId - Review ID
	 * @param detectionId - Detection ID
	 * @returns Promise that resolves with the updated review
	 * @throws {ApiError} if the request fails
	 */
	async linkDetection(
		workspaceId: string,
		reviewId: string,
		detectionId: string,
	): Promise<WorkspaceReview> {
		const { data } = await this.#api.POST(
			"/workspaces/{workspaceId}/reviews/{reviewId}/detections/{detectionId}",
			{
				params: { path: { workspaceId, reviewId, detectionId } },
			},
		);
		return data!;
	}

	/**
	 * Link a redaction to a review (idempotent).
	 * @param workspaceId - Workspace id
	 * @param reviewId - Review ID
	 * @param redactionId - Redaction ID
	 * @returns Promise that resolves with the updated review
	 * @throws {ApiError} if the request fails
	 */
	async linkRedaction(
		workspaceId: string,
		reviewId: string,
		redactionId: string,
	): Promise<WorkspaceReview> {
		const { data } = await this.#api.POST(
			"/workspaces/{workspaceId}/reviews/{reviewId}/redactions/{redactionId}",
			{
				params: { path: { workspaceId, reviewId, redactionId } },
			},
		);
		return data!;
	}
}
