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
	 * @param workspaceSlug - Workspace slug
	 * @param documents - Document or array of documents to upload
	 * @returns Promise that resolves with the uploaded document metadata
	 * @throws {ApiError} if the request fails
	 */
	async uploadDocuments(
		workspaceSlug: string,
		documents: Blob | Blob[],
	): Promise<WorkspaceDocument[]> {
		const formData = new FormData();
		const documentArray = Array.isArray(documents) ? documents : [documents];

		for (const document of documentArray) {
			const name = document instanceof File ? document.name : "document";
			formData.append("documents", document, name);
		}

		const { data } = await this.#api.POST(
			"/workspaces/{workspaceSlug}/documents/",
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
	 * List documents in a workspace
	 * @param workspaceSlug - Workspace slug
	 * @param query - Optional query parameters (formats, modality, hash, search,
	 *   limit, after)
	 * @returns Promise that resolves with a paginated list of documents
	 * @throws {ApiError} if the request fails
	 */
	async listDocuments(
		workspaceSlug: string,
		query?: ListWorkspaceDocuments & CursorPagination,
	): Promise<WorkspaceDocumentPage> {
		const { data } = await this.#api.GET(
			"/workspaces/{workspaceSlug}/documents/",
			{
				params: { path: { workspaceSlug }, query },
			},
		);
		return data!;
	}

	/**
	 * Get document metadata by ID
	 * @param workspaceSlug - Workspace slug
	 * @param documentId - Document ID
	 * @returns Promise that resolves with the document metadata
	 * @throws {ApiError} if the request fails
	 */
	async getDocument(
		workspaceSlug: string,
		documentId: string,
	): Promise<WorkspaceDocument> {
		const { data } = await this.#api.GET(
			"/workspaces/{workspaceSlug}/documents/{documentId}/",
			{
				params: { path: { workspaceSlug, documentId } },
			},
		);
		return data!;
	}

	/**
	 * Download a document by ID
	 * @param workspaceSlug - Workspace slug
	 * @param documentId - Document ID
	 * @returns Promise that resolves with the document response
	 * @throws {ApiError} if the request fails
	 */
	async downloadDocument(
		workspaceSlug: string,
		documentId: string,
	): Promise<Response> {
		const { response } = await this.#api.GET(
			"/workspaces/{workspaceSlug}/documents/{documentId}/content/",
			{
				params: { path: { workspaceSlug, documentId } },
				parseAs: "stream",
			},
		);
		return response;
	}

	/**
	 * Update a document's metadata
	 * @param workspaceSlug - Workspace slug
	 * @param documentId - Document ID
	 * @param updates - Document update request
	 * @returns Promise that resolves with the updated document
	 * @throws {ApiError} if the request fails
	 */
	async updateDocument(
		workspaceSlug: string,
		documentId: string,
		updates: UpdateWorkspaceDocument,
	): Promise<WorkspaceDocument> {
		const { data } = await this.#api.PATCH(
			"/workspaces/{workspaceSlug}/documents/{documentId}/",
			{
				params: { path: { workspaceSlug, documentId } },
				body: updates,
			},
		);
		return data!;
	}

	/**
	 * Delete a document
	 * @param workspaceSlug - Workspace slug
	 * @param documentId - Document ID
	 * @returns Promise that resolves when the document is deleted
	 * @throws {ApiError} if the request fails
	 */
	async deleteDocument(
		workspaceSlug: string,
		documentId: string,
	): Promise<void> {
		await this.#api.DELETE(
			"/workspaces/{workspaceSlug}/documents/{documentId}/",
			{
				params: { path: { workspaceSlug, documentId } },
			},
		);
	}

	/**
	 * Delete several documents in one call.
	 *
	 * Idempotent: ids resolving to live documents in the workspace are removed
	 * and returned in `deleted`; unknown, already-deleted, or out-of-workspace
	 * ids are returned in `skipped`. Deletion is permanent.
	 *
	 * @param workspaceSlug - Workspace slug
	 * @param documentIds - The document IDs to delete
	 * @returns Promise that resolves with the deleted and skipped ids
	 * @throws {ApiError} if the request fails
	 */
	async deleteDocuments(
		workspaceSlug: string,
		documentIds: string[],
	): Promise<WorkspaceDeletedDocuments> {
		const { data } = await this.#api.POST(
			"/workspaces/{workspaceSlug}/documents/delete/",
			{
				params: { path: { workspaceSlug } },
				body: { documentIds },
			},
		);
		return data!;
	}

	/**
	 * Assign a document for review, opening a review thread.
	 * @param workspaceSlug - Workspace slug
	 * @param documentId - Document ID
	 * @param assignment - Review assignment request
	 * @returns Promise that resolves with the review thread
	 * @throws {ApiError} if the request fails
	 */
	async assignReview(
		workspaceSlug: string,
		documentId: string,
		assignment: AssignWorkspaceReview,
	): Promise<WorkspaceThread> {
		const { data } = await this.#api.PUT(
			"/workspaces/{workspaceSlug}/documents/{documentId}/review/assign/",
			{
				params: { path: { workspaceSlug, documentId } },
				body: assignment,
			},
		);
		return data!;
	}

	/**
	 * Mark a document's review as verified (resolved).
	 * @param workspaceSlug - Workspace slug
	 * @param documentId - Document ID
	 * @returns Promise that resolves with the review thread
	 * @throws {ApiError} if the request fails
	 */
	async verifyReview(
		workspaceSlug: string,
		documentId: string,
	): Promise<WorkspaceThread> {
		const { data } = await this.#api.POST(
			"/workspaces/{workspaceSlug}/documents/{documentId}/review/verify/",
			{
				params: { path: { workspaceSlug, documentId } },
			},
		);
		return data!;
	}
}
