import type { ApiClient } from "@/client.js";
import type {
	ListMembersQuery,
	Member,
	Pagination,
	UpdateMember,
} from "@/datatypes/index.js";

/**
 * Service for handling member operations
 */
export class Members {
	#api: ApiClient;

	constructor(api: ApiClient) {
		this.#api = api;
	}

	/**
	 * List members of a workspace
	 * @param workspaceId - Workspace ID
	 * @param query - Optional query parameters (role, has2fa, sortBy, order, offset, limit)
	 * @returns Promise that resolves with the list of members
	 * @throws {ApiError} if the request fails
	 */
	async listMembers(
		workspaceId: string,
		query?: ListMembersQuery & Pagination,
	): Promise<Member[]> {
		const { data } = await this.#api.GET(
			"/workspaces/{workspace_id}/members/",
			{
				params: { path: { workspace_id: workspaceId }, query },
			},
		);
		return data!;
	}

	/**
	 * Get member details by account ID
	 * @param workspaceId - Workspace ID
	 * @param accountId - Account ID
	 * @returns Promise that resolves with the member details
	 * @throws {ApiError} if the request fails
	 */
	async getMember(workspaceId: string, accountId: string): Promise<Member> {
		const { data } = await this.#api.GET(
			"/workspaces/{workspace_id}/members/{account_id}/",
			{
				params: {
					path: { workspace_id: workspaceId, account_id: accountId },
				},
			},
		);
		return data!;
	}

	/**
	 * Update a member's role
	 * @param workspaceId - Workspace ID
	 * @param accountId - Account ID
	 * @param updates - New role for the member
	 * @returns Promise that resolves with the updated member
	 * @throws {ApiError} if the request fails
	 */
	async updateMember(
		workspaceId: string,
		accountId: string,
		updates: UpdateMember,
	): Promise<Member> {
		const { data } = await this.#api.PATCH(
			"/workspaces/{workspace_id}/members/{account_id}/role",
			{
				params: {
					path: { workspace_id: workspaceId, account_id: accountId },
				},
				body: updates,
			},
		);
		return data!;
	}

	/**
	 * Remove a member from a workspace
	 * @param workspaceId - Workspace ID
	 * @param accountId - Account ID
	 * @returns Promise that resolves when the member is removed
	 * @throws {ApiError} if the request fails
	 */
	async removeMember(workspaceId: string, accountId: string): Promise<void> {
		await this.#api.DELETE("/workspaces/{workspace_id}/members/{account_id}/", {
			params: { path: { workspace_id: workspaceId, account_id: accountId } },
		});
	}

	/**
	 * Leave a workspace
	 * @param workspaceId - Workspace ID
	 * @returns Promise that resolves when the member has left
	 * @throws {ApiError} if the request fails
	 */
	async leaveWorkspace(workspaceId: string): Promise<void> {
		await this.#api.POST("/workspaces/{workspace_id}/members/leave", {
			params: { path: { workspace_id: workspaceId } },
		});
	}
}
