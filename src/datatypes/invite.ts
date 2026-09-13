import type { components } from "@/schema/api.js";

type Schemas = components["schemas"];

// Invite resources.
export type WorkspaceInvite = Schemas["WorkspaceInvite"];
export type WorkspaceInviteSent = Schemas["WorkspaceInviteSent"];
export type CreateWorkspaceInvite = Schemas["CreateWorkspaceInvite"];
export type ReplyWorkspaceInvite = Schemas["ReplyWorkspaceInvite"];
export type GenerateWorkspaceInviteCode =
	Schemas["GenerateWorkspaceInviteCode"];
export type WorkspaceInviteCode = Schemas["WorkspaceInviteCode"];
export type InviteStatus = Schemas["InviteStatus"];
export type InviteExpiration = Schemas["InviteExpiration"];

// Listing and pagination.
export type ListWorkspaceInvites = Schemas["ListWorkspaceInvites"];
export type InviteSortField = Schemas["InviteSortField"];
export type Direction = Schemas["Direction"];
export type InvitePreview = Schemas["InvitePreview"];
export type WorkspaceInvitePage = Schemas["WorkspaceInvitePage"];
