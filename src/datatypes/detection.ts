import type { components } from "@/schema/api.js";

type Schemas = components["schemas"];

// Opaque detection identifier.
export type DetectionId = Schemas["DetectionId"];

// Detection resources (one analysis pass of a document through a pipeline).
export type WorkspaceDetection = Schemas["WorkspaceDetection"];
export type DetectionMetadata = Schemas["DetectionMetadata"];
export type CreateWorkspaceDetection = Schemas["CreateWorkspaceDetection"];
export type CreateAdhocWorkspaceDetection =
	Schemas["CreateAdhocWorkspaceDetection"];
export type DetectionStatus = Schemas["DetectionStatus"];
export type WorkspaceDetectionPage = Schemas["WorkspaceDetectionPage"];
export type WorkspaceDetectionsQuery = Schemas["WorkspaceDetectionsQuery"];
export type WorkspacePipelineDetectionsQuery =
	Schemas["WorkspacePipelineDetectionsQuery"];
export type DetectionStatusEvent = Schemas["DetectionStatusEvent"];

// Redaction resources (applying a detection's redactions to produce output).
export type RedactionId = Schemas["RedactionId"];
export type RedactWorkspaceDetection = Schemas["RedactWorkspaceDetection"];
export type WorkspaceRedactionResult = Schemas["WorkspaceRedactionResult"];
export type WorkspaceRedactionResultPage =
	Schemas["WorkspaceRedactionResultPage"];
