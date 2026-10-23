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
 * A `from`/`to` day range (inclusive), both optional. Flatten it into an
 * endpoint's query struct with `#[serde(flatten)]`, or use it directly when
 * the range is the only parameter.
 */
export type DateWindow = Schemas["DateWindow"];
