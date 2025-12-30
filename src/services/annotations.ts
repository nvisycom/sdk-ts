import type { ApiClient } from "@/client.js";
import type {
	Annotation,
	CreateAnnotation,
	Pagination,
	UpdateAnnotation,
} from "@/datatypes/index.js";

/**
 * Service for handling file annotation operations
 */
export class AnnotationsService {
	#api: ApiClient;

	constructor(api: ApiClient) {
		this.#api = api;
	}

	/**
	 * List annotations for a file
	 * @param fileId - File ID
	 * @param query - Optional query parameters (offset, limit)
	 * @returns Promise that resolves with the list of annotations
	 * @throws {ApiError} if the request fails
	 */
	async list(fileId: string, query?: Pagination): Promise<Annotation[]> {
		const { data } = await this.#api.GET("/files/{file_id}/annotations/", {
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
	async get(annotationId: string): Promise<Annotation> {
		const { data } = await this.#api.GET("/annotations/{annotation_id}", {
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
	async create(
		fileId: string,
		annotation: CreateAnnotation,
	): Promise<Annotation> {
		const { data } = await this.#api.POST("/files/{file_id}/annotations/", {
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
	async update(
		annotationId: string,
		updates: UpdateAnnotation,
	): Promise<Annotation> {
		const { data } = await this.#api.PATCH("/annotations/{annotation_id}", {
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
	async delete(annotationId: string): Promise<void> {
		await this.#api.DELETE("/annotations/{annotation_id}", {
			params: { path: { annotationId } },
		});
	}
}
