import type { components } from "@/schema/api.js";

type Schemas = components["schemas"];

// File resources.
export type File = Schemas["File"];
export type UpdateFile = Schemas["UpdateFile"];
export type FileKind = Schemas["FileKind"];
export type FileHash = Schemas["FileHash"];
export type FormatToken = Schemas["FormatToken"];
export type ModalityToken = Schemas["ModalityToken"];
export type ListFiles = Schemas["ListFiles"];
export type FilePage = Schemas["FilePage"];

// Bulk deletion.
export type DeleteFiles = Schemas["DeleteFiles"];
export type DeletedFiles = Schemas["DeletedFiles"];
