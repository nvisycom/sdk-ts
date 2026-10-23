import type { components } from "@/schema/api.js";

type Schemas = components["schemas"];

// Workspace member resources.
/** Represents a workspace member. */
export type WorkspaceMember = Schemas["WorkspaceMember"];
/** Request to update a member's role. */
export type UpdateWorkspaceMember = Schemas["UpdateWorkspaceMember"];
/** Query parameters for listing workspace members. */
export type ListWorkspaceMembers = Schemas["ListWorkspaceMembers"];
/** Fields available for sorting workspace members. */
export type MemberSortField = Schemas["MemberSortField"];
/** Generic paginated response wrapper. */
export type WorkspaceMemberPage = Schemas["WorkspaceMemberPage"];
