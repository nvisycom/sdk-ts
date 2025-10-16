# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to
[Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

### Changed

### Fixed

### Removed

## [0.2.0] - 2025-10-18

### Added

- `ClientBuilder.fromConfig()` static method for creating builders from configuration objects
- `Client.fromConfig()` static method for creating clients from configuration objects
- `userAgent` configuration option and `NVISY_USER_AGENT` environment variable for custom user agent strings
- `ClientBuilder.withUserAgent()` method for setting custom user agent in builder pattern
- `DocumentsService` for document upload, management, and processing operations
- `IntegrationsService` for third-party service integrations
- `MembersService` for team member invitation and management

### Changed

- Environment variable names:
  - `NVISY_API_KEY` → `NVISY_API_TOKEN`
  - `NVISY_TIMEOUT` → `NVISY_MAX_TIMEOUT`
- Service names changed to plural (DocumentsService, IntegrationsService, MembersService)
- Client configuration validation now uses `ClientBuilder.fromConfig()` instead of internal validation method
- Client class is now readonly - configuration cannot be modified after creation

### Removed

- `Client.withConfig()` and other related methods (client is now readonly)

## [0.1.0] - 2025-10-15

### Added

- Initial release of the Nvisy SDK
- `Client` class for interacting with the Nvisy document redaction API
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

[Unreleased]: https://github.com/nvisycom/sdk/compare/v0.2.0...HEAD
[0.2.0]: https://github.com/nvisycom/sdk/compare/v0.1.0...v0.2.0
[0.1.0]: https://github.com/nvisycom/sdk/releases/tag/v0.1.0
