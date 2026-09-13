import type { ApiClient } from "@/client.js";
import type {
	CursorPagination,
	SyncStatus,
	WorkspaceConnectionSync,
	WorkspaceConnectionSyncPage,
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
	 * @param workspaceId - Workspace id
	 * @param query - Optional query parameters (provider, status, limit, after)
	 * @returns Promise that resolves with a paginated list of connection syncs
	 * @throws {ApiError} if the request fails
	 */
	async listWorkspaceSyncs(
		workspaceId: string,
		query?: CursorPagination & { provider?: string[]; status?: SyncStatus },
	): Promise<WorkspaceConnectionSyncPage> {
		const { data } = await this.#api.GET("/workspaces/{workspaceId}/syncs/", {
			params: { path: { workspaceId }, query },
		});
		return data!;
	}

	/**
	 * Start a sync for an object-store connection.
	 *
	 * Runs the connection's configured direction — imports every new object, or
	 * exports every redacted output not yet exported. File-service connections
	 * use {@link Connections.importFiles} and {@link Connections.exportFiles}
	 * instead. Returns the created sync — poll it for completion.
	 *
	 * @param workspaceId - Workspace id
	 * @param connectionId - Connection ID
	 * @returns Promise that resolves with the started connection sync
	 * @throws {ApiError} if the request fails
	 */
	async startSync(
		workspaceId: string,
		connectionId: string,
	): Promise<WorkspaceConnectionSync> {
		const { data } = await this.#api.POST(
			"/workspaces/{workspaceId}/connections/{connectionId}/sync/",
			{
				params: { path: { workspaceId, connectionId } },
			},
		);
		return data!;
	}

	/**
	 * List syncs for a connection
	 * @param workspaceId - Workspace id
	 * @param connectionId - Connection ID
	 * @param query - Optional pagination parameters (limit, after)
	 * @returns Promise that resolves with a paginated list of connection syncs
	 * @throws {ApiError} if the request fails
	 */
	async listSyncs(
		workspaceId: string,
		connectionId: string,
		query?: CursorPagination,
	): Promise<WorkspaceConnectionSyncPage> {
		const { data } = await this.#api.GET(
			"/workspaces/{workspaceId}/connections/{connectionId}/syncs/",
			{
				params: { path: { workspaceId, connectionId }, query },
			},
		);
		return data!;
	}

	/**
	 * Get a connection sync by ID
	 * @param workspaceId - Workspace id
	 * @param connectionId - Connection ID
	 * @param syncId - Sync ID
	 * @returns Promise that resolves with the connection sync details
	 * @throws {ApiError} if the request fails
	 */
	async getSync(
		workspaceId: string,
		connectionId: string,
		syncId: string,
	): Promise<WorkspaceConnectionSync> {
		const { data } = await this.#api.GET(
			"/workspaces/{workspaceId}/connections/{connectionId}/syncs/{syncId}/",
			{
				params: { path: { workspaceId, connectionId, syncId } },
			},
		);
		return data!;
	}

	/**
	 * Cancel a running connection sync
	 * @param workspaceId - Workspace id
	 * @param connectionId - Connection ID
	 * @param syncId - Sync ID
	 * @returns Promise that resolves with the canceled connection sync
	 * @throws {ApiError} if the request fails
	 */
	async cancelSync(
		workspaceId: string,
		connectionId: string,
		syncId: string,
	): Promise<WorkspaceConnectionSync> {
		const { data } = await this.#api.POST(
			"/workspaces/{workspaceId}/connections/{connectionId}/syncs/{syncId}/cancel/",
			{
				params: { path: { workspaceId, connectionId, syncId } },
			},
		);
		return data!;
	}
}
