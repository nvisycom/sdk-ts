import type { ApiClient } from "@/client.js";
import type { CreateTemplate, Template } from "@/datatypes/index.js";

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
		const { data } = await this.#api.GET("/projects/{project_id}/templates", {
			params: { path: { projectId } },
		});
		return data!;
	}

	/**
	 * Get a specific template by ID
	 * @param projectId - Project ID
	 * @param templateId - Template ID
	 * @returns Promise that resolves with the template details
	 * @throws {ApiError} if the request fails
	 */
	async get(projectId: string, templateId: string): Promise<Template> {
		const { data } = await this.#api.GET(
			"/projects/{project_id}/templates/{template_id}",
			{
				params: { path: { projectId, templateId } },
			},
		);
		return data!;
	}

	/**
	 * Create a new template
	 * @param projectId - Project ID
	 * @param template - Template creation request
	 * @returns Promise that resolves with the created template
	 * @throws {ApiError} if the request fails
	 */
	async create(projectId: string, template: CreateTemplate): Promise<Template> {
		const { data } = await this.#api.POST("/projects/{project_id}/templates", {
			params: { path: { projectId } },
			body: template,
		});
		return data!;
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
		const { data } = await this.#api.PUT(
			"/projects/{project_id}/templates/{template_id}",
			{
				params: { path: { projectId, templateId } },
				body: updates,
			},
		);
		return data!;
	}

	/**
	 * Delete a template
	 * @param projectId - Project ID
	 * @param templateId - Template ID
	 * @returns Promise that resolves when the template is deleted
	 * @throws {ApiError} if the request fails
	 */
	async delete(projectId: string, templateId: string): Promise<void> {
		await this.#api.DELETE("/projects/{project_id}/templates/{template_id}", {
			params: { path: { projectId, templateId } },
		});
	}
}
