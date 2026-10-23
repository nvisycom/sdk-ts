import type { components } from "@/schema/api.js";

type Schemas = components["schemas"];

/** Opaque detection identifier (detection_<uuid>). */
export type DetectionId = Schemas["DetectionId"];

// Detection resources (one analysis pass of a document through a pipeline).
/** Response type for a detection. */
export type WorkspaceDetection = Schemas["WorkspaceDetection"];
/** Structured metadata for a detection. */
export type DetectionMetadata = Schemas["DetectionMetadata"];
/** Request payload to start a detection over a document. */
export type CreateWorkspaceDetection = Schemas["CreateWorkspaceDetection"];
/**
 * Request payload to start an ad-hoc detection over a document, naming its
 * policies directly rather than through a pipeline.
 */
export type CreateAdhocWorkspaceDetection =
	Schemas["CreateAdhocWorkspaceDetection"];
/** The execution status of a detection (one analysis pass of a file). */
export type DetectionStatus = Schemas["DetectionStatus"];
/** Generic paginated response wrapper. */
export type WorkspaceDetectionPage = Schemas["WorkspaceDetectionPage"];
/** Query parameters for listing detections across a workspace. */
export type WorkspaceDetectionsQuery = Schemas["WorkspaceDetectionsQuery"];
/** Query parameters for listing a single pipeline's detections. */
export type WorkspacePipelineDetectionsQuery =
	Schemas["WorkspacePipelineDetectionsQuery"];
/**
 * A detection's status change, broadcast on the core-NATS subject
 * `detection_subject`.
 */
export type DetectionStatusEvent = Schemas["DetectionStatusEvent"];

// Redaction resources (applying a detection's redactions to produce output).
/** Opaque redaction identifier (redaction_<uuid>). */
export type RedactionId = Schemas["RedactionId"];
/** Request payload to redact a detection. */
export type RedactWorkspaceDetection = Schemas["RedactWorkspaceDetection"];
/** Response type for a redaction. */
export type WorkspaceRedactionResult = Schemas["WorkspaceRedactionResult"];
/** Generic paginated response wrapper. */
export type WorkspaceRedactionResultPage =
	Schemas["WorkspaceRedactionResultPage"];
/** Query parameters for listing a workspace's redactions. */
export type WorkspaceRedactionsQuery = Schemas["WorkspaceRedactionsQuery"];
