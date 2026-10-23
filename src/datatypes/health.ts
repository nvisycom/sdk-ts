import type { components } from "@/schema/api.js";

type Schemas = components["schemas"];

// Health and status.
/** Response body for `GET /health/`. */
export type Health = Schemas["Health"];
/** Operational status of a service component. */
export type HealthStatus = Schemas["HealthStatus"];
/** Health of a single service component. */
export type ComponentHealth = Schemas["ComponentHealth"];
