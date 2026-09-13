import type { components } from "@/schema/api.js";

type Schemas = components["schemas"];

// Document resources.
export type WorkspaceDocument = Schemas["WorkspaceDocument"];
export type UpdateWorkspaceDocument = Schemas["UpdateWorkspaceDocument"];
export type DocumentKind = Schemas["DocumentKind"];
export type DocumentHash = Schemas["DocumentHash"];
export type FormatToken = Schemas["FormatToken"];
export type ModalityToken = Schemas["ModalityToken"];
export type ListWorkspaceDocuments = Schemas["ListWorkspaceDocuments"];
export type WorkspaceDocumentPage = Schemas["WorkspaceDocumentPage"];

// Bulk deletion.
export type DeleteWorkspaceDocuments = Schemas["DeleteWorkspaceDocuments"];
export type WorkspaceDeletedDocuments = Schemas["WorkspaceDeletedDocuments"];

// Document review: assigning a document to a reviewer and its review status.
export type AssignWorkspaceReview = Schemas["AssignWorkspaceReview"];
export type ReviewStatus = Schemas["ReviewStatus"];
