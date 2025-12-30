import type { ApiClient } from "@/client.js";
import type {
	DownloadArchivedFilesRequest,
	DownloadMultipleFilesRequest,
	File,
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
	 * Download a file by ID
	 * @param projectId - Project ID
	 * @param fileId - File ID
	 * @returns Promise that resolves with the file response
	 * @throws {ApiError} if the request fails
	 */
	async download(projectId: string, fileId: string): Promise<Response> {
		const { response } = await this.#api.GET(
			"/projects/{project_id}/files/{file_id}",
			{
				params: { path: { projectId, fileId } },
				parseAs: "stream",
			},
		);
		return response;
	}

	/**
	 * Update a file's metadata
	 * @param projectId - Project ID
	 * @param fileId - File ID
	 * @param updates - File update request
	 * @returns Promise that resolves with the updated file
	 * @throws {ApiError} if the request fails
	 */
	async update(
		projectId: string,
		fileId: string,
		updates: UpdateFile,
	): Promise<File> {
		const { data } = await this.#api.PATCH(
			"/projects/{project_id}/files/{file_id}",
			{
				params: { path: { projectId, fileId, version: "v1" } },
				body: updates,
			},
		);
		return data!;
	}

	/**
	 * Delete a file
	 * @param projectId - Project ID
	 * @param fileId - File ID
	 * @returns Promise that resolves when the file is deleted
	 * @throws {ApiError} if the request fails
	 */
	async delete(projectId: string, fileId: string): Promise<void> {
		await this.#api.DELETE("/projects/{project_id}/files/{file_id}", {
			params: { path: { projectId, fileId, version: "v1" } },
		});
	}

	/**
	 * Download multiple files
	 * @param projectId - Project ID
	 * @param request - Download request with file IDs
	 * @returns Promise that resolves with the download response
	 * @throws {ApiError} if the request fails
	 */
	async downloadMultiple(
		projectId: string,
		request: DownloadMultipleFilesRequest,
	): Promise<Response> {
		const { response } = await this.#api.POST(
			"/projects/{project_id}/files/download",
			{
				params: { path: { projectId } },
				body: request,
				parseAs: "stream",
			},
		);
		return response;
	}

	/**
	 * Download files as an archive
	 * @param projectId - Project ID
	 * @param request - Archive download request
	 * @returns Promise that resolves with the archive response
	 * @throws {ApiError} if the request fails
	 */
	async downloadArchive(
		projectId: string,
		request: DownloadArchivedFilesRequest,
	): Promise<Response> {
		const { response } = await this.#api.POST(
			"/projects/{project_id}/files/archive",
			{
				params: { path: { projectId } },
				body: request,
				parseAs: "stream",
			},
		);
		return response;
	}
}
