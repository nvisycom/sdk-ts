import type { ApiClient } from "@/client.js";
import type {
	CreateProjectIntegration,
	Integration,
	Pagination,
	UpdateIntegrationCredentials,
	UpdateProjectIntegration,
} from "@/datatypes/index.js";
import { unwrap } from "@/errors.js";

/**
 * Service for handling integration operations
 */
export class IntegrationsService {
	#api: ApiClient;

	constructor(api: ApiClient) {
		this.#api = api;
	}

	/**
	 * List integrations for a project
	 * @param projectId - Project ID
	 * @param pagination - Pagination parameters
	 * @returns Promise that resolves with the list of integrations
	 * @throws {ApiError} if the request fails
	 */
	async list(
		projectId: string,
		pagination?: Pagination,
	): Promise<Integration[]> {
		const result = await this.#api.GET("/projects/{project_id}/integrations/", {
			params: { path: { projectId } },
			body: pagination ?? {},
		});
		return unwrap(result);
	}

	/**
	 * Get integration details by ID
	 * @param projectId - Project ID
	 * @param integrationId - Integration ID
	 * @returns Promise that resolves with the integration details
	 * @throws {ApiError} if the request fails
	 */
	async get(projectId: string, integrationId: string): Promise<Integration> {
		const result = await this.#api.GET(
			"/projects/{project_id}/integrations/{integration_id}/",
			{
				params: { path: { projectId, integrationId } },
			},
		);
		return unwrap(result);
	}

	/**
	 * Create a new integration
	 * @param projectId - Project ID
	 * @param integration - Integration creation request
	 * @returns Promise that resolves with the created integration
	 * @throws {ApiError} if the request fails
	 */
	async create(
		projectId: string,
		integration: CreateProjectIntegration,
	): Promise<Integration> {
		const result = await this.#api.POST(
			"/projects/{project_id}/integrations/",
			{
				params: { path: { projectId } },
				body: integration,
			},
		);
		return unwrap(result);
	}

	/**
	 * Update an existing integration
	 * @param projectId - Project ID
	 * @param integrationId - Integration ID
	 * @param updates - Integration update request
	 * @returns Promise that resolves with the updated integration
	 * @throws {ApiError} if the request fails
	 */
	async update(
		projectId: string,
		integrationId: string,
		updates: UpdateProjectIntegration,
	): Promise<Integration> {
		const result = await this.#api.PUT(
			"/projects/{project_id}/integrations/{integration_id}/",
			{
				params: { path: { projectId, integrationId } },
				body: updates,
			},
		);
		return unwrap(result);
	}

	/**
	 * Update integration credentials
	 * @param projectId - Project ID
	 * @param integrationId - Integration ID
	 * @param credentials - New credentials
	 * @returns Promise that resolves with the updated integration
	 * @throws {ApiError} if the request fails
	 */
	async updateCredentials(
		projectId: string,
		integrationId: string,
		credentials: UpdateIntegrationCredentials,
	): Promise<Integration> {
		const result = await this.#api.PATCH(
			"/projects/{project_id}/integrations/{integration_id}/credentials/",
			{
				params: { path: { projectId, integrationId } },
				body: credentials,
			},
		);
		return unwrap(result);
	}

	/**
	 * Delete an integration
	 * @param projectId - Project ID
	 * @param integrationId - Integration ID
	 * @returns Promise that resolves when the integration is deleted
	 * @throws {ApiError} if the request fails
	 */
	async delete(projectId: string, integrationId: string): Promise<void> {
		const result = await this.#api.DELETE(
			"/projects/{project_id}/integrations/{integration_id}/",
			{
				params: { path: { projectId, integrationId } },
			},
		);
		unwrap(result);
	}
}
