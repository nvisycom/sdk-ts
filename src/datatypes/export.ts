import type { components } from "@/schema/api.js";

type Schemas = components["schemas"];

// Downloadable export format and its query shapes.
export type ExportFormat = Schemas["ExportFormat"];
export type ExportQuery = Schemas["ExportQuery"];
// Inclusive date window (`from` / `to`, YYYY-MM-DD), shared by exports and the
// analytics run time series.
export type DateWindow = Schemas["DateWindow"];
