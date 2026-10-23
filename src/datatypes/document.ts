import type { components } from "@/schema/api.js";

type Schemas = components["schemas"];

// Document resources.
/** Represents a document in responses. */
export type WorkspaceDocument = Schemas["WorkspaceDocument"];
/** Request to update document metadata. */
export type UpdateWorkspaceDocument = Schemas["UpdateWorkspaceDocument"];
/** Query parameters for listing documents. */
export type ListWorkspaceDocuments = Schemas["ListWorkspaceDocuments"];
/** Generic paginated response wrapper. */
export type WorkspaceDocumentPage = Schemas["WorkspaceDocumentPage"];
/** The kind of a human-facing document. */
export type DocumentKind = Schemas["DocumentKind"];
/** A SHA-256 content hash as a 64-character hex string. */
export type DocumentHash = Schemas["DocumentHash"];
/** A supported file extension. */
export type FormatToken = Schemas["FormatToken"];
/** A supported document modality. */
export type ModalityToken = Schemas["ModalityToken"];

// Bulk deletion.
/** Request to delete several documents in one call. */
export type DeleteWorkspaceDocuments = Schemas["DeleteWorkspaceDocuments"];
/** Result of a bulk document deletion. */
export type WorkspaceDeletedDocuments = Schemas["WorkspaceDeletedDocuments"];
