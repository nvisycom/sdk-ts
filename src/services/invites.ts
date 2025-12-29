import type { ApiClient } from "@/client.js";
import type {
	CreateInvite,
	GenerateInviteCode,
	Invite,
	InviteCode,
	Member,
	Pagination,
	ReplyInvite,
} from "@/datatypes/index.js";
import { unwrap } from "@/errors.js";

/**
 * Service for handling project invitation operations
 */
export class InvitesService {
	#api: ApiClient;

	constructor(api: ApiClient) {
		this.#api = api;
	}

	/**
	 * List all invitations for a project
	 * @param projectId - Project ID
	 * @param pagination - Pagination parameters
	 * @returns Promise that resolves with the list of invitations
	 * @throws {ApiError} if the request fails
	 */
	async list(projectId: string, pagination?: Pagination): Promise<Invite[]> {
		const result = await this.#api.GET("/projects/{project_id}/invites/", {
			params: { path: { projectId } },
			body: pagination ?? {},
		});
		return unwrap(result);
	}

	/**
	 * Send an invitation to join a project
	 * @param projectId - Project ID
	 * @param invite - Invitation request
	 * @returns Promise that resolves with the created invitation
	 * @throws {ApiError} if the request fails
	 */
	async send(projectId: string, invite: CreateInvite): Promise<Invite> {
		const result = await this.#api.POST("/projects/{project_id}/invites/", {
			params: { path: { projectId } },
			body: invite,
		});
		return unwrap(result);
	}

	/**
	 * Cancel a pending invitation
	 * @param projectId - Project ID
	 * @param inviteId - Invite ID
	 * @returns Promise that resolves when the invitation is canceled
	 * @throws {ApiError} if the request fails
	 */
	async cancel(projectId: string, inviteId: string): Promise<void> {
		const result = await this.#api.DELETE(
			"/projects/{project_id}/invites/{invite_id}/",
			{
				params: { path: { projectId, inviteId } },
			},
		);
		unwrap(result);
	}

	/**
	 * Reply to an invitation (accept or decline)
	 * @param projectId - Project ID
	 * @param inviteId - Invite ID
	 * @param reply - Reply request
	 * @returns Promise that resolves with the updated invitation
	 * @throws {ApiError} if the request fails
	 */
	async reply(
		projectId: string,
		inviteId: string,
		reply: ReplyInvite,
	): Promise<Invite> {
		const result = await this.#api.PATCH(
			"/projects/{project_id}/invites/{invite_id}/reply/",
			{
				params: { path: { projectId, inviteId } },
				body: reply,
			},
		);
		return unwrap(result);
	}

	/**
	 * Generate a shareable invite code for a project
	 * @param projectId - Project ID
	 * @param options - Invite code generation options
	 * @returns Promise that resolves with the generated invite code
	 * @throws {ApiError} if the request fails
	 */
	async generateCode(
		projectId: string,
		options: GenerateInviteCode,
	): Promise<InviteCode> {
		const result = await this.#api.POST(
			"/projects/{project_id}/invites/code/",
			{
				params: { path: { projectId } },
				body: options,
			},
		);
		return unwrap(result);
	}

	/**
	 * Join a project using an invite code
	 * @param inviteCode - The invite code
	 * @returns Promise that resolves with the member details
	 * @throws {ApiError} if the request fails
	 */
	async joinWithCode(inviteCode: string): Promise<Member> {
		const result = await this.#api.POST("/invites/{invite_code}/join/", {
			params: { path: { inviteCode } },
		});
		return unwrap(result);
	}
}
