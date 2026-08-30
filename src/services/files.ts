import type { ApiClient } from "@/client.js";
import type {
	CursorPagination,
	DeletedFiles,
	File,
	FilePage,
	ListFiles,
	UpdateFile,
} from "@/datatypes/index.js";

/**
 * Service for handling file operations
 */
export class Files {
	#api: ApiClient;

	constructor(api: ApiClient) {
		this.#api = api;
	}

	/**
	 * Upload one or more files to a workspace
	 * @param workspaceSlug - Workspace slug
	 * @param files - File or array of files to upload
	 * @returns Promise that resolves with the uploaded file metadata
	 * @throws {ApiError} if the request fails
	 */
	async uploadFiles(
		workspaceSlug: string,
		files: Blob | Blob[],
	): Promise<File[]> {
		const formData = new FormData();
		const fileArray = Array.isArray(files) ? files : [files];

		for (const file of fileArray) {
			const name = file instanceof File ? file.name : "file";
			formData.append("files", file, name);
		}

		const { data } = await this.#api.POST(
			"/workspaces/{workspaceSlug}/files/",
			{
				params: { path: { workspaceSlug } },
				// Schema types multipart as unknown[], but openapi-fetch needs FormData.
				body: formData as unknown as unknown[],
				bodySerializer: (formData) => formData,
				// Remove Content-Type so browser sets multipart/form-data with boundary.
				headers: { "Content-Type": null } as unknown as HeadersInit,
			},
		);

		return data!;
	}

	/**
	 * List files in a workspace
	 * @param workspaceSlug - Workspace slug
	 * @param query - Optional query parameters (formats, search, limit, after)
	 * @returns Promise that resolves with a paginated list of files
	 * @throws {ApiError} if the request fails
	 */
	async listFiles(
		workspaceSlug: string,
		query?: ListFiles & CursorPagination,
	): Promise<FilePage> {
		const { data } = await this.#api.GET("/workspaces/{workspaceSlug}/files/", {
			params: { path: { workspaceSlug }, query },
		});
		return data!;
	}

	/**
	 * Get file metadata by ID
	 * @param workspaceSlug - Workspace slug
	 * @param fileId - File ID
	 * @returns Promise that resolves with the file metadata
	 * @throws {ApiError} if the request fails
	 */
	async getFile(workspaceSlug: string, fileId: string): Promise<File> {
		const { data } = await this.#api.GET(
			"/workspaces/{workspaceSlug}/files/{fileId}/",
			{
				params: { path: { workspaceSlug, fileId } },
			},
		);
		return data!;
	}

	/**
	 * Download a file by ID
	 * @param workspaceSlug - Workspace slug
	 * @param fileId - File ID
	 * @returns Promise that resolves with the file response
	 * @throws {ApiError} if the request fails
	 */
	async downloadFile(workspaceSlug: string, fileId: string): Promise<Response> {
		const { response } = await this.#api.GET(
			"/workspaces/{workspaceSlug}/files/{fileId}/content/",
			{
				params: { path: { workspaceSlug, fileId } },
				parseAs: "stream",
			},
		);
		return response;
	}

	/**
	 * Update a file's metadata
	 * @param workspaceSlug - Workspace slug
	 * @param fileId - File ID
	 * @param updates - File update request
	 * @returns Promise that resolves with the updated file
	 * @throws {ApiError} if the request fails
	 */
	async updateFile(
		workspaceSlug: string,
		fileId: string,
		updates: UpdateFile,
	): Promise<File> {
		const { data } = await this.#api.PATCH(
			"/workspaces/{workspaceSlug}/files/{fileId}/",
			{
				params: { path: { workspaceSlug, fileId } },
				body: updates,
			},
		);
		return data!;
	}

	/**
	 * Delete a file
	 * @param workspaceSlug - Workspace slug
	 * @param fileId - File ID
	 * @returns Promise that resolves when the file is deleted
	 * @throws {ApiError} if the request fails
	 */
	async deleteFile(workspaceSlug: string, fileId: string): Promise<void> {
		await this.#api.DELETE("/workspaces/{workspaceSlug}/files/{fileId}/", {
			params: { path: { workspaceSlug, fileId } },
		});
	}

	/**
	 * Delete several files in one call.
	 *
	 * Idempotent: ids resolving to live files in the workspace are removed and
	 * returned in `deleted`; unknown, already-deleted, or out-of-workspace ids
	 * are returned in `skipped`. Deletion is permanent.
	 *
	 * @param workspaceSlug - Workspace slug
	 * @param fileIds - The file IDs to delete
	 * @returns Promise that resolves with the deleted and skipped ids
	 * @throws {ApiError} if the request fails
	 */
	async deleteFiles(
		workspaceSlug: string,
		fileIds: string[],
	): Promise<DeletedFiles> {
		const { data } = await this.#api.POST(
			"/workspaces/{workspaceSlug}/files/delete/",
			{
				params: { path: { workspaceSlug } },
				body: { fileIds },
			},
		);
		return data!;
	}
}
