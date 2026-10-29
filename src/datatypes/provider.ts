import type { components } from "@/schema/api.js";

type Schemas = components["schemas"];

// Workspace inference providers: the LLM / NER services a workspace can call.

/** Opaque provider identifier (provider_<uuid>). */
export type ProviderId = Schemas["ProviderId"];

// Provider resources.
/** Response type for a workspace inference provider. */
export type WorkspaceProvider = Schemas["WorkspaceProvider"];
/** Request payload for creating a new workspace provider. */
export type CreateWorkspaceProvider = Schemas["CreateWorkspaceProvider"];
/** Request payload for updating an existing workspace provider. */
export type UpdateWorkspaceProvider = Schemas["UpdateWorkspaceProvider"];
/** Query parameters for listing providers. */
export type WorkspaceProvidersQuery = Schemas["WorkspaceProvidersQuery"];
/** Generic paginated response wrapper. */
export type WorkspaceProviderPage = Schemas["WorkspaceProviderPage"];

// The inference model type backing a provider, and its typed config.
/** The inference model type backing a workspace provider. */
export type ProviderType = Schemas["ProviderType"];
/** A fully-typed inference-provider configuration. */
export type ProviderConfig = Schemas["ProviderConfig"];
/**
 * A fully-typed inference connection configuration, across every inference
 * kind.
 */
export type AssistantConfig = Schemas["AssistantConfig"];
/** A fully-typed inference connection configuration. */
export type InferenceConfig = AssistantConfig;
