import type { components } from "@/schema/api.js";

type Schemas = components["schemas"];

// Opaque webhook identifier.
export type WebhookId = Schemas["WebhookId"];

// Webhook resources and delivery.
export type WorkspaceWebhook = Schemas["WorkspaceWebhook"];
export type WorkspaceWebhookCreated = Schemas["WorkspaceWebhookCreated"];
export type CreateWorkspaceWebhook = Schemas["CreateWorkspaceWebhook"];
export type UpdateWorkspaceWebhook = Schemas["UpdateWorkspaceWebhook"];
export type TestWorkspaceWebhook = Schemas["TestWorkspaceWebhook"];
export type WorkspaceWebhookResult = Schemas["WorkspaceWebhookResult"];
export type WebhookStatus = Schemas["WebhookStatus"];
export type WebhookEvent = Schemas["WebhookEvent"];
export type WorkspaceWebhookPage = Schemas["WorkspaceWebhookPage"];
