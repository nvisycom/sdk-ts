import type { components } from "@/schema/api.js";

type Schemas = components["schemas"];

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
