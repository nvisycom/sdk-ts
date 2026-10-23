import type { components } from "@/schema/api.js";

type Schemas = components["schemas"];

// Activity-log resources.
/** Response type for a workspace activity. */
export type WorkspaceActivity = Schemas["WorkspaceActivity"];
/** Generic paginated response wrapper. */
export type WorkspaceActivityPage = Schemas["WorkspaceActivityPage"];
/** The type of activity performed in a workspace, for audit logging. */
export type ActivityType = Schemas["ActivityType"];
/**
 * The activity-specific filter parameters: which activity types to keep and
 * whose activities to keep.
 */
export type WorkspaceActivityFilterQuery =
	Schemas["WorkspaceActivityFilterQuery"];
/**
 * The export-only query parameter: the output format. Kept separate from the
 * shared filter and window so each is extracted on its own (see
 * `WorkspaceActivityFilterQuery` for why flattening is avoided).
 */
export type WorkspaceActivityExportOptions =
	Schemas["WorkspaceActivityExportOptions"];

// Activity payload: a discriminated union (on `activityType`) whose per-event
// data lives in a named `*ActivityParams` type.
/**
 * The typed payload of an audit-log activity, tagged by `type` with its
 * params under `data` (the same `{type, data}` envelope the notification
 * payload and outbox event use).
 */
export type ActivityPayload = Schemas["ActivityPayload"];
/** Params of a workspace-scoped activity (`workspace.*`). */
export type WorkspaceActivityParams = Schemas["WorkspaceActivityParams"];
/** Params of a member activity (`member.*`). */
export type MemberActivityParams = Schemas["MemberActivityParams"];
/** Params of an invite activity (`invite.*`). */
export type InviteActivityParams = Schemas["InviteActivityParams"];
/** Params of a connection activity (`connection.*`). */
export type ConnectionActivityParams = Schemas["ConnectionActivityParams"];
/** Params of a pipeline activity (`pipeline.*`, non-run). */
export type PipelineActivityParams = Schemas["PipelineActivityParams"];
/** Params of a detection activity (`pipeline.detection.*`). */
export type DetectionActivityParams = Schemas["DetectionActivityParams"];
/** Params of a redaction activity (`pipeline.redaction.*`). */
export type RedactionActivityParams = Schemas["RedactionActivityParams"];
/** Params of a policy activity (`policy.*`). */
export type PolicyActivityParams = Schemas["PolicyActivityParams"];
/** Params of a provider activity (`provider.*`). */
export type ProviderActivityParams = Schemas["ProviderActivityParams"];
/** Params of a document activity (`document.*`). */
export type DocumentActivityParams = Schemas["DocumentActivityParams"];
/** Params of a webhook activity (`webhook.*`). */
export type WebhookActivityParams = Schemas["WebhookActivityParams"];
/**
 * Params of a review activity (`review.opened`, `review.reopened`,
 * `review.renamed`, `review.deleted`, `review.verified`, `review.assigned`,
 * `review.unassigned`).
 */
export type ReviewActivityParams = Schemas["ReviewActivityParams"];
/** Params of a review-comment activity (`review.comment.created`). */
export type ReviewCommentActivityParams =
	Schemas["ReviewCommentActivityParams"];
