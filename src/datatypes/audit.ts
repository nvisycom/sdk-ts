import type { components } from "@/schema/api.js";

type Schemas = components["schemas"];

// The detection result model: what `getDetections()` returns via `Audit`.
// A modality-tagged tree of recognized entities, each with its full audit
// trail (the events in its life) and location within the document.

// Audit container.
export type Audit = Schemas["Audit"];
export type DocumentContext = Schemas["DocumentContext"];
export type CodecParams = Schemas["CodecParams"];
export type EntityCoRef = Schemas["EntityCoRef"];
export type Report = Schemas["Report"];

// Reviewer edits applied on top of automatic detection.
export type EditSet = Schemas["EditSet"];

// Raster mode a run resolved to, with its render resolution.
export type RasterMode = Schemas["RasterMode"];
export type Dpi = Schemas["Dpi"];

// Redaction decision and reviewer overrides.
export type Redaction = Schemas["Redaction"];
export type Selection = Schemas["Selection"];
export type Suppress = Schemas["Suppress"];
export type ManualIntent = Schemas["ManualIntent"];
export type LeakProfile = Schemas["LeakProfile"];
export type RuleMatch = Schemas["RuleMatch"];

// Attribution: the rationale behind a redaction.
export type Attribution = Schemas["Attribution"];
export type CitedAttribution = Schemas["CitedAttribution"];
export type FreeformAttribution = Schemas["FreeformAttribution"];

// Recognition and reconciliation event detail.
export type ModelEvent = Schemas["ModelEvent"];
export type PatternEvent = Schemas["PatternEvent"];
export type Conflict = Schemas["Conflict"];
export type Contested = Schemas["Contested"];
export type Deduplication = Schemas["Deduplication"];
export type Calibration = Schemas["Calibration"];
export type OperatorId = Schemas["OperatorId"];

// Audit-event digest and the coarse category a label belongs to.
export type AuditHash = Schemas["AuditHash"];
export type Category = Schemas["Category"];

/** Half-open `[start, end)` index range. Generated name; a plain uint range. */
export type RangeOfUint = Schemas["Range_of_uint"];

// Reference back to the original source (byte range + optional container part).
export type SourceRef = Schemas["SourceRef"];

// Geometry / spans, shared across modalities.
export type BoundingBox = Schemas["BoundingBox"];
export type Point = Schemas["Point"];
export type Polygon = Schemas["Polygon"];
export type Dimensions = Schemas["Dimensions"];
export type TimeSpan = Schemas["TimeSpan"];

// Text modality.
export type TextEntity = Schemas["TextEntity"];
export type TextAuditEvent = Schemas["TextAuditEvent"];
export type TextAuditKind = Schemas["TextAuditKind"];
export type TextAuditLog = Schemas["TextAuditLog"];
export type TextHint = Schemas["TextHint"];
export type TextLocation = Schemas["TextLocation"];
export type TextData = Schemas["TextData"];
export type TextModel = Schemas["TextModel"];
export type TextPattern = Schemas["TextPattern"];
export type TextManual = Schemas["TextManual"];
export type TextEdit = Schemas["TextEdit"];
export type TextAdd = Schemas["TextAdd"];
export type TextRefinement = Schemas["TextRefinement"];
export type TextRetag = Schemas["TextRetag"];

// Image modality.
export type ImageEntity = Schemas["ImageEntity"];
export type ImageAuditEvent = Schemas["ImageAuditEvent"];
export type ImageAuditKind = Schemas["ImageAuditKind"];
export type ImageAuditLog = Schemas["ImageAuditLog"];
export type ImageHint = Schemas["ImageHint"];
export type ImageLocation = Schemas["ImageLocation"];
export type ImageData = Schemas["ImageData"];
export type ImageModel = Schemas["ImageModel"];
export type ImagePattern = Schemas["ImagePattern"];
export type ImageManual = Schemas["ImageManual"];
export type ImageEdit = Schemas["ImageEdit"];
export type ImageAdd = Schemas["ImageAdd"];
export type ImageRefinement = Schemas["ImageRefinement"];
export type ImageRetag = Schemas["ImageRetag"];

// Audio modality.
export type AudioEntity = Schemas["AudioEntity"];
export type AudioAuditEvent = Schemas["AudioAuditEvent"];
export type AudioAuditKind = Schemas["AudioAuditKind"];
export type AudioAuditLog = Schemas["AudioAuditLog"];
export type AudioHint = Schemas["AudioHint"];
export type AudioLocation = Schemas["AudioLocation"];
export type AudioData = Schemas["AudioData"];
export type AudioModel = Schemas["AudioModel"];
export type AudioPattern = Schemas["AudioPattern"];
export type AudioManual = Schemas["AudioManual"];
export type AudioEdit = Schemas["AudioEdit"];
export type AudioAdd = Schemas["AudioAdd"];
export type AudioRefinement = Schemas["AudioRefinement"];
export type AudioRetag = Schemas["AudioRetag"];

// Tabular modality.
export type TabularEntity = Schemas["TabularEntity"];
export type TabularAuditEvent = Schemas["TabularAuditEvent"];
export type TabularAuditKind = Schemas["TabularAuditKind"];
export type TabularAuditLog = Schemas["TabularAuditLog"];
export type TabularHint = Schemas["TabularHint"];
export type TabularLocation = Schemas["TabularLocation"];
export type TabularModel = Schemas["TabularModel"];
export type TabularPattern = Schemas["TabularPattern"];
export type TabularManual = Schemas["TabularManual"];
export type TabularEdit = Schemas["TabularEdit"];
export type TabularAdd = Schemas["TabularAdd"];
export type TabularRefinement = Schemas["TabularRefinement"];
export type TabularRetag = Schemas["TabularRetag"];
