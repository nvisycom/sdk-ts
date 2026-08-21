import type { components } from "@/schema/api.js";

type Schemas = components["schemas"];

// Opaque pagination cursor.
export type Cursor = Schemas["Cursor"];

// Cursor-based pagination. `CursorPagination2` additionally reports a total
// count (`include_count`); generated name kept to mirror the schema.
export type CursorPagination = Schemas["CursorPagination"];
export type CursorPagination2 = Schemas["CursorPagination2"];

// Offset/limit pagination.
export type OffsetPagination = Schemas["OffsetPagination"];
