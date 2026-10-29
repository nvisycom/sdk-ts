import type { components } from "@/schema/api.js";

type Schemas = components["schemas"];

/** File and intermediate metadata belonging to a single detection run. */
export type WorkspaceDetectionArtifacts =
	Schemas["WorkspaceDetectionArtifacts"];
/** The detection's input file metadata. */
export type DetectionArtifactInput = Schemas["DetectionArtifactInput"];
/** Availability of a detection's intermediate artifact. */
export type DetectionArtifactIntermediate =
	Schemas["DetectionArtifactIntermediate"];
/** Metadata for a redacted file produced from a detection. */
export type DetectionArtifactOutput = Schemas["DetectionArtifactOutput"];

// Enrichment intermediates a detection produces, returned by
// `detections.getIntermediates()`: OCR layout for images, transcript for audio,
// and token sequences for text.

/** Container: a modality-tagged `parts` array of per-part artifacts. */
export type ArtifactSet = Schemas["ArtifactSet"];

// Image OCR layout: regions in reading order, each a recognized run of text.
/** An image's recognized text, laid out in space. */
export type Layout = Schemas["Layout"];
/**
 * One recognized run of image text: its box, the text, and an optional
 * confidence.
 */
export type LayoutRegion = Schemas["LayoutRegion"];

// Audio transcript.
/** Timestamped transcript of an audio stream. */
export type Transcription = Schemas["Transcription"];
/**
 * One segment of a `Transcription`: a span of audio and the text recognised
 * within it, with optional diarization, language, confidence, and per-word
 * timings.
 */
export type TranscriptSegment = Schemas["TranscriptSegment"];
/** One word within a `TranscriptSegment`, with its own time span. */
export type TranscriptWord = Schemas["TranscriptWord"];

// Text tokenization.
/**
 * Owning token sequence: the `Text` modality's enrichment artifact, produced
 * by a tokenizing enricher and read by a context enhancer.
 */
export type Tokens = Schemas["Tokens"];
/** One token produced by an upstream tokenizer. */
export type Token = Schemas["Token"];
