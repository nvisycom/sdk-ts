import type { ApiClient } from "@/client.js";
import type { Comment, CreateComment, Pagination } from "@/datatypes/index.js";

/**
 * Service for handling file comment operations
 */
export class CommentsService {
	#api: ApiClient;

	constructor(api: ApiClient) {
		this.#api = api;
	}

	/**
	 * List all comments on a file
	 * @param fileId - File ID
	 * @param pagination - Pagination parameters
	 * @returns Promise that resolves with the list of comments
	 * @throws {ApiError} if the request fails
	 */
	async list(fileId: string, pagination?: Pagination): Promise<Comment[]> {
		const { data } = await this.#api.GET("/files/{file_id}/comments", {
			params: { path: { fileId } },
			body: pagination ?? {},
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
	async create(fileId: string, comment: CreateComment): Promise<Comment> {
		const { data } = await this.#api.POST("/files/{file_id}/comments", {
			params: { path: { fileId } },
			body: comment,
		});
		return data!;
	}

	/**
	 * Delete a comment
	 * @param fileId - File ID
	 * @param commentId - Comment ID
	 * @returns Promise that resolves when the comment is deleted
	 * @throws {ApiError} if the request fails
	 */
	async delete(fileId: string, commentId: string): Promise<void> {
		await this.#api.DELETE("/files/{file_id}/comments/{comment_id}", {
			params: { path: { fileId, commentId } },
		});
	}
}
