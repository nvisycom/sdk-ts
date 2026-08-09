import type { components } from "@/schema/api.js";

type Schemas = components["schemas"];

export type Policy = Schemas["Policy"];
export type PolicySummary = Schemas["PolicySummary"];
export type PolicySummaryPage = Schemas["PolicySummaryPage"];
export type PolicyDefinition = Schemas["PolicyDefinition"];
export type CreatePolicy = Schemas["CreatePolicy"];
export type UpdatePolicy = Schemas["UpdatePolicy"];
export type PolicyRule = Schemas["PolicyRule"];
// Built-in policy templates catalog.
export type Template = Schemas["Template"];
export type PolicyTemplateSummary = Schemas["PolicyTemplateSummary"];
