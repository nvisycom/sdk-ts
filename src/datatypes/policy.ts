import type { components } from "@/schema/api.js";

type Schemas = components["schemas"];

// The full policy resource returned by the API.
export type Policy = Schemas["Policy2"];
// The embedded policy definition (rules, retention, etc.).
export type PolicyDefinition = Schemas["Policy"];
export type CreatePolicy = Schemas["CreatePolicy"];
export type UpdatePolicy = Schemas["UpdatePolicy"];
export type PolicyRule = Schemas["PolicyRule"];
export type PolicyAction = Schemas["PolicyAction"];
export type PoliciesPage = Schemas["PolicysPage"];
