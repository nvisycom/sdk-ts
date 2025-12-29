import type { ApiClient } from "@/client.js";
import type { CreateTemplate, Template } from "@/datatypes/index.js";
import { unwrap } from "@/errors.js";

/**
 * Service for handling template operations
 */
export class TemplatesService {
	#api: ApiClient;

	constructor(api: ApiClient) {
		this.#api = api;
	}

	/**
	 * List all templates in a project
	 * @param projectId - Project ID
	 * @returns Promise that resolves with the list of templates
	 * @throws {ApiError} if the request fails
	 */
	async list(projectId: string): Promise<Template[]> {
		const result = await this.#api.GET("/projects/{project_id}/templates", {
			params: { path: { projectId } },
		});
		return unwrap(result);
	}

	/**
	 * Get a specific template by ID
	 * @param projectId - Project ID
	 * @param templateId - Template ID
	 * @returns Promise that resolves with the template details
	 * @throws {ApiError} if the request fails
	 */
	async get(projectId: string, templateId: string): Promise<Template> {
		const result = await this.#api.GET(
			"/projects/{project_id}/templates/{template_id}",
			{
				params: { path: { projectId, templateId } },
			},
		);
		return unwrap(result);
	}

	/**
	 * Create a new template
	 * @param projectId - Project ID
	 * @param template - Template creation request
	 * @returns Promise that resolves with the created template
	 * @throws {ApiError} if the request fails
	 */
	async create(projectId: string, template: CreateTemplate): Promise<Template> {
		const result = await this.#api.POST("/projects/{project_id}/templates", {
			params: { path: { projectId } },
			body: template,
		});
		return unwrap(result);
	}

	/**
	 * Update an existing template
	 * @param projectId - Project ID
	 * @param templateId - Template ID
	 * @param updates - Template update request
	 * @returns Promise that resolves with the updated template
	 * @throws {ApiError} if the request fails
	 */
	async update(
		projectId: string,
		templateId: string,
		updates: CreateTemplate,
	): Promise<Template> {
		const result = await this.#api.PUT(
			"/projects/{project_id}/templates/{template_id}",
			{
				params: { path: { projectId, templateId } },
				body: updates,
			},
		);
		return unwrap(result);
	}

	/**
	 * Delete a template
	 * @param projectId - Project ID
	 * @param templateId - Template ID
	 * @returns Promise that resolves when the template is deleted
	 * @throws {ApiError} if the request fails
	 */
	async delete(projectId: string, templateId: string): Promise<void> {
		const result = await this.#api.DELETE(
			"/projects/{project_id}/templates/{template_id}",
			{
				params: { path: { projectId, templateId } },
			},
		);
		unwrap(result);
	}
}
