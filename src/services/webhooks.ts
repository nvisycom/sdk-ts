import type { ApiClient } from "@/client.js";
import type {
	CreateWorkspaceWebhook,
	CursorPagination,
	TestWorkspaceWebhook,
	UpdateWorkspaceWebhook,
	WorkspaceWebhook,
	WorkspaceWebhookCreated,
	WorkspaceWebhookPage,
	WorkspaceWebhookResult,
} from "@/datatypes/index.js";

/**
 * Service for handling webhook operations
 */
export class Webhooks {
	#api: ApiClient;

	constructor(api: ApiClient) {
		this.#api = api;
	}

	/**
	 * List all webhooks in a workspace
	 * @param workspaceId - Workspace id
	 * @param query - Optional pagination parameters (limit, after)
	 * @returns Promise that resolves with a paginated list of webhooks
	 * @throws {ApiError} if the request fails
	 */
	async listWebhooks(
		workspaceId: string,
		query?: CursorPagination,
	): Promise<WorkspaceWebhookPage> {
		const { data } = await this.#api.GET(
			"/workspaces/{workspaceId}/webhooks/",
			{
				params: { path: { workspaceId }, query },
			},
		);
		return data!;
	}

	/**
	 * Create a new webhook
	 * @param workspaceId - Workspace id
	 * @param webhook - Webhook creation request
	 * @returns Promise that resolves with the created webhook (including secret)
	 * @throws {ApiError} if the request fails
	 */
	async createWebhook(
		workspaceId: string,
		webhook: CreateWorkspaceWebhook,
	): Promise<WorkspaceWebhookCreated> {
		const { data } = await this.#api.POST(
			"/workspaces/{workspaceId}/webhooks/",
			{
				params: { path: { workspaceId } },
				body: webhook,
			},
		);
		return data!;
	}

	/**
	 * Get a specific webhook by id
	 * @param workspaceId - Workspace id
	 * @param webhookId - Webhook ID
	 * @returns Promise that resolves with the webhook details
	 * @throws {ApiError} if the request fails
	 */
	async getWebhook(
		workspaceId: string,
		webhookId: string,
	): Promise<WorkspaceWebhook> {
		const { data } = await this.#api.GET(
			"/workspaces/{workspaceId}/webhooks/{webhookId}/",
			{
				params: { path: { workspaceId, webhookId } },
			},
		);
		return data!;
	}

	/**
	 * Update an existing webhook
	 * @param workspaceId - Workspace id
	 * @param webhookId - Webhook ID
	 * @param updates - Webhook update request
	 * @returns Promise that resolves with the updated webhook
	 * @throws {ApiError} if the request fails
	 */
	async updateWebhook(
		workspaceId: string,
		webhookId: string,
		updates: UpdateWorkspaceWebhook,
	): Promise<WorkspaceWebhook> {
		const { data } = await this.#api.PATCH(
			"/workspaces/{workspaceId}/webhooks/{webhookId}/",
			{
				params: { path: { workspaceId, webhookId } },
				body: updates,
			},
		);
		return data!;
	}

	/**
	 * Delete a webhook
	 * @param workspaceId - Workspace id
	 * @param webhookId - Webhook ID
	 * @returns Promise that resolves when the webhook is deleted
	 * @throws {ApiError} if the request fails
	 */
	async deleteWebhook(workspaceId: string, webhookId: string): Promise<void> {
		await this.#api.DELETE("/workspaces/{workspaceId}/webhooks/{webhookId}/", {
			params: { path: { workspaceId, webhookId } },
		});
	}

	/**
	 * Test a webhook by sending a test payload
	 * @param workspaceId - Workspace id
	 * @param webhookId - Webhook ID
	 * @param options - Test webhook options
	 * @returns Promise that resolves with the test result
	 * @throws {ApiError} if the request fails
	 */
	async testWebhook(
		workspaceId: string,
		webhookId: string,
		options?: TestWorkspaceWebhook,
	): Promise<WorkspaceWebhookResult> {
		const { data } = await this.#api.POST(
			"/workspaces/{workspaceId}/webhooks/{webhookId}/test/",
			{
				params: { path: { workspaceId, webhookId } },
				body: options ?? {},
			},
		);
		return data!;
	}
}
