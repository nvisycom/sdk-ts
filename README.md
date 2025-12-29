# Nvisy.com SDK for TypeScript/JavaScript

[![npm version](https://img.shields.io/npm/v/@nvisy/sdk?color=000000&style=flat-square)](https://www.npmjs.com/package/@nvisy/sdk)
[![build](https://img.shields.io/github/actions/workflow/status/nvisycom/sdk/build.yml?branch=main&color=000000&style=flat-square)](https://github.com/nvisycom/sdk/actions/workflows/build.yml)
[![node](https://img.shields.io/badge/Node.JS-20.0+-000000?style=flat-square&logo=node.js&logoColor=white)](https://nodejs.org/)
[![typescript](https://img.shields.io/badge/TypeScript-5.9+-000000?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)

Official Node.JS SDK for the Nvisy document redaction platform.

## Features

- Modern ES2022+ JavaScript target
- Full TypeScript support with strict typing
- Flexible configuration via a config object or builder pattern
- Built-in environment variable support
- Automatic retry logic with smart error handling
- Individual module exports for optimal bundling

## Installation

```bash
npm install @nvisy/sdk
```

## Usage

### Direct Configuration

Create a client by passing configuration options directly to the constructor:

```typescript
import { Client } from "@nvisy/sdk";

const client = new Client({
  apiKey: "your-api-key", // Required: 10+ chars, alphanumeric with _ and -
  baseUrl: "https://api.nvisy.com", // Optional: API endpoint (default shown)
  timeout: 30000, // Optional: 1000-300000ms (default: 30000)
  maxRetries: 3, // Optional: 0-5 attempts (default: 3)
  userAgent: "MyApp/1.0.0", // Optional: custom user agent
  headers: { // Optional: custom headers
    "X-Custom-Header": "value",
  },
});
```

### Builder Pattern

Use the fluent builder API for more readable configuration:

```typescript
import { Client } from "@nvisy/sdk";

const client = Client.builder()
  .withApiKey("your-api-key") // Required: 10+ chars, alphanumeric with _ and -
  .withBaseUrl("https://api.nvisy.com") // Optional: API endpoint (default shown)
  .withTimeout(60000) // Optional: 1000-300000ms (default: 30000)
  .withMaxRetries(5) // Optional: 0-5 attempts (default: 3)
  .withUserAgent("MyApp/1.0.0") // Optional: custom user agent
  .withHeader("X-Custom-Header", "value") // Optional: single custom header
  .withHeaders({ "X-Another": "header" }) // Optional: multiple custom headers
  .build();
```

### From Environment Variables

Load configuration from environment variables:

```typescript
import { Client, ClientBuilder } from "@nvisy/sdk";

// Using builder pattern from environment (allows additional configuration)
const client = ClientBuilder.fromEnvironment()
  .withTimeout(60000) // Override or add to env config
  .build();

// Or using Client directly
const client = Client.fromEnvironment();
```

Set these environment variables:

| Variable            | Description                      | Required |
| ------------------- | -------------------------------- | -------- |
| `NVISY_API_TOKEN`   | API key for authentication       | Yes      |
| `NVISY_BASE_URL`    | Custom API endpoint URL          | No       |
| `NVISY_MAX_TIMEOUT` | Request timeout in milliseconds  | No       |
| `NVISY_MAX_RETRIES` | Maximum number of retry attempts | No       |
| `NVISY_USER_AGENT`  | Custom user agent string         | No       |

## Services

The SDK provides access to the following services:

- **Documents** - Document upload, management, and processing
- **Members** - Team member invitation and management
- **Integrations** - Third-party service integrations
- **Status** - API health and status monitoring

## Changelog

See [CHANGELOG.md](CHANGELOG.md) for release notes and version history.

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for development guidelines.

## License

MIT License - see [LICENSE.txt](LICENSE.txt) for details.

## Support

- Documentation: [docs.nvisy.com](https://docs.nvisy.com)
- Issues: [GitHub Issues](https://github.com/nvisycom/sdk/issues)
- Email: [support@nvisy.com](mailto:support@nvisy.com)
