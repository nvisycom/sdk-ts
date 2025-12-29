# Nvisy.com SDK for TypeScript/JavaScript

[![npm version](https://img.shields.io/npm/v/@nvisy/sdk?color=000000&style=flat-square)](https://www.npmjs.com/package/@nvisy/sdk)
[![build](https://img.shields.io/github/actions/workflow/status/nvisycom/sdk-ts/build.yml?branch=main&color=000000&style=flat-square)](https://github.com/nvisycom/sdk-ts/actions/workflows/build.yml)

Official TypeScript SDK for the Nvisy AI-powered document processing platform. Transform documents into usable data and apply intelligent edits with ease.

## Features

- Modern ES2022+ JavaScript target
- Full TypeScript support with strict typing
- Flexible configuration via a config object or builder pattern
- Built-in environment variable support
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
  .withHeader("X-Custom", "value") // Override or add to env config
  .build();

// Or using Client directly
const client = Client.fromEnvironment();
```

Set these environment variables:

| Variable           | Description                | Required |
| ------------------ | -------------------------- | -------- |
| `NVISY_API_TOKEN`  | API key for authentication | Yes      |
| `NVISY_BASE_URL`   | Custom API endpoint URL    | No       |
| `NVISY_USER_AGENT` | Custom user agent string   | No       |

## Services

The SDK provides full API coverage with services for all endpoints including account management, projects, documents, files, members, invites, integrations, pipelines, templates, webhooks, comments, and status monitoring.

## Changelog

See [CHANGELOG.md](CHANGELOG.md) for release notes and version history.

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for development guidelines.

## License

MIT License - see [LICENSE.txt](LICENSE.txt) for details.

## Support

- Documentation: [docs.nvisy.com](https://docs.nvisy.com)
- Issues: [GitHub Issues](https://github.com/nvisycom/sdk-ts/issues)
- Email: [support@nvisy.com](mailto:support@nvisy.com)
