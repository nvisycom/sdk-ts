import type { components } from "@/schema/api.js";

type Schemas = components["schemas"];

// Aggregate workspace analytics: storage, detection health, and inference usage.
export type WorkspaceAnalytics = Schemas["WorkspaceAnalytics"];

// Stored-document totals with a per-kind breakdown.
export type WorkspaceStorageAnalytics = Schemas["WorkspaceStorageAnalytics"];
export type WorkspaceStorageKindEntry = Schemas["WorkspaceStorageKindEntry"];

// Detection health: status mix, error rate, and durations.
export type WorkspaceDetectionAnalytics =
	Schemas["WorkspaceDetectionAnalytics"];
export type WorkspaceDetectionStatusEntry =
	Schemas["WorkspaceDetectionStatusEntry"];

// Inference token usage: workspace totals plus a per-model breakdown.
export type WorkspaceUsageAnalytics = Schemas["WorkspaceUsageAnalytics"];
export type ModelUsage = Schemas["ModelUsage"];
export type WorkspaceModelUsageEntry = Schemas["WorkspaceModelUsageEntry"];
export type Usage = Schemas["Usage"];
export type UsageReport = Schemas["UsageReport"];
export type TokenCounts = Schemas["TokenCounts"];
export type RecognizerId = Schemas["RecognizerId"];

// Daily detection activity over a date window (`DateWindow`, in `export`).
export type WorkspaceDetectionTimeSeries =
	Schemas["WorkspaceDetectionTimeSeries"];
export type WorkspaceDetectionDayEntry = Schemas["WorkspaceDetectionDayEntry"];
