import type { ApiClient } from "@/client.js";
import type {
	CreateDocument,
	CursorPagination,
	Document,
	DocumentsPage,
	UpdateDocument,
} from "@/datatypes/index.js";

/**
 * Service for handling document operations
 */
export class Documents {
	#api: ApiClient;

	constructor(api: ApiClient) {
		this.#api = api;
	}

	/**
	 * List documents in a workspace
	 * @param workspaceId - Workspace ID
	 * @param query - Optional pagination parameters (limit, after)
	 * @returns Promise that resolves with a paginated list of documents
	 * @throws {ApiError} if the request fails
	 */
	async listDocuments(
		workspaceId: string,
		query?: CursorPagination,
	): Promise<DocumentsPage> {
		const { data } = await this.#api.GET(
			"/workspaces/{workspaceId}/documents",
			{
				params: { path: { workspaceId }, query },
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
	async getDocument(documentId: string): Promise<Document> {
		const { data } = await this.#api.GET("/documents/{documentId}", {
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
	async createDocument(
		workspaceId: string,
		document: CreateDocument,
	): Promise<Document> {
		const { data } = await this.#api.POST(
			"/workspaces/{workspaceId}/documents",
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
	async updateDocument(
		documentId: string,
		updates: UpdateDocument,
	): Promise<Document> {
		const { data } = await this.#api.PATCH("/documents/{documentId}", {
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
	async deleteDocument(documentId: string): Promise<void> {
		await this.#api.DELETE("/documents/{documentId}", {
			params: { path: { documentId } },
		});
	}
}
