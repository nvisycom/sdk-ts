import type { components } from "@/schema/api.js";

type Schemas = components["schemas"];

export type ErrorResponse = Schemas["ErrorResponse"];
export type ValidationErrorDetail = Schemas["ValidationErrorDetail"];
