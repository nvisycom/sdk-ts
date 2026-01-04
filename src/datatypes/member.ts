import type { components } from "@/schema/api.js";

type Schemas = components["schemas"];

export type Member = Schemas["Member"];
export type UpdateMember = Schemas["UpdateMember"];
export type ListMembers = Schemas["ListMembers"];
export type MemberSortField = Schemas["MemberSortField"];
export type MembersPage = Schemas["MembersPage"];
