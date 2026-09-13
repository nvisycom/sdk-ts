import type { components } from "@/schema/api.js";

type Schemas = components["schemas"];

// Opaque connection identifier.
export type ConnectionId = Schemas["ConnectionId"];

// Connection resources and sync operations.
export type WorkspaceConnection = Schemas["WorkspaceConnection"];
export type ConnectionType = Schemas["ConnectionType"];
export type CreateWorkspaceConnection = Schemas["CreateWorkspaceConnection"];
export type UpdateWorkspaceConnection = Schemas["UpdateWorkspaceConnection"];
export type WorkspaceConnectionsQuery = Schemas["WorkspaceConnectionsQuery"];
export type WorkspaceConnectionPage = Schemas["WorkspaceConnectionPage"];
export type WorkspaceConnectionSync = Schemas["WorkspaceConnectionSync"];
export type WorkspaceConnectionSyncPage =
	Schemas["WorkspaceConnectionSyncPage"];
export type WorkspaceConnectionVerification =
	Schemas["WorkspaceConnectionVerification"];

// Importing documents from, and exporting workspace documents to, a
// file-service connection.
export type ImportWorkspaceFiles = Schemas["ImportWorkspaceFiles"];
export type PickedFile = Schemas["PickedFile"];
export type ExportWorkspaceFiles = Schemas["ExportWorkspaceFiles"];
// Short-lived provider access token for a browser file picker.
export type WorkspacePickerTokenRequest =
	Schemas["WorkspacePickerTokenRequest"];
export type WorkspacePickerToken = Schemas["WorkspacePickerToken"];

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
export type FileServiceProvider = Schemas["FileServiceProvider"];
export type FileServiceConfig = Schemas["FileServiceConfig"];
export type OAuthTokens = Schemas["OAuthTokens"];
export type StartFileServiceOAuth = Schemas["StartFileServiceOAuth"];
export type OAuthStartResponse = Schemas["OAuthStartResponse"];

// Sync scheduling.
export type WorkspaceSyncSchedule = Schemas["WorkspaceSyncSchedule"];
export type SyncScheduleInput = Schemas["SyncScheduleInput"];
