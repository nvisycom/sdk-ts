import type { components } from "@/schema/api.js";

type Schemas = components["schemas"];

export type Webhook = Schemas["Webhook"];
export type WebhookWithSecret = Schemas["WebhookWithSecret"];
export type CreateWebhook = Schemas["CreateWebhook"];
export type UpdateWebhook = Schemas["UpdateWebhook"];
export type WebhookStatus = Schemas["WebhookStatus"];
