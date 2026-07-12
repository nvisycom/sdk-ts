import type { components } from "@/schema/api.js";

type Schemas = components["schemas"];

export type Health = Schemas["Health"];
export type HealthStatus = Schemas["HealthStatus"];
export type ComponentHealth = Schemas["ComponentHealth"];
export type CheckHealth = Schemas["CheckHealth"];
