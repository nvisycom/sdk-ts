import type { components } from "@/schema/api.js";

type Schemas = components["schemas"];

// Opaque webhook identifier.
export type WebhookId = Schemas["WebhookId"];

// Webhook resources and delivery.
export type Webhook = Schemas["Webhook"];
export type WebhookCreated = Schemas["WebhookCreated"];
export type CreateWebhook = Schemas["CreateWebhook"];
export type UpdateWebhook = Schemas["UpdateWebhook"];
export type TestWebhook = Schemas["TestWebhook"];
export type WebhookResult = Schemas["WebhookResult"];
export type WebhookStatus = Schemas["WebhookStatus"];
export type WebhookEvent = Schemas["WebhookEvent"];
export type WebhookPage = Schemas["WebhookPage"];
