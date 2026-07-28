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
	 * @param workspaceSlug - Workspace slug
	 * @returns Promise that resolves with the workspace details
	 * @throws {ApiError} if the request fails
	 */
	async getWorkspace(workspaceSlug: string): Promise<Workspace> {
		const { data } = await this.#api.GET("/workspaces/{workspaceSlug}/", {
			params: { path: { workspaceSlug } },
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
	 * @param workspaceSlug - Workspace slug
	 * @param updates - Workspace update request
	 * @returns Promise that resolves with the updated workspace
	 * @throws {ApiError} if the request fails
	 */
	async updateWorkspace(
		workspaceSlug: string,
		updates: UpdateWorkspace,
	): Promise<Workspace> {
		const { data } = await this.#api.PATCH("/workspaces/{workspaceSlug}/", {
			params: { path: { workspaceSlug } },
			body: updates,
		});
		return data!;
	}

	/**
	 * Delete a workspace
	 * @param workspaceSlug - Workspace slug
	 * @returns Promise that resolves when the workspace is deleted
	 * @throws {ApiError} if the request fails
	 */
	async deleteWorkspace(workspaceSlug: string): Promise<void> {
		await this.#api.DELETE("/workspaces/{workspaceSlug}/", {
			params: { path: { workspaceSlug } },
		});
	}

	/**
	 * Get notification settings for the authenticated user in a workspace
	 * @param workspaceSlug - Workspace slug
	 * @returns Promise that resolves with the notification settings
	 * @throws {ApiError} if the request fails
	 */
	async getNotificationSettings(
		workspaceSlug: string,
	): Promise<NotificationSettings> {
		const { data } = await this.#api.GET(
			"/workspaces/{workspaceSlug}/notifications/",
			{
				params: { path: { workspaceSlug } },
			},
		);
		return data!;
	}

	/**
	 * Update notification settings for the authenticated user in a workspace
	 * @param workspaceSlug - Workspace slug
	 * @param settings - Notification settings update request
	 * @returns Promise that resolves with the updated notification settings
	 * @throws {ApiError} if the request fails
	 */
	async updateNotificationSettings(
		workspaceSlug: string,
		settings: UpdateNotificationSettings,
	): Promise<NotificationSettings> {
		const { data } = await this.#api.PATCH(
			"/workspaces/{workspaceSlug}/notifications/",
			{
				params: { path: { workspaceSlug } },
				body: settings,
			},
		);
		return data!;
	}
}
