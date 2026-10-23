import type { components } from "@/schema/api.js";

type Schemas = components["schemas"];

// Invite resources.
/** Workspace invite with complete information. */
export type WorkspaceInvite = Schemas["WorkspaceInvite"];
/** Acknowledgement returned after sending a workspace invitation. */
export type WorkspaceInviteSent = Schemas["WorkspaceInviteSent"];
/** Request payload for creating a new workspace invite. */
export type CreateWorkspaceInvite = Schemas["CreateWorkspaceInvite"];
/** Request to respond to a workspace invitation. */
export type ReplyWorkspaceInvite = Schemas["ReplyWorkspaceInvite"];
/** Request to generate a shareable invite code for a workspace. */
export type GenerateWorkspaceInviteCode =
	Schemas["GenerateWorkspaceInviteCode"];
/**
 * Response for a freshly generated shareable invite code: the full invite
 * plus its raw, show-once code.
 */
export type WorkspaceInviteCode = Schemas["WorkspaceInviteCode"];
/** The current status of a workspace invitation. */
export type InviteStatus = Schemas["InviteStatus"];
/** Expiration options for invite codes. */
export type InviteExpiration = Schemas["InviteExpiration"];

// Listing and pagination.
/** Query parameters for listing workspace invites. */
export type ListWorkspaceInvites = Schemas["ListWorkspaceInvites"];
/** Fields available for sorting workspace invites. */
export type InviteSortField = Schemas["InviteSortField"];
/** Sort order direction. */
export type Direction = Schemas["Direction"];
/** Preview of an invite with workspace details for display before joining. */
export type InvitePreview = Schemas["InvitePreview"];
/** Generic paginated response wrapper. */
export type WorkspaceInvitePage = Schemas["WorkspaceInvitePage"];
