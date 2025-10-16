import type { Client } from "@/client.js";
import type {
	Document,
	DocumentListParams,
	DocumentListResponse,
	DocumentUploadRequest,
} from "@/datatypes/document.js";

/**
 * Service for handling document operations
 */
export class DocumentsService {
	#client: Client;

	constructor(client: Client) {
		this.#client = client;
	}

	/**
	 * Get the underlying client instance
	 * @internal
	 */
	get client(): Client {
		return this.#client;
	}

	/**
	 * Upload a new document
	 * @param request - Document upload request
	 * @returns Promise that resolves with the created document
	 */
	async upload(_request: DocumentUploadRequest): Promise<Document> {
		throw new Error("Not implemented");
	}

	/**
	 * Get document details by ID
	 * @param documentId - Document ID
	 * @returns Promise that resolves with the document details
	 */
	async get(_documentId: string): Promise<Document> {
		throw new Error("Not implemented");
	}

	/**
	 * List documents with optional filtering
	 * @param params - Query parameters for filtering and pagination
	 * @returns Promise that resolves with the document list
	 */
	async list(_params?: DocumentListParams): Promise<DocumentListResponse> {
		throw new Error("Not implemented");
	}

	/**
	 * Delete a document
	 * @param documentId - Document ID
	 * @returns Promise that resolves when the document is deleted
	 */
	async delete(_documentId: string): Promise<void> {
		throw new Error("Not implemented");
	}

	/**
	 * Download document content
	 * @param documentId - Document ID
	 * @returns Promise that resolves with the document blob
	 */
	async download(_documentId: string): Promise<Blob> {
		throw new Error("Not implemented");
	}
}
