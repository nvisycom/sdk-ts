import type { ApiClient } from "@/client.js";
import { unwrap } from "@/errors.js";
import type { Comment, CreateDocumentComment, UpdateDocumentComment, Pagination } from "@/datatypes/index.js";

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
   * @param projectId - Project ID
   * @param fileId - File ID
   * @param pagination - Pagination parameters
   * @returns Promise that resolves with the list of comments
   * @throws {ApiError} if the request fails
   */
  async list(projectId: string, fileId: string, pagination?: Pagination): Promise<Comment[]> {
    const result = await this.#api.GET("/projects/{project_id}/files/{file_id}/comments", {
      params: { path: { projectId, fileId } },
      body: pagination ?? {},
    });
    return unwrap(result);
  }

  /**
   * Create a new comment on a file
   * @param projectId - Project ID
   * @param fileId - File ID
   * @param comment - Comment creation request
   * @returns Promise that resolves with the created comment
   * @throws {ApiError} if the request fails
   */
  async create(projectId: string, fileId: string, comment: CreateDocumentComment): Promise<Comment> {
    const result = await this.#api.POST("/projects/{project_id}/files/{file_id}/comments", {
      params: { path: { projectId, fileId } },
      body: comment,
    });
    return unwrap(result);
  }

  /**
   * Update an existing comment
   * @param projectId - Project ID
   * @param fileId - File ID
   * @param commentId - Comment ID
   * @param updates - Comment update request
   * @returns Promise that resolves with the updated comment
   * @throws {ApiError} if the request fails
   */
  async update(projectId: string, fileId: string, commentId: string, updates: UpdateDocumentComment): Promise<Comment> {
    const result = await this.#api.PATCH("/projects/{project_id}/files/{file_id}/comments/{comment_id}", {
      params: { path: { projectId, fileId, commentId } },
      body: updates,
    });
    return unwrap(result);
  }

  /**
   * Delete a comment
   * @param projectId - Project ID
   * @param fileId - File ID
   * @param commentId - Comment ID
   * @returns Promise that resolves when the comment is deleted
   * @throws {ApiError} if the request fails
   */
  async delete(projectId: string, fileId: string, commentId: string): Promise<void> {
    const result = await this.#api.DELETE("/projects/{project_id}/files/{file_id}/comments/{comment_id}", {
      params: { path: { projectId, fileId, commentId } },
    });
    unwrap(result);
  }
}
