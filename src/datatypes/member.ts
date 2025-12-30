import type { components } from "@/schema/api.js";

type Schemas = components["schemas"];

export type Member = Schemas["Member"];
export type UpdateMemberRole = Schemas["UpdateMemberRole"];
export type ListMembersQuery = Schemas["ListMembersQuery"];
export type MemberSortField = Schemas["MemberSortField"];
