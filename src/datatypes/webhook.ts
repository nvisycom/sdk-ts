import type { components } from "@/schema/api.js";

type Schemas = components["schemas"];

/** Opaque whk identifier (whk_<uuid>). */
export type WebhookId = Schemas["WebhookId"];

// Webhook resources and delivery.
/** Workspace webhook response. */
export type WorkspaceWebhook = Schemas["WorkspaceWebhook"];
/** Webhook creation response that includes the secret (visible only once). */
export type WorkspaceWebhookCreated = Schemas["WorkspaceWebhookCreated"];
/** Request payload for creating a new workspace webhook. */
export type CreateWorkspaceWebhook = Schemas["CreateWorkspaceWebhook"];
/** Request payload for updating an existing workspace webhook. */
export type UpdateWorkspaceWebhook = Schemas["UpdateWorkspaceWebhook"];
/** Request payload for testing a webhook. */
export type TestWorkspaceWebhook = Schemas["TestWorkspaceWebhook"];
/** Result of a webhook delivery attempt. */
export type WorkspaceWebhookResult = Schemas["WorkspaceWebhookResult"];
/** Generic paginated response wrapper. */
export type WorkspaceWebhookPage = Schemas["WorkspaceWebhookPage"];
/** The operational status of a workspace webhook. */
export type WebhookStatus = Schemas["WebhookStatus"];
/** The types of events that can trigger webhook delivery. */
export type WebhookEvent = Schemas["WebhookEvent"];
