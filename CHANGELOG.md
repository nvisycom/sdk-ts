# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to
[Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [0.3.0] - 2026-01-04

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

[Unreleased]: https://github.com/nvisycom/sdk-ts/compare/v0.3.0...HEAD
[0.3.0]: https://github.com/nvisycom/sdk-ts/compare/v0.2.0...v0.3.0
[0.2.0]: https://github.com/nvisycom/sdk-ts/compare/v0.1.0...v0.2.0
[0.1.0]: https://github.com/nvisycom/sdk-ts/releases/tag/v0.1.0
