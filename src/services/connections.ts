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
	 * @param workspaceSlug - Workspace slug
	 * @param query - Optional query parameters (provider, limit, after)
	 * @returns Promise that resolves with a paginated list of connections
	 * @throws {ApiError} if the request fails
	 */
	async listConnections(
		workspaceSlug: string,
		query?: CursorPagination & { provider?: string },
	): Promise<ConnectionsPage> {
		const { data } = await this.#api.GET(
			"/workspaces/{workspaceSlug}/connections/",
			{
				params: { path: { workspaceSlug }, query },
			},
		);
		return data!;
	}

	/**
	 * Create a connection in a workspace
	 * @param workspaceSlug - Workspace slug
	 * @param connection - Connection creation request
	 * @returns Promise that resolves with the created connection
	 * @throws {ApiError} if the request fails
	 */
	async createConnection(
		workspaceSlug: string,
		connection: CreateConnection,
	): Promise<Connection> {
		const { data } = await this.#api.POST(
			"/workspaces/{workspaceSlug}/connections/",
			{
				params: { path: { workspaceSlug } },
				body: connection,
			},
		);
		return data!;
	}

	/**
	 * Get connection details by ID
	 * @param workspaceSlug - Workspace slug
	 * @param connectionId - Connection ID
	 * @returns Promise that resolves with the connection details
	 * @throws {ApiError} if the request fails
	 */
	async getConnection(
		workspaceSlug: string,
		connectionId: string,
	): Promise<Connection> {
		const { data } = await this.#api.GET(
			"/workspaces/{workspaceSlug}/connections/{connectionId}/",
			{
				params: { path: { workspaceSlug, connectionId } },
			},
		);
		return data!;
	}

	/**
	 * Update a connection
	 * @param workspaceSlug - Workspace slug
	 * @param connectionId - Connection ID
	 * @param updates - Connection update request
	 * @returns Promise that resolves with the updated connection
	 * @throws {ApiError} if the request fails
	 */
	async updateConnection(
		workspaceSlug: string,
		connectionId: string,
		updates: UpdateConnection,
	): Promise<Connection> {
		const { data } = await this.#api.PUT(
			"/workspaces/{workspaceSlug}/connections/{connectionId}/",
			{
				params: { path: { workspaceSlug, connectionId } },
				body: updates,
			},
		);
		return data!;
	}

	/**
	 * Delete a connection
	 * @param workspaceSlug - Workspace slug
	 * @param connectionId - Connection ID
	 * @returns Promise that resolves when the connection is deleted
	 * @throws {ApiError} if the request fails
	 */
	async deleteConnection(
		workspaceSlug: string,
		connectionId: string,
	): Promise<void> {
		await this.#api.DELETE(
			"/workspaces/{workspaceSlug}/connections/{connectionId}/",
			{
				params: { path: { workspaceSlug, connectionId } },
			},
		);
	}
}
