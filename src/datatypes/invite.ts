import type { components } from "@/schema/api.js";

type Schemas = components["schemas"];

export type Invite = Schemas["Invite"];
export type CreateInvite = Schemas["CreateInvite"];
export type ReplyInvite = Schemas["ReplyInvite"];
export type GenerateInviteCode = Schemas["GenerateInviteCode"];
export type InviteCode = Schemas["InviteCode"];
export type InviteStatus = Schemas["InviteStatus"];
export type InviteExpiration = Schemas["InviteExpiration"];
export type ListInvites = Schemas["ListInvites"];
export type InviteSortField = Schemas["InviteSortField"];
export type SortOrder = Schemas["SortOrder"];
export type InvitePreview = Schemas["InvitePreview"];
export type InvitesPage = Schemas["InvitesPage"];
