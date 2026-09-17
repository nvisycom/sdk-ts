import type { components } from "@/schema/api.js";

type Schemas = components["schemas"];

export type WorkspaceActivity = Schemas["WorkspaceActivity"];
export type WorkspaceActivityPage = Schemas["WorkspaceActivityPage"];
// The kind of an activity, usable as a list/export filter.
export type ActivityType = Schemas["ActivityType"];
// Filters for listing activities (type + actor + date window).
export type WorkspaceActivityFilterQuery =
	Schemas["WorkspaceActivityFilterQuery"];
// Export-only option (output format) for the activity-log export.
export type WorkspaceActivityExportOptions =
	Schemas["WorkspaceActivityExportOptions"];

// Activity payload: a discriminated union (on `activityType`) whose per-event
// data lives in a named `*ActivityParams` type.
export type ActivityPayload = Schemas["ActivityPayload"];
export type WorkspaceActivityParams = Schemas["WorkspaceActivityParams"];
export type MemberActivityParams = Schemas["MemberActivityParams"];
export type InviteActivityParams = Schemas["InviteActivityParams"];
export type ConnectionActivityParams = Schemas["ConnectionActivityParams"];
export type PipelineActivityParams = Schemas["PipelineActivityParams"];
export type DetectionActivityParams = Schemas["DetectionActivityParams"];
export type RedactionActivityParams = Schemas["RedactionActivityParams"];
export type PolicyActivityParams = Schemas["PolicyActivityParams"];
export type ProviderActivityParams = Schemas["ProviderActivityParams"];
export type DocumentActivityParams = Schemas["DocumentActivityParams"];
export type WebhookActivityParams = Schemas["WebhookActivityParams"];
export type ReviewActivityParams = Schemas["ReviewActivityParams"];
export type ReviewCommentActivityParams =
	Schemas["ReviewCommentActivityParams"];
