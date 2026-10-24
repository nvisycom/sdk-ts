import type { components } from "@/schema/api.js";

type Schemas = components["schemas"];

// Policy resources.
/** Response type for a workspace policy. */
export type WorkspacePolicy = Schemas["WorkspacePolicy"];
/** A named governance policy. */
export type Policy = Schemas["Policy"];
/** The kind of a redaction policy. */
export type PolicyKind = Schemas["PolicyKind"];
/** Lightweight policy view for lists. */
export type WorkspacePolicySummary = Schemas["WorkspacePolicySummary"];
/** Generic paginated response wrapper. */
export type WorkspacePolicySummaryPage = Schemas["WorkspacePolicySummaryPage"];
/** Query parameters for listing policies. */
export type WorkspacePoliciesQuery = Schemas["WorkspacePoliciesQuery"];
/**
 * A client-authored policy body: the parts of a policy definition a caller
 * may set, without the fields the server owns.
 */
export type PolicyDraft = Schemas["PolicyDraft"];
/** Request payload for creating a new workspace policy. */
export type CreateWorkspacePolicy = Schemas["CreateWorkspacePolicy"];
/** Request payload for updating an existing workspace policy. */
export type UpdateWorkspacePolicy = Schemas["UpdateWorkspacePolicy"];
/**
 * Request payload to promote a derived (ad-hoc) policy to an authored one,
 * optionally replacing its generated name with `displayName`.
 */
export type PromoteWorkspacePolicy = Schemas["PromoteWorkspacePolicy"];
/**
 * One rule inside a `Policy`. Identity is the UUID; `name` / `description`
 * are display-only. `dispatch` picks the selection strategy.
 */
export type PolicyRule = Schemas["PolicyRule"];
/** How to detect one caller-authored label. */
export type CustomMatcher = Schemas["CustomMatcher"];

// Built-in policy template to base a new policy on.
/** A regulatory posture this crate ships a `Template` for. */
export type PolicyTemplate = Schemas["PolicyTemplate"];
/** The template a `Policy` was built from. */
export type TemplateOrigin = Schemas["TemplateOrigin"];
/** Which HIPAA §164.514 de-identification method to apply. */
export type HipaaDeidMethod = Schemas["HipaaDeidMethod"];
/** Which account-identifier labels §164.514(b)(2)(i)(J) covers. */
export type HipaaAccountNumbers = Schemas["HipaaAccountNumbers"];
/** Which operator to apply to Article 9 special-category entities. */
export type GdprArticle9Treatment = Schemas["GdprArticle9Treatment"];
/** Which sensitive-data labels the template's scope covers. */
export type GdprSensitiveScope = Schemas["GdprSensitiveScope"];
/** Which PCI DSS subsection this template addresses. */
export type PciDssPart = Schemas["PciDssPart"];
/** Which PCI DSS §3.5.1-permitted render approach to apply to stored PAN. */
export type PciPanRender = Schemas["PciPanRender"];

/**
 * Predicate over a recognised entity. The wire format uses an internally
 * tagged enum so authors write `{ "kind": "confidence", "min": 0.7 }` etc.
 */
export type Predicate = Schemas["Predicate"];

// Redaction operators, per modality.
/** Per-modality operator specs carried by a `redact` rule. */
export type ModalityRedactions = Schemas["ModalityRedactions"];
/** Operator spec a `redact` text rule carries. */
export type TextRedaction = Schemas["TextRedaction"];
/** Operator spec a `redact` image rule carries. */
export type ImageRedaction = Schemas["ImageRedaction"];
/** Operator spec a `redact` audio rule carries. */
export type AudioRedaction = Schemas["AudioRedaction"];
/** Operator spec a `redact` tabular rule carries. */
export type TabularRedaction = Schemas["TabularRedaction"];

// Label vocabulary. A policy detects one or more named `LabelScope`s.
/** A named set of labels a `Policy` detects. */
export type LabelScope = Schemas["LabelScope"];
/**
 * One entry inside a table-dispatch rule: the label to match plus the
 * per-modality operators to run.
 */
export type LabelEntry = Schemas["LabelEntry"];
/**
 * A label's human-facing text in one language: a display name and an
 * optional fuller description.
 */
export type LabelLocale = Schemas["LabelLocale"];
/**
 * Kind of sensitive information: a stable `id`, per-language `LabelLocale`s,
 * an optional `category`, and zero or more tags.
 */
export type Label = Schemas["Label"];
/** Lightweight reference to a `Label`, carrying only its id. */
export type LabelRef = Schemas["LabelRef"];
/** A value localized per `LanguageTag`, with an English-first fallback. */
export type LocalizedText = Schemas["LocalizedText"];

// Leaf / detail types.
/** Color as 8-bit RGB. */
export type Color = Schemas["Color"];
/** Shape of a synthesized tone. */
export type Waveform = Schemas["Waveform"];
/** Text a clamp text operator emits for out-of-range values. */
export type ClampBucket = Schemas["ClampBucket"];
/** Minimum-confidence cutoff in the closed range `0.0..=1.0`. */
export type ConfidenceThreshold = Schemas["ConfidenceThreshold"];
/** Which written date convention a `GeneralizeDate` accepts on *input*. */
export type DateStyle = Schemas["DateStyle"];
/** The coarseness a `GeneralizeDate` reduces a date/timestamp to. */
export type DateGranularity = Schemas["DateGranularity"];
/**
 * Well-formed [BCP 47] language tag, such as `en`, `en-US`, or `zh-Hant-HK`.
 */
export type LanguageTag = Schemas["LanguageTag"];
/** Which SHA-2 variant a hashing operator uses. */
export type Sha2Algorithm = Schemas["Sha2Algorithm"];
/**
 * Fallback operator that runs when a declinable primary text operator (clamp
 * or generalize-date) doesn't apply to the entity value.
 */
export type TerminalFallback = Schemas["TerminalFallback"];
