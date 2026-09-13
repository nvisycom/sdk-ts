import type { ApiClient } from "@/client.js";
import type {
	CreateWorkspaceConnection,
	CursorPagination,
	ExportWorkspaceFiles,
	FileServiceProvider,
	ImportWorkspaceFiles,
	OAuthStartResponse,
	StartFileServiceOAuth,
	UpdateWorkspaceConnection,
	WorkspaceConnection,
	WorkspaceConnectionPage,
	WorkspaceConnectionSync,
	WorkspaceConnectionVerification,
	WorkspacePickerToken,
	WorkspacePickerTokenRequest,
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
	 * @param workspaceId - Workspace id
	 * @param query - Optional query parameters (provider, limit, after)
	 * @returns Promise that resolves with a paginated list of connections
	 * @throws {ApiError} if the request fails
	 */
	async listConnections(
		workspaceId: string,
		query?: CursorPagination & { provider?: string[] },
	): Promise<WorkspaceConnectionPage> {
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
	 * @param workspaceId - Workspace id
	 * @param connection - Connection creation request
	 * @returns Promise that resolves with the created connection
	 * @throws {ApiError} if the request fails
	 */
	async createConnection(
		workspaceId: string,
		connection: CreateWorkspaceConnection,
	): Promise<WorkspaceConnection> {
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
	 * @param workspaceId - Workspace id
	 * @param connectionId - Connection ID
	 * @returns Promise that resolves with the connection details
	 * @throws {ApiError} if the request fails
	 */
	async getConnection(
		workspaceId: string,
		connectionId: string,
	): Promise<WorkspaceConnection> {
		const { data } = await this.#api.GET(
			"/workspaces/{workspaceId}/connections/{connectionId}/",
			{
				params: { path: { workspaceId, connectionId } },
			},
		);
		return data!;
	}

	/**
	 * Update a connection
	 * @param workspaceId - Workspace id
	 * @param connectionId - Connection ID
	 * @param updates - Connection update request
	 * @returns Promise that resolves with the updated connection
	 * @throws {ApiError} if the request fails
	 */
	async updateConnection(
		workspaceId: string,
		connectionId: string,
		updates: UpdateWorkspaceConnection,
	): Promise<WorkspaceConnection> {
		const { data } = await this.#api.PATCH(
			"/workspaces/{workspaceId}/connections/{connectionId}/",
			{
				params: { path: { workspaceId, connectionId } },
				body: updates,
			},
		);
		return data!;
	}

	/**
	 * Delete a connection
	 * @param workspaceId - Workspace id
	 * @param connectionId - Connection ID
	 * @returns Promise that resolves when the connection is deleted
	 * @throws {ApiError} if the request fails
	 */
	async deleteConnection(
		workspaceId: string,
		connectionId: string,
	): Promise<void> {
		await this.#api.DELETE(
			"/workspaces/{workspaceId}/connections/{connectionId}/",
			{
				params: { path: { workspaceId, connectionId } },
			},
		);
	}

	/**
	 * Verify a connection's configuration and credentials
	 * @param workspaceId - Workspace id
	 * @param connectionId - Connection ID
	 * @returns Promise that resolves with the verification result
	 * @throws {ApiError} if the request fails
	 */
	async verifyConnection(
		workspaceId: string,
		connectionId: string,
	): Promise<WorkspaceConnectionVerification> {
		const { data } = await this.#api.POST(
			"/workspaces/{workspaceId}/connections/{connectionId}/verify/",
			{
				params: { path: { workspaceId, connectionId } },
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
	 * @param workspaceId - Workspace id
	 * @param provider - The file-service provider to connect
	 * @param request - Display name for the connection and optional sync root
	 * @returns Promise that resolves with the provider authorize URL
	 * @throws {ApiError} if the request fails
	 */
	async startFileServiceOAuth(
		workspaceId: string,
		provider: FileServiceProvider,
		request: StartFileServiceOAuth,
	): Promise<OAuthStartResponse> {
		const { data } = await this.#api.POST(
			"/workspaces/{workspaceId}/connections/oauth/{provider}/start/",
			{
				params: { path: { workspaceId, provider } },
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
	 * @param workspaceId - Workspace id
	 * @param connectionId - Connection ID
	 * @param request - The picker-selected files to import
	 * @returns Promise that resolves with the created connection sync
	 * @throws {ApiError} if the request fails
	 */
	async importFiles(
		workspaceId: string,
		connectionId: string,
		request: ImportWorkspaceFiles,
	): Promise<WorkspaceConnectionSync> {
		const { data } = await this.#api.POST(
			"/workspaces/{workspaceId}/connections/{connectionId}/import/",
			{
				params: { path: { workspaceId, connectionId } },
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
	 * @param workspaceId - Workspace id
	 * @param connectionId - Connection ID
	 * @param request - The workspace file ids to export
	 * @returns Promise that resolves with the created connection sync
	 * @throws {ApiError} if the request fails
	 */
	async exportFiles(
		workspaceId: string,
		connectionId: string,
		request: ExportWorkspaceFiles,
	): Promise<WorkspaceConnectionSync> {
		const { data } = await this.#api.POST(
			"/workspaces/{workspaceId}/connections/{connectionId}/export/",
			{
				params: { path: { workspaceId, connectionId } },
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
	 * @param workspaceId - Workspace id
	 * @param connectionId - Connection ID
	 * @param request - Optional picker resource (defaults to the connection's)
	 * @returns Promise that resolves with the short-lived picker token
	 * @throws {ApiError} if the request fails
	 */
	async getPickerToken(
		workspaceId: string,
		connectionId: string,
		request: WorkspacePickerTokenRequest = {},
	): Promise<WorkspacePickerToken> {
		const { data } = await this.#api.POST(
			"/workspaces/{workspaceId}/connections/{connectionId}/picker-token/",
			{
				params: { path: { workspaceId, connectionId } },
				body: request,
			},
		);
		return data!;
	}
}
