import type { components } from "@/schema/api.js";

type Schemas = components["schemas"];

// Workspace inference providers: the LLM / NER services a workspace can call.

// Opaque provider identifier.
export type ProviderId = Schemas["ProviderId"];

// Provider resources.
export type WorkspaceProvider = Schemas["WorkspaceProvider"];
export type CreateWorkspaceProvider = Schemas["CreateWorkspaceProvider"];
export type UpdateWorkspaceProvider = Schemas["UpdateWorkspaceProvider"];
export type WorkspaceProvidersQuery = Schemas["WorkspaceProvidersQuery"];
export type WorkspaceProviderPage = Schemas["WorkspaceProviderPage"];

// The inference model type backing a provider, and its typed config.
export type ProviderType = Schemas["ProviderType"];
export type ProviderConfig = Schemas["ProviderConfig"];
export type InferenceConfig = Schemas["InferenceConfig"];
