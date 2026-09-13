import type { ApiClient } from "@/client.js";
import type {
	CreateWorkspace,
	CursorPagination,
	UpdateWorkspace,
	UpdateWorkspaceNotificationSettings,
	Workspace,
	WorkspaceNotificationSettings,
	WorkspacePage,
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
	async listWorkspaces(query?: CursorPagination): Promise<WorkspacePage> {
		const { data } = await this.#api.GET("/workspaces/", {
			params: { query },
		});
		return data!;
	}

	/**
	 * Get workspace details by ID
	 * @param workspaceId - Workspace id
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
	 * @param workspaceId - Workspace id
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
	 * @param workspaceId - Workspace id
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
	 * @param workspaceId - Workspace id
	 * @returns Promise that resolves with the notification settings
	 * @throws {ApiError} if the request fails
	 */
	async getNotificationSettings(
		workspaceId: string,
	): Promise<WorkspaceNotificationSettings> {
		const { data } = await this.#api.GET(
			"/workspaces/{workspaceId}/notifications/",
			{
				params: { path: { workspaceId } },
			},
		);
		return data!;
	}

	/**
	 * Update notification settings for the authenticated user in a workspace
	 * @param workspaceId - Workspace id
	 * @param settings - Notification settings update request
	 * @returns Promise that resolves with the updated notification settings
	 * @throws {ApiError} if the request fails
	 */
	async updateNotificationSettings(
		workspaceId: string,
		settings: UpdateWorkspaceNotificationSettings,
	): Promise<WorkspaceNotificationSettings> {
		const { data } = await this.#api.PATCH(
			"/workspaces/{workspaceId}/notifications/",
			{
				params: { path: { workspaceId } },
				body: settings,
			},
		);
		return data!;
	}

	/**
	 * Upload a workspace's avatar image
	 * @param workspaceId - Workspace id
	 * @param avatar - Avatar image to upload
	 * @returns Promise that resolves when the avatar is uploaded
	 * @throws {ApiError} if the request fails
	 */
	async uploadAvatar(workspaceId: string, avatar: Blob): Promise<void> {
		const formData = new FormData();
		const name = avatar instanceof File ? avatar.name : "avatar";
		formData.append("avatar", avatar, name);

		await this.#api.PUT("/workspaces/{workspaceId}/avatar/", {
			params: { path: { workspaceId } },
			// Schema types multipart as unknown[], but openapi-fetch needs FormData.
			body: formData as unknown as unknown[],
			bodySerializer: (formData) => formData,
			// Remove Content-Type so browser sets multipart/form-data with boundary.
			headers: { "Content-Type": null } as unknown as HeadersInit,
		});
	}

	/**
	 * Delete a workspace's avatar image
	 * @param workspaceId - Workspace id
	 * @returns Promise that resolves when the avatar is deleted
	 * @throws {ApiError} if the request fails
	 */
	async deleteAvatar(workspaceId: string): Promise<void> {
		await this.#api.DELETE("/workspaces/{workspaceId}/avatar/", {
			params: { path: { workspaceId } },
		});
	}
}
