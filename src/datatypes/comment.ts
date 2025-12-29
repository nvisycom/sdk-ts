import type { components } from "@/schema/api.js";

type Schemas = components["schemas"];

export type Comment = Schemas["Comment"];
export type CreateDocumentComment = Schemas["CreateDocumentComment"];
export type UpdateDocumentComment = Schemas["UpdateDocumentComment"];
