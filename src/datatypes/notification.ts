import type { components } from "@/schema/api.js";

type Schemas = components["schemas"];

// Notification resources, settings, and unread-count tracking.
/** Response type for an account notification. */
export type AccountNotification = Schemas["AccountNotification"];
/** Defines the type of notification event sent to a user. */
export type NotificationEvent = Schemas["NotificationEvent"];
/** Response for notification settings within a workspace. */
export type WorkspaceNotificationSettings =
	Schemas["WorkspaceNotificationSettings"];
/** Request payload for updating notification settings. */
export type UpdateWorkspaceNotificationSettings =
	Schemas["UpdateWorkspaceNotificationSettings"];
/** Response type for unread notifications status. */
export type AccountUnreadStatus = Schemas["AccountUnreadStatus"];
/** Generic paginated response wrapper. */
export type AccountNotificationPage = Schemas["AccountNotificationPage"];
/** Response type for a mark-all-read action. */
export type AccountMarkedReadStatus = Schemas["AccountMarkedReadStatus"];
/**
 * An account's current unread-notification count, broadcast on the account's
 * core-NATS unread subject.
 */
export type UnreadCountEvent = Schemas["UnreadCountEvent"];

// Notification payload: a discriminated union (on `notifyType`) whose per-event
// data lives in a named `*Params` type.
/**
 * The typed payload of a notification, tagged by `type` with its params
 * under `data` (the same `{type, data}` envelope the activity log and outbox
 * event use).
 */
export type NotificationPayload = Schemas["NotificationPayload"];
/** Params of a `member.joined` notification. */
export type MemberJoinedParams = Schemas["MemberJoinedParams"];
/** Params of a `connection.sync.completed` notification. */
export type ConnectionSyncCompletedParams =
	Schemas["ConnectionSyncCompletedParams"];
/** Params of a `connection.sync.failed` notification. */
export type ConnectionSyncFailedParams = Schemas["ConnectionSyncFailedParams"];
/** Params of a `pipeline.detection.completed` notification. */
export type DetectionCompletedParams = Schemas["DetectionCompletedParams"];
/** Params of a `pipeline.detection.failed` notification. */
export type DetectionFailedParams = Schemas["DetectionFailedParams"];
/** Params of a `pipeline.redaction.created` notification. */
export type RedactionCreatedParams = Schemas["RedactionCreatedParams"];
/**
 * Params of a `review.assigned` notification, sent to the reviewer a review
 * was assigned to.
 */
export type ReviewAssignedParams = Schemas["ReviewAssignedParams"];
/**
 * Params of a `comment.mentioned` notification, sent to a mentioned account.
 */
export type CommentMentionedParams = Schemas["CommentMentionedParams"];
