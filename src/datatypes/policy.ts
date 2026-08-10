import type { components } from "@/schema/api.js";

type Schemas = components["schemas"];

// Policy resources.
export type Policy = Schemas["Policy"];
export type PolicySummary = Schemas["PolicySummary"];
export type PolicySummaryPage = Schemas["PolicySummaryPage"];
export type PolicyDefinition = Schemas["PolicyDefinition"];
export type CreatePolicy = Schemas["CreatePolicy"];
export type UpdatePolicy = Schemas["UpdatePolicy"];
export type PolicyRule = Schemas["PolicyRule"];

// Built-in policy template to base a new policy on.
export type PolicyTemplate = Schemas["PolicyTemplate"];
export type HipaaDeidMethod = Schemas["HipaaDeidMethod"];
export type GdprArticle9Treatment = Schemas["GdprArticle9Treatment"];
export type PciDssPart = Schemas["PciDssPart"];
export type PciPanRender = Schemas["PciPanRender"];

// Rules and their conditions.
export type Predicate = Schemas["Predicate"];

// Redaction operators, per modality.
export type ModalityRedactions = Schemas["ModalityRedactions"];
export type TextRedaction = Schemas["TextRedaction"];
export type ImageRedaction = Schemas["ImageRedaction"];
export type AudioRedaction = Schemas["AudioRedaction"];
export type TabularRedaction = Schemas["TabularRedaction"];

// Retention. `RetentionSettings` sets per-scope retention on a workspace;
// `RetentionOverride` lets a pipeline override it per scope.
export type Retention = Schemas["Retention"];
export type RetentionSettings = Schemas["RetentionSettings"];
export type RetentionOverride = Schemas["RetentionOverride"];

// Label vocabulary.
export type Labels = Schemas["Labels"];
export type LabelGroup = Schemas["LabelGroup"];
export type LabelEntry = Schemas["LabelEntry"];
export type LabelLocale = Schemas["LabelLocale"];
export type Label = Schemas["Label"];
export type LocalizedText = Schemas["LocalizedText"];

// Leaf / detail types.
export type Color = Schemas["Color"];
export type Waveform = Schemas["Waveform"];
export type ClampBucket = Schemas["ClampBucket"];
export type ConfidenceThreshold = Schemas["ConfidenceThreshold"];
export type DateStyle = Schemas["DateStyle"];
export type DateGranularity = Schemas["DateGranularity"];
export type LanguageTag = Schemas["LanguageTag"];
export type Sha2Algorithm = Schemas["Sha2Algorithm"];
export type TerminalFallback = Schemas["TerminalFallback"];
