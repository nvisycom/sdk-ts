import type { components } from "@/schema/api.js";

type Schemas = components["schemas"];

// Opaque connection identifier.
export type ConnectionId = Schemas["ConnectionId"];

// Connection resources and sync operations.
export type Connection = Schemas["Connection"];
export type CreateConnection = Schemas["CreateConnection"];
export type UpdateConnection = Schemas["UpdateConnection"];
export type ConnectionsQuery = Schemas["ConnectionsQuery"];
export type ConnectionPage = Schemas["ConnectionPage"];
export type ConnectionSync = Schemas["ConnectionSync"];
export type ConnectionSyncPage = Schemas["ConnectionSyncPage"];
export type ConnectionVerification = Schemas["ConnectionVerification"];

// Importing files from, and exporting workspace files to, a file-service connection.
export type ImportFiles = Schemas["ImportFiles"];
export type PickedFile = Schemas["PickedFile"];
export type ExportFiles = Schemas["ExportFiles"];

// Sync enums.
export type SyncMode = Schemas["SyncMode"];
export type SyncStatus = Schemas["SyncStatus"];
export type SyncTriggerType = Schemas["SyncTriggerType"];
export type SyncDeletionPolicy = Schemas["SyncDeletionPolicy"];

// Connection config (storage backend + credentials).
export type ConnectionConfig = Schemas["ConnectionConfig"];
export type StorageConfig = Schemas["StorageConfig"];
export type S3Credentials = Schemas["S3Credentials"];
export type AzureCredentials = Schemas["AzureCredentials"];
export type GcsCredentials = Schemas["GcsCredentials"];

// LLM inference connection config: a provider variant plus its credentials.
export type LlmConfig = Schemas["LlmConfig"];
export type AuthenticatedProvider = Schemas["AuthenticatedProvider"];
export type UnauthenticatedProvider = Schemas["UnauthenticatedProvider"];

// File-service connection config (OAuth-backed) and its OAuth start flow.
export type Provider = Schemas["Provider"];
export type FileServiceConfig = Schemas["FileServiceConfig"];
export type OAuthTokens = Schemas["OAuthTokens"];
export type StartFileServiceOAuth = Schemas["StartFileServiceOAuth"];
export type OAuthStartResponse = Schemas["OAuthStartResponse"];

// Sync scheduling.
export type SyncSchedule = Schemas["SyncSchedule"];
export type SyncScheduleInput = Schemas["SyncScheduleInput"];
