import type { components } from "@/schema/api.js";

type Schemas = components["schemas"];

/** Opaque connection identifier (connection_<uuid>). */
export type ConnectionId = Schemas["ConnectionId"];

// Connection resources and sync operations.
/** Response type for a workspace connection. */
export type WorkspaceConnection = Schemas["WorkspaceConnection"];
/** The capability category of a transfer connection. */
export type ConnectionType = Schemas["ConnectionType"];
/** Request payload for creating a new workspace connection. */
export type CreateWorkspaceConnection = Schemas["CreateWorkspaceConnection"];
/** Request payload for updating an existing workspace connection. */
export type UpdateWorkspaceConnection = Schemas["UpdateWorkspaceConnection"];
/** Query parameters for listing connections. */
export type WorkspaceConnectionsQuery = Schemas["WorkspaceConnectionsQuery"];
/** Generic paginated response wrapper. */
export type WorkspaceConnectionPage = Schemas["WorkspaceConnectionPage"];
/** A connection sync (import or export). */
export type WorkspaceConnectionSync = Schemas["WorkspaceConnectionSync"];
/** Generic paginated response wrapper. */
export type WorkspaceConnectionSyncPage =
	Schemas["WorkspaceConnectionSyncPage"];
/** Result of a connection reachability check. */
export type WorkspaceConnectionVerification =
	Schemas["WorkspaceConnectionVerification"];

// Importing documents from, and exporting workspace documents to, a
// file-service connection.
/**
 * Request payload to import a caller-selected set of files from a
 * file-service connection (the provider picker returns id + name per file).
 */
export type ImportWorkspaceFiles = Schemas["ImportWorkspaceFiles"];
/** One file the user selected in the provider's picker. */
export type PickedFile = Schemas["PickedFile"];
/**
 * Request payload to export a caller-selected set of workspace files to a
 * connection. Each is written as a new provider file, never overwriting a
 * source. Mirrors `ImportWorkspaceFiles` on the export side.
 */
export type ExportWorkspaceFiles = Schemas["ExportWorkspaceFiles"];
/** Body for minting a browser file-picker token. */
export type WorkspacePickerTokenRequest =
	Schemas["WorkspacePickerTokenRequest"];
/** A short-lived provider OAuth access token for a browser file picker. */
export type WorkspacePickerToken = Schemas["WorkspacePickerToken"];

// Sync enums.
/** The direction a connection syncs data. */
export type SyncMode = Schemas["SyncMode"];
/** Defines the execution status of a connection sync run. */
export type SyncStatus = Schemas["SyncStatus"];
/** How a connection sync run was initiated. */
export type SyncTriggerType = Schemas["SyncTriggerType"];
/**
 * What a whole-listing import does with a file whose source object no longer
 * exists.
 */
export type SyncDeletionPolicy = Schemas["SyncDeletionPolicy"];

// Connection config (storage backend + credentials).
/** A fully-typed transfer-connection configuration. */
export type ConnectionConfig = Schemas["ConnectionConfig"];
/** A fully-typed object-store connection configuration. */
export type StorageConfig = Schemas["StorageConfig"];
/** Typed credentials for S3-compatible provider. */
export type S3Credentials = Schemas["S3Credentials"];
/** Typed credentials for Azure Blob Storage. */
export type AzureCredentials = Schemas["AzureCredentials"];
/** Typed credentials for Google Cloud Storage. */
export type GcsCredentials = Schemas["GcsCredentials"];

// LLM inference connection config: a provider variant plus its credentials.
/** A fully-typed LLM inference connection configuration. */
export type LlmConfig = Schemas["LlmConfig"];
/**
 * Configuration for a provider reached with an API key (`OpenAI`,
 * Anthropic).
 */
export type AuthenticatedProvider = Schemas["AuthenticatedProvider"];
/**
 * Configuration for a provider reached without an API key (Ollama),
 * addressed by a caller-supplied base URL. Carries no secret, so it derives
 * `Debug`.
 */
export type UnauthenticatedProvider = Schemas["UnauthenticatedProvider"];

// File-service connection config (OAuth-backed) and its OAuth start flow.
/** A supported cloud file-service provider. */
export type FileServiceProvider = Schemas["FileServiceProvider"];
/**
 * A fully-typed cloud file-service connection configuration: a provider and
 * its settings. Serialized (flat: `{ "provider": ..., "tokens": ..., "root":
 * ... }`) only to persist the config encrypted at rest, never returned in
 * API responses.
 */
export type FileServiceConfig = Schemas["FileServiceConfig"];
/**
 * A persisted OAuth token set. Stored encrypted with the rest of a
 * connection's config; never returned in API responses. The tokens are
 * masked in `Debug` so a connection config's derived `Debug` cannot leak
 * them.
 */
export type OAuthTokens = Schemas["OAuthTokens"];
/** Request payload for starting a cloud file-service OAuth authorization. */
export type StartFileServiceOAuth = Schemas["StartFileServiceOAuth"];
/**
 * The response to a successful authorization start: where to send the user.
 */
export type OAuthStartResponse = Schemas["OAuthStartResponse"];

// Sync scheduling.
/**
 * A connection's scheduled-sync configuration (its cron config), present
 * only for connections that sync on a timer. A connection can transfer on
 * demand without this — it is purely the schedule, not a capability marker.
 * When the connection last synced is on `WorkspaceConnection` itself, since
 * a connection with no schedule still syncs.
 */
export type WorkspaceSyncSchedule = Schemas["WorkspaceSyncSchedule"];
/** Scheduled-sync configuration for a schedulable connection. */
export type SyncScheduleInput = Schemas["SyncScheduleInput"];
