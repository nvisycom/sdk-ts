import type { ApiClient } from "@/client.js";
import { unwrap } from "@/errors.js";
import type { Document, CreateDocument, UpdateDocument, Pagination } from "@/datatypes/index.js";

/**
 * Service for handling document operations
 */
export class DocumentsService {
  #api: ApiClient;

  constructor(api: ApiClient) {
    this.#api = api;
  }

  /**
   * List documents in a project
   * @param projectId - Project ID
   * @param pagination - Pagination parameters
   * @returns Promise that resolves with the list of documents
   * @throws {ApiError} if the request fails
   */
  async list(projectId: string, pagination?: Pagination): Promise<Document[]> {
    const result = await this.#api.GET("/projects/{project_id}/documents", {
      params: { path: { projectId } },
      body: pagination ?? {},
    });
    return unwrap(result);
  }

  /**
   * Get document details by ID
   * @param documentId - Document ID
   * @returns Promise that resolves with the document details
   * @throws {ApiError} if the request fails
   */
  async get(documentId: string): Promise<Document> {
    const result = await this.#api.GET("/documents/{document_id}", {
      params: { path: { documentId } },
    });
    return unwrap(result);
  }

  /**
   * Create a new document
   * @param projectId - Project ID
   * @param document - Document creation request
   * @returns Promise that resolves with the created document
   * @throws {ApiError} if the request fails
   */
  async create(projectId: string, document: CreateDocument): Promise<Document> {
    const result = await this.#api.POST("/projects/{project_id}/documents", {
      params: { path: { projectId } },
      body: document,
    });
    return unwrap(result);
  }

  /**
   * Update an existing document
   * @param documentId - Document ID
   * @param updates - Document update request
   * @returns Promise that resolves with the updated document
   * @throws {ApiError} if the request fails
   */
  async update(documentId: string, updates: UpdateDocument): Promise<Document> {
    const result = await this.#api.PATCH("/documents/{document_id}", {
      params: { path: { documentId } },
      body: updates,
    });
    return unwrap(result);
  }

  /**
   * Delete a document
   * @param documentId - Document ID
   * @returns Promise that resolves when the document is deleted
   * @throws {ApiError} if the request fails
   */
  async delete(documentId: string): Promise<void> {
    const result = await this.#api.DELETE("/documents/{document_id}", {
      params: { path: { documentId } },
    });
    unwrap(result);
  }
}
