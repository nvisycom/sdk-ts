import type { ApiClient } from "@/client.js";
import type {
	DownloadArchivedFilesRequest,
	DownloadMultipleFilesRequest,
	File,
	ListFilesQuery,
	Pagination,
	UpdateFile,
} from "@/datatypes/index.js";

/**
 * Service for handling file operations
 */
export class FilesService {
	#api: ApiClient;

	constructor(api: ApiClient) {
		this.#api = api;
	}

	/**
	 * List files in a workspace
	 * @param workspaceId - Workspace ID
	 * @param query - Optional query parameters (formats, sortBy, order, offset, limit)
	 * @returns Promise that resolves with the list of files
	 * @throws {ApiError} if the request fails
	 */
	async list(
		workspaceId: string,
		query?: ListFilesQuery & Pagination,
	): Promise<File[]> {
		const { data } = await this.#api.GET("/workspaces/{workspace_id}/files/", {
			params: { path: { workspace_id: workspaceId }, query },
		});
		return data!;
	}

	/**
	 * Download a file by ID
	 * @param fileId - File ID
	 * @returns Promise that resolves with the file response
	 * @throws {ApiError} if the request fails
	 */
	async download(fileId: string): Promise<Response> {
		const { response } = await this.#api.GET("/files/{file_id}", {
			params: { path: { file_id: fileId } },
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
	async update(fileId: string, updates: UpdateFile): Promise<File> {
		const { data } = await this.#api.PATCH("/files/{file_id}", {
			params: { path: { file_id: fileId } },
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
	async delete(fileId: string): Promise<void> {
		await this.#api.DELETE("/files/{file_id}", {
			params: { path: { file_id: fileId } },
		});
	}

	/**
	 * Download multiple files
	 * @param workspaceId - Workspace ID
	 * @param request - Download request with file IDs
	 * @returns Promise that resolves with the download response
	 * @throws {ApiError} if the request fails
	 */
	async downloadMultiple(
		workspaceId: string,
		request: DownloadMultipleFilesRequest,
	): Promise<Response> {
		const { response } = await this.#api.POST(
			"/workspaces/{workspace_id}/files/download",
			{
				params: { path: { workspace_id: workspaceId } },
				body: request,
				parseAs: "stream",
			},
		);
		return response;
	}

	/**
	 * Download files as an archive
	 * @param workspaceId - Workspace ID
	 * @param request - Archive download request
	 * @returns Promise that resolves with the archive response
	 * @throws {ApiError} if the request fails
	 */
	async downloadArchive(
		workspaceId: string,
		request: DownloadArchivedFilesRequest,
	): Promise<Response> {
		const { response } = await this.#api.POST(
			"/workspaces/{workspace_id}/files/archive",
			{
				params: { path: { workspace_id: workspaceId } },
				body: request,
				parseAs: "stream",
			},
		);
		return response;
	}
}
