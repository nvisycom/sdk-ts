import type { components } from "@/schema/api.js";

type Schemas = components["schemas"];

// Deployment catalogs: the built-in vocabularies a workspace's policies and
// pipelines can target. Read-only; served by the `/catalog/*` endpoints.

/** Registry of the deployment's built-in labels, keyed by id. */
export type LabelCatalog = Schemas["LabelCatalog"];

/** The engine's registered recognizers, grouped into NER and LLM. */
export type RecognizerCatalog = Schemas["RecognizerCatalog"];
export type RegisteredRecognizer = Schemas["RegisteredRecognizer"];
