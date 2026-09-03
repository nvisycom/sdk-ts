# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to
[Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [0.42.0] - 2026-09-03

### Changed

- Regenerated the API schema against the updated platform handlers
- **Breaking:** the `parts` field on `ArtifactSet` and `Report` changed from a
  part-id-keyed object map to a tagged array (`{ id, modality, artifact }[]`),
  each entry carrying its own `id`
- **Breaking:** the `part` field on the per-modality `*Add` audit-event
  datatypes is now `string[]` (an added entity may span multiple container
  parts). `SourceRef.part` stays a single `string`

## [0.41.0] - 2026-09-02

### Added

- `detections.getIntermediates(workspaceSlug, detectionId)` returns a
  detection's enrichment intermediates (`ArtifactSet`) — an image's OCR layout,
  an audio clip's transcript, or tokenized text — so a client can search the
  extracted content and add missed entities (a detection whose analysis ran no
  enricher has none and 404s)
- Intermediates datatypes (`ArtifactSet`, `Layout`, `LayoutBlock`, `LayoutWord`,
  `Transcription`, `TranscriptSegment`, `TranscriptWord`, `Tokens`, `Token`)
- An `intermediates` retention scope on `RetentionSettings` and
  `RetentionOverride`

### Changed

- Regenerated the API schema against the updated platform handlers

## [0.40.0] - 2026-08-31

### Added

- `FileHash` datatype (a SHA-256 content hash, 64-char hex). Files now carry an
  optional `hash`, and `files.listFiles()` accepts it as a filter to find files
  by content hash

### Changed

- Regenerated the API schema against the updated platform handlers

## [0.39.0] - 2026-08-30

### Added

- `files.deleteFiles(workspaceSlug, fileIds)` deletes several files in one call
  and returns the `deleted` and `skipped` ids (`DeletedFiles`); the request
  shape is `DeleteFiles`

### Changed

- Regenerated the API schema against the updated platform handlers
- **Breaking:** renamed the `OcrPolicy` datatype to `RasterPolicy`, matching the
  renamed `WorkspaceSettings` raster policy

## [0.38.0] - 2026-08-29

### Added

- `checkHealth()` — a standalone health check that needs neither an API token
  nor a `Nvisy` client, for use as a pre-auth liveness probe. The health
  endpoint is public (unauthenticated returns a cached status, authenticated a
  real-time one), and a degraded `503` is returned as a `Health` value rather
  than thrown. Exported from `@nvisy/sdk/standalone` with its `HealthConfig`

### Changed

- **Breaking:** the standalone `login` / `signup` functions moved from
  `@nvisy/sdk/auth` to `@nvisy/sdk/standalone`, now sharing one module with
  `checkHealth`:

  ```diff
  - import { login, signup } from "@nvisy/sdk/auth";
  + import { login, signup } from "@nvisy/sdk/standalone";
  ```

  `AuthConfig` is re-exported from the same subpath; behavior is unchanged.

## [0.37.0] - 2026-08-27

### Changed

- Regenerated the API schema against the updated platform handlers. The
  per-modality `*Add` audit-event datatypes (`TextAdd`, `ImageAdd`, `AudioAdd`,
  `TabularAdd`) now carry an optional `part` (the container-part id for a
  multi-file document)

## [0.36.0] - 2026-08-27

### Changed

- Regenerated the API schema against the updated platform handlers. The
  detection time-series endpoint moved from `/analytics/runs/timeseries/` to
  `/analytics/detections/timeseries/`, finishing the run-to-detection rename;
  `analytics.getDetectionTimeSeries()` is unchanged for callers

## [0.35.0] - 2026-08-26

The platform renamed the core "pipeline run" concept to "detection" and made
redaction an independent resource. This release renames the SDK to match.

### Added

- `nvisy.detections` service (replaces `nvisy.runs`): `listDetections`,
  `listPipelineDetections`, `createDetection`, `getDetection`, `getAnalysis`
  (the audit), `downloadAudit`, `events` / `streamEvents` (SSE), plus
  `listRedactions` and `createRedaction`
- `nvisy.redactions` service, parallel to detections: `getReview`
- Detection datatypes (`Detection`, `CreateDetection`, `DetectionPage`,
  `DetectionStatus`, `DetectionId`, `DetectionMetadata`, `DetectionStatusEvent`,
  `PipelineDetectionsQuery`) and redaction datatypes (`RedactDetection`,
  `RedactionId`, `RedactionResult`, `RedactionResultPage`)

### Changed

- Regenerated the API schema against the updated platform handlers
- **Breaking:** `nvisy.runs` is renamed to `nvisy.detections`; its methods are
  renamed accordingly (`createRun` → `createDetection`, `getRun` →
  `getDetection`, `getDetections` → `getAnalysis`, `redact` →
  `createRedaction`, `listRuns` / `listPipelineRuns` → `listDetections` /
  `listPipelineDetections`)
- **Breaking:** `analytics.getRunTimeSeries()` is renamed to
  `analytics.getDetectionTimeSeries()`
- **Breaking:** the run analytics, notification-payload, and activity datatypes
  are renamed to their detection/redaction equivalents (`RunAnalytics` →
  `DetectionAnalytics`, `RunTimeSeries` → `DetectionTimeSeries`,
  `PipelineRun*Params` → `Detection*Params` / `Redaction*Params`, etc.)

### Removed

- **Breaking:** the `PipelineRun*` / `Run*` datatypes (`PipelineRun`,
  `CreatePipelineRun`, `PipelineRunPage`, `PipelineRunStatus`,
  `PipelineRunsQuery`, `RunId`, `RunMetadata`, `RunStatusEvent`), and the
  per-modality `*Redact` audit-event datatypes (`TextRedact`, `ImageRedact`,
  `AudioRedact`, `TabularRedact`) — the platform no longer exposes them

## [0.34.0] - 2026-08-18

### Added

- The redesigned detection-result model reachable from `Audit`: the document
  container (`DocumentContext`, `CodecParams`, `Report`), reviewer edits
  (`EditSet`), the redaction decision (`Redaction`, `Selection`, `Suppress`,
  `ManualIntent`), attribution rationales (`CitedAttribution`,
  `FreeformAttribution`), reconciliation events (`Conflict`, `Contested`,
  `Deduplication`, `Calibration`), and the per-modality event kinds for text,
  image, audio, and tabular content (`*Model`, `*Pattern`, `*Manual`, `*Edit`,
  `*Add`, `*Redact`, `*Refinement`, `*Retag`)

### Changed

- Regenerated the API schema against the updated platform handlers
- The default user-agent version is now injected from `package.json` at build
  time, so it always matches the published version (previously a hand-maintained
  constant that had drifted)
- **Breaking:** the `Audit` datatype is now exported from the audit module
  (unchanged import path via the package root and `@nvisy/sdk/datatypes`)
- **Breaking:** the activity feed's query datatypes are renamed —
  `ActivityListQuery` → `ActivityFilterQuery` and `ActivityExportQuery` →
  `ActivityExportOptions` — now composed with the date window and pagination by
  `listActivities()` / `exportActivities()`

### Removed

- **Breaking:** detection-model datatypes the platform no longer exposes:
  `EntityGroup`, `AuditContext`, `AttributionKind`, `Review`, the per-modality
  `*EntityRecord` types (`TextEntityRecord`, `ImageEntityRecord`,
  `AudioEntityRecord`, `TabularEntityRecord`), and `ScopeParams`

## [0.33.0] - 2026-08-18

### Added

- `ActivityListQuery` and `ActivityType` datatypes. `activities.listActivities()`
  now accepts the feed's filters (`type`, `actor`, `from`, `to`) alongside
  pagination (`limit`, `after`, `includeCount`); `type` is an `ActivityType[]`
  and is also usable on `activities.exportActivities()`

### Changed

- Regenerated the API schema against the updated platform handlers
- **Breaking:** `activities.listActivities()` now takes an `ActivityListQuery`
  (filters + pagination) rather than a plain cursor-pagination object

### Removed

- **Breaking:** the `SystemAnnouncementParams` and `SystemReportParams`
  notification-payload datatypes; the platform no longer emits the
  `system:announcement` / `system:report` notification variants

## [0.32.0] - 2026-08-18

### Added

- `chat` service for the workspace assistant: `listSessions`, `createSession`,
  `deleteSession`, `listMessages`, `streamMessage` (streams the reply as typed
  `ChatToken` deltas over SSE), and `sendMessage` for the raw response
- `analytics` service: `getAnalytics` (`WorkspaceAnalytics`) and
  `getRunTimeSeries` (`RunTimeSeries`)
- `activities.exportActivities()` to export the activity log over a date window
  as a downloadable file
- Chat datatypes (`ChatSession`, `ChatSessionPage`, `CreateChatSession`,
  `ChatMessage`, `ChatRole`, `SendChatMessage`, `ChatToken`), analytics
  datatypes (`WorkspaceAnalytics`, `StorageAnalytics`, `RunAnalytics`,
  `UsageAnalytics`, `RunTimeSeries`, and their entries plus `Usage`,
  `UsageReport`, `TokenCounts`, `ModelUsage`, `ProviderType`, `RecognizerId`),
  export datatypes (`ExportFormat`, `ExportQuery`, `DateWindow`,
  `ActivityExportQuery`)

### Changed

- Regenerated the API schema against the updated platform handlers
- Schema generation now passes `--default-non-nullable false`, so a schema
  field that carries a `default` (e.g. `CursorPagination.includeCount`,
  `Login.rememberMe`) is typed as optional instead of required. Callers can
  omit these fields, e.g. `listPolicies(slug, { limit: 20 })`
- **Breaking:** `runs.downloadAuditJson()` and `runs.downloadAuditCsv()` are
  replaced by a single `runs.downloadAudit(workspaceSlug, runId, { format })`,
  where `format` is `csv` (default) or `json`, matching the merged
  `GET /runs/{runId}/audit` endpoint

## [0.31.0] - 2026-08-18

### Added

- `PasswordChange` datatype, a re-authenticated password change (current plus
  new password) now accepted on `UpdateAccount.password`

### Changed

- Regenerated the API schema against the updated platform handlers

## [0.30.0] - 2026-08-18

### Added

- `fetch` option on the client config and the standalone auth helpers, letting
  a host swap in a custom `fetch` implementation for every request. Defaults to
  the global `fetch`, so existing callers are unaffected. Useful for a desktop
  (Tauri) app passing `@tauri-apps/plugin-http`'s `fetch`, which performs the
  request in the native process and so is not subject to browser CORS

## [0.29.0] - 2026-08-14

### Added

- `SourceRef` datatype, a reference back to the original source (byte range
  plus, for a multi-file body, the container part) now carried on detections

### Changed

- Regenerated the API schema against the updated platform handlers

## [0.28.0] - 2026-08-14

### Added

- `LabelScope` datatype, a named set of labels a policy detects (replacing the
  removed label-vocabulary containers)
- The opaque id newtypes are now re-exported, so consumers can name them in
  their own signatures: `Handle`, `LabelRef`, `ConnectionId`, `RunId`,
  `WebhookId`

### Changed

- Regenerated the API schema against the updated platform handlers

### Removed

- **Breaking:** the `Labels` and `LabelGroup` policy label-vocabulary
  datatypes, replaced by `LabelScope`. The remaining label types (`LabelEntry`,
  `LabelLocale`, `Label`, `LabelRef`, `LocalizedText`) are unchanged

## [0.27.0] - 2026-08-14

### Added

- `PolicyDraft` datatype, the client-authored policy body used by
  `CreatePolicy` / `UpdatePolicy`
- `TemplateOrigin` (the template a `PolicyDefinition` was built from) and
  `AttributionKind` (the shape of an `Attribution`'s rationale) datatypes

### Changed

- Regenerated the API schema against the updated platform handlers
- **Breaking:** renamed the `OcrMode` datatype to `RasterMode`, matching
  `AuditContext.rasterMode`

### Removed

- **Breaking:** the `GdprArticle9` and `HipaaDeidentification` policy-template
  wrapper datatypes, now folded into `TemplateOrigin`. Their leaf enums
  (`GdprArticle9Treatment`, `GdprSensitiveScope`, `HipaaDeidMethod`,
  `HipaaAccountNumbers`) remain

## [0.26.0] - 2026-08-14

### Added

- `AuditHash` (audit-event digest) and `Category` (a label's coarse group)
  datatypes
- Policy-template config datatypes: `HipaaDeidentification`,
  `HipaaAccountNumbers`, `GdprArticle9`, `GdprSensitiveScope`

### Changed

- Regenerated the API schema against the updated platform handlers
- **Breaking:** renamed the per-modality audit-event datatypes, for each of
  text, image, audio, and tabular: `*Event` → `*AuditEvent`, `*EventKind` →
  `*AuditKind`, and `*Provenance` → `*AuditLog` (e.g. `TextEvent` →
  `TextAuditEvent`, `TextProvenance` → `TextAuditLog`)

## [0.25.0] - 2026-08-12

### Added

- `notifications.streamEvents()` streams the account's unread notification
  count as Server-Sent Events (typed `UnreadCountEvent`), with
  `notifications.events()` for the raw `text/event-stream` response
- `ActivityPayload` datatype, a discriminated union (on `activityType`)
  carrying each event's data, plus its named variant types
  (`WorkspaceActivityParams`, `MemberActivityParams`, `InviteActivityParams`,
  `ConnectionActivityParams`, `PipelineActivityParams`,
  `PipelineRunActivityParams`, `PolicyActivityParams`, `FileActivityParams`,
  `WebhookActivityParams`)
- `UnreadCountEvent` and `RunMetadata` datatypes

### Changed

- Regenerated the API schema against the updated platform handlers
- **Breaking:** the `Activity` datatype now carries a structured `payload`
  (`ActivityPayload`) instead of a flat `activityType` enum. Read the event
  type from `activity.payload.activityType`; the `ActivityType` datatype is
  removed
- **Breaking:** renamed the run event-stream methods for a consistent SSE
  surface across services — `runs.streamEventsResponse()` is now
  `runs.events()` (raw response), and `runs.streamEvents()` keeps its name
  (parsed events). Each service now exposes the same `events()` /
  `streamEvents()` pair

## [0.24.0] - 2026-08-12

### Added

- `NotificationPayload` datatype, a discriminated union (on `notifyType`)
  carrying each event's data, plus its nine named variant types:
  `MemberInvitedParams`, `MemberJoinedParams`, `ConnectionSyncCompletedParams`,
  `ConnectionSyncFailedParams`, `PipelineRunAnalyzedParams`,
  `PipelineRunCompletedParams`, `PipelineRunFailedParams`,
  `SystemAnnouncementParams`, and `SystemReportParams`

### Changed

- Regenerated the API schema against the updated platform handlers
- **Breaking:** the `Notification` datatype now carries a structured `payload`
  (`NotificationPayload`) instead of a flat `notifyType` enum. Read the event
  type from `notification.payload.notifyType`; each variant's data (e.g.
  `workspaceSlug`, `recordsSynced`, `runId`) hangs off the same object

## [0.23.0] - 2026-08-12

### Added

- `notifications.markAllRead()` marks every unread notification for the
  authenticated account as read and returns how many were marked
  (`MarkedReadStatus`)
- `notifications.markRead(notificationId)` marks a single notification as read
- `MarkedReadStatus` datatype (`{ markedRead }`)

### Changed

- Regenerated the API schema against the updated platform handlers

## [0.22.0] - 2026-08-12

### Added

- `PipelineRunsQuery` datatype, the filters accepted by the run-listing
  endpoints (`fileId`, `status`, `triggerType`, `triggeredBy`)
- `runs.listRuns()` and `runs.listPipelineRuns()` now accept those filters in
  their `query` argument (previously only `status` and pagination);
  `listRuns()` also accepts `pipelineId`

### Changed

- Regenerated the API schema against the updated platform handlers

## [0.21.0] - 2026-08-11

### Changed

- Regenerated the API schema against the updated platform handlers; the
  `CreatePipeline` datatype now accepts an optional `status` field, so a
  pipeline can be created directly as `enabled` instead of the default `draft`

## [0.20.0] - 2026-08-11

### Added

- `runs.streamEvents()` streams a run's status changes as Server-Sent Events,
  yielding each transition as a typed `RunStatusEvent` until the run settles:
  `for await (const { status } of nvisy.runs.streamEvents(ws, runId)) { ... }`
- `runs.streamEventsResponse()` for callers that want the raw `text/event-stream`
  `Response` instead of parsed events
- `RunStatusEvent` datatype (`{ runId, status }`)

### Changed

- Regenerated the API schema against the updated platform handlers; the run
  events endpoint now documents its `RunStatusEvent` payload

## [0.19.0] - 2026-08-11

### Added

- `runs.downloadAuditJson()` and `runs.downloadAuditCsv()` for downloading a
  run's audit as a pretty-printed JSON file or a zip of `entities.csv`,
  `provenance.csv`, and `reviews.csv`. Both return the raw `Response`

### Changed

- Regenerated the API schema against the updated platform handlers; the
  `PipelineSummary` datatype now carries a `createdBy` field

## [0.18.0] - 2026-08-11

### Changed

- Regenerated the API schema against the updated platform handlers
- Renamed the `recognizer` datatype module to `scope`, reflecting that the
  surviving types describe analysis scope and localization, not recognizers

### Removed

- **Breaking:** the recognizer-configuration datatypes the platform no longer
  exposes: `RecognizerParams`, `PatternRecognizerParams`, `ProviderSelection`,
  `CustomPatternRule`, `CustomPatternVariant`, `CustomPatternContext`,
  `CustomDictionary`, `CustomDictionaryTerm`, `PipelineDeduplication`,
  `MergingStrategyParams`, and `TiebreakerParams`. Scope/localization
  (`ScopeParams`, `ScopeMetadata`, `CountryCode`, `Language`, `Languages`,
  `LanguageSpan`, `LanguageProvenance`) and `Confidence` remain

## [0.17.0] - 2026-08-10

### Added

- Typed workspace settings datatypes: `WorkspaceSettings` (default retention
  plus OCR rasterization policy) and `OcrPolicy`
- Retention model datatypes: `RetentionSettings` (per-scope workspace
  retention) and `RetentionOverride` (a pipeline's per-scope override)
- Detection-result datatypes for the OCR mode a run actually used, reachable
  via `Audit`: `OcrMode` and `Dpi`

### Changed

- Regenerated the API schema against the updated platform handlers
- Renamed the `FileSource` datatype to `FileKind`, matching `File.fileKind`

### Removed

- **Breaking:** `FileSource` datatype (renamed to `FileKind`)
- **Breaking:** `Artifact` and `ArtifactType` datatypes. They are no longer
  part of the schema; `runs.redact()` already returns `PipelineRun`
- **Breaking:** `RetentionPolicy` and `RetentionScope` datatypes, superseded
  by `RetentionSettings` / `RetentionOverride`

## [0.16.0] - 2026-08-10

### Added

- `catalog` service for reading the deployment's built-in catalogs:
  `catalog.listLabels()` (`GET /catalog/labels/`) returns the label taxonomy,
  and `catalog.listRecognizers()` (`GET /catalog/recognizers/`) returns the
  engine's registered recognizers grouped into NER and LLM
- Catalog datatypes: `LabelCatalog`, `RecognizerCatalog`,
  `RegisteredRecognizer`
- Detection-result datatypes (`src/datatypes/audit.ts`), the model
  `runs.getDetections()` returns via `Audit`: the entity container
  (`EntityGroup`, `AuditContext`, `EntityCoRef`), redaction rationale
  (`Review`, `Attribution`, `LeakProfile`, `RuleMatch`), recognition detail
  (`ModelEvent`, `PatternEvent`, `OperatorId`, `RangeOfUint`), geometry and
  spans (`BoundingBox`, `Point`, `Polygon`, `Dimensions`, `TimeSpan`), and the
  per-modality entity/event/hint/location/provenance/data types for text,
  image, audio, and tabular content
- `ArtifactType` datatype, reachable from `Artifact`

### Changed

- Regenerated the API schema against the updated platform handlers
- The coverage audit now also flags schema types reachable from response
  bodies the SDK returns (`Audit`, `Artifact`), not only request bodies

### Removed

- **Breaking:** `PredicatedRule`, `TableRule`, and `DocumentPredicate`
  datatypes. The predicate grammar is now unified into the single `Predicate`
  union, and the two rule shapes are inlined variants of `PolicyRule`
  (`kind: "predicated"` / `kind: "table"`)

## [0.15.0] - 2026-08-09

### Added

- Connection config datatypes: `StorageConfig`, `LlmConfig` (LLM inference
  connections), `AnthropicCredentials`, `OpenAiCredentials`, and sync
  scheduling (`SyncSchedule`, `SyncScheduleInput`)
- Policy template treatment enums: `HipaaDeidMethod`, `GdprArticle9Treatment`,
  `PciDssPart`, `PciPanRender`
- Recognizer/detection config datatypes (`src/datatypes/recognizer.ts`):
  `RecognizerParams`, `PatternRecognizerParams`, `ProviderSelection`, custom
  rules/dictionaries (`CustomPatternRule`, `CustomPatternVariant`,
  `CustomPatternContext`, `CustomDictionary`, `CustomDictionaryTerm`),
  deduplication (`PipelineDeduplication`, `MergingStrategyParams`,
  `TiebreakerParams`), scope/localization (`ScopeParams`, `ScopeMetadata`,
  `CountryCode`, `Language`, `Languages`, `LanguageSpan`,
  `LanguageProvenance`), and `Confidence`

### Changed

- Regenerated the API schema against the updated platform handlers

## [0.14.0] - 2026-08-09

### Added

- `PolicyTemplate` datatype, the built-in template a new policy can be based
  on via `CreatePolicy.template` (`"hipaa_safe_harbor"`, `"gdpr_article9"`,
  `"pci_dss_pan_truncate"`, `"pci_dss_pan_hmac"`, `"ccpa"`)
- Policy-construction datatypes for building `CreatePolicy` / `UpdatePolicy`
  bodies: rules (`PredicatedRule`, `TableRule`, `Predicate`,
  `DocumentPredicate`), redactions (`ModalityRedactions`, `TextRedaction`,
  `ImageRedaction`, `AudioRedaction`, `TabularRedaction`), retention
  (`RetentionPolicy`, `Retention`, `RetentionScope`), the label vocabulary
  (`Labels`, `LabelGroup`, `LabelEntry`, `LabelLocale`, `Label`,
  `LocalizedText`), and detail types (`Color`, `Waveform`, `ClampBucket`,
  `ConfidenceThreshold`, `DateStyle`, `DateGranularity`, `LanguageTag`,
  `Sha2Algorithm`, `TerminalFallback`)

### Changed

- Regenerated the API schema against the updated platform handlers
- **BREAKING**: the detections result type is renamed `AnalyzedDocument` to
  `Audit`. `runs.getDetections()` now resolves to `Audit`.

## [0.13.0] - 2026-08-05

### Changed

- Regenerated the API schema against the updated platform handlers

### Removed

- **BREAKING**: `account.getAvatar()` and `workspaces.getAvatar()`. Avatar
  images are now served from a content-addressed path exposed as the
  `avatarUrl` field on the account/workspace; fetch that URL directly.
  Uploading (`uploadAvatar`) and deleting (`deleteAvatar`) are unchanged.

## [0.12.0] - 2026-08-05

### Added

- `@nvisy/sdk/webhooks` — utilities for receiving webhooks, built on Web
  Crypto (works in Node, browsers, edge runtimes, and workers):
  - `verifyWebhook()` / `constructEvent()` — verify a signature and parse the
    event from raw values
  - `verifyRequest()` / `constructEventFromRequest()` — accept a standard
    Fetch `Request`, for web-standard frameworks (Hono, Next.js App Router,
    Remix, SvelteKit, Deno, Bun, Cloudflare Workers)
  - `WEBHOOK_HEADERS` constant and `WebhookSignatureError`
  - HMAC-SHA256 verification with constant-time comparison and timestamp
    replay protection
- `AccountRef` datatype — the public account reference (username, display
  name, avatar) embedded in resources by their creator/trigger fields

### Changed

- Regenerated the API schema against the updated platform handlers

## [0.11.0] - 2026-08-04

### Added

- Avatar methods on `account` and `workspaces`: `getAvatar`, `uploadAvatar`,
  `deleteAvatar` (account keyed by `username`, workspace by `workspaceSlug`)
- `PolicySummary` and `PolicySummaryPage` datatypes

### Changed

- Regenerated the API schema against the updated platform handlers
- `policies.listPolicies()` now returns `PolicySummaryPage` (summaries)
- `Account` now includes an `avatarUrl` field

### Removed

- **BREAKING**: `PolicyPage` datatype (replaced by `PolicySummaryPage`)
- **BREAKING**: `PolicyAction` datatype (no longer part of the API)

## [0.10.0] - 2026-08-04

### Added

- `syncs.listWorkspaceSyncs()` to list all syncs across a workspace's
  connections (`GET /workspaces/{workspaceSlug}/syncs/`)

### Changed

- Regenerated the API schema against the updated platform handlers
- `connections.listConnections()` and `syncs.listWorkspaceSyncs()` accept a
  repeatable `provider` filter (`string[]`)

## [0.9.0] - 2026-08-04

### Changed

- Regenerated the API schema against the updated platform handlers
- **BREAKING**: paginated response types renamed from plural to singular
  base (e.g. `FilesPage` → `FilePage`, `ActivitiesPage` → `ActivityPage`,
  `PoliciesPage` → `PolicyPage`, `PipelineSummariesPage` →
  `PipelineSummaryPage`), matching the schema. All list methods return the
  renamed types.

### Added

- Connection provider config datatypes: `ConnectionConfig`, `S3Credentials`,
  `AzureCredentials`, `GcsCredentials` (needed to build a connection's
  `config`)
- Connection sync datatypes: `SyncMode`, `SyncStatus`, `SyncTriggerType`,
  `SyncDeletionPolicy`
- `Artifact` datatype for pipeline run artifacts
- `scripts/audit-coverage.mjs` and `audit:coverage` / `audit:coverage:remote`
  scripts to verify the SDK covers every spec operation (1:1)

## [0.8.0] - 2026-08-04

### Added

- `syncs` service for connection syncs: `startSync`, `listSyncs`, `getSync`,
  `cancelSync`
- `connections.verifyConnection()` to validate a connection's configuration
  and credentials
- `ConnectionSync`, `ConnectionSyncsPage`, `SyncConnection`, and
  `ConnectionVerification` datatypes

### Changed

- Regenerated the API schema against the updated platform handlers
- **BREAKING**: `connections.updateConnection()`,
  `policies.updatePolicy()`, and `webhooks.updateWebhook()` now issue
  `PATCH` instead of `PUT`
- **BREAKING**: `invites.replyToInvite()` now resolves to `Member` (the
  created member) instead of `Invite`

### Fixed

- **BREAKING**: `status.checkHealth()` no longer sends a request body on the
  `GET /health/` request. A GET with a body throws `TypeError: Request with
  GET method cannot have body` in browsers, which made the method unusable
  there. The method now takes no arguments (was `checkHealth(options?)`).

### Removed

- **BREAKING**: `CheckHealth` datatype (the health endpoint no longer accepts
  a request payload)

## [0.7.0] - 2026-08-02

### Added

- `FormatToken` and `ModalityToken` datatypes for the file `formats` and
  `modalities` filters

### Changed

- Regenerated the API schema against the updated platform handlers

### Removed

- **BREAKING**: `FileFormat` datatype (replaced by `FormatToken`)

## [0.6.0] - 2026-07-29

### Added

- `ApiToken.current` field, indicating which token authenticated the
  current request (set by the token listing endpoint)

### Changed

- Regenerated the API schema against the updated platform handlers

## [0.5.0] - 2026-07-12

### Added

- `account.getPublicAccount(username)` for public account profiles

### Changed

- Regenerated the API schema against the updated platform handlers
- **BREAKING**: resources are now addressed under their workspace. Workspaces
  are identified by slug (`workspaceSlug`), and item-level methods for
  connections, files, invites, members, pipelines, policies, runs, and
  webhooks now take the workspace slug as their first argument
- **BREAKING**: pipelines and policies are addressed by slug (`pipelineSlug`,
  `policySlug`); members and public accounts by `username`
- **BREAKING**: `runs` methods are workspace-scoped:
  `listRuns(workspaceSlug)`, `listPipelineRuns(workspaceSlug, pipelineSlug)`,
  `createRun(workspaceSlug, pipelineSlug, run)`,
  `getRun(workspaceSlug, runId)`, `getDetections(workspaceSlug, runId)`,
  `redact(workspaceSlug, runId)`
- **BREAKING**: `webhooks.createWebhook()` now returns `WebhookCreated`;
  `invites.sendInvite()` now returns `InviteSent`

### Removed

- **BREAKING**: `contexts` service and datatypes (no longer part of the API)

## [0.4.0] - 2026-07-12

### Added

- `contexts` service and datatypes (`Context`, `CreateContext`,
  `UpdateContext`, `ContextEntry`, `ContextsPage`)
- `connections` service and datatypes (`Connection`, `CreateConnection`,
  `UpdateConnection`, `ConnectionsQuery`, `ConnectionsPage`)
- `pipelines` service and datatypes (`Pipeline`, `CreatePipeline`,
  `UpdatePipeline`, `PipelineDefinition`, `PipelineStatus`, `PipelineSummary`,
  `PipelineSummariesPage`, and more)
- `policies` service and datatypes (`Policy`, `CreatePolicy`, `UpdatePolicy`,
  `PolicyRule`, `PolicyAction`, `PoliciesPage`)
- `Health` datatypes for the health endpoint (`Health`, `HealthStatus`,
  `ComponentHealth`, `CheckHealth`)

### Changed

- Regenerated the API schema against the redacted-pipeline platform API
- **BREAKING**: `runs` is now a pipeline-run service: `listRuns(pipelineId)`,
  `createRun(pipelineId)`, `getRun(runId)`, `getDetections(runId)`,
  `redact(runId)` (was integration-run based)
- **BREAKING**: `status.checkHealth()` now returns `Health` (was
  `MonitorStatus`)
- **BREAKING**: `NvisyApiError.resource` and `.suggestion` are now
  `string | undefined` (were `string | null`)

### Removed

- **BREAKING**: `annotations`, `comments`, `documents`, and `integrations`
  services and their datatypes (no longer part of the API)

## [0.3.0] - 2026-01-09

### Added

- Logging middleware (`withLogging: true` in config) for request/response
  logging
- Page types for all paginated responses: `ActivitiesPage`, `AnnotationsPage`,
  `ApiTokensPage`, `CommentsPage`, `DocumentsPage`, `FilesPage`,
  `IntegrationsPage`, `IntegrationRunsPage`, `InvitesPage`, `MembersPage`,
  `NotificationsPage`, `WebhooksPage`, `WorkspacesPage`

### Changed

- Renamed `Client` class to `Nvisy`
- Renamed service classes from `*Service` (e.g. `WorkspacesService` →
  `Workspaces`)
- Renamed service handler methods to include entity names (e.g. `list` →
  `listWorkspaces`)
- Renamed `ClientError` to `NvisyError` and `ApiError` to `NvisyApiError`
- `NvisyApiError` now extends `NvisyError`
- **BREAKING**: API path parameters now use camelCase (`workspaceId` instead of
  `workspace_id`)
- **BREAKING**: Pagination changed from offset-based to cursor-based
  - Query params: `offset`/`limit` → `limit`/`after`
  - Pagination type: `Pagination` → `CursorPagination`
- **BREAKING**: All list methods now return paginated response objects instead
  of arrays
  - Return type: `Promise<T[]>` → `Promise<TPage>` (e.g., `WorkspacesPage`)
  - Response structure: `{ items: T[], total?: number, nextCursor?: string }`
- **BREAKING**: Comments service methods simplified
  - `updateComment(fileId, commentId, ...)` → `updateComment(commentId, ...)`
  - `deleteComment(fileId, commentId)` → `deleteComment(commentId)`
- Renamed query types to match schema (dropped `Query` suffix)
- Renamed request types (dropped `Request` suffix)

### Removed

- `ConfigError` and `NetworkError` classes (use `NvisyError` instead)
- Re-exports of datatypes and services from main entry point (use
  `@nvisy/sdk/datatypes` and `@nvisy/sdk/services`)
- `DocumentStatus` type (removed from API)
- `ListIntegrationsQuery` type (integration type filter removed)

## [0.2.0] - 2025-06-15

### Added

- Generated OpenAPI schema types for type-safe API calls
- `Client.withApiToken()` method to create a new client with a different token
- Error middleware for automatic API error handling
- Full API coverage with services for all endpoints
- Comprehensive JSDoc documentation for all public APIs

### Changed

- Client now requires `apiToken` in configuration
- Refactored all services to use `openapi-fetch` for type-safe API calls
- Improved error handling with `ApiError`
- Services now throw `ApiError` automatically via middleware
- Datatypes now re-export schema types with convenient aliases
- Services are created on-demand via Client getters

### Removed

- `ClientBuilder` class and `Client.builder()` method
- `Client.fromEnvironment()` method
- Environment variable support (`NVISY_API_TOKEN`, `NVISY_BASE_URL`,
  `NVISY_USER_AGENT`)
- Manual type definitions in datatypes (now use schema re-exports)

## [0.1.0] - 2025-10-15

### Added

- Initial release of the Nvisy SDK
- `Client` class for interacting with the Nvisy document processing API
- `ClientBuilder` class for fluent configuration building
- Comprehensive error handling with `ClientError` and other error classes
- Configuration management with environment variable support
- TypeScript support with full type definitions
- Multiple export paths for individual modules
- Custom header support with validation

### Features

- Fluent API for client configuration
- Built-in validation for all configuration options
- Comprehensive test coverage
- Modern ES2022+ JavaScript target
- Tree-shakeable ESM builds

### Error Handling

- Structured error responses with `name`, `message`, and `context` fields
- Automatic retry logic for server errors and rate limiting
- HTTP status code classification (client vs server errors)
- Network error handling for timeouts, DNS resolution, and connection issues
- Configuration validation with detailed error messages

[Unreleased]: https://github.com/nvisycom/sdk-ts/compare/v0.42.0...HEAD
[0.42.0]: https://github.com/nvisycom/sdk-ts/compare/v0.41.0...v0.42.0
[0.41.0]: https://github.com/nvisycom/sdk-ts/compare/v0.40.0...v0.41.0
[0.40.0]: https://github.com/nvisycom/sdk-ts/compare/v0.39.0...v0.40.0
[0.39.0]: https://github.com/nvisycom/sdk-ts/compare/v0.38.0...v0.39.0
[0.38.0]: https://github.com/nvisycom/sdk-ts/compare/v0.37.0...v0.38.0
[0.37.0]: https://github.com/nvisycom/sdk-ts/compare/v0.36.0...v0.37.0
[0.36.0]: https://github.com/nvisycom/sdk-ts/compare/v0.35.0...v0.36.0
[0.35.0]: https://github.com/nvisycom/sdk-ts/compare/v0.34.0...v0.35.0
[0.34.0]: https://github.com/nvisycom/sdk-ts/compare/v0.33.0...v0.34.0
[0.33.0]: https://github.com/nvisycom/sdk-ts/compare/v0.32.0...v0.33.0
[0.32.0]: https://github.com/nvisycom/sdk-ts/compare/v0.31.0...v0.32.0
[0.31.0]: https://github.com/nvisycom/sdk-ts/compare/v0.30.0...v0.31.0
[0.30.0]: https://github.com/nvisycom/sdk-ts/compare/v0.29.0...v0.30.0
[0.29.0]: https://github.com/nvisycom/sdk-ts/compare/v0.28.0...v0.29.0
[0.28.0]: https://github.com/nvisycom/sdk-ts/compare/v0.27.0...v0.28.0
[0.27.0]: https://github.com/nvisycom/sdk-ts/compare/v0.26.0...v0.27.0
[0.26.0]: https://github.com/nvisycom/sdk-ts/compare/v0.25.0...v0.26.0
[0.25.0]: https://github.com/nvisycom/sdk-ts/compare/v0.24.0...v0.25.0
[0.24.0]: https://github.com/nvisycom/sdk-ts/compare/v0.23.0...v0.24.0
[0.23.0]: https://github.com/nvisycom/sdk-ts/compare/v0.22.0...v0.23.0
[0.22.0]: https://github.com/nvisycom/sdk-ts/compare/v0.21.0...v0.22.0
[0.21.0]: https://github.com/nvisycom/sdk-ts/compare/v0.20.0...v0.21.0
[0.20.0]: https://github.com/nvisycom/sdk-ts/compare/v0.19.0...v0.20.0
[0.19.0]: https://github.com/nvisycom/sdk-ts/compare/v0.18.0...v0.19.0
[0.18.0]: https://github.com/nvisycom/sdk-ts/compare/v0.17.0...v0.18.0
[0.17.0]: https://github.com/nvisycom/sdk-ts/compare/v0.16.0...v0.17.0
[0.16.0]: https://github.com/nvisycom/sdk-ts/compare/v0.15.0...v0.16.0
[0.15.0]: https://github.com/nvisycom/sdk-ts/compare/v0.14.0...v0.15.0
[0.14.0]: https://github.com/nvisycom/sdk-ts/compare/v0.13.0...v0.14.0
[0.13.0]: https://github.com/nvisycom/sdk-ts/compare/v0.12.0...v0.13.0
[0.12.0]: https://github.com/nvisycom/sdk-ts/compare/v0.11.0...v0.12.0
[0.11.0]: https://github.com/nvisycom/sdk-ts/compare/v0.10.0...v0.11.0
[0.10.0]: https://github.com/nvisycom/sdk-ts/compare/v0.9.0...v0.10.0
[0.9.0]: https://github.com/nvisycom/sdk-ts/compare/v0.8.0...v0.9.0
[0.8.0]: https://github.com/nvisycom/sdk-ts/compare/v0.7.0...v0.8.0
[0.7.0]: https://github.com/nvisycom/sdk-ts/compare/v0.6.0...v0.7.0
[0.6.0]: https://github.com/nvisycom/sdk-ts/compare/v0.5.0...v0.6.0
[0.5.0]: https://github.com/nvisycom/sdk-ts/compare/v0.4.0...v0.5.0
[0.4.0]: https://github.com/nvisycom/sdk-ts/compare/v0.3.0...v0.4.0
[0.3.0]: https://github.com/nvisycom/sdk-ts/compare/v0.2.0...v0.3.0
[0.2.0]: https://github.com/nvisycom/sdk-ts/compare/v0.1.0...v0.2.0
[0.1.0]: https://github.com/nvisycom/sdk-ts/releases/tag/v0.1.0
