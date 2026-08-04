import type { ApiClient } from "@/client.js";
import type {
	ConnectionSync,
	ConnectionSyncPage,
	CursorPagination,
	SyncConnection,
	SyncStatus,
} from "@/datatypes/index.js";

/**
 * Service for handling connection sync operations
 */
export class Syncs {
	#api: ApiClient;

	constructor(api: ApiClient) {
		this.#api = api;
	}

	/**
	 * List all syncs across a workspace's connections
	 * @param workspaceSlug - Workspace slug
	 * @param query - Optional query parameters (provider, status, limit, after)
	 * @returns Promise that resolves with a paginated list of connection syncs
	 * @throws {ApiError} if the request fails
	 */
	async listWorkspaceSyncs(
		workspaceSlug: string,
		query?: CursorPagination & { provider?: string[]; status?: SyncStatus },
	): Promise<ConnectionSyncPage> {
		const { data } = await this.#api.GET("/workspaces/{workspaceSlug}/syncs/", {
			params: { path: { workspaceSlug }, query },
		});
		return data!;
	}

	/**
	 * Start a sync for a connection
	 * @param workspaceSlug - Workspace slug
	 * @param connectionId - Connection ID
	 * @param sync - Sync request
	 * @returns Promise that resolves with the started connection sync
	 * @throws {ApiError} if the request fails
	 */
	async startSync(
		workspaceSlug: string,
		connectionId: string,
		sync: SyncConnection,
	): Promise<ConnectionSync> {
		const { data } = await this.#api.POST(
			"/workspaces/{workspaceSlug}/connections/{connectionId}/sync/",
			{
				params: { path: { workspaceSlug, connectionId } },
				body: sync,
			},
		);
		return data!;
	}

	/**
	 * List syncs for a connection
	 * @param workspaceSlug - Workspace slug
	 * @param connectionId - Connection ID
	 * @param query - Optional pagination parameters (limit, after)
	 * @returns Promise that resolves with a paginated list of connection syncs
	 * @throws {ApiError} if the request fails
	 */
	async listSyncs(
		workspaceSlug: string,
		connectionId: string,
		query?: CursorPagination,
	): Promise<ConnectionSyncPage> {
		const { data } = await this.#api.GET(
			"/workspaces/{workspaceSlug}/connections/{connectionId}/syncs/",
			{
				params: { path: { workspaceSlug, connectionId }, query },
			},
		);
		return data!;
	}

	/**
	 * Get a connection sync by ID
	 * @param workspaceSlug - Workspace slug
	 * @param connectionId - Connection ID
	 * @param syncId - Sync ID
	 * @returns Promise that resolves with the connection sync details
	 * @throws {ApiError} if the request fails
	 */
	async getSync(
		workspaceSlug: string,
		connectionId: string,
		syncId: string,
	): Promise<ConnectionSync> {
		const { data } = await this.#api.GET(
			"/workspaces/{workspaceSlug}/connections/{connectionId}/syncs/{syncId}/",
			{
				params: { path: { workspaceSlug, connectionId, syncId } },
			},
		);
		return data!;
	}

	/**
	 * Cancel a running connection sync
	 * @param workspaceSlug - Workspace slug
	 * @param connectionId - Connection ID
	 * @param syncId - Sync ID
	 * @returns Promise that resolves with the canceled connection sync
	 * @throws {ApiError} if the request fails
	 */
	async cancelSync(
		workspaceSlug: string,
		connectionId: string,
		syncId: string,
	): Promise<ConnectionSync> {
		const { data } = await this.#api.POST(
			"/workspaces/{workspaceSlug}/connections/{connectionId}/syncs/{syncId}/cancel/",
			{
				params: { path: { workspaceSlug, connectionId, syncId } },
			},
		);
		return data!;
	}
}
