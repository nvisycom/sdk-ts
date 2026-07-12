import type { ApiClient } from "@/client.js";
import type {
	Connection,
	ConnectionsPage,
	CreateConnection,
	CursorPagination,
	UpdateConnection,
} from "@/datatypes/index.js";

/**
 * Service for handling connection operations
 */
export class Connections {
	#api: ApiClient;

	constructor(api: ApiClient) {
		this.#api = api;
	}

	/**
	 * List connections in a workspace
	 * @param workspaceId - Workspace ID
	 * @param query - Optional query parameters (provider, limit, after)
	 * @returns Promise that resolves with a paginated list of connections
	 * @throws {ApiError} if the request fails
	 */
	async listConnections(
		workspaceId: string,
		query?: CursorPagination & { provider?: string },
	): Promise<ConnectionsPage> {
		const { data } = await this.#api.GET(
			"/workspaces/{workspaceId}/connections/",
			{
				params: { path: { workspaceId }, query },
			},
		);
		return data!;
	}

	/**
	 * Create a connection in a workspace
	 * @param workspaceId - Workspace ID
	 * @param connection - Connection creation request
	 * @returns Promise that resolves with the created connection
	 * @throws {ApiError} if the request fails
	 */
	async createConnection(
		workspaceId: string,
		connection: CreateConnection,
	): Promise<Connection> {
		const { data } = await this.#api.POST(
			"/workspaces/{workspaceId}/connections/",
			{
				params: { path: { workspaceId } },
				body: connection,
			},
		);
		return data!;
	}

	/**
	 * Get connection details by ID
	 * @param connectionId - Connection ID
	 * @returns Promise that resolves with the connection details
	 * @throws {ApiError} if the request fails
	 */
	async getConnection(connectionId: string): Promise<Connection> {
		const { data } = await this.#api.GET("/connections/{connectionId}/", {
			params: { path: { connectionId } },
		});
		return data!;
	}

	/**
	 * Update a connection
	 * @param connectionId - Connection ID
	 * @param updates - Connection update request
	 * @returns Promise that resolves with the updated connection
	 * @throws {ApiError} if the request fails
	 */
	async updateConnection(
		connectionId: string,
		updates: UpdateConnection,
	): Promise<Connection> {
		const { data } = await this.#api.PUT("/connections/{connectionId}/", {
			params: { path: { connectionId } },
			body: updates,
		});
		return data!;
	}

	/**
	 * Delete a connection
	 * @param connectionId - Connection ID
	 * @returns Promise that resolves when the connection is deleted
	 * @throws {ApiError} if the request fails
	 */
	async deleteConnection(connectionId: string): Promise<void> {
		await this.#api.DELETE("/connections/{connectionId}/", {
			params: { path: { connectionId } },
		});
	}
}
