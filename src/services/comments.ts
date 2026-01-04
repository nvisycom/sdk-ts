import type { ApiClient } from "@/client.js";
import type {
	Comment,
	CommentsPage,
	CreateComment,
	CursorPagination,
	UpdateComment,
} from "@/datatypes/index.js";

/**
 * Service for handling file comment operations
 */
export class Comments {
	#api: ApiClient;

	constructor(api: ApiClient) {
		this.#api = api;
	}

	/**
	 * List all comments on a file
	 * @param fileId - File ID
	 * @param query - Optional pagination parameters (limit, after)
	 * @returns Promise that resolves with a paginated list of comments
	 * @throws {ApiError} if the request fails
	 */
	async listComments(
		fileId: string,
		query?: CursorPagination,
	): Promise<CommentsPage> {
		const { data } = await this.#api.GET("/files/{fileId}/comments", {
			params: { path: { fileId }, query },
		});
		return data!;
	}

	/**
	 * Create a new comment on a file
	 * @param fileId - File ID
	 * @param comment - Comment creation request
	 * @returns Promise that resolves with the created comment
	 * @throws {ApiError} if the request fails
	 */
	async createComment(
		fileId: string,
		comment: CreateComment,
	): Promise<Comment> {
		const { data } = await this.#api.POST("/files/{fileId}/comments", {
			params: { path: { fileId } },
			body: comment,
		});
		return data!;
	}

	/**
	 * Update a comment
	 * @param commentId - Comment ID
	 * @param updates - Comment update request
	 * @returns Promise that resolves with the updated comment
	 * @throws {ApiError} if the request fails
	 */
	async updateComment(
		commentId: string,
		updates: UpdateComment,
	): Promise<Comment> {
		const { data } = await this.#api.PATCH("/comments/{commentId}", {
			params: { path: { commentId } },
			body: updates,
		});
		return data!;
	}

	/**
	 * Delete a comment
	 * @param commentId - Comment ID
	 * @returns Promise that resolves when the comment is deleted
	 * @throws {ApiError} if the request fails
	 */
	async deleteComment(commentId: string): Promise<void> {
		await this.#api.DELETE("/comments/{commentId}", {
			params: { path: { commentId } },
		});
	}
}
