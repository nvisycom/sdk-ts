import type { components } from "@/schema/api.js";

type Schemas = components["schemas"];

// Document resources.
export type WorkspaceDocument = Schemas["WorkspaceDocument"];
export type UpdateWorkspaceDocument = Schemas["UpdateWorkspaceDocument"];
export type ListWorkspaceDocuments = Schemas["ListWorkspaceDocuments"];
export type WorkspaceDocumentPage = Schemas["WorkspaceDocumentPage"];
// Content identity: kind, hash, and the format / modality tokens.
export type DocumentKind = Schemas["DocumentKind"];
export type DocumentHash = Schemas["DocumentHash"];
export type FormatToken = Schemas["FormatToken"];
export type ModalityToken = Schemas["ModalityToken"];

// Bulk deletion.
export type DeleteWorkspaceDocuments = Schemas["DeleteWorkspaceDocuments"];
export type WorkspaceDeletedDocuments = Schemas["WorkspaceDeletedDocuments"];
