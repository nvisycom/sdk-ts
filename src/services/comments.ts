import type { ApiClient } from "@/client.js";
import type {
	Comment,
	CreateComment,
	Pagination,
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
	 * @param query - Optional query parameters (offset, limit)
	 * @returns Promise that resolves with the list of comments
	 * @throws {ApiError} if the request fails
	 */
	async listComments(fileId: string, query?: Pagination): Promise<Comment[]> {
		const { data } = await this.#api.GET("/files/{file_id}/comments", {
			params: { path: { file_id: fileId }, query },
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
		const { data } = await this.#api.POST("/files/{file_id}/comments", {
			params: { path: { file_id: fileId } },
			body: comment,
		});
		return data!;
	}

	/**
	 * Update a comment
	 * @param fileId - File ID
	 * @param commentId - Comment ID
	 * @param updates - Comment update request
	 * @returns Promise that resolves with the updated comment
	 * @throws {ApiError} if the request fails
	 */
	async updateComment(
		fileId: string,
		commentId: string,
		updates: UpdateComment,
	): Promise<Comment> {
		const { data } = await this.#api.PATCH(
			"/files/{file_id}/comments/{comment_id}",
			{
				params: { path: { file_id: fileId, comment_id: commentId } },
				body: updates,
			},
		);
		return data!;
	}

	/**
	 * Delete a comment
	 * @param fileId - File ID
	 * @param commentId - Comment ID
	 * @returns Promise that resolves when the comment is deleted
	 * @throws {ApiError} if the request fails
	 */
	async deleteComment(fileId: string, commentId: string): Promise<void> {
		await this.#api.DELETE("/files/{file_id}/comments/{comment_id}", {
			params: { path: { file_id: fileId, comment_id: commentId } },
		});
	}
}
