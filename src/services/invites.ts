import type { ApiClient } from "@/client.js";
import type {
	CreateInvite,
	GenerateInviteCode,
	Invite,
	InviteCode,
	ListInvitesQuery,
	Member,
	Pagination,
	ReplyInvite,
} from "@/datatypes/index.js";

/**
 * Service for handling workspace invitation operations
 */
export class InvitesService {
	#api: ApiClient;

	constructor(api: ApiClient) {
		this.#api = api;
	}

	/**
	 * List all invitations for a workspace
	 * @param workspaceId - Workspace ID
	 * @param query - Optional query parameters (role, sortBy, order, offset, limit)
	 * @returns Promise that resolves with the list of invitations
	 * @throws {ApiError} if the request fails
	 */
	async list(
		workspaceId: string,
		query?: ListInvitesQuery & Pagination,
	): Promise<Invite[]> {
		const { data } = await this.#api.GET(
			"/workspaces/{workspace_id}/invites/",
			{
				params: { path: { workspaceId }, query },
			},
		);
		return data!;
	}

	/**
	 * Send an invitation to join a workspace
	 * @param workspaceId - Workspace ID
	 * @param invite - Invitation request
	 * @returns Promise that resolves with the created invitation
	 * @throws {ApiError} if the request fails
	 */
	async send(workspaceId: string, invite: CreateInvite): Promise<Invite> {
		const { data } = await this.#api.POST(
			"/workspaces/{workspace_id}/invites/",
			{
				params: { path: { workspaceId } },
				body: invite,
			},
		);
		return data!;
	}

	/**
	 * Cancel a pending invitation
	 * @param inviteId - Invite ID
	 * @returns Promise that resolves when the invitation is canceled
	 * @throws {ApiError} if the request fails
	 */
	async cancel(inviteId: string): Promise<void> {
		await this.#api.DELETE("/invites/{invite_id}/", {
			params: { path: { inviteId } },
		});
	}

	/**
	 * Reply to an invitation (accept or decline)
	 * @param inviteId - Invite ID
	 * @param reply - Reply request
	 * @returns Promise that resolves with the updated invitation
	 * @throws {ApiError} if the request fails
	 */
	async reply(inviteId: string, reply: ReplyInvite): Promise<Invite> {
		const { data } = await this.#api.PATCH("/invites/{invite_id}/reply/", {
			params: { path: { inviteId } },
			body: reply,
		});
		return data!;
	}

	/**
	 * Generate a shareable invite code for a workspace
	 * @param workspaceId - Workspace ID
	 * @param options - Invite code generation options
	 * @returns Promise that resolves with the generated invite code
	 * @throws {ApiError} if the request fails
	 */
	async generateCode(
		workspaceId: string,
		options: GenerateInviteCode,
	): Promise<InviteCode> {
		const { data } = await this.#api.POST(
			"/workspaces/{workspace_id}/invites/code/",
			{
				params: { path: { workspaceId } },
				body: options,
			},
		);
		return data!;
	}

	/**
	 * Join a workspace using an invite code
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
