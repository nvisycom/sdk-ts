import type { components } from "@/schema/api.js";

type Schemas = components["schemas"];

export type File = Schemas["File"];
export type UpdateFile = Schemas["UpdateFile"];
export type ProcessingStatus = Schemas["ProcessingStatus"];
export type ContentSegmentation = Schemas["ContentSegmentation"];
export type DownloadMultipleFilesRequest = Schemas["DownloadMultipleFilesRequest"];
export type DownloadArchivedFilesRequest = Schemas["DownloadArchivedFilesRequest"];
export type ArchiveFormat = Schemas["ArchiveFormat"];
