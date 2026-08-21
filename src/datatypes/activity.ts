import type { components } from "@/schema/api.js";

type Schemas = components["schemas"];

export type Activity = Schemas["Activity"];
export type ActivityPage = Schemas["ActivityPage"];
// Query for the activity-log export (date window + output format).
export type ActivityExportQuery = Schemas["ActivityExportQuery"];

// Activity payload: a discriminated union (on `activityType`) whose per-event
// data lives in a named `*ActivityParams` type.
export type ActivityPayload = Schemas["ActivityPayload"];
export type WorkspaceActivityParams = Schemas["WorkspaceActivityParams"];
export type MemberActivityParams = Schemas["MemberActivityParams"];
export type InviteActivityParams = Schemas["InviteActivityParams"];
export type ConnectionActivityParams = Schemas["ConnectionActivityParams"];
export type PipelineActivityParams = Schemas["PipelineActivityParams"];
export type PipelineRunActivityParams = Schemas["PipelineRunActivityParams"];
export type PolicyActivityParams = Schemas["PolicyActivityParams"];
export type FileActivityParams = Schemas["FileActivityParams"];
export type WebhookActivityParams = Schemas["WebhookActivityParams"];
