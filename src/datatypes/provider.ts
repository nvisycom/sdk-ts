import type { components } from "@/schema/api.js";

type Schemas = components["schemas"];

// Workspace inference providers: the LLM / NER services a workspace can call.

// Opaque provider identifier.
export type ProviderId = Schemas["ProviderId"];

// Provider resources.
export type Provider = Schemas["Provider"];
export type CreateProvider = Schemas["CreateProvider"];
export type UpdateProvider = Schemas["UpdateProvider"];
export type ProvidersQuery = Schemas["ProvidersQuery"];
export type ProviderPage = Schemas["ProviderPage"];

// The inference model type backing a provider, and its typed config.
export type ProviderType = Schemas["ProviderType"];
export type ProviderConfig = Schemas["ProviderConfig"];
export type InferenceConfig = Schemas["InferenceConfig"];
