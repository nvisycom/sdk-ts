import type { components } from "@/schema/api.js";

type Schemas = components["schemas"];

// Enrichment intermediates a detection produces, returned by
// `detections.getArtifacts()`: OCR layout for images, transcript for audio,
// and token sequences for text.

// Container: `{ body, parts }` of per-part artifacts.
export type ArtifactSet = Schemas["ArtifactSet"];

// Image OCR layout.
export type Layout = Schemas["Layout"];
export type LayoutBlock = Schemas["LayoutBlock"];
export type LayoutWord = Schemas["LayoutWord"];

// Audio transcript.
export type Transcription = Schemas["Transcription"];
export type TranscriptSegment = Schemas["TranscriptSegment"];
export type TranscriptWord = Schemas["TranscriptWord"];

// Text tokenization.
export type Tokens = Schemas["Tokens"];
export type Token = Schemas["Token"];
