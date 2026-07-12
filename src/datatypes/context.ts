import type { components } from "@/schema/api.js";

type Schemas = components["schemas"];

// The full context resource returned by the API.
export type Context = Schemas["Context2"];
// The embedded context definition (entries only).
export type ContextDefinition = Schemas["Context"];
export type CreateContext = Schemas["CreateContext"];
export type UpdateContext = Schemas["UpdateContext"];
export type ContextEntry = Schemas["ContextEntry"];
export type ContextsPage = Schemas["ContextsPage"];
