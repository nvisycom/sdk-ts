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
		const { data } = await this.#api.GET("/projects/{project_id}/invites/", {
			params: { path: { projectId } },
			body: pagination ?? {},
		});
		return data!;
	}

	/**
	 * Send an invitation to join a project
	 * @param projectId - Project ID
	 * @param invite - Invitation request
	 * @returns Promise that resolves with the created invitation
	 * @throws {ApiError} if the request fails
	 */
	async send(projectId: string, invite: CreateInvite): Promise<Invite> {
		const { data } = await this.#api.POST("/projects/{project_id}/invites/", {
			params: { path: { projectId } },
			body: invite,
		});
		return data!;
	}

	/**
	 * Cancel a pending invitation
	 * @param projectId - Project ID
	 * @param inviteId - Invite ID
	 * @returns Promise that resolves when the invitation is canceled
	 * @throws {ApiError} if the request fails
	 */
	async cancel(projectId: string, inviteId: string): Promise<void> {
		await this.#api.DELETE("/projects/{project_id}/invites/{invite_id}/", {
			params: { path: { projectId, inviteId } },
		});
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
		const { data } = await this.#api.PATCH(
			"/projects/{project_id}/invites/{invite_id}/reply/",
			{
				params: { path: { projectId, inviteId } },
				body: reply,
			},
		);
		return data!;
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
		const { data } = await this.#api.POST(
			"/projects/{project_id}/invites/code/",
			{
				params: { path: { projectId } },
				body: options,
			},
		);
		return data!;
	}

	/**
	 * Join a project using an invite code
	 * @param inviteCode - The invite code
	 * @returns Promise that resolves with the member details
	 * @throws {ApiError} if the request fails
	 */
	async joinWithCode(inviteCode: string): Promise<Member> {
		const { data } = await this.#api.POST("/invites/{invite_code}/join/", {
			params: { path: { inviteCode } },
		});
		return data!;
	}
}
