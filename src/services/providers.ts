import type { ApiClient } from "@/client.js";
import type {
	CreateWorkspaceProvider,
	CursorPagination,
	UpdateWorkspaceProvider,
	WorkspaceConnectionVerification,
	WorkspaceProvider,
	WorkspaceProviderPage,
	WorkspaceProvidersQuery,
} from "@/datatypes/index.js";

/**
 * Service for a workspace's inference providers — the LLM / NER services the
 * platform calls. Only provider metadata is returned; encrypted credentials
 * are never exposed.
 */
export class Providers {
	#api: ApiClient;

	constructor(api: ApiClient) {
		this.#api = api;
	}

	/**
	 * List a workspace's inference providers
	 * @param workspaceId - Workspace id
	 * @param query - Optional pagination and filters (provider, limit, after)
	 * @returns Promise that resolves with a paginated list of providers
	 * @throws {ApiError} if the request fails
	 */
	async listProviders(
		workspaceId: string,
		query?: CursorPagination & WorkspaceProvidersQuery,
	): Promise<WorkspaceProviderPage> {
		const { data } = await this.#api.GET(
			"/workspaces/{workspaceId}/providers",
			{
				params: { path: { workspaceId }, query },
			},
		);
		return data!;
	}

	/**
	 * Create an inference provider in a workspace
	 * @param workspaceId - Workspace id
	 * @param provider - Provider creation request
	 * @returns Promise that resolves with the created provider
	 * @throws {ApiError} if the request fails
	 */
	async createProvider(
		workspaceId: string,
		provider: CreateWorkspaceProvider,
	): Promise<WorkspaceProvider> {
		const { data } = await this.#api.POST(
			"/workspaces/{workspaceId}/providers",
			{
				params: { path: { workspaceId } },
				body: provider,
			},
		);
		return data!;
	}

	/**
	 * Get provider details by ID
	 * @param workspaceId - Workspace id
	 * @param providerId - Provider ID
	 * @returns Promise that resolves with the provider details
	 * @throws {ApiError} if the request fails
	 */
	async getProvider(
		workspaceId: string,
		providerId: string,
	): Promise<WorkspaceProvider> {
		const { data } = await this.#api.GET(
			"/workspaces/{workspaceId}/providers/{providerId}",
			{
				params: { path: { workspaceId, providerId } },
			},
		);
		return data!;
	}

	/**
	 * Update an inference provider
	 * @param workspaceId - Workspace id
	 * @param providerId - Provider ID
	 * @param updates - Provider update request
	 * @returns Promise that resolves with the updated provider
	 * @throws {ApiError} if the request fails
	 */
	async updateProvider(
		workspaceId: string,
		providerId: string,
		updates: UpdateWorkspaceProvider,
	): Promise<WorkspaceProvider> {
		const { data } = await this.#api.PATCH(
			"/workspaces/{workspaceId}/providers/{providerId}",
			{
				params: { path: { workspaceId, providerId } },
				body: updates,
			},
		);
		return data!;
	}

	/**
	 * Delete an inference provider
	 * @param workspaceId - Workspace id
	 * @param providerId - Provider ID
	 * @returns Promise that resolves when the provider is deleted
	 * @throws {ApiError} if the request fails
	 */
	async deleteProvider(workspaceId: string, providerId: string): Promise<void> {
		await this.#api.DELETE("/workspaces/{workspaceId}/providers/{providerId}", {
			params: { path: { workspaceId, providerId } },
		});
	}

	/**
	 * Verify an inference provider's configuration and credentials
	 * @param workspaceId - Workspace id
	 * @param providerId - Provider ID
	 * @returns Promise that resolves with the verification result
	 * @throws {ApiError} if the request fails
	 */
	async verifyProvider(
		workspaceId: string,
		providerId: string,
	): Promise<WorkspaceConnectionVerification> {
		const { data } = await this.#api.POST(
			"/workspaces/{workspaceId}/providers/{providerId}/verify",
			{
				params: { path: { workspaceId, providerId } },
			},
		);
		return data!;
	}
}
