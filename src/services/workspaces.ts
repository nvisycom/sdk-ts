import type { ApiClient } from "@/client.js";
import type {
	CreateWorkspace,
	CursorPagination,
	NotificationSettings,
	UpdateNotificationSettings,
	UpdateWorkspace,
	Workspace,
	WorkspacesPage,
} from "@/datatypes/index.js";

/**
 * Service for handling workspace operations
 */
export class Workspaces {
	#api: ApiClient;

	constructor(api: ApiClient) {
		this.#api = api;
	}

	/**
	 * List all workspaces
	 * @param query - Optional pagination parameters (limit, after)
	 * @returns Promise that resolves with a paginated list of workspaces
	 * @throws {ApiError} if the request fails
	 */
	async listWorkspaces(query?: CursorPagination): Promise<WorkspacesPage> {
		const { data } = await this.#api.GET("/workspaces/", {
			params: { query },
		});
		return data!;
	}

	/**
	 * Get workspace details by ID
	 * @param workspaceId - Workspace ID
	 * @returns Promise that resolves with the workspace details
	 * @throws {ApiError} if the request fails
	 */
	async getWorkspace(workspaceId: string): Promise<Workspace> {
		const { data } = await this.#api.GET("/workspaces/{workspaceId}/", {
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
	async createWorkspace(workspace: CreateWorkspace): Promise<Workspace> {
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
	async updateWorkspace(
		workspaceId: string,
		updates: UpdateWorkspace,
	): Promise<Workspace> {
		const { data } = await this.#api.PATCH("/workspaces/{workspaceId}/", {
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
	async deleteWorkspace(workspaceId: string): Promise<void> {
		await this.#api.DELETE("/workspaces/{workspaceId}/", {
			params: { path: { workspaceId } },
		});
	}

	/**
	 * Get notification settings for the authenticated user in a workspace
	 * @param workspaceId - Workspace ID
	 * @returns Promise that resolves with the notification settings
	 * @throws {ApiError} if the request fails
	 */
	async getNotificationSettings(
		workspaceId: string,
	): Promise<NotificationSettings> {
		const { data } = await this.#api.GET(
			"/workspaces/{workspaceId}/notifications",
			{
				params: { path: { workspaceId } },
			},
		);
		return data!;
	}

	/**
	 * Update notification settings for the authenticated user in a workspace
	 * @param workspaceId - Workspace ID
	 * @param settings - Notification settings update request
	 * @returns Promise that resolves with the updated notification settings
	 * @throws {ApiError} if the request fails
	 */
	async updateNotificationSettings(
		workspaceId: string,
		settings: UpdateNotificationSettings,
	): Promise<NotificationSettings> {
		const { data } = await this.#api.PATCH(
			"/workspaces/{workspaceId}/notifications",
			{
				params: { path: { workspaceId } },
				body: settings,
			},
		);
		return data!;
	}
}
