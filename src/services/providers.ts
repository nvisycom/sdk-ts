import type { ApiClient } from "@/client.js";
import type {
	ConnectionVerification,
	CreateProvider,
	CursorPagination,
	Provider,
	ProviderPage,
	ProvidersQuery,
	UpdateProvider,
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
	 * @param workspaceSlug - Workspace slug
	 * @param query - Optional pagination and filters (provider, limit, after)
	 * @returns Promise that resolves with a paginated list of providers
	 * @throws {ApiError} if the request fails
	 */
	async listProviders(
		workspaceSlug: string,
		query?: CursorPagination & ProvidersQuery,
	): Promise<ProviderPage> {
		const { data } = await this.#api.GET(
			"/workspaces/{workspaceSlug}/providers/",
			{
				params: { path: { workspaceSlug }, query },
			},
		);
		return data!;
	}

	/**
	 * Create an inference provider in a workspace
	 * @param workspaceSlug - Workspace slug
	 * @param provider - Provider creation request
	 * @returns Promise that resolves with the created provider
	 * @throws {ApiError} if the request fails
	 */
	async createProvider(
		workspaceSlug: string,
		provider: CreateProvider,
	): Promise<Provider> {
		const { data } = await this.#api.POST(
			"/workspaces/{workspaceSlug}/providers/",
			{
				params: { path: { workspaceSlug } },
				body: provider,
			},
		);
		return data!;
	}

	/**
	 * Get provider details by ID
	 * @param workspaceSlug - Workspace slug
	 * @param providerId - Provider ID
	 * @returns Promise that resolves with the provider details
	 * @throws {ApiError} if the request fails
	 */
	async getProvider(
		workspaceSlug: string,
		providerId: string,
	): Promise<Provider> {
		const { data } = await this.#api.GET(
			"/workspaces/{workspaceSlug}/providers/{providerId}/",
			{
				params: { path: { workspaceSlug, providerId } },
			},
		);
		return data!;
	}

	/**
	 * Update an inference provider
	 * @param workspaceSlug - Workspace slug
	 * @param providerId - Provider ID
	 * @param updates - Provider update request
	 * @returns Promise that resolves with the updated provider
	 * @throws {ApiError} if the request fails
	 */
	async updateProvider(
		workspaceSlug: string,
		providerId: string,
		updates: UpdateProvider,
	): Promise<Provider> {
		const { data } = await this.#api.PATCH(
			"/workspaces/{workspaceSlug}/providers/{providerId}/",
			{
				params: { path: { workspaceSlug, providerId } },
				body: updates,
			},
		);
		return data!;
	}

	/**
	 * Delete an inference provider
	 * @param workspaceSlug - Workspace slug
	 * @param providerId - Provider ID
	 * @returns Promise that resolves when the provider is deleted
	 * @throws {ApiError} if the request fails
	 */
	async deleteProvider(
		workspaceSlug: string,
		providerId: string,
	): Promise<void> {
		await this.#api.DELETE(
			"/workspaces/{workspaceSlug}/providers/{providerId}/",
			{
				params: { path: { workspaceSlug, providerId } },
			},
		);
	}

	/**
	 * Verify an inference provider's configuration and credentials
	 * @param workspaceSlug - Workspace slug
	 * @param providerId - Provider ID
	 * @returns Promise that resolves with the verification result
	 * @throws {ApiError} if the request fails
	 */
	async verifyProvider(
		workspaceSlug: string,
		providerId: string,
	): Promise<ConnectionVerification> {
		const { data } = await this.#api.POST(
			"/workspaces/{workspaceSlug}/providers/{providerId}/verify/",
			{
				params: { path: { workspaceSlug, providerId } },
			},
		);
		return data!;
	}
}
