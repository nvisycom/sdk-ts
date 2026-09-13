import type { components } from "@/schema/api.js";

type Schemas = components["schemas"];

// Notification resources, settings, and unread-count tracking.
export type AccountNotification = Schemas["AccountNotification"];
export type NotificationEvent = Schemas["NotificationEvent"];
export type WorkspaceNotificationSettings =
	Schemas["WorkspaceNotificationSettings"];
export type UpdateWorkspaceNotificationSettings =
	Schemas["UpdateWorkspaceNotificationSettings"];
export type AccountUnreadStatus = Schemas["AccountUnreadStatus"];
export type AccountNotificationPage = Schemas["AccountNotificationPage"];
export type AccountMarkedReadStatus = Schemas["AccountMarkedReadStatus"];
export type UnreadCountEvent = Schemas["UnreadCountEvent"];

// Notification payload: a discriminated union (on `notifyType`) whose per-event
// data lives in a named `*Params` type.
export type NotificationPayload = Schemas["NotificationPayload"];
export type MemberJoinedParams = Schemas["MemberJoinedParams"];
export type ConnectionSyncCompletedParams =
	Schemas["ConnectionSyncCompletedParams"];
export type ConnectionSyncFailedParams = Schemas["ConnectionSyncFailedParams"];
export type DetectionCompletedParams = Schemas["DetectionCompletedParams"];
export type DetectionFailedParams = Schemas["DetectionFailedParams"];
export type RedactionCreatedParams = Schemas["RedactionCreatedParams"];
export type ReviewAssignedParams = Schemas["ReviewAssignedParams"];
export type CommentMentionedParams = Schemas["CommentMentionedParams"];
