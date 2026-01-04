import type { ApiClient } from "@/client.js";
import type {
	ApiToken,
	ApiTokensPage,
	ApiTokenWithJWT,
	CreateApiToken,
	CursorPagination,
	UpdateApiToken,
} from "@/datatypes/index.js";

/**
 * Service for handling API token operations
 */
export class ApiTokens {
	#api: ApiClient;

	constructor(api: ApiClient) {
		this.#api = api;
	}

	/**
	 * List all API tokens for the authenticated account
	 * @param query - Optional pagination parameters (limit, after)
	 * @returns Promise that resolves with a paginated list of API tokens
	 * @throws {ApiError} if the request fails
	 */
	async listApiTokens(query?: CursorPagination): Promise<ApiTokensPage> {
		const { data } = await this.#api.GET("/api-tokens/", {
			params: { query },
		});
		return data!;
	}

	/**
	 * Get a specific API token by token ID
	 * @param tokenId - The token identifier
	 * @returns Promise that resolves with the API token details
	 * @throws {ApiError} if the request fails
	 */
	async getApiToken(tokenId: string): Promise<ApiToken> {
		const { data } = await this.#api.GET("/api-tokens/{tokenId}/", {
			params: { path: { tokenId } },
		});
		return data!;
	}

	/**
	 * Create a new API token
	 * @param token - Token creation request
	 * @returns Promise that resolves with the created token (includes JWT, shown only once)
	 * @throws {ApiError} if the request fails
	 */
	async createApiToken(token: CreateApiToken): Promise<ApiTokenWithJWT> {
		const { data } = await this.#api.POST("/api-tokens/", {
			body: token,
		});
		return data!;
	}

	/**
	 * Update an existing API token
	 * @param tokenId - The token identifier
	 * @param updates - Token update request
	 * @returns Promise that resolves with the updated token
	 * @throws {ApiError} if the request fails
	 */
	async updateApiToken(
		tokenId: string,
		updates: UpdateApiToken,
	): Promise<ApiToken> {
		const { data } = await this.#api.PATCH("/api-tokens/{tokenId}/", {
			params: { path: { tokenId } },
			body: updates,
		});
		return data!;
	}

	/**
	 * Revoke an API token
	 * @param tokenId - The token identifier
	 * @returns Promise that resolves when the token is revoked
	 * @throws {ApiError} if the request fails
	 */
	async revokeApiToken(tokenId: string): Promise<void> {
		await this.#api.DELETE("/api-tokens/{tokenId}/", {
			params: { path: { tokenId } },
		});
	}
}
