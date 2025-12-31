import type { ApiClient } from "@/client.js";
import type {
	CreateWebhook,
	UpdateWebhook,
	Webhook,
	WebhookWithSecret,
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
	 * @param workspaceId - Workspace ID
	 * @returns Promise that resolves with the list of webhooks
	 * @throws {ApiError} if the request fails
	 */
	async listWebhooks(workspaceId: string): Promise<Webhook[]> {
		const { data } = await this.#api.GET(
			"/workspaces/{workspace_id}/webhooks/",
			{
				params: { path: { workspace_id: workspaceId } },
			},
		);
		return data!;
	}

	/**
	 * Get a specific webhook by ID
	 * @param webhookId - Webhook ID
	 * @returns Promise that resolves with the webhook details
	 * @throws {ApiError} if the request fails
	 */
	async getWebhook(webhookId: string): Promise<Webhook> {
		const { data } = await this.#api.GET("/webhooks/{webhook_id}/", {
			params: { path: { webhook_id: webhookId } },
		});
		return data!;
	}

	/**
	 * Create a new webhook
	 * @param workspaceId - Workspace ID
	 * @param webhook - Webhook creation request
	 * @returns Promise that resolves with the created webhook (includes secret, shown only once)
	 * @throws {ApiError} if the request fails
	 */
	async createWebhook(
		workspaceId: string,
		webhook: CreateWebhook,
	): Promise<WebhookWithSecret> {
		const { data } = await this.#api.POST(
			"/workspaces/{workspace_id}/webhooks/",
			{
				params: { path: { workspace_id: workspaceId } },
				body: webhook,
			},
		);
		return data!;
	}

	/**
	 * Update an existing webhook
	 * @param webhookId - Webhook ID
	 * @param updates - Webhook update request
	 * @returns Promise that resolves with the updated webhook
	 * @throws {ApiError} if the request fails
	 */
	async updateWebhook(
		webhookId: string,
		updates: UpdateWebhook,
	): Promise<Webhook> {
		const { data } = await this.#api.PUT("/webhooks/{webhook_id}/", {
			params: { path: { webhook_id: webhookId } },
			body: updates,
		});
		return data!;
	}

	/**
	 * Delete a webhook
	 * @param webhookId - Webhook ID
	 * @returns Promise that resolves when the webhook is deleted
	 * @throws {ApiError} if the request fails
	 */
	async deleteWebhook(webhookId: string): Promise<void> {
		await this.#api.DELETE("/webhooks/{webhook_id}/", {
			params: { path: { webhook_id: webhookId } },
		});
	}
}
