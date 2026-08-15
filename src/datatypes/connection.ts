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
export type SyncConnection = Schemas["SyncConnection"];
export type ConnectionSync = Schemas["ConnectionSync"];
export type ConnectionSyncPage = Schemas["ConnectionSyncPage"];
export type ConnectionVerification = Schemas["ConnectionVerification"];

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

// LLM inference connection config (provider + credentials + model).
export type LlmConfig = Schemas["LlmConfig"];
export type AnthropicCredentials = Schemas["AnthropicCredentials"];
export type OpenAiCredentials = Schemas["OpenAiCredentials"];

// Sync scheduling.
export type SyncSchedule = Schemas["SyncSchedule"];
export type SyncScheduleInput = Schemas["SyncScheduleInput"];
