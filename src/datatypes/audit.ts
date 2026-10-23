import type { components } from "@/schema/api.js";

type Schemas = components["schemas"];

// The detection result model: what `getDetections()` returns via `Audit`.
// A modality-tagged tree of recognized entities, each with its full audit
// trail (the events in its life) and location within the document.

// Audit container.
/** What detection found in one document. */
export type Audit = Schemas["Audit"];
/** What a caller asserts about the document being processed. */
export type DocumentContext = Schemas["DocumentContext"];
/** How the codec decodes this document. */
export type CodecParams = Schemas["CodecParams"];
/** What to do with an image's EXIF metadata when re-encoding it. */
export type ExifPolicy = Schemas["ExifPolicy"];
/**
 * Coreference identifier shared by entities that denote the same real-world
 * thing.
 */
export type EntityCoRef = Schemas["EntityCoRef"];
/** Detection result: a per-part, modality-tagged list of entities. */
export type Report = Schemas["Report"];
/** Labels a request introduces, and how to detect them. */
export type Recognition = Schemas["Recognition"];
/** Which of the available components one request wants to run. */
export type ComponentSelection = Schemas["ComponentSelection"];

/** Reviewer edits for one document, one list per modality. */
export type EditSet = Schemas["EditSet"];

// Raster mode a run resolved to, with its render resolution.
/** Policy for rendering a document's pages to images. */
export type RasterMode = Schemas["RasterMode"];
/** Dots-per-inch resolution for rasterizing vector content. */
export type Dpi = Schemas["Dpi"];

// Redaction decision and reviewer overrides.
/** An operator hid the entity. */
export type Redaction = Schemas["Redaction"];
/**
 * An operator was *picked* to hide the entity, the redaction decision,
 * recorded before it is applied so it can be reviewed (and the entity
 * edited) first. The `Redaction` event that follows records the operator
 * actually run.
 */
export type Selection = Schemas["Selection"];
/** Leave this entity alone: a reviewer calling it a false positive. */
export type Suppress = Schemas["Suppress"];
/**
 * Which human decision a `Manual` event records, the reviewer actions on a
 * finding: `Flag` a miss, `Suppress` a false positive, or `Amend` an
 * existing finding.
 */
export type ManualIntent = Schemas["ManualIntent"];
/** What a redacted output leaks about the original it replaced. */
export type LeakProfile = Schemas["LeakProfile"];
/**
 * A serializable summary of *which selection rule* bound an operator to an
 * entity, the automatic "why" behind a redaction.
 */
export type RuleMatch = Schemas["RuleMatch"];

// Attribution: the rationale behind a redaction.
/**
 * Author-supplied rationale for a redaction: *under what authority* it was
 * made.
 */
export type Attribution = Schemas["Attribution"];
/**
 * A `Cited` rationale: a citable authority, the citation within it, and an
 * optional rationale for why it applies.
 */
export type CitedAttribution = Schemas["CitedAttribution"];
/**
 * A `Freeform` rationale: a policy label and an optional human description,
 * with no formal citation.
 */
export type FreeformAttribution = Schemas["FreeformAttribution"];

// Recognition and reconciliation event detail.
/** Metadata of a model/NER recognition, carried by `Model`. */
export type ModelEvent = Schemas["ModelEvent"];
/** Metadata of a pattern/dictionary recognition, carried by `Pattern`. */
export type PatternEvent = Schemas["PatternEvent"];
/**
 * A competing detection of a *different* label over the same span was
 * resolved against this (winning) entity, the loser is recorded, not
 * dropped.
 */
export type Conflict = Schemas["Conflict"];
/**
 * A competing detection of a different label over the same span was left
 * *unresolved*: both entities survive, flagged for a human. Recorded on each
 * entity of the contested pair, naming the other.
 */
export type Contested = Schemas["Contested"];
/** Several detections were fused into one entity. */
export type Deduplication = Schemas["Deduplication"];
/** The entity's confidence was rescaled by a per-recognizer factor. */
export type Calibration = Schemas["Calibration"];
/**
 * Identifies a redaction operator, for the redaction audit a higher layer
 * assembles.
 */
export type OperatorId = Schemas["OperatorId"];

// Audit-event digest and the coarse category a label belongs to.
/** A 32-byte BLAKE3 digest. */
export type AuditHash = Schemas["AuditHash"];
/**
 * The coarse group a `Label` belongs to, for organizing detected entities by
 * kind (`financial`, `health`, `identity`, …).
 */
export type Category = Schemas["Category"];

/** Half-open `[start, end)` index range. Generated name; a plain uint range. */
export type RangeOfUint = Schemas["Range_of_uint"];

// Reference back to the original source (byte range + optional container part).
/**
 * A reference back to the original source: a byte range, and, for a
 * container whose body spans several files, which part that range indexes.
 */
export type SourceRef = Schemas["SourceRef"];

// Geometry / spans, shared across modalities. Coordinates are f64.
/** Axis-aligned bounding box in f64 pixel coordinates. */
export type BoundingBox = Schemas["BoundingBoxF64"];
/** A point in f64 pixel coordinates. */
export type Point = Schemas["PointF64"];
/** A polygon whose vertices are f64 pixel coordinates. */
export type Polygon = Schemas["PolygonF64"];
/** Half-open `[start, end)` stream interval, measured in microseconds. */
export type TimeSpan = Schemas["TimeSpan"];

// Text modality.
/** Detected piece of sensitive information within some medium. */
export type TextEntity = Schemas["TextEntity"];
/**
 * One node in an entity's audit DAG: a thing that happened, with its effect
 * on confidence and its tamper-evident links.
 */
export type TextAuditEvent = Schemas["TextAuditEvent"];
/**
 * Kind of an `AuditEvent`, carrying its event-specific detail and the
 * rationale for why it happened.
 */
export type TextAuditKind = Schemas["TextAuditKind"];
/**
 * Full audit trail of an `Entity`: every `AuditEvent` in its life, as a
 * tamper-evident DAG.
 */
export type TextAuditLog = Schemas["TextAuditLog"];
/**
 * Located, out-of-band context a recognizer may treat as in-context for a
 * nearby value.
 */
export type TextHint = Schemas["TextHint"];
/** Where an entity sits in text. */
export type TextLocation = Schemas["TextLocation"];
/**
 * A location the pipeline detected over decoded text: always a byte span,
 * plus where that text physically lives.
 */
export type Detected = Schemas["Detected"];
/**
 * A reviewer's mark with no decoded span: the physical anchor is the whole
 * location. (A mark on plain text gives a byte range, so it is an inline
 * `Detected` location, not a `Marked` — hence no inline variant here.)
 */
export type Marked = Schemas["Marked"];
/**
 * Axis-aligned bounding box in normalized `0.0..=1.0` coordinates, top-left
 * origin: `(0, 0)` is the top-left corner of the medium and `(1, 1)` the
 * bottom-right, with `y` increasing downward.
 */
export type UnitBoundingBox = Schemas["UnitBoundingBox"];
/**
 * Detail of a model/NER recognition: a model matched at `location`, with its
 * metadata in `model`.
 */
export type TextModel = Schemas["TextModel"];
/**
 * Detail of a pattern/dictionary recognition: a recognizer matched at
 * `location`, with the pattern metadata in `pattern`.
 */
export type TextPattern = Schemas["TextPattern"];
/**
 * A human override, outside automatic detection: an entity a reviewer added
 * by hand, or a detected one they marked to ignore. Its provenance is a
 * person's decision, not a recognizer's, so the trail records *why* (an
 * `Attribution`, when supplied). *Who* made the override is the event's
 * `source`, not a payload field.
 */
export type TextManual = Schemas["TextManual"];
/** One change to an analyzed document. */
export type TextEdit = Schemas["TextEdit"];
/** A detection recognition missed. */
export type TextAdd = Schemas["TextAdd"];
/** A context keyword near the entity lifted its confidence. */
export type TextRefinement = Schemas["TextRefinement"];
/**
 * Correct what an existing detection *is* or *covers*, then redact it under
 * the policy set as corrected.
 */
export type TextRetag = Schemas["TextRetag"];

// Image modality.
/** Detected piece of sensitive information within some medium. */
export type ImageEntity = Schemas["ImageEntity"];
/**
 * One node in an entity's audit DAG: a thing that happened, with its effect
 * on confidence and its tamper-evident links.
 */
export type ImageAuditEvent = Schemas["ImageAuditEvent"];
/**
 * Kind of an `AuditEvent`, carrying its event-specific detail and the
 * rationale for why it happened.
 */
export type ImageAuditKind = Schemas["ImageAuditKind"];
/**
 * Full audit trail of an `Entity`: every `AuditEvent` in its life, as a
 * tamper-evident DAG.
 */
export type ImageAuditLog = Schemas["ImageAuditLog"];
/**
 * Located, out-of-band context a recognizer may treat as in-context for a
 * nearby value.
 */
export type ImageHint = Schemas["ImageHint"];
/** Region within image content. */
export type ImageLocation = Schemas["ImageLocation"];
/**
 * Detail of a model/NER recognition: a model matched at `location`, with its
 * metadata in `model`.
 */
export type ImageModel = Schemas["ImageModel"];
/**
 * Detail of a pattern/dictionary recognition: a recognizer matched at
 * `location`, with the pattern metadata in `pattern`.
 */
export type ImagePattern = Schemas["ImagePattern"];
/**
 * A human override, outside automatic detection: an entity a reviewer added
 * by hand, or a detected one they marked to ignore. Its provenance is a
 * person's decision, not a recognizer's, so the trail records *why* (an
 * `Attribution`, when supplied). *Who* made the override is the event's
 * `source`, not a payload field.
 */
export type ImageManual = Schemas["ImageManual"];
/** One change to an analyzed document. */
export type ImageEdit = Schemas["ImageEdit"];
/** A detection recognition missed. */
export type ImageAdd = Schemas["ImageAdd"];
/** A context keyword near the entity lifted its confidence. */
export type ImageRefinement = Schemas["ImageRefinement"];
/**
 * Correct what an existing detection *is* or *covers*, then redact it under
 * the policy set as corrected.
 */
export type ImageRetag = Schemas["ImageRetag"];

// Audio modality.
/** Detected piece of sensitive information within some medium. */
export type AudioEntity = Schemas["AudioEntity"];
/**
 * One node in an entity's audit DAG: a thing that happened, with its effect
 * on confidence and its tamper-evident links.
 */
export type AudioAuditEvent = Schemas["AudioAuditEvent"];
/**
 * Kind of an `AuditEvent`, carrying its event-specific detail and the
 * rationale for why it happened.
 */
export type AudioAuditKind = Schemas["AudioAuditKind"];
/**
 * Full audit trail of an `Entity`: every `AuditEvent` in its life, as a
 * tamper-evident DAG.
 */
export type AudioAuditLog = Schemas["AudioAuditLog"];
/**
 * Located, out-of-band context a recognizer may treat as in-context for a
 * nearby value.
 */
export type AudioHint = Schemas["AudioHint"];
/** A `TimeSpan` within audio content, with an optional speaker label. */
export type AudioLocation = Schemas["AudioLocation"];
/**
 * Detail of a model/NER recognition: a model matched at `location`, with its
 * metadata in `model`.
 */
export type AudioModel = Schemas["AudioModel"];
/**
 * Detail of a pattern/dictionary recognition: a recognizer matched at
 * `location`, with the pattern metadata in `pattern`.
 */
export type AudioPattern = Schemas["AudioPattern"];
/**
 * A human override, outside automatic detection: an entity a reviewer added
 * by hand, or a detected one they marked to ignore. Its provenance is a
 * person's decision, not a recognizer's, so the trail records *why* (an
 * `Attribution`, when supplied). *Who* made the override is the event's
 * `source`, not a payload field.
 */
export type AudioManual = Schemas["AudioManual"];
/** One change to an analyzed document. */
export type AudioEdit = Schemas["AudioEdit"];
/** A detection recognition missed. */
export type AudioAdd = Schemas["AudioAdd"];
/** A context keyword near the entity lifted its confidence. */
export type AudioRefinement = Schemas["AudioRefinement"];
/**
 * Correct what an existing detection *is* or *covers*, then redact it under
 * the policy set as corrected.
 */
export type AudioRetag = Schemas["AudioRetag"];

// Tabular modality.
/** Detected piece of sensitive information within some medium. */
export type TabularEntity = Schemas["TabularEntity"];
/**
 * One node in an entity's audit DAG: a thing that happened, with its effect
 * on confidence and its tamper-evident links.
 */
export type TabularAuditEvent = Schemas["TabularAuditEvent"];
/**
 * Kind of an `AuditEvent`, carrying its event-specific detail and the
 * rationale for why it happened.
 */
export type TabularAuditKind = Schemas["TabularAuditKind"];
/**
 * Full audit trail of an `Entity`: every `AuditEvent` in its life, as a
 * tamper-evident DAG.
 */
export type TabularAuditLog = Schemas["TabularAuditLog"];
/**
 * Located, out-of-band context a recognizer may treat as in-context for a
 * nearby value.
 */
export type TabularHint = Schemas["TabularHint"];
/** Cell-addressed location within tabular content. */
export type TabularLocation = Schemas["TabularLocation"];
/**
 * Detail of a model/NER recognition: a model matched at `location`, with its
 * metadata in `model`.
 */
export type TabularModel = Schemas["TabularModel"];
/**
 * Detail of a pattern/dictionary recognition: a recognizer matched at
 * `location`, with the pattern metadata in `pattern`.
 */
export type TabularPattern = Schemas["TabularPattern"];
/**
 * A human override, outside automatic detection: an entity a reviewer added
 * by hand, or a detected one they marked to ignore. Its provenance is a
 * person's decision, not a recognizer's, so the trail records *why* (an
 * `Attribution`, when supplied). *Who* made the override is the event's
 * `source`, not a payload field.
 */
export type TabularManual = Schemas["TabularManual"];
/** One change to an analyzed document. */
export type TabularEdit = Schemas["TabularEdit"];
/** A detection recognition missed. */
export type TabularAdd = Schemas["TabularAdd"];
/** A context keyword near the entity lifted its confidence. */
export type TabularRefinement = Schemas["TabularRefinement"];
/**
 * Correct what an existing detection *is* or *covers*, then redact it under
 * the policy set as corrected.
 */
export type TabularRetag = Schemas["TabularRetag"];

// Extracted document/media metadata, per modality, and the reader that
// surfaced it (`MetadataEvent`, carried on each modality's audit event).
/** Source detail of a metadata-field detection, carried by `Metadata`. */
export type MetadataEvent = Schemas["MetadataEvent"];
/**
 * Detail of a metadata-field detection: a document's out-of-band field (an
 * EXIF tag, a file timestamp, a document property) was surfaced as a
 * redaction subject at `location`, with its source in `metadata`.
 */
export type AudioMetadata = Schemas["AudioMetadata"];
/**
 * Detail of a metadata-field detection: a document's out-of-band field (an
 * EXIF tag, a file timestamp, a document property) was surfaced as a
 * redaction subject at `location`, with its source in `metadata`.
 */
export type ImageMetadata = Schemas["ImageMetadata"];
/**
 * Detail of a metadata-field detection: a document's out-of-band field (an
 * EXIF tag, a file timestamp, a document property) was surfaced as a
 * redaction subject at `location`, with its source in `metadata`.
 */
export type TabularMetadata = Schemas["TabularMetadata"];
/**
 * Detail of a metadata-field detection: a document's out-of-band field (an
 * EXIF tag, a file timestamp, a document property) was surfaced as a
 * redaction subject at `location`, with its source in `metadata`.
 */
export type TextMetadata = Schemas["TextMetadata"];
