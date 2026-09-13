import type { ApiClient } from "@/client.js";
import type {
	CreateWorkspacePolicy,
	CursorPagination,
	UpdateWorkspacePolicy,
	WorkspacePoliciesQuery,
	WorkspacePolicy,
	WorkspacePolicySummaryPage,
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
	 * @param workspaceId - Workspace id
	 * @param query - Optional pagination parameters (limit, after)
	 * @returns Promise that resolves with a paginated list of policies
	 * @throws {ApiError} if the request fails
	 */
	async listPolicies(
		workspaceId: string,
		query?: CursorPagination & WorkspacePoliciesQuery,
	): Promise<WorkspacePolicySummaryPage> {
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
	 * @param workspaceId - Workspace id
	 * @param policy - Policy creation request
	 * @returns Promise that resolves with the created policy
	 * @throws {ApiError} if the request fails
	 */
	async createPolicy(
		workspaceId: string,
		policy: CreateWorkspacePolicy,
	): Promise<WorkspacePolicy> {
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
	 * Get policy details by id
	 * @param workspaceId - Workspace id
	 * @param policyId - Policy id
	 * @returns Promise that resolves with the policy details
	 * @throws {ApiError} if the request fails
	 */
	async getPolicy(
		workspaceId: string,
		policyId: string,
	): Promise<WorkspacePolicy> {
		const { data } = await this.#api.GET(
			"/workspaces/{workspaceId}/policies/{policyId}/",
			{
				params: { path: { workspaceId, policyId } },
			},
		);
		return data!;
	}

	/**
	 * Update a policy
	 * @param workspaceId - Workspace id
	 * @param policyId - Policy id
	 * @param updates - Policy update request
	 * @returns Promise that resolves with the updated policy
	 * @throws {ApiError} if the request fails
	 */
	async updatePolicy(
		workspaceId: string,
		policyId: string,
		updates: UpdateWorkspacePolicy,
	): Promise<WorkspacePolicy> {
		const { data } = await this.#api.PATCH(
			"/workspaces/{workspaceId}/policies/{policyId}/",
			{
				params: { path: { workspaceId, policyId } },
				body: updates,
			},
		);
		return data!;
	}

	/**
	 * Delete a policy
	 * @param workspaceId - Workspace id
	 * @param policyId - Policy id
	 * @returns Promise that resolves when the policy is deleted
	 * @throws {ApiError} if the request fails
	 */
	async deletePolicy(workspaceId: string, policyId: string): Promise<void> {
		await this.#api.DELETE("/workspaces/{workspaceId}/policies/{policyId}/", {
			params: { path: { workspaceId, policyId } },
		});
	}
}
