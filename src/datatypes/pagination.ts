import type { components } from "@/schema/api.js";

type Schemas = components["schemas"];

// Cursor-based pagination.
export type CursorPagination = Schemas["CursorPagination"];

// Offset/limit pagination.
export type OffsetPagination = Schemas["OffsetPagination"];
