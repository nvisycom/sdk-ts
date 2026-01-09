import type { components } from "@/schema/api.js";

type Schemas = components["schemas"];

export type Comment = Schemas["Comment"];
export type CreateComment = Schemas["CreateComment"];
export type UpdateComment = Schemas["UpdateComment"];
export type CommentsPage = Schemas["CommentsPage"];
