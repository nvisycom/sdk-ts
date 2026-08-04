import type { ApiClient } from "@/client.js";
import type {
	CreateWebhook,
	CursorPagination,
	TestWebhook,
	UpdateWebhook,
	Webhook,
	WebhookCreated,
	WebhookResult,
	WebhooksPage,
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
	 * @param workspaceSlug - Workspace slug
	 * @param query - Optional pagination parameters (limit, after)
	 * @returns Promise that resolves with a paginated list of webhooks
	 * @throws {ApiError} if the request fails
	 */
	async listWebhooks(
		workspaceSlug: string,
		query?: CursorPagination,
	): Promise<WebhooksPage> {
		const { data } = await this.#api.GET(
			"/workspaces/{workspaceSlug}/webhooks/",
			{
				params: { path: { workspaceSlug }, query },
			},
		);
		return data!;
	}

	/**
	 * Create a new webhook
	 * @param workspaceSlug - Workspace slug
	 * @param webhook - Webhook creation request
	 * @returns Promise that resolves with the created webhook (including secret)
	 * @throws {ApiError} if the request fails
	 */
	async createWebhook(
		workspaceSlug: string,
		webhook: CreateWebhook,
	): Promise<WebhookCreated> {
		const { data } = await this.#api.POST(
			"/workspaces/{workspaceSlug}/webhooks/",
			{
				params: { path: { workspaceSlug } },
				body: webhook,
			},
		);
		return data!;
	}

	/**
	 * Get a specific webhook by slug
	 * @param workspaceSlug - Workspace slug
	 * @param webhookId - Webhook ID
	 * @returns Promise that resolves with the webhook details
	 * @throws {ApiError} if the request fails
	 */
	async getWebhook(workspaceSlug: string, webhookId: string): Promise<Webhook> {
		const { data } = await this.#api.GET(
			"/workspaces/{workspaceSlug}/webhooks/{webhookId}/",
			{
				params: { path: { workspaceSlug, webhookId } },
			},
		);
		return data!;
	}

	/**
	 * Update an existing webhook
	 * @param workspaceSlug - Workspace slug
	 * @param webhookId - Webhook ID
	 * @param updates - Webhook update request
	 * @returns Promise that resolves with the updated webhook
	 * @throws {ApiError} if the request fails
	 */
	async updateWebhook(
		workspaceSlug: string,
		webhookId: string,
		updates: UpdateWebhook,
	): Promise<Webhook> {
		const { data } = await this.#api.PATCH(
			"/workspaces/{workspaceSlug}/webhooks/{webhookId}/",
			{
				params: { path: { workspaceSlug, webhookId } },
				body: updates,
			},
		);
		return data!;
	}

	/**
	 * Delete a webhook
	 * @param workspaceSlug - Workspace slug
	 * @param webhookId - Webhook ID
	 * @returns Promise that resolves when the webhook is deleted
	 * @throws {ApiError} if the request fails
	 */
	async deleteWebhook(workspaceSlug: string, webhookId: string): Promise<void> {
		await this.#api.DELETE(
			"/workspaces/{workspaceSlug}/webhooks/{webhookId}/",
			{
				params: { path: { workspaceSlug, webhookId } },
			},
		);
	}

	/**
	 * Test a webhook by sending a test payload
	 * @param workspaceSlug - Workspace slug
	 * @param webhookId - Webhook ID
	 * @param options - Test webhook options
	 * @returns Promise that resolves with the test result
	 * @throws {ApiError} if the request fails
	 */
	async testWebhook(
		workspaceSlug: string,
		webhookId: string,
		options?: TestWebhook,
	): Promise<WebhookResult> {
		const { data } = await this.#api.POST(
			"/workspaces/{workspaceSlug}/webhooks/{webhookId}/test/",
			{
				params: { path: { workspaceSlug, webhookId } },
				body: options ?? {},
			},
		);
		return data!;
	}
}
