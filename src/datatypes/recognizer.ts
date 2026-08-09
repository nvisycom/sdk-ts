import type { components } from "@/schema/api.js";

type Schemas = components["schemas"];

// Recognizer configuration, as referenced from pipeline/policy definitions.
export type RecognizerParams = Schemas["RecognizerParams"];
export type PatternRecognizerParams = Schemas["PatternRecognizerParams"];
export type ProviderSelection = Schemas["ProviderSelection"];

// Custom pattern rules and dictionaries.
export type CustomPatternRule = Schemas["CustomPatternRule"];
export type CustomPatternVariant = Schemas["CustomPatternVariant"];
export type CustomPatternContext = Schemas["CustomPatternContext"];
export type CustomDictionary = Schemas["CustomDictionary"];
export type CustomDictionaryTerm = Schemas["CustomDictionaryTerm"];

// Deduplication and merging of overlapping findings.
export type PipelineDeduplication = Schemas["PipelineDeduplication"];
export type MergingStrategyParams = Schemas["MergingStrategyParams"];
export type TiebreakerParams = Schemas["TiebreakerParams"];

// Analysis scope and localization.
export type ScopeParams = Schemas["ScopeParams"];
export type ScopeMetadata = Schemas["ScopeMetadata"];
export type CountryCode = Schemas["CountryCode"];
export type Language = Schemas["Language"];
export type Languages = Schemas["Languages"];
export type LanguageSpan = Schemas["LanguageSpan"];
export type LanguageProvenance = Schemas["LanguageProvenance"];

// Detection confidence.
export type Confidence = Schemas["Confidence"];
