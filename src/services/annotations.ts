import type { ApiClient } from "@/client.js";
import type {
	Annotation,
	AnnotationsPage,
	CreateAnnotation,
	CursorPagination,
	UpdateAnnotation,
} from "@/datatypes/index.js";

/**
 * Service for handling file annotation operations
 */
export class Annotations {
	#api: ApiClient;

	constructor(api: ApiClient) {
		this.#api = api;
	}

	/**
	 * List annotations for a file
	 * @param fileId - File ID
	 * @param query - Optional pagination parameters (limit, after)
	 * @returns Promise that resolves with a paginated list of annotations
	 * @throws {ApiError} if the request fails
	 */
	async listAnnotations(
		fileId: string,
		query?: CursorPagination,
	): Promise<AnnotationsPage> {
		const { data } = await this.#api.GET("/files/{fileId}/annotations/", {
			params: { path: { fileId }, query },
		});
		return data!;
	}

	/**
	 * Get annotation details by ID
	 * @param annotationId - Annotation ID
	 * @returns Promise that resolves with the annotation details
	 * @throws {ApiError} if the request fails
	 */
	async getAnnotation(annotationId: string): Promise<Annotation> {
		const { data } = await this.#api.GET("/annotations/{annotationId}", {
			params: { path: { annotationId } },
		});
		return data!;
	}

	/**
	 * Create a new annotation
	 * @param fileId - File ID
	 * @param annotation - Annotation creation request
	 * @returns Promise that resolves with the created annotation
	 * @throws {ApiError} if the request fails
	 */
	async createAnnotation(
		fileId: string,
		annotation: CreateAnnotation,
	): Promise<Annotation> {
		const { data } = await this.#api.POST("/files/{fileId}/annotations/", {
			params: { path: { fileId } },
			body: annotation,
		});
		return data!;
	}

	/**
	 * Update an existing annotation
	 * @param annotationId - Annotation ID
	 * @param updates - Annotation update request
	 * @returns Promise that resolves with the updated annotation
	 * @throws {ApiError} if the request fails
	 */
	async updateAnnotation(
		annotationId: string,
		updates: UpdateAnnotation,
	): Promise<Annotation> {
		const { data } = await this.#api.PATCH("/annotations/{annotationId}", {
			params: { path: { annotationId } },
			body: updates,
		});
		return data!;
	}

	/**
	 * Delete an annotation
	 * @param annotationId - Annotation ID
	 * @returns Promise that resolves when the annotation is deleted
	 * @throws {ApiError} if the request fails
	 */
	async deleteAnnotation(annotationId: string): Promise<void> {
		await this.#api.DELETE("/annotations/{annotationId}", {
			params: { path: { annotationId } },
		});
	}
}
