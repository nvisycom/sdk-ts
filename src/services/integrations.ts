import type { ApiClient } from "@/client.js";
import type {
	CreateIntegration,
	Integration,
	ListIntegrationsQuery,
	Pagination,
	UpdateIntegration,
	UpdateIntegrationCredentials,
} from "@/datatypes/index.js";

/**
 * Service for handling integration operations
 */
export class Integrations {
	#api: ApiClient;

	constructor(api: ApiClient) {
		this.#api = api;
	}

	/**
	 * List integrations for a workspace
	 * @param workspaceId - Workspace ID
	 * @param query - Optional query parameters (integrationType, offset, limit)
	 * @returns Promise that resolves with the list of integrations
	 * @throws {ApiError} if the request fails
	 */
	async listIntegrations(
		workspaceId: string,
		query?: ListIntegrationsQuery & Pagination,
	): Promise<Integration[]> {
		const { data } = await this.#api.GET(
			"/workspaces/{workspace_id}/integrations/",
			{
				params: { path: { workspace_id: workspaceId }, query },
			},
		);
		return data!;
	}

	/**
	 * Get integration details by ID
	 * @param integrationId - Integration ID
	 * @returns Promise that resolves with the integration details
	 * @throws {ApiError} if the request fails
	 */
	async getIntegration(integrationId: string): Promise<Integration> {
		const { data } = await this.#api.GET("/integrations/{integration_id}/", {
			params: { path: { integration_id: integrationId } },
		});
		return data!;
	}

	/**
	 * Create a new integration
	 * @param workspaceId - Workspace ID
	 * @param integration - Integration creation request
	 * @returns Promise that resolves with the created integration
	 * @throws {ApiError} if the request fails
	 */
	async createIntegration(
		workspaceId: string,
		integration: CreateIntegration,
	): Promise<Integration> {
		const { data } = await this.#api.POST(
			"/workspaces/{workspace_id}/integrations/",
			{
				params: { path: { workspace_id: workspaceId } },
				body: integration,
			},
		);
		return data!;
	}

	/**
	 * Update an existing integration
	 * @param integrationId - Integration ID
	 * @param updates - Integration update request
	 * @returns Promise that resolves with the updated integration
	 * @throws {ApiError} if the request fails
	 */
	async updateIntegration(
		integrationId: string,
		updates: UpdateIntegration,
	): Promise<Integration> {
		const { data } = await this.#api.PUT("/integrations/{integration_id}/", {
			params: { path: { integration_id: integrationId } },
			body: updates,
		});
		return data!;
	}

	/**
	 * Update integration credentials
	 * @param integrationId - Integration ID
	 * @param credentials - New credentials
	 * @returns Promise that resolves with the updated integration
	 * @throws {ApiError} if the request fails
	 */
	async updateIntegrationCredentials(
		integrationId: string,
		credentials: UpdateIntegrationCredentials,
	): Promise<Integration> {
		const { data } = await this.#api.PATCH(
			"/integrations/{integration_id}/credentials/",
			{
				params: { path: { integration_id: integrationId } },
				body: credentials,
			},
		);
		return data!;
	}

	/**
	 * Delete an integration
	 * @param integrationId - Integration ID
	 * @returns Promise that resolves when the integration is deleted
	 * @throws {ApiError} if the request fails
	 */
	async deleteIntegration(integrationId: string): Promise<void> {
		await this.#api.DELETE("/integrations/{integration_id}/", {
			params: { path: { integration_id: integrationId } },
		});
	}
}
