import type { components } from "@/schema/api.js";

type Schemas = components["schemas"];

export type Connection = Schemas["Connection"];
export type CreateConnection = Schemas["CreateConnection"];
export type UpdateConnection = Schemas["UpdateConnection"];
export type ConnectionsQuery = Schemas["ConnectionsQuery"];
export type ConnectionsPage = Schemas["ConnectionsPage"];
