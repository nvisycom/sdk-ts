import type { components } from "@/schema/api.js";

type Schemas = components["schemas"];

export type Activity = Schemas["Activity"];
export type ActivityPage = Schemas["ActivityPage"];
// The kind of an activity, usable as a list/export filter.
export type ActivityType = Schemas["ActivityType"];
// Filters for listing activities (type + actor + date window).
export type ActivityFilterQuery = Schemas["ActivityFilterQuery"];
// Export-only option (output format) for the activity-log export.
export type ActivityExportOptions = Schemas["ActivityExportOptions"];

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
export type FileActivityParams = Schemas["FileActivityParams"];
export type WebhookActivityParams = Schemas["WebhookActivityParams"];
