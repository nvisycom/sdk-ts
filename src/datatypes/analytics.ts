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

// Inference usage: workspace totals (per meter) plus a per-model breakdown.
export type WorkspaceUsageAnalytics = Schemas["WorkspaceUsageAnalytics"];
export type ModelUsage = Schemas["ModelUsage"];
export type WorkspaceModelUsageEntry = Schemas["WorkspaceModelUsageEntry"];

// Per-call usage: the outcome, duration, model/meter cost, and output count of a
// single backend call. An `Audit` carries a `usage?: Usage[]` for its run.
export type Usage = Schemas["Usage"];
// Whether a backend call succeeded (`"Ok"`) or failed with an `ErrorKind`.
export type Outcome = Schemas["Outcome"];
export type ErrorKind = Schemas["ErrorKind"];
// The billing meters a call spent: `Units` is a list of `Meter`s (tokens, audio
// seconds, pages, images, characters); `TokenCounts` is the token-meter detail.
export type Units = Schemas["Units"];
export type Meter = Schemas["Meter"];
export type TokenCounts = Schemas["TokenCounts"];

// Daily detection activity over a date window (`DateWindow`, in `export`).
export type WorkspaceDetectionTimeSeries =
	Schemas["WorkspaceDetectionTimeSeries"];
export type WorkspaceDetectionDayEntry = Schemas["WorkspaceDetectionDayEntry"];
