import type { components } from "@/schema/api.js";

type Schemas = components["schemas"];

// File resources.
export type File = Schemas["File"];
export type UpdateFile = Schemas["UpdateFile"];
export type FileKind = Schemas["FileKind"];
export type FormatToken = Schemas["FormatToken"];
export type ModalityToken = Schemas["ModalityToken"];
export type ListFiles = Schemas["ListFiles"];
export type FilePage = Schemas["FilePage"];
