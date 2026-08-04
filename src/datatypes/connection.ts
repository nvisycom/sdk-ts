import type { components } from "@/schema/api.js";

type Schemas = components["schemas"];

export type Connection = Schemas["Connection"];
export type CreateConnection = Schemas["CreateConnection"];
export type UpdateConnection = Schemas["UpdateConnection"];
export type ConnectionsQuery = Schemas["ConnectionsQuery"];
export type ConnectionPage = Schemas["ConnectionPage"];
export type SyncConnection = Schemas["SyncConnection"];
export type ConnectionSync = Schemas["ConnectionSync"];
export type ConnectionSyncPage = Schemas["ConnectionSyncPage"];
export type ConnectionVerification = Schemas["ConnectionVerification"];
export type SyncMode = Schemas["SyncMode"];
export type SyncStatus = Schemas["SyncStatus"];
export type SyncTriggerType = Schemas["SyncTriggerType"];
export type SyncDeletionPolicy = Schemas["SyncDeletionPolicy"];

export type ConnectionConfig = Schemas["ConnectionConfig"];
export type S3Credentials = Schemas["S3Credentials"];
export type AzureCredentials = Schemas["AzureCredentials"];
export type GcsCredentials = Schemas["GcsCredentials"];
