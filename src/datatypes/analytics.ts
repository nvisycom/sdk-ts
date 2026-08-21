import type { components } from "@/schema/api.js";

type Schemas = components["schemas"];

// Aggregate workspace analytics: storage, run health, and inference usage.
export type WorkspaceAnalytics = Schemas["WorkspaceAnalytics"];

// Stored-file totals with a per-kind breakdown.
export type StorageAnalytics = Schemas["StorageAnalytics"];
export type StorageKindEntry = Schemas["StorageKindEntry"];

// Pipeline-run health: status mix, error rate, and durations.
export type RunAnalytics = Schemas["RunAnalytics"];
export type RunStatusEntry = Schemas["RunStatusEntry"];

// Inference token usage: workspace totals plus a per-model breakdown.
export type UsageAnalytics = Schemas["UsageAnalytics"];
export type ModelUsage = Schemas["ModelUsage"];
export type ModelUsageEntry = Schemas["ModelUsageEntry"];
export type Usage = Schemas["Usage"];
export type UsageReport = Schemas["UsageReport"];
export type TokenCounts = Schemas["TokenCounts"];
export type ProviderType = Schemas["ProviderType"];
export type RecognizerId = Schemas["RecognizerId"];

// Daily pipeline-run activity over a date window (`DateWindow`, in `export`).
export type RunTimeSeries = Schemas["RunTimeSeries"];
export type RunDayEntry = Schemas["RunDayEntry"];
