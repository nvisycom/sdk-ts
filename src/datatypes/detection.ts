import type { components } from "@/schema/api.js";

type Schemas = components["schemas"];

// Opaque detection identifier.
export type DetectionId = Schemas["DetectionId"];

// Detection resources (one analysis pass of a file through a pipeline).
export type Detection = Schemas["Detection"];
export type DetectionMetadata = Schemas["DetectionMetadata"];
export type CreateDetection = Schemas["CreateDetection"];
export type DetectionStatus = Schemas["DetectionStatus"];
export type DetectionPage = Schemas["DetectionPage"];
export type PipelineDetectionsQuery = Schemas["PipelineDetectionsQuery"];
export type DetectionStatusEvent = Schemas["DetectionStatusEvent"];

// Redaction resources (applying a detection's redactions to produce output).
export type RedactionId = Schemas["RedactionId"];
export type RedactDetection = Schemas["RedactDetection"];
export type RedactionResult = Schemas["RedactionResult"];
export type RedactionResultPage = Schemas["RedactionResultPage"];
