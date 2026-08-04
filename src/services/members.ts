import type { ApiClient } from "@/client.js";
import type {
	CursorPagination,
	ListMembers,
	Member,
	MemberPage,
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
	 * @param workspaceSlug - Workspace slug
	 * @param query - Optional query parameters (role, has2fa, sortBy, order, limit, after)
	 * @returns Promise that resolves with a paginated list of members
	 * @throws {ApiError} if the request fails
	 */
	async listMembers(
		workspaceSlug: string,
		query?: ListMembers & CursorPagination,
	): Promise<MemberPage> {
		const { data } = await this.#api.GET(
			"/workspaces/{workspaceSlug}/members/",
			{
				params: { path: { workspaceSlug }, query },
			},
		);
		return data!;
	}

	/**
	 * Get member details by username
	 * @param workspaceSlug - Workspace slug
	 * @param username - Member username
	 * @returns Promise that resolves with the member details
	 * @throws {ApiError} if the request fails
	 */
	async getMember(workspaceSlug: string, username: string): Promise<Member> {
		const { data } = await this.#api.GET(
			"/workspaces/{workspaceSlug}/members/{username}/",
			{
				params: {
					path: { workspaceSlug, username },
				},
			},
		);
		return data!;
	}

	/**
	 * Update a member's role
	 * @param workspaceSlug - Workspace slug
	 * @param username - Member username
	 * @param updates - New role for the member
	 * @returns Promise that resolves with the updated member
	 * @throws {ApiError} if the request fails
	 */
	async updateMember(
		workspaceSlug: string,
		username: string,
		updates: UpdateMember,
	): Promise<Member> {
		const { data } = await this.#api.PATCH(
			"/workspaces/{workspaceSlug}/members/{username}/",
			{
				params: {
					path: { workspaceSlug, username },
				},
				body: updates,
			},
		);
		return data!;
	}

	/**
	 * Remove a member from a workspace
	 * @param workspaceSlug - Workspace slug
	 * @param username - Member username
	 * @returns Promise that resolves when the member is removed
	 * @throws {ApiError} if the request fails
	 */
	async removeMember(workspaceSlug: string, username: string): Promise<void> {
		await this.#api.DELETE("/workspaces/{workspaceSlug}/members/{username}/", {
			params: { path: { workspaceSlug, username } },
		});
	}

	/**
	 * Leave a workspace
	 * @param workspaceSlug - Workspace slug
	 * @returns Promise that resolves when the member has left
	 * @throws {ApiError} if the request fails
	 */
	async leaveWorkspace(workspaceSlug: string): Promise<void> {
		await this.#api.POST("/workspaces/{workspaceSlug}/members/leave/", {
			params: { path: { workspaceSlug } },
		});
	}
}
