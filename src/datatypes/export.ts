import type { components } from "@/schema/api.js";

type Schemas = components["schemas"];

// Downloadable export format and its query shapes.
/** The file format an export is rendered as. */
export type ExportFormat = Schemas["ExportFormat"];
/**
 * Query parameters for an export whose only choice is the output format.
 * Used by endpoints that already scope their data another way (e.g. by
 * path), so the format is all the query carries.
 */
export type ExportQuery = Schemas["ExportQuery"];
/**
 * A `from`/`to` day range (inclusive), both optional. Pass its fields
 * directly, or spread a `DateWindow` into an endpoint's query object, when a
 * date range narrows the request.
 */
export type DateWindow = Schemas["DateWindow"];
