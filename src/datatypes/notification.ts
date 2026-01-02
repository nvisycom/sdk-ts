import type { components } from "@/schema/api.js";

type Schemas = components["schemas"];

export type Notification = Schemas["Notification"];
export type NotificationEvent = Schemas["NotificationEvent"];
export type NotificationSettings = Schemas["NotificationSettings"];
export type UpdateNotificationSettings = Schemas["UpdateNotificationSettings"];
export type UnreadStatus = Schemas["UnreadStatus"];
