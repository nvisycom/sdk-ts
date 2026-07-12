import type { ApiClient } from "@/client.js";
import type {
	CreatePolicy,
	CursorPagination,
	PoliciesPage,
	Policy,
	UpdatePolicy,
} from "@/datatypes/index.js";

/**
 * Service for handling policy operations
 */
export class Policies {
	#api: ApiClient;

	constructor(api: ApiClient) {
		this.#api = api;
	}

	/**
	 * List policies in a workspace
	 * @param workspaceId - Workspace ID
	 * @param query - Optional pagination parameters (limit, after)
	 * @returns Promise that resolves with a paginated list of policies
	 * @throws {ApiError} if the request fails
	 */
	async listPolicies(
		workspaceId: string,
		query?: CursorPagination,
	): Promise<PoliciesPage> {
		const { data } = await this.#api.GET(
			"/workspaces/{workspaceId}/policies/",
			{
				params: { path: { workspaceId }, query },
			},
		);
		return data!;
	}

	/**
	 * Create a policy in a workspace
	 * @param workspaceId - Workspace ID
	 * @param policy - Policy creation request
	 * @returns Promise that resolves with the created policy
	 * @throws {ApiError} if the request fails
	 */
	async createPolicy(
		workspaceId: string,
		policy: CreatePolicy,
	): Promise<Policy> {
		const { data } = await this.#api.POST(
			"/workspaces/{workspaceId}/policies/",
			{
				params: { path: { workspaceId } },
				body: policy,
			},
		);
		return data!;
	}

	/**
	 * Get policy details by ID
	 * @param policyId - Policy ID
	 * @returns Promise that resolves with the policy details
	 * @throws {ApiError} if the request fails
	 */
	async getPolicy(policyId: string): Promise<Policy> {
		const { data } = await this.#api.GET("/policies/{policyId}/", {
			params: { path: { policyId } },
		});
		return data!;
	}

	/**
	 * Update a policy
	 * @param policyId - Policy ID
	 * @param updates - Policy update request
	 * @returns Promise that resolves with the updated policy
	 * @throws {ApiError} if the request fails
	 */
	async updatePolicy(policyId: string, updates: UpdatePolicy): Promise<Policy> {
		const { data } = await this.#api.PUT("/policies/{policyId}/", {
			params: { path: { policyId } },
			body: updates,
		});
		return data!;
	}

	/**
	 * Delete a policy
	 * @param policyId - Policy ID
	 * @returns Promise that resolves when the policy is deleted
	 * @throws {ApiError} if the request fails
	 */
	async deletePolicy(policyId: string): Promise<void> {
		await this.#api.DELETE("/policies/{policyId}/", {
			params: { path: { policyId } },
		});
	}
}
