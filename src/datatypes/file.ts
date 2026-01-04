import type { components } from "@/schema/api.js";

type Schemas = components["schemas"];

export type File = Schemas["File"];
export type UpdateFile = Schemas["UpdateFile"];
export type ProcessingStatus = Schemas["ProcessingStatus"];
export type ContentSegmentation = Schemas["ContentSegmentation"];
export type DownloadMultipleFiles = Schemas["DownloadMultipleFiles"];
export type DownloadArchivedFiles = Schemas["DownloadArchivedFiles"];
export type ArchiveFormat = Schemas["ArchiveFormat"];
export type ListFiles = Schemas["ListFiles"];
export type FileFormat = Schemas["FileFormat"];
export type FilesPage = Schemas["FilesPage"];
