import type { components } from "@/schema/api.js";

type Schemas = components["schemas"];

/** Opaque detection identifier (detection_<uuid>). */
export type DetectionId = Schemas["DetectionId"];

// Detection resources (one analysis pass of a document against policies).
/** Response type for a detection. */
export type WorkspaceDetection = Schemas["WorkspaceDetection"];
/** Structured metadata for a detection. */
export type DetectionMetadata = Schemas["DetectionMetadata"];
/**
 * Request payload to start a detection over a document, naming the policies
 * to run against it by id.
 */
export type CreateWorkspaceDetection = Schemas["CreateWorkspaceDetection"];
/** The execution status of a detection (one analysis pass of a file). */
export type DetectionStatus = Schemas["DetectionStatus"];
/** Generic paginated response wrapper. */
export type WorkspaceDetectionPage = Schemas["WorkspaceDetectionPage"];
/** Query parameters for listing detections across a workspace. */
export type WorkspaceDetectionsQuery = Schemas["WorkspaceDetectionsQuery"];
/**
 * A detection's status change, broadcast on the core-NATS subject
 * `detection_subject`.
 */
export type DetectionStatusEvent = Schemas["DetectionStatusEvent"];

// Reviewer edits accumulated on a detection, layered over its analysis at
// redact time.
/**
 * Request payload to set a detection's accumulated reviewer edits (suppress a
 * false positive, retag a detection, or add one the analysis missed), or
 * clear them when `edits` is omitted. Pass the `editSetRev` last read; a stale
 * value is rejected with 409.
 */
export type EditWorkspaceDetection = Schemas["EditWorkspaceDetection"];

// Redaction resources (applying a detection's stored analysis plus edits to
// produce output).
/** Opaque redaction identifier (redaction_<uuid>). */
export type RedactionId = Schemas["RedactionId"];
/** Response type for a redaction. */
export type WorkspaceRedactionResult = Schemas["WorkspaceRedactionResult"];
/** Generic paginated response wrapper. */
export type WorkspaceRedactionResultPage =
	Schemas["WorkspaceRedactionResultPage"];
/** Query parameters for listing a workspace's redactions. */
export type WorkspaceRedactionsQuery = Schemas["WorkspaceRedactionsQuery"];
