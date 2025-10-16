/**
 * Document status enumeration
 */
export type DocumentStatus = "uploaded" | "processing" | "completed" | "failed";

/**
 * Document interface representing a document in the system
 */
export interface Document {
	/** Unique document identifier */
	id: string;
	/** Document name */
	name: string;
	/** Current processing status */
	status: DocumentStatus;
	/** Timestamp when document was created */
	createdAt: string;
	/** Project ID this document belongs to */
	projectId: string;
}

/**
 * Document upload request interface
 */
export interface DocumentUploadRequest {
	/** Project ID to upload the document to */
	projectId: string;
	/** File to upload */
	file: File | Buffer;
}

/**
 * Document list query parameters
 */
export interface DocumentListParams {
	/** Project ID to filter by */
	projectId?: string;
	/** Status to filter by */
	status?: DocumentStatus;
	/** Maximum number of results to return */
	limit?: number;
	/** Offset for pagination */
	offset?: number;
}

/**
 * Document list response interface
 */
export interface DocumentListResponse {
	/** List of documents */
	documents: Document[];
	/** Total count of documents matching criteria */
	totalCount: number;
}
