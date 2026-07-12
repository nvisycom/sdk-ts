import type { components } from "@/schema/api.js";

type Schemas = components["schemas"];

export type File = Schemas["File"];
export type UpdateFile = Schemas["UpdateFile"];
export type FileFormat = Schemas["FileFormat"];
export type FileSource = Schemas["FileSource"];
export type ListFiles = Schemas["ListFiles"];
export type FilesPage = Schemas["FilesPage"];
