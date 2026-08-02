import type { components } from "@/schema/api.js";

type Schemas = components["schemas"];

export type File = Schemas["File"];
export type UpdateFile = Schemas["UpdateFile"];
export type FileSource = Schemas["FileSource"];
export type FormatToken = Schemas["FormatToken"];
export type ModalityToken = Schemas["ModalityToken"];
export type ListFiles = Schemas["ListFiles"];
export type FilesPage = Schemas["FilesPage"];
