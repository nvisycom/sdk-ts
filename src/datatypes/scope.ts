import type { components } from "@/schema/api.js";

type Schemas = components["schemas"];

// Analysis scope and localization.
export type ScopeMetadata = Schemas["ScopeMetadata"];
export type CountryCode = Schemas["CountryCode"];

// Language claims: a caller-asserted or detector-found language, carried on the
// document context. The language itself is a BCP 47 `LanguageTag` (re-exported
// from `policy`); `LanguageSource` records how a claim was obtained (asserted, or
// detected with a confidence); the optional span is a byte-offset range
// (`Range_of_uint`, re-exported from `audit` as `RangeOfUint`).
export type LanguageClaim = Schemas["LanguageClaim"];
export type LanguageClaims = Schemas["LanguageClaim"][];
export type LanguageSource = Schemas["LanguageSource"];

// Detection confidence.
export type Confidence = Schemas["Confidence"];
