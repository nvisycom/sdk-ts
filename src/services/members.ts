import type { ApiClient } from "@/client.js";
import type {
	Member,
	Pagination,
	UpdateMemberRole,
} from "@/datatypes/index.js";
import { unwrap } from "@/errors.js";

/**
 * Service for handling member operations
 */
export class MembersService {
	#api: ApiClient;

	constructor(api: ApiClient) {
		this.#api = api;
	}

	/**
	 * List members of a project
	 * @param projectId - Project ID
	 * @param pagination - Pagination parameters
	 * @returns Promise that resolves with the list of members
	 * @throws {ApiError} if the request fails
	 */
	async list(projectId: string, pagination?: Pagination): Promise<Member[]> {
		const result = await this.#api.GET("/projects/{project_id}/members/", {
			params: { path: { projectId } },
			body: pagination ?? {},
		});
		return unwrap(result);
	}

	/**
	 * Get member details by account ID
	 * @param projectId - Project ID
	 * @param accountId - Account ID
	 * @returns Promise that resolves with the member details
	 * @throws {ApiError} if the request fails
	 */
	async get(projectId: string, accountId: string): Promise<Member> {
		const result = await this.#api.GET(
			"/projects/{project_id}/members/{account_id}/",
			{
				params: { path: { projectId, accountId } },
			},
		);
		return unwrap(result);
	}

	/**
	 * Update a member's role
	 * @param projectId - Project ID
	 * @param accountId - Account ID
	 * @param role - New role for the member
	 * @returns Promise that resolves with the updated member
	 * @throws {ApiError} if the request fails
	 */
	async updateRole(
		projectId: string,
		accountId: string,
		role: UpdateMemberRole,
	): Promise<Member> {
		const result = await this.#api.PATCH(
			"/projects/{project_id}/members/{account_id}/role",
			{
				params: { path: { projectId, accountId } },
				body: role,
			},
		);
		return unwrap(result);
	}

	/**
	 * Remove a member from a project
	 * @param projectId - Project ID
	 * @param accountId - Account ID
	 * @returns Promise that resolves when the member is removed
	 * @throws {ApiError} if the request fails
	 */
	async remove(projectId: string, accountId: string): Promise<void> {
		const result = await this.#api.DELETE(
			"/projects/{project_id}/members/{account_id}/",
			{
				params: { path: { projectId, accountId } },
			},
		);
		unwrap(result);
	}

	/**
	 * Leave a project
	 * @param projectId - Project ID
	 * @returns Promise that resolves when the member has left
	 * @throws {ApiError} if the request fails
	 */
	async leave(projectId: string): Promise<void> {
		const result = await this.#api.POST(
			"/projects/{project_id}/members/leave",
			{
				params: { path: { projectId } },
			},
		);
		unwrap(result);
	}
}
