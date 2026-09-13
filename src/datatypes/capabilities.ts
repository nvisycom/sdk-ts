import type { components } from "@/schema/api.js";

type Schemas = components["schemas"];

// Deployment capabilities: the built-in vocabularies a workspace's policies and
// pipelines can target, plus what connectors and auth methods are available.
// Read-only; served by the `/capabilities/*` endpoints.

/** Registry of the deployment's built-in labels, keyed by id. */
export type LabelCatalog = Schemas["LabelCatalog"];

/** The engine's registered recognizers, grouped into NER and LLM. */
export type RecognizerCatalog = Schemas["RecognizerCatalog"];
export type RegisteredRecognizer = Schemas["RegisteredRecognizer"];

/** Which connector families and providers this deployment can create. */
export type ConnectorCapabilities = Schemas["ConnectorCapabilities"];
export type FileProviders = Schemas["FileProviders"];

/** Which authentication methods this deployment offers. */
export type AuthCapabilities = Schemas["AuthCapabilities"];
