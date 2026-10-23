import type { components } from "@/schema/api.js";

type Schemas = components["schemas"];

// Deployment capabilities: the built-in vocabularies a workspace's policies and
// pipelines can target, plus what connectors and auth methods are available.
// Read-only; served by the `/capabilities/*` endpoints.

/** Registry of `Label`s, keyed by id. */
export type LabelCatalog = Schemas["LabelCatalog"];

// The engine's registered recognizers, grouped into NER and LLM.
/** The engine's registered recognizers, grouped by kind. */
export type RecognizerCatalog = Schemas["RecognizerCatalog"];
/** Public view of one recognizer in the engine's NER or LLM lineup. */
export type RegisteredRecognizer = Schemas["RegisteredRecognizer"];

// Which connector families and providers this deployment can create.
/** Which connector families and providers this deployment can create. */
export type ConnectorCapabilities = Schemas["ConnectorCapabilities"];
/**
 * Per-provider availability for the OAuth file services. Each field is
 * `true` only when that provider's OAuth app is configured on the server.
 */
export type FileProviders = Schemas["FileProviders"];

/** The sign-in methods this deployment offers. */
export type AuthCapabilities = Schemas["AuthCapabilities"];
