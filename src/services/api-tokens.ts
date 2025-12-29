import type { ApiClient } from "@/client.js";
import { unwrap } from "@/errors.js";
import type { ApiToken, ApiTokenWithSecret, CreateApiToken, UpdateApiToken } from "@/datatypes/index.js";

/**
 * Service for handling API token operations
 */
export class ApiTokensService {
  #api: ApiClient;

  constructor(api: ApiClient) {
    this.#api = api;
  }

  /**
   * List all API tokens for the authenticated account
   * @param options - Pagination options
   * @returns Promise that resolves with the list of API tokens
   * @throws {ApiError} if the request fails
   */
  async list(options?: { offset?: number; limit?: number }): Promise<ApiToken[]> {
    const result = await this.#api.GET("/api-tokens/", {
      params: { query: options },
    });
    return unwrap(result);
  }

  /**
   * Get a specific API token by access token
   * @param accessToken - The access token identifier
   * @returns Promise that resolves with the API token details
   * @throws {ApiError} if the request fails
   */
  async get(accessToken: string): Promise<ApiToken> {
    const result = await this.#api.GET("/api-tokens/{access_token}/" as "/api-tokens/{access_token}/", {
      params: { path: { access_token: accessToken } as never },
    });
    return unwrap(result);
  }

  /**
   * Create a new API token
   * @param token - Token creation request
   * @returns Promise that resolves with the created token (includes secret, shown only once)
   * @throws {ApiError} if the request fails
   */
  async create(token: CreateApiToken): Promise<ApiTokenWithSecret> {
    const result = await this.#api.POST("/api-tokens/", {
      body: token,
    });
    return unwrap(result);
  }

  /**
   * Update an existing API token
   * @param accessToken - The access token identifier
   * @param updates - Token update request
   * @returns Promise that resolves with the updated token
   * @throws {ApiError} if the request fails
   */
  async update(accessToken: string, updates: UpdateApiToken): Promise<ApiToken> {
    const result = await this.#api.PATCH("/api-tokens/{access_token}/" as "/api-tokens/{access_token}/", {
      params: { path: { access_token: accessToken } as never },
      body: updates,
    });
    return unwrap(result);
  }

  /**
   * Revoke an API token
   * @param accessToken - The access token identifier
   * @returns Promise that resolves when the token is revoked
   * @throws {ApiError} if the request fails
   */
  async revoke(accessToken: string): Promise<void> {
    const result = await this.#api.DELETE("/api-tokens/{access_token}/" as "/api-tokens/{access_token}/", {
      params: { path: { access_token: accessToken } as never },
    });
    unwrap(result);
  }
}
