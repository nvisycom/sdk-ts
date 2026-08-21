import type { components } from "@/schema/api.js";

type Schemas = components["schemas"];

// Downloadable export format and its query shape.
export type ExportFormat = Schemas["ExportFormat"];
export type ExportQuery = Schemas["ExportQuery"];
