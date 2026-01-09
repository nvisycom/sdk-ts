import type { components } from "@/schema/api.js";

type Schemas = components["schemas"];

export type Annotation = Schemas["Annotation"];
export type CreateAnnotation = Schemas["CreateAnnotation"];
export type UpdateAnnotation = Schemas["UpdateAnnotation"];
export type AnnotationsPage = Schemas["AnnotationsPage"];
