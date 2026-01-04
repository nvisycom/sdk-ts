import type { components } from "@/schema/api.js";

type Schemas = components["schemas"];

export type Webhook = Schemas["Webhook"];
export type CreateWebhook = Schemas["CreateWebhook"];
export type UpdateWebhook = Schemas["UpdateWebhook"];
export type TestWebhook = Schemas["TestWebhook"];
export type WebhookResult = Schemas["WebhookResult"];
export type WebhookStatus = Schemas["WebhookStatus"];
export type WebhookEvent = Schemas["WebhookEvent"];
export type WebhooksPage = Schemas["WebhooksPage"];
