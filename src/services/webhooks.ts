import type { ApiClient } from "@/client.js";
import { unwrap } from "@/errors.js";
import type { Webhook, WebhookWithSecret, CreateWebhook, UpdateWebhook } from "@/datatypes/index.js";

/**
 * Service for handling webhook operations
 */
export class WebhooksService {
  #api: ApiClient;

  constructor(api: ApiClient) {
    this.#api = api;
  }

  /**
   * List all webhooks in a project
   * @param projectId - Project ID
   * @returns Promise that resolves with the list of webhooks
   * @throws {ApiError} if the request fails
   */
  async list(projectId: string): Promise<Webhook[]> {
    const result = await this.#api.GET("/projects/{project_id}/webhooks/", {
      params: { path: { projectId } },
    });
    return unwrap(result);
  }

  /**
   * Get a specific webhook by ID
   * @param projectId - Project ID
   * @param webhookId - Webhook ID
   * @returns Promise that resolves with the webhook details
   * @throws {ApiError} if the request fails
   */
  async get(projectId: string, webhookId: string): Promise<Webhook> {
    const result = await this.#api.GET("/projects/{project_id}/webhooks/{webhook_id}/", {
      params: { path: { projectId, webhookId } },
    });
    return unwrap(result);
  }

  /**
   * Create a new webhook
   * @param projectId - Project ID
   * @param webhook - Webhook creation request
   * @returns Promise that resolves with the created webhook (includes secret, shown only once)
   * @throws {ApiError} if the request fails
   */
  async create(projectId: string, webhook: CreateWebhook): Promise<WebhookWithSecret> {
    const result = await this.#api.POST("/projects/{project_id}/webhooks/", {
      params: { path: { projectId } },
      body: webhook,
    });
    return unwrap(result);
  }

  /**
   * Update an existing webhook
   * @param projectId - Project ID
   * @param webhookId - Webhook ID
   * @param updates - Webhook update request
   * @returns Promise that resolves with the updated webhook
   * @throws {ApiError} if the request fails
   */
  async update(projectId: string, webhookId: string, updates: UpdateWebhook): Promise<Webhook> {
    const result = await this.#api.PUT("/projects/{project_id}/webhooks/{webhook_id}/", {
      params: { path: { projectId, webhookId } },
      body: updates,
    });
    return unwrap(result);
  }

  /**
   * Delete a webhook
   * @param projectId - Project ID
   * @param webhookId - Webhook ID
   * @returns Promise that resolves when the webhook is deleted
   * @throws {ApiError} if the request fails
   */
  async delete(projectId: string, webhookId: string): Promise<void> {
    const result = await this.#api.DELETE("/projects/{project_id}/webhooks/{webhook_id}/", {
      params: { path: { projectId, webhookId } },
    });
    unwrap(result);
  }
}
