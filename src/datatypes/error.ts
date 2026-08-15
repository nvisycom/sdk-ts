import type { components } from "@/schema/api.js";

type Schemas = components["schemas"];

// Error responses.
export type ErrorResponse = Schemas["ErrorResponse"];
export type ValidationErrorDetail = Schemas["ValidationErrorDetail"];
