import type { components } from "@/schema/api.js";

type Schemas = components["schemas"];

// Analysis scope and localization.
/** Caller-asserted scope shared across every payload of one analysis. */
export type ScopeMetadata = Schemas["ScopeMetadata"];
/** [ISO 3166-1] country, identified by its code. */
export type CountryCode = Schemas["CountryCode"];

// Language claims: a caller-asserted or detector-found language, carried on the
// document context. The language itself is a BCP 47 `LanguageTag` (re-exported
// from `policy`); `LanguageSource` records how a claim was obtained (asserted, or
// detected with a confidence); the optional span is a byte-offset range
// (`Range_of_uint`, re-exported from `audit` as `RangeOfUint`).
/** A single claim that a span of text is in a `language`. */
export type LanguageClaim = Schemas["LanguageClaim"];
/** A list of `LanguageClaim`s — the languages claimed for a document. */
export type LanguageClaims = Schemas["LanguageClaim"][];
/** Where a `LanguageClaim` came from, and how much to trust it. */
export type LanguageSource = Schemas["LanguageSource"];

/** Confidence score in the closed range `0.0..=1.0`. */
export type Confidence = Schemas["Confidence"];
