import type { ApiClient } from "@/client.js";
import type {
	Connection,
	ConnectionPage,
	ConnectionSync,
	ConnectionVerification,
	CreateConnection,
	CursorPagination,
	ExportFiles,
	ImportFiles,
	OAuthStartResponse,
	PickerToken,
	Provider,
	StartFileServiceOAuth,
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
		query?: CursorPagination & { provider?: string[] },
	): Promise<ConnectionPage> {
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
		const { data } = await this.#api.PATCH(
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

	/**
	 * Verify a connection's configuration and credentials
	 * @param workspaceSlug - Workspace slug
	 * @param connectionId - Connection ID
	 * @returns Promise that resolves with the verification result
	 * @throws {ApiError} if the request fails
	 */
	async verifyConnection(
		workspaceSlug: string,
		connectionId: string,
	): Promise<ConnectionVerification> {
		const { data } = await this.#api.POST(
			"/workspaces/{workspaceSlug}/connections/{connectionId}/verify/",
			{
				params: { path: { workspaceSlug, connectionId } },
			},
		);
		return data!;
	}

	/**
	 * Start the OAuth flow to connect a file-service provider.
	 *
	 * Returns an `authorizeUrl` to send the user to; on their consent the
	 * provider redirects back and the connection is created. Navigate the
	 * browser to the URL (a full-page redirect, not a fetch) to continue.
	 *
	 * @param workspaceSlug - Workspace slug
	 * @param provider - The file-service provider to connect
	 * @param request - Display name for the connection and optional sync root
	 * @returns Promise that resolves with the provider authorize URL
	 * @throws {ApiError} if the request fails
	 */
	async startFileServiceOAuth(
		workspaceSlug: string,
		provider: Provider,
		request: StartFileServiceOAuth,
	): Promise<OAuthStartResponse> {
		const { data } = await this.#api.POST(
			"/workspaces/{workspaceSlug}/connections/oauth/{provider}/start/",
			{
				params: { path: { workspaceSlug, provider } },
				body: request,
			},
		);
		return data!;
	}

	/**
	 * Import picker-selected files from a file-service connection.
	 *
	 * Takes the files the user chose in the provider's picker (id + name each);
	 * already-imported files are skipped. Returns the created sync — poll it for
	 * completion.
	 *
	 * @param workspaceSlug - Workspace slug
	 * @param connectionId - Connection ID
	 * @param request - The picker-selected files to import
	 * @returns Promise that resolves with the created connection sync
	 * @throws {ApiError} if the request fails
	 */
	async importFiles(
		workspaceSlug: string,
		connectionId: string,
		request: ImportFiles,
	): Promise<ConnectionSync> {
		const { data } = await this.#api.POST(
			"/workspaces/{workspaceSlug}/connections/{connectionId}/import/",
			{
				params: { path: { workspaceSlug, connectionId } },
				body: request,
			},
		);
		return data!;
	}

	/**
	 * Export workspace files to a file-service connection.
	 *
	 * Each file's redacted output is written to the connection as a new provider
	 * file, never overwriting the source. Returns the created sync — poll it for
	 * completion.
	 *
	 * @param workspaceSlug - Workspace slug
	 * @param connectionId - Connection ID
	 * @param request - The workspace file ids to export
	 * @returns Promise that resolves with the created connection sync
	 * @throws {ApiError} if the request fails
	 */
	async exportFiles(
		workspaceSlug: string,
		connectionId: string,
		request: ExportFiles,
	): Promise<ConnectionSync> {
		const { data } = await this.#api.POST(
			"/workspaces/{workspaceSlug}/connections/{connectionId}/export/",
			{
				params: { path: { workspaceSlug, connectionId } },
				body: request,
			},
		);
		return data!;
	}

	/**
	 * Mint a short-lived provider access token for a browser file picker.
	 *
	 * For file-service connections with a token-based picker only. The token is
	 * minted from the connection's stored credentials and is short-lived; the
	 * refresh token is never returned.
	 *
	 * @param workspaceSlug - Workspace slug
	 * @param connectionId - Connection ID
	 * @returns Promise that resolves with the short-lived picker token
	 * @throws {ApiError} if the request fails
	 */
	async getPickerToken(
		workspaceSlug: string,
		connectionId: string,
	): Promise<PickerToken> {
		const { data } = await this.#api.POST(
			"/workspaces/{workspaceSlug}/connections/{connectionId}/picker-token/",
			{
				params: { path: { workspaceSlug, connectionId } },
			},
		);
		return data!;
	}
}
