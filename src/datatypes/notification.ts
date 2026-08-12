import type { components } from "@/schema/api.js";

type Schemas = components["schemas"];

export type Notification = Schemas["Notification"];
export type NotificationEvent = Schemas["NotificationEvent"];
export type NotificationSettings = Schemas["NotificationSettings"];
export type UpdateNotificationSettings = Schemas["UpdateNotificationSettings"];
export type UnreadStatus = Schemas["UnreadStatus"];
export type NotificationPage = Schemas["NotificationPage"];
export type MarkedReadStatus = Schemas["MarkedReadStatus"];

// Notification payload: a discriminated union (on `notifyType`) whose per-event
// data lives in a named `*Params` type.
export type NotificationPayload = Schemas["NotificationPayload"];
export type MemberInvitedParams = Schemas["MemberInvitedParams"];
export type MemberJoinedParams = Schemas["MemberJoinedParams"];
export type ConnectionSyncCompletedParams =
	Schemas["ConnectionSyncCompletedParams"];
export type ConnectionSyncFailedParams = Schemas["ConnectionSyncFailedParams"];
export type PipelineRunAnalyzedParams = Schemas["PipelineRunAnalyzedParams"];
export type PipelineRunCompletedParams = Schemas["PipelineRunCompletedParams"];
export type PipelineRunFailedParams = Schemas["PipelineRunFailedParams"];
export type SystemAnnouncementParams = Schemas["SystemAnnouncementParams"];
export type SystemReportParams = Schemas["SystemReportParams"];
