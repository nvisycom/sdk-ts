import type { ApiClient } from "@/client.js";
import type {
	AssignWorkspaceReview,
	CursorPagination,
	ListWorkspaceDocuments,
	UpdateWorkspaceDocument,
	WorkspaceDeletedDocuments,
	WorkspaceDocument,
	WorkspaceDocumentPage,
	WorkspaceThread,
} from "@/datatypes/index.js";

/**
 * Service for handling document operations, including review assignment.
 */
export class Documents {
	#api: ApiClient;

	constructor(api: ApiClient) {
		this.#api = api;
	}

	/**
	 * Upload one or more documents to a workspace
	 * @param workspaceId - Workspace id
	 * @param documents - Document or array of documents to upload
	 * @returns Promise that resolves with the uploaded document metadata
	 * @throws {ApiError} if the request fails
	 */
	async uploadDocuments(
		workspaceId: string,
		documents: Blob | Blob[],
	): Promise<WorkspaceDocument[]> {
		const formData = new FormData();
		const documentArray = Array.isArray(documents) ? documents : [documents];

		for (const document of documentArray) {
			const name = document instanceof File ? document.name : "document";
			formData.append("documents", document, name);
		}

		const { data } = await this.#api.POST(
			"/workspaces/{workspaceId}/documents",
			{
				params: { path: { workspaceId } },
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
	 * List documents in a workspace
	 * @param workspaceId - Workspace id
	 * @param query - Optional query parameters (formats, modality, hash, search,
	 *   limit, after)
	 * @returns Promise that resolves with a paginated list of documents
	 * @throws {ApiError} if the request fails
	 */
	async listDocuments(
		workspaceId: string,
		query?: ListWorkspaceDocuments & CursorPagination,
	): Promise<WorkspaceDocumentPage> {
		const { data } = await this.#api.GET(
			"/workspaces/{workspaceId}/documents",
			{
				params: { path: { workspaceId }, query },
			},
		);
		return data!;
	}

	/**
	 * Get document metadata by ID
	 * @param workspaceId - Workspace id
	 * @param documentId - Document ID
	 * @returns Promise that resolves with the document metadata
	 * @throws {ApiError} if the request fails
	 */
	async getDocument(
		workspaceId: string,
		documentId: string,
	): Promise<WorkspaceDocument> {
		const { data } = await this.#api.GET(
			"/workspaces/{workspaceId}/documents/{documentId}",
			{
				params: { path: { workspaceId, documentId } },
			},
		);
		return data!;
	}

	/**
	 * Download a document by ID
	 * @param workspaceId - Workspace id
	 * @param documentId - Document ID
	 * @returns Promise that resolves with the document response
	 * @throws {ApiError} if the request fails
	 */
	async downloadDocument(
		workspaceId: string,
		documentId: string,
	): Promise<Response> {
		const { response } = await this.#api.GET(
			"/workspaces/{workspaceId}/documents/{documentId}/content",
			{
				params: { path: { workspaceId, documentId } },
				parseAs: "stream",
			},
		);
		return response;
	}

	/**
	 * Update a document's metadata
	 * @param workspaceId - Workspace id
	 * @param documentId - Document ID
	 * @param updates - Document update request
	 * @returns Promise that resolves with the updated document
	 * @throws {ApiError} if the request fails
	 */
	async updateDocument(
		workspaceId: string,
		documentId: string,
		updates: UpdateWorkspaceDocument,
	): Promise<WorkspaceDocument> {
		const { data } = await this.#api.PATCH(
			"/workspaces/{workspaceId}/documents/{documentId}",
			{
				params: { path: { workspaceId, documentId } },
				body: updates,
			},
		);
		return data!;
	}

	/**
	 * Delete a document
	 * @param workspaceId - Workspace id
	 * @param documentId - Document ID
	 * @returns Promise that resolves when the document is deleted
	 * @throws {ApiError} if the request fails
	 */
	async deleteDocument(workspaceId: string, documentId: string): Promise<void> {
		await this.#api.DELETE("/workspaces/{workspaceId}/documents/{documentId}", {
			params: { path: { workspaceId, documentId } },
		});
	}

	/**
	 * Delete several documents in one call.
	 *
	 * Idempotent: ids resolving to live documents in the workspace are removed
	 * and returned in `deleted`; unknown, already-deleted, or out-of-workspace
	 * ids are returned in `skipped`. Deletion is permanent.
	 *
	 * @param workspaceId - Workspace id
	 * @param documentIds - The document IDs to delete
	 * @returns Promise that resolves with the deleted and skipped ids
	 * @throws {ApiError} if the request fails
	 */
	async deleteDocuments(
		workspaceId: string,
		documentIds: string[],
	): Promise<WorkspaceDeletedDocuments> {
		const { data } = await this.#api.POST(
			"/workspaces/{workspaceId}/documents/delete",
			{
				params: { path: { workspaceId } },
				body: { documentIds },
			},
		);
		return data!;
	}

	/**
	 * Assign a document for review, opening a review thread.
	 * @param workspaceId - Workspace id
	 * @param documentId - Document ID
	 * @param assignment - Review assignment request
	 * @returns Promise that resolves with the review thread
	 * @throws {ApiError} if the request fails
	 */
	async assignReview(
		workspaceId: string,
		documentId: string,
		assignment: AssignWorkspaceReview,
	): Promise<WorkspaceThread> {
		const { data } = await this.#api.PUT(
			"/workspaces/{workspaceId}/documents/{documentId}/review/assign",
			{
				params: { path: { workspaceId, documentId } },
				body: assignment,
			},
		);
		return data!;
	}

	/**
	 * Mark a document's review as verified (resolved).
	 * @param workspaceId - Workspace id
	 * @param documentId - Document ID
	 * @returns Promise that resolves with the review thread
	 * @throws {ApiError} if the request fails
	 */
	async verifyReview(
		workspaceId: string,
		documentId: string,
	): Promise<WorkspaceThread> {
		const { data } = await this.#api.POST(
			"/workspaces/{workspaceId}/documents/{documentId}/review/verify",
			{
				params: { path: { workspaceId, documentId } },
			},
		);
		return data!;
	}
}
