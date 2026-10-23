import type { components } from "@/schema/api.js";

type Schemas = components["schemas"];

/**
 * Aggregate analytics for a workspace: what it stores, how its detections
 * fare, and the inference usage they metered.
 */
export type WorkspaceAnalytics = Schemas["WorkspaceAnalytics"];

// Stored-document totals with a per-kind breakdown.
/** Storage totals across a workspace's live files. */
export type WorkspaceStorageAnalytics = Schemas["WorkspaceStorageAnalytics"];
/** One document `kind`'s share of a workspace's storage. */
export type WorkspaceStorageKindEntry = Schemas["WorkspaceStorageKindEntry"];

// Detection health: status mix, error rate, and durations.
/** Detection health for a workspace. */
export type WorkspaceDetectionAnalytics =
	Schemas["WorkspaceDetectionAnalytics"];
/** One status's share of a workspace's detections. */
export type WorkspaceDetectionStatusEntry =
	Schemas["WorkspaceDetectionStatusEntry"];

// Inference usage: workspace totals (per meter) plus a per-model breakdown.
/** Inference usage across a workspace's detections. */
export type WorkspaceUsageAnalytics = Schemas["WorkspaceUsageAnalytics"];
/** The model a backend called and the billing units the call spent. */
export type ModelUsage = Schemas["ModelUsage"];
/** One model's usage across a workspace's detections. */
export type WorkspaceModelUsageEntry = Schemas["WorkspaceModelUsageEntry"];

// Per-call usage: the outcome, duration, model/meter cost, and output count of a
// single backend call. An `Audit` carries a `usage?: Usage[]` for its run.
/**
 * One backend call's resource usage: whether it succeeded, how long it took,
 * the model it called and the units it spent, and how much it produced.
 */
export type Usage = Schemas["Usage"];
/** Whether a backend call succeeded, so a sink can track error rate. */
export type Outcome = Schemas["Outcome"];
/** Coarse category of `Error`, suitable for matching. */
export type ErrorKind = Schemas["ErrorKind"];
/**
 * The billing meters a backend call spent — its cost, across every currency
 * the backend meters in.
 */
export type Units = Schemas["Units"];
/**
 * One billing meter a backend call spent, in the currency that meter bills
 * in.
 */
export type Meter = Schemas["Meter"];
/** The token counts a model reported. */
export type TokenCounts = Schemas["TokenCounts"];

// Daily detection activity over a date window (`DateWindow`, in `export`).
/**
 * A workspace's daily detection activity over a window: one point per day,
 * dense (quiet days included with `detections: 0`), ready to plot as a
 * continuous series.
 */
export type WorkspaceDetectionTimeSeries =
	Schemas["WorkspaceDetectionTimeSeries"];
/** A single day of detection activity. */
export type WorkspaceDetectionDayEntry = Schemas["WorkspaceDetectionDayEntry"];
