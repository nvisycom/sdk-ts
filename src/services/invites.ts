import type { ApiClient } from "@/client.js";
import type {
	CreateInvite,
	CursorPagination,
	GenerateInviteCode,
	InviteCode,
	InvitePreview,
	InviteSent,
	InvitesPage,
	ListInvites,
	Member,
	ReplyInvite,
} from "@/datatypes/index.js";

/**
 * Service for handling workspace invitation operations
 */
export class Invites {
	#api: ApiClient;

	constructor(api: ApiClient) {
		this.#api = api;
	}

	/**
	 * List all invitations for a workspace
	 * @param workspaceId - Workspace ID
	 * @param query - Optional query parameters (role, sortBy, order, limit, after)
	 * @returns Promise that resolves with a paginated list of invitations
	 * @throws {ApiError} if the request fails
	 */
	async listInvites(
		workspaceSlug: string,
		query?: ListInvites & CursorPagination,
	): Promise<InvitesPage> {
		const { data } = await this.#api.GET(
			"/workspaces/{workspaceSlug}/invites/",
			{
				params: { path: { workspaceSlug }, query },
			},
		);
		return data!;
	}

	/**
	 * Send an invitation to join a workspace
	 * @param workspaceSlug - Workspace slug
	 * @param invite - Invitation request
	 * @returns Promise that resolves with the sent invitation
	 * @throws {ApiError} if the request fails
	 */
	async sendInvite(
		workspaceSlug: string,
		invite: CreateInvite,
	): Promise<InviteSent> {
		const { data } = await this.#api.POST(
			"/workspaces/{workspaceSlug}/invites/",
			{
				params: { path: { workspaceSlug } },
				body: invite,
			},
		);
		return data!;
	}

	/**
	 * Cancel a pending invitation
	 * @param workspaceSlug - Workspace slug
	 * @param inviteId - Invite ID
	 * @returns Promise that resolves when the invitation is canceled
	 * @throws {ApiError} if the request fails
	 */
	async cancelInvite(workspaceSlug: string, inviteId: string): Promise<void> {
		await this.#api.DELETE("/workspaces/{workspaceSlug}/invites/{inviteId}/", {
			params: { path: { workspaceSlug, inviteId } },
		});
	}

	/**
	 * Reply to an invitation (accept or decline)
	 * @param workspaceSlug - Workspace slug
	 * @param inviteId - Invite ID
	 * @param reply - Reply request
	 * @returns Promise that resolves with the updated invitation
	 * @throws {ApiError} if the request fails
	 */
	async replyToInvite(
		workspaceSlug: string,
		inviteId: string,
		reply: ReplyInvite,
	): Promise<Member> {
		const { data } = await this.#api.POST(
			"/workspaces/{workspaceSlug}/invites/{inviteId}/",
			{
				params: { path: { workspaceSlug, inviteId } },
				body: reply,
			},
		);
		return data!;
	}

	/**
	 * Generate a shareable invite code for a workspace
	 * @param workspaceSlug - Workspace slug
	 * @param options - Invite code generation options
	 * @returns Promise that resolves with the generated invite code
	 * @throws {ApiError} if the request fails
	 */
	async generateInviteCode(
		workspaceSlug: string,
		options: GenerateInviteCode,
	): Promise<InviteCode> {
		const { data } = await this.#api.POST(
			"/workspaces/{workspaceSlug}/invites/code/",
			{
				params: { path: { workspaceSlug } },
				body: options,
			},
		);
		return data!;
	}

	/**
	 * Reply to an invite code (accept or decline)
	 * @param inviteCode - The invite code
	 * @param reply - Optional reply request (defaults to accept if not provided)
	 * @returns Promise that resolves with the member details if accepted, null if declined
	 * @throws {ApiError} if the request fails
	 */
	async replyToInviteCode(
		inviteCode: string,
		reply?: ReplyInvite | null,
	): Promise<Member | null> {
		const { data } = await this.#api.POST("/invites/code/{inviteCode}/", {
			params: { path: { inviteCode } },
			body: reply ?? null,
		});
		return data!;
	}

	/**
	 * Preview an invite code without joining
	 * @param inviteCode - The invite code
	 * @returns Promise that resolves with the invite preview details
	 * @throws {ApiError} if the request fails
	 */
	async previewInvite(inviteCode: string): Promise<InvitePreview> {
		const { data } = await this.#api.GET("/invites/code/{inviteCode}/", {
			params: { path: { inviteCode } },
		});
		return data!;
	}
}
