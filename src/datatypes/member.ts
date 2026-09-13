import type { components } from "@/schema/api.js";

type Schemas = components["schemas"];

// Workspace member resources.
export type WorkspaceMember = Schemas["WorkspaceMember"];
export type UpdateWorkspaceMember = Schemas["UpdateWorkspaceMember"];
export type ListWorkspaceMembers = Schemas["ListWorkspaceMembers"];
export type MemberSortField = Schemas["MemberSortField"];
export type WorkspaceMemberPage = Schemas["WorkspaceMemberPage"];
