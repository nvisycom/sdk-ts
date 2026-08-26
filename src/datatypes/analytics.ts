import type { components } from "@/schema/api.js";

type Schemas = components["schemas"];

// Aggregate workspace analytics: storage, detection health, and inference usage.
export type WorkspaceAnalytics = Schemas["WorkspaceAnalytics"];

// Stored-file totals with a per-kind breakdown.
export type StorageAnalytics = Schemas["StorageAnalytics"];
export type StorageKindEntry = Schemas["StorageKindEntry"];

// Detection health: status mix, error rate, and durations.
export type DetectionAnalytics = Schemas["DetectionAnalytics"];
export type DetectionStatusEntry = Schemas["DetectionStatusEntry"];

// Inference token usage: workspace totals plus a per-model breakdown.
export type UsageAnalytics = Schemas["UsageAnalytics"];
export type ModelUsage = Schemas["ModelUsage"];
export type ModelUsageEntry = Schemas["ModelUsageEntry"];
export type Usage = Schemas["Usage"];
export type UsageReport = Schemas["UsageReport"];
export type TokenCounts = Schemas["TokenCounts"];
export type ProviderType = Schemas["ProviderType"];
export type RecognizerId = Schemas["RecognizerId"];

// Daily detection activity over a date window (`DateWindow`, in `export`).
export type DetectionTimeSeries = Schemas["DetectionTimeSeries"];
export type DetectionDayEntry = Schemas["DetectionDayEntry"];
