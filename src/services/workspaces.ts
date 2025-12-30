import type { ApiClient } from "@/client.js";
import type {
	CreateWorkspace,
	Pagination,
	UpdateWorkspace,
	Workspace,
} from "@/datatypes/index.js";

/**
 * Service for handling workspace operations
 */
export class WorkspacesService {
	#api: ApiClient;

	constructor(api: ApiClient) {
		this.#api = api;
	}

	/**
	 * List all workspaces
	 * @param pagination - Pagination parameters
	 * @returns Promise that resolves with the list of workspaces
	 * @throws {ApiError} if the request fails
	 */
	async list(pagination?: Pagination): Promise<Workspace[]> {
		const { data } = await this.#api.GET("/workspaces/", {
			body: pagination ?? {},
		});
		return data!;
	}

	/**
	 * Get workspace details by ID
	 * @param workspaceId - Workspace ID
	 * @returns Promise that resolves with the workspace details
	 * @throws {ApiError} if the request fails
	 */
	async get(workspaceId: string): Promise<Workspace> {
		const { data } = await this.#api.GET("/workspaces/{workspace_id}/", {
			params: { path: { workspaceId } },
		});
		return data!;
	}

	/**
	 * Create a new workspace
	 * @param workspace - Workspace creation request
	 * @returns Promise that resolves with the created workspace
	 * @throws {ApiError} if the request fails
	 */
	async create(workspace: CreateWorkspace): Promise<Workspace> {
		const { data } = await this.#api.POST("/workspaces/", {
			body: workspace,
		});
		return data!;
	}

	/**
	 * Update an existing workspace
	 * @param workspaceId - Workspace ID
	 * @param updates - Workspace update request
	 * @returns Promise that resolves with the updated workspace
	 * @throws {ApiError} if the request fails
	 */
	async update(
		workspaceId: string,
		updates: UpdateWorkspace,
	): Promise<Workspace> {
		const { data } = await this.#api.PATCH("/workspaces/{workspace_id}/", {
			params: { path: { workspaceId } },
			body: updates,
		});
		return data!;
	}

	/**
	 * Delete a workspace
	 * @param workspaceId - Workspace ID
	 * @returns Promise that resolves when the workspace is deleted
	 * @throws {ApiError} if the request fails
	 */
	async delete(workspaceId: string): Promise<void> {
		await this.#api.DELETE("/workspaces/{workspace_id}/", {
			params: { path: { workspaceId } },
		});
	}
}
