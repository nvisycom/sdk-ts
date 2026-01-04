import type { ApiClient } from "@/client.js";
import type {
	CursorPagination,
	DeleteFiles,
	DownloadFiles,
	File,
	FilesPage,
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
	 * @param workspaceId - Workspace ID
	 * @param files - File or array of files to upload
	 * @returns Promise that resolves with the uploaded file metadata
	 * @throws {ApiError} if the request fails
	 */
	async uploadFiles(
		workspaceId: string,
		files: Blob | Blob[],
	): Promise<File[]> {
		const formData = new FormData();
		const fileArray = Array.isArray(files) ? files : [files];

		for (const file of fileArray) {
			const name = file instanceof File ? file.name : "file";
			formData.append("files", file, name);
		}

		const { data } = await this.#api.POST("/workspaces/{workspaceId}/files/", {
			params: { path: { workspaceId } },
			// Schema types multipart as unknown[], but openapi-fetch needs FormData.
			body: formData as unknown as unknown[],
			bodySerializer: (formData) => formData,
			// Remove Content-Type so browser sets multipart/form-data with boundary.
			headers: { "Content-Type": null } as unknown as HeadersInit,
		});

		return data!;
	}

	/**
	 * List files in a workspace
	 * @param workspaceId - Workspace ID
	 * @param query - Optional query parameters (formats, limit, after)
	 * @returns Promise that resolves with a paginated list of files
	 * @throws {ApiError} if the request fails
	 */
	async listFiles(
		workspaceId: string,
		query?: ListFiles & CursorPagination,
	): Promise<FilesPage> {
		const { data } = await this.#api.GET("/workspaces/{workspaceId}/files/", {
			params: { path: { workspaceId }, query },
		});
		return data!;
	}

	/**
	 * Download a file by ID
	 * @param fileId - File ID
	 * @returns Promise that resolves with the file response
	 * @throws {ApiError} if the request fails
	 */
	async downloadFile(fileId: string): Promise<Response> {
		const { response } = await this.#api.GET("/files/{fileId}", {
			params: { path: { fileId } },
			parseAs: "stream",
		});
		return response;
	}

	/**
	 * Update a file's metadata
	 * @param fileId - File ID
	 * @param updates - File update request
	 * @returns Promise that resolves with the updated file
	 * @throws {ApiError} if the request fails
	 */
	async updateFile(fileId: string, updates: UpdateFile): Promise<File> {
		const { data } = await this.#api.PATCH("/files/{fileId}", {
			params: { path: { fileId } },
			body: updates,
		});
		return data!;
	}

	/**
	 * Delete a file
	 * @param fileId - File ID
	 * @returns Promise that resolves when the file is deleted
	 * @throws {ApiError} if the request fails
	 */
	async deleteFile(fileId: string): Promise<void> {
		await this.#api.DELETE("/files/{fileId}", {
			params: { path: { fileId } },
		});
	}

	/**
	 * Download files as an archive
	 * @param workspaceId - Workspace ID
	 * @param request - Download request with format and optional file IDs
	 * @returns Promise that resolves with the archive response
	 * @throws {ApiError} if the request fails
	 */
	async downloadFiles(
		workspaceId: string,
		request: DownloadFiles,
	): Promise<Response> {
		const { response } = await this.#api.GET(
			"/workspaces/{workspaceId}/files/batch",
			{
				params: { path: { workspaceId } },
				body: request,
				parseAs: "stream",
			},
		);
		return response;
	}

	/**
	 * Delete multiple files
	 * @param workspaceId - Workspace ID
	 * @param request - Delete request with file IDs
	 * @returns Promise that resolves when the files are deleted
	 * @throws {ApiError} if the request fails
	 */
	async deleteFiles(workspaceId: string, request: DeleteFiles): Promise<void> {
		await this.#api.DELETE("/workspaces/{workspaceId}/files/batch", {
			params: { path: { workspaceId } },
			body: request,
		});
	}
}
