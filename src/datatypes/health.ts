import type { components } from "@/schema/api.js";

type Schemas = components["schemas"];

// Health and status.
export type Health = Schemas["Health"];
export type HealthStatus = Schemas["HealthStatus"];
export type ComponentHealth = Schemas["ComponentHealth"];
