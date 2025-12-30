import type { ApiClient } from "@/client.js";
import type {
	CreateDocument,
	Document,
	Pagination,
	UpdateDocument,
} from "@/datatypes/index.js";

/**
 * Service for handling document operations
 */
export class DocumentsService {
	#api: ApiClient;

	constructor(api: ApiClient) {
		this.#api = api;
	}

	/**
	 * List documents in a workspace
	 * @param workspaceId - Workspace ID
	 * @param pagination - Pagination parameters
	 * @returns Promise that resolves with the list of documents
	 * @throws {ApiError} if the request fails
	 */
	async list(
		workspaceId: string,
		pagination?: Pagination,
	): Promise<Document[]> {
		const { data } = await this.#api.GET(
			"/workspaces/{workspace_id}/documents",
			{
				params: { path: { workspaceId } },
				body: pagination ?? {},
			},
		);
		return data!;
	}

	/**
	 * Get document details by ID
	 * @param documentId - Document ID
	 * @returns Promise that resolves with the document details
	 * @throws {ApiError} if the request fails
	 */
	async get(documentId: string): Promise<Document> {
		const { data } = await this.#api.GET("/documents/{document_id}", {
			params: { path: { documentId } },
		});
		return data!;
	}

	/**
	 * Create a new document
	 * @param workspaceId - Workspace ID
	 * @param document - Document creation request
	 * @returns Promise that resolves with the created document
	 * @throws {ApiError} if the request fails
	 */
	async create(
		workspaceId: string,
		document: CreateDocument,
	): Promise<Document> {
		const { data } = await this.#api.POST(
			"/workspaces/{workspace_id}/documents",
			{
				params: { path: { workspaceId } },
				body: document,
			},
		);
		return data!;
	}

	/**
	 * Update an existing document
	 * @param documentId - Document ID
	 * @param updates - Document update request
	 * @returns Promise that resolves with the updated document
	 * @throws {ApiError} if the request fails
	 */
	async update(documentId: string, updates: UpdateDocument): Promise<Document> {
		const { data } = await this.#api.PATCH("/documents/{document_id}", {
			params: { path: { documentId } },
			body: updates,
		});
		return data!;
	}

	/**
	 * Delete a document
	 * @param documentId - Document ID
	 * @returns Promise that resolves when the document is deleted
	 * @throws {ApiError} if the request fails
	 */
	async delete(documentId: string): Promise<void> {
		await this.#api.DELETE("/documents/{document_id}", {
			params: { path: { documentId } },
		});
	}
}
