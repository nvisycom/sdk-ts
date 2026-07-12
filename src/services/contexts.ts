import type { ApiClient } from "@/client.js";
import type {
	Context,
	ContextsPage,
	CreateContext,
	CursorPagination,
	UpdateContext,
} from "@/datatypes/index.js";

/**
 * Service for handling context operations
 */
export class Contexts {
	#api: ApiClient;

	constructor(api: ApiClient) {
		this.#api = api;
	}

	/**
	 * List contexts in a workspace
	 * @param workspaceId - Workspace ID
	 * @param query - Optional pagination parameters (limit, after)
	 * @returns Promise that resolves with a paginated list of contexts
	 * @throws {ApiError} if the request fails
	 */
	async listContexts(
		workspaceId: string,
		query?: CursorPagination,
	): Promise<ContextsPage> {
		const { data } = await this.#api.GET(
			"/workspaces/{workspaceId}/contexts/",
			{
				params: { path: { workspaceId }, query },
			},
		);
		return data!;
	}

	/**
	 * Create a context in a workspace
	 * @param workspaceId - Workspace ID
	 * @param context - Context creation request
	 * @returns Promise that resolves with the created context
	 * @throws {ApiError} if the request fails
	 */
	async createContext(
		workspaceId: string,
		context: CreateContext,
	): Promise<Context> {
		const { data } = await this.#api.POST(
			"/workspaces/{workspaceId}/contexts/",
			{
				params: { path: { workspaceId } },
				body: context,
			},
		);
		return data!;
	}

	/**
	 * Get context details by ID
	 * @param contextId - Context ID
	 * @returns Promise that resolves with the context details
	 * @throws {ApiError} if the request fails
	 */
	async getContext(contextId: string): Promise<Context> {
		const { data } = await this.#api.GET("/contexts/{contextId}/", {
			params: { path: { contextId } },
		});
		return data!;
	}

	/**
	 * Update a context
	 * @param contextId - Context ID
	 * @param updates - Context update request
	 * @returns Promise that resolves with the updated context
	 * @throws {ApiError} if the request fails
	 */
	async updateContext(
		contextId: string,
		updates: UpdateContext,
	): Promise<Context> {
		const { data } = await this.#api.PUT("/contexts/{contextId}/", {
			params: { path: { contextId } },
			body: updates,
		});
		return data!;
	}

	/**
	 * Delete a context
	 * @param contextId - Context ID
	 * @returns Promise that resolves when the context is deleted
	 * @throws {ApiError} if the request fails
	 */
	async deleteContext(contextId: string): Promise<void> {
		await this.#api.DELETE("/contexts/{contextId}/", {
			params: { path: { contextId } },
		});
	}
}
