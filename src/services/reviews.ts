import type { ApiClient } from "@/client.js";
import type {
	ApproveWorkspaceReview,
	CreateWorkspaceComment,
	CreateWorkspaceReview,
	CursorPagination,
	RenameWorkspaceReview,
	UpdateWorkspaceComment,
	WorkspaceComment,
	WorkspaceReview,
	WorkspaceReviewEntryPage,
	WorkspaceReviewEventPage,
	WorkspaceReviewPage,
	WorkspaceReviewsQuery,
} from "@/datatypes/index.js";

/**
 * Service for document reviews: opening a review on a document and driving it
 * through its approval lifecycle (submit, request changes, approve, reopen)
 * with assignees, comments, and a timeline of events.
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
	 * Rename a review (update its title / purpose).
	 * @param workspaceId - Workspace id
	 * @param reviewId - Review ID
	 * @param updates - The review rename request
	 * @returns Promise that resolves with the updated review
	 * @throws {ApiError} if the request fails
	 */
	async updateReview(
		workspaceId: string,
		reviewId: string,
		updates: RenameWorkspaceReview,
	): Promise<WorkspaceReview> {
		const { data } = await this.#api.PATCH(
			"/workspaces/{workspaceId}/reviews/{reviewId}",
			{
				params: { path: { workspaceId, reviewId } },
				body: updates,
			},
		);
		return data!;
	}

	/**
	 * Delete a review.
	 * @param workspaceId - Workspace id
	 * @param reviewId - Review ID
	 * @returns Promise that resolves when the review is deleted
	 * @throws {ApiError} if the request fails
	 */
	async deleteReview(workspaceId: string, reviewId: string): Promise<void> {
		await this.#api.DELETE("/workspaces/{workspaceId}/reviews/{reviewId}", {
			params: { path: { workspaceId, reviewId } },
		});
	}

	/**
	 * Assign a reviewer to a review (idempotent).
	 * @param workspaceId - Workspace id
	 * @param reviewId - Review ID
	 * @param accountId - Account id of the reviewer to assign
	 * @returns Promise that resolves with the updated review
	 * @throws {ApiError} if the request fails
	 */
	async assignReviewer(
		workspaceId: string,
		reviewId: string,
		accountId: string,
	): Promise<WorkspaceReview> {
		const { data } = await this.#api.POST(
			"/workspaces/{workspaceId}/reviews/{reviewId}/assignees/{accountId}",
			{
				params: { path: { workspaceId, reviewId, accountId } },
			},
		);
		return data!;
	}

	/**
	 * Remove a reviewer from a review.
	 * @param workspaceId - Workspace id
	 * @param reviewId - Review ID
	 * @param accountId - Account id of the reviewer to remove
	 * @returns Promise that resolves with the updated review
	 * @throws {ApiError} if the request fails
	 */
	async unassignReviewer(
		workspaceId: string,
		reviewId: string,
		accountId: string,
	): Promise<WorkspaceReview> {
		const { data } = await this.#api.DELETE(
			"/workspaces/{workspaceId}/reviews/{reviewId}/assignees/{accountId}",
			{
				params: { path: { workspaceId, reviewId, accountId } },
			},
		);
		return data!;
	}

	/**
	 * Submit (or resubmit) a review for review, moving it to `in_review`.
	 * @param workspaceId - Workspace id
	 * @param reviewId - Review ID
	 * @returns Promise that resolves with the updated review
	 * @throws {ApiError} if the request fails
	 */
	async submitReview(
		workspaceId: string,
		reviewId: string,
	): Promise<WorkspaceReview> {
		const { data } = await this.#api.POST(
			"/workspaces/{workspaceId}/reviews/{reviewId}/submit",
			{
				params: { path: { workspaceId, reviewId } },
			},
		);
		return data!;
	}

	/**
	 * Request changes on a review, moving it to `changes_requested`.
	 * @param workspaceId - Workspace id
	 * @param reviewId - Review ID
	 * @returns Promise that resolves with the updated review
	 * @throws {ApiError} if the request fails
	 */
	async requestChanges(
		workspaceId: string,
		reviewId: string,
	): Promise<WorkspaceReview> {
		const { data } = await this.#api.POST(
			"/workspaces/{workspaceId}/reviews/{reviewId}/request-changes",
			{
				params: { path: { workspaceId, reviewId } },
			},
		);
		return data!;
	}

	/**
	 * Approve a review, optionally recording the approved redaction as its
	 * output. Reaches `approved` once the workspace's required number of
	 * distinct approvals is met.
	 * @param workspaceId - Workspace id
	 * @param reviewId - Review ID
	 * @param approval - Approval request (optional approved `redactionId`)
	 * @returns Promise that resolves with the updated review
	 * @throws {ApiError} if the request fails
	 */
	async approveReview(
		workspaceId: string,
		reviewId: string,
		approval: ApproveWorkspaceReview = {},
	): Promise<WorkspaceReview> {
		const { data } = await this.#api.POST(
			"/workspaces/{workspaceId}/reviews/{reviewId}/approve",
			{
				params: { path: { workspaceId, reviewId } },
				body: approval,
			},
		);
		return data!;
	}

	/**
	 * Reopen an approved review, returning it to `in_review`.
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
	 * Get a review's timeline: comments interleaved with lifecycle events.
	 * @param workspaceId - Workspace id
	 * @param reviewId - Review ID
	 * @param query - Optional pagination (limit, after)
	 * @returns Promise that resolves with a paginated list of timeline entries
	 * @throws {ApiError} if the request fails
	 */
	async getTimeline(
		workspaceId: string,
		reviewId: string,
		query?: CursorPagination,
	): Promise<WorkspaceReviewEntryPage> {
		const { data } = await this.#api.GET(
			"/workspaces/{workspaceId}/reviews/{reviewId}/timeline",
			{
				params: { path: { workspaceId, reviewId }, query },
			},
		);
		return data!;
	}

	/**
	 * Get a review's lifecycle events (assignments, status changes, etc.).
	 * @param workspaceId - Workspace id
	 * @param reviewId - Review ID
	 * @param query - Optional pagination (limit, after)
	 * @returns Promise that resolves with a paginated list of review events
	 * @throws {ApiError} if the request fails
	 */
	async getEvents(
		workspaceId: string,
		reviewId: string,
		query?: CursorPagination,
	): Promise<WorkspaceReviewEventPage> {
		const { data } = await this.#api.GET(
			"/workspaces/{workspaceId}/reviews/{reviewId}/events",
			{
				params: { path: { workspaceId, reviewId }, query },
			},
		);
		return data!;
	}

	/**
	 * Add a comment to a review.
	 * @param workspaceId - Workspace id
	 * @param reviewId - Review ID
	 * @param comment - The comment to add
	 * @returns Promise that resolves with the created comment
	 * @throws {ApiError} if the request fails
	 */
	async addComment(
		workspaceId: string,
		reviewId: string,
		comment: CreateWorkspaceComment,
	): Promise<WorkspaceComment> {
		const { data } = await this.#api.POST(
			"/workspaces/{workspaceId}/reviews/{reviewId}/comments",
			{
				params: { path: { workspaceId, reviewId } },
				body: comment,
			},
		);
		return data!;
	}

	/**
	 * Edit a comment.
	 * @param workspaceId - Workspace id
	 * @param commentId - Comment ID
	 * @param updates - The comment update
	 * @returns Promise that resolves with the updated comment
	 * @throws {ApiError} if the request fails
	 */
	async updateComment(
		workspaceId: string,
		commentId: string,
		updates: UpdateWorkspaceComment,
	): Promise<WorkspaceComment> {
		const { data } = await this.#api.PATCH(
			"/workspaces/{workspaceId}/comments/{commentId}",
			{
				params: { path: { workspaceId, commentId } },
				body: updates,
			},
		);
		return data!;
	}

	/**
	 * Delete a comment.
	 * @param workspaceId - Workspace id
	 * @param commentId - Comment ID
	 * @returns Promise that resolves when the comment is deleted
	 * @throws {ApiError} if the request fails
	 */
	async deleteComment(workspaceId: string, commentId: string): Promise<void> {
		await this.#api.DELETE("/workspaces/{workspaceId}/comments/{commentId}", {
			params: { path: { workspaceId, commentId } },
		});
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
}
