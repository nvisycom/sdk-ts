import type { components } from "@/schema/api.js";

type Schemas = components["schemas"];

export type Document = Schemas["Document"];
export type CreateDocument = Schemas["CreateDocument"];
export type UpdateDocument = Schemas["UpdateDocument"];
export type DocumentStatus = Schemas["DocumentStatus"];
