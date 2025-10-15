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

## [1.0.0] - 2024-10-15

### Added

- Initial release of the Nvisy SDK
- `Client` class for interacting with the Nvisy document redaction API
- `ClientBuilder` class for fluent configuration building
- Comprehensive error handling with `ClientError` and other error classes
- Configuration management with environment variable support
- TypeScript support with full type definitions
- Multiple export paths for individual modules (`./client`, `./builder`,
  `./errors`)
- Environment variable configuration support (`NVISY_API_KEY`, `NVISY_BASE_URL`,
  etc.)
- Request timeout and retry configuration
- Custom header support with validation

### Features

- Fluent API for client configuration
- Built-in validation for all configuration options
- OpenAPI integration with `openapi-fetch`
- Comprehensive test coverage
- Modern ES2022+ JavaScript target
- Tree-shakeable ESM builds

### Configuration Options

- API key authentication (required)
- Base URL customization
- Request timeout configuration (1000-300000ms)
- Retry attempt limits (0-10 retries)
- Custom headers with reserved header protection

### Error Handling

- Structured error responses with `name`, `message`, and `context` fields
- Automatic retry logic for server errors and rate limiting
- HTTP status code classification (client vs server errors)
- Network error handling for timeouts, DNS resolution, and connection issues
- Configuration validation with detailed error messages

[Unreleased]: https://github.com/nvisycom/sdk/compare/v1.0.0...HEAD
[1.0.0]: https://github.com/nvisycom/sdk/releases/tag/v1.0.0
