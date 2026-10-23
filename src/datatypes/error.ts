import type { components } from "@/schema/api.js";

type Schemas = components["schemas"];

/**
 * The serialized shape of an HTTP error: the inert wire/OpenAPI-schema view
 * that `Error` renders to at the response boundary.
 */
export type ErrorResponse = Schemas["ErrorResponse"];
