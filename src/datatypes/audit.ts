import type { components } from "@/schema/api.js";

type Schemas = components["schemas"];

// The detection result model: what `getDetections()` returns via `Audit`.
// A modality-tagged tree of recognized entities, each with its full audit
// trail (events, provenance, reviewer overrides) and location within the
// document it was found in.

// Audit container.
export type EntityGroup = Schemas["EntityGroup"];
export type AuditContext = Schemas["AuditContext"];
export type EntityCoRef = Schemas["EntityCoRef"];

// OCR mode actually used for the run (`AuditContext.ocrMode`); the `force`
// variant carries the render resolution in `Dpi`.
export type OcrMode = Schemas["OcrMode"];
export type Dpi = Schemas["Dpi"];

// Redaction rationale and reviewer overrides.
export type Review = Schemas["Review"];
export type Attribution = Schemas["Attribution"];
export type LeakProfile = Schemas["LeakProfile"];
export type RuleMatch = Schemas["RuleMatch"];

// Recognition event detail.
export type ModelEvent = Schemas["ModelEvent"];
export type PatternEvent = Schemas["PatternEvent"];
export type OperatorId = Schemas["OperatorId"];

/** Half-open `[start, end)` index range. Generated name; a plain uint range. */
export type RangeOfUint = Schemas["Range_of_uint"];

// Geometry / spans, shared across modalities.
export type BoundingBox = Schemas["BoundingBox"];
export type Point = Schemas["Point"];
export type Polygon = Schemas["Polygon"];
export type Dimensions = Schemas["Dimensions"];
export type TimeSpan = Schemas["TimeSpan"];

// Text modality.
export type TextEntity = Schemas["TextEntity"];
export type TextEntityRecord = Schemas["TextEntityRecord"];
export type TextEvent = Schemas["TextEvent"];
export type TextEventKind = Schemas["TextEventKind"];
export type TextHint = Schemas["TextHint"];
export type TextLocation = Schemas["TextLocation"];
export type TextProvenance = Schemas["TextProvenance"];
export type TextData = Schemas["TextData"];

// Image modality.
export type ImageEntity = Schemas["ImageEntity"];
export type ImageEntityRecord = Schemas["ImageEntityRecord"];
export type ImageEvent = Schemas["ImageEvent"];
export type ImageEventKind = Schemas["ImageEventKind"];
export type ImageHint = Schemas["ImageHint"];
export type ImageLocation = Schemas["ImageLocation"];
export type ImageProvenance = Schemas["ImageProvenance"];
export type ImageData = Schemas["ImageData"];

// Audio modality.
export type AudioEntity = Schemas["AudioEntity"];
export type AudioEntityRecord = Schemas["AudioEntityRecord"];
export type AudioEvent = Schemas["AudioEvent"];
export type AudioEventKind = Schemas["AudioEventKind"];
export type AudioHint = Schemas["AudioHint"];
export type AudioLocation = Schemas["AudioLocation"];
export type AudioProvenance = Schemas["AudioProvenance"];
export type AudioData = Schemas["AudioData"];

// Tabular modality.
export type TabularEntity = Schemas["TabularEntity"];
export type TabularEntityRecord = Schemas["TabularEntityRecord"];
export type TabularEvent = Schemas["TabularEvent"];
export type TabularEventKind = Schemas["TabularEventKind"];
export type TabularHint = Schemas["TabularHint"];
export type TabularLocation = Schemas["TabularLocation"];
export type TabularProvenance = Schemas["TabularProvenance"];
