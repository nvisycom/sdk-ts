import type { ApiClient } from "@/client.js";
import type {
	CreateWorkspaceInvite,
	CursorPagination,
	GenerateWorkspaceInviteCode,
	InvitePreview,
	ListWorkspaceInvites,
	ReplyWorkspaceInvite,
	WorkspaceInviteCode,
	WorkspaceInvitePage,
	WorkspaceInviteSent,
	WorkspaceMember,
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
		workspaceId: string,
		query?: ListWorkspaceInvites & CursorPagination,
	): Promise<WorkspaceInvitePage> {
		const { data } = await this.#api.GET("/workspaces/{workspaceId}/invites/", {
			params: { path: { workspaceId }, query },
		});
		return data!;
	}

	/**
	 * Send an invitation to join a workspace
	 * @param workspaceId - Workspace id
	 * @param invite - Invitation request
	 * @returns Promise that resolves with the sent invitation
	 * @throws {ApiError} if the request fails
	 */
	async sendInvite(
		workspaceId: string,
		invite: CreateWorkspaceInvite,
	): Promise<WorkspaceInviteSent> {
		const { data } = await this.#api.POST(
			"/workspaces/{workspaceId}/invites/",
			{
				params: { path: { workspaceId } },
				body: invite,
			},
		);
		return data!;
	}

	/**
	 * Cancel a pending invitation
	 * @param workspaceId - Workspace id
	 * @param inviteId - Invite ID
	 * @returns Promise that resolves when the invitation is canceled
	 * @throws {ApiError} if the request fails
	 */
	async cancelInvite(workspaceId: string, inviteId: string): Promise<void> {
		await this.#api.DELETE("/workspaces/{workspaceId}/invites/{inviteId}/", {
			params: { path: { workspaceId, inviteId } },
		});
	}

	/**
	 * Reply to an invitation (accept or decline)
	 * @param workspaceId - Workspace id
	 * @param inviteId - Invite ID
	 * @param reply - Reply request
	 * @returns Promise that resolves with the updated invitation
	 * @throws {ApiError} if the request fails
	 */
	async replyToInvite(
		workspaceId: string,
		inviteId: string,
		reply: ReplyWorkspaceInvite,
	): Promise<WorkspaceMember> {
		const { data } = await this.#api.POST(
			"/workspaces/{workspaceId}/invites/{inviteId}/",
			{
				params: { path: { workspaceId, inviteId } },
				body: reply,
			},
		);
		return data!;
	}

	/**
	 * Generate a shareable invite code for a workspace
	 * @param workspaceId - Workspace id
	 * @param options - Invite code generation options
	 * @returns Promise that resolves with the generated invite code
	 * @throws {ApiError} if the request fails
	 */
	async generateInviteCode(
		workspaceId: string,
		options: GenerateWorkspaceInviteCode,
	): Promise<WorkspaceInviteCode> {
		const { data } = await this.#api.POST(
			"/workspaces/{workspaceId}/invites/code/",
			{
				params: { path: { workspaceId } },
				body: options,
			},
		);
		return data!;
	}

	/**
	 * Reply to an invite code (accept or decline)
	 * @param inviteCode - The invite code
	 * @param reply - Reply request (accept or decline the invitation)
	 * @returns Promise that resolves with the member details if accepted, null if declined
	 * @throws {ApiError} if the request fails
	 */
	async replyToInviteCode(
		inviteCode: string,
		reply: ReplyWorkspaceInvite,
	): Promise<WorkspaceMember | null> {
		const { data } = await this.#api.POST("/invites/code/{inviteCode}/", {
			params: { path: { inviteCode } },
			body: reply,
		});
		return data ?? null;
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
