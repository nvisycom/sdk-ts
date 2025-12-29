import type { components } from "@/schema/api.js";

type Schemas = components["schemas"];

export type MonitorStatus = Schemas["MonitorStatus"];
export type ServiceStatus = Schemas["ServiceStatus"];
export type CheckHealth = Schemas["CheckHealth"];
