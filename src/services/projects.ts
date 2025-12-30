import type { ApiClient } from "@/client.js";
import type {
	CreateProject,
	Pagination,
	Project,
	UpdateProject,
} from "@/datatypes/index.js";

/**
 * Service for handling project operations
 */
export class ProjectsService {
	#api: ApiClient;

	constructor(api: ApiClient) {
		this.#api = api;
	}

	/**
	 * List all projects the authenticated user is a member of
	 * @param pagination - Pagination parameters
	 * @returns Promise that resolves with the list of projects
	 * @throws {ApiError} if the request fails
	 */
	async list(pagination?: Pagination): Promise<Project[]> {
		const { data } = await this.#api.GET("/projects/", {
			body: pagination ?? {},
		});
		return data!;
	}

	/**
	 * Get a specific project by ID
	 * @param projectId - Project ID
	 * @returns Promise that resolves with the project details
	 * @throws {ApiError} if the request fails
	 */
	async get(projectId: string): Promise<Project> {
		const { data } = await this.#api.GET("/projects/{project_id}/", {
			params: { path: { projectId } },
		});
		return data!;
	}

	/**
	 * Create a new project
	 * @param project - Project creation request
	 * @returns Promise that resolves with the created project
	 * @throws {ApiError} if the request fails
	 */
	async create(project: CreateProject): Promise<Project> {
		const { data } = await this.#api.POST("/projects/", {
			body: project,
		});
		return data!;
	}

	/**
	 * Update an existing project
	 * @param projectId - Project ID
	 * @param updates - Project update request
	 * @returns Promise that resolves with the updated project
	 * @throws {ApiError} if the request fails
	 */
	async update(projectId: string, updates: UpdateProject): Promise<Project> {
		const { data } = await this.#api.PATCH("/projects/{project_id}/", {
			params: { path: { projectId } },
			body: updates,
		});
		return data!;
	}

	/**
	 * Delete a project (soft-delete)
	 * @param projectId - Project ID
	 * @returns Promise that resolves when the project is deleted
	 * @throws {ApiError} if the request fails
	 */
	async delete(projectId: string): Promise<void> {
		await this.#api.DELETE("/projects/{project_id}/", {
			params: { path: { projectId } },
		});
	}
}
