# JavaScript & TypeScript SDK

[![npm version](https://img.shields.io/npm/v/@nvisy/sdk?color=000000&style=flat-square)](https://www.npmjs.com/package/@nvisy/sdk)
[![build](https://img.shields.io/github/actions/workflow/status/nvisycom/sdk/build.yml?branch=main&color=000000&style=flat-square)](https://github.com/nvisycom/sdk/actions/workflows/build.yml)
[![node](https://img.shields.io/badge/node-%3E%3D20.0.0-000000?style=flat-square&logo=node.js&logoColor=white)](https://nodejs.org/)
[![typescript](https://img.shields.io/badge/TypeScript-5.9+-000000?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)

Official JavaScript & TypeScript SDK for the Nvisy document redaction platform.

## Features

- Modern ES2022+ JavaScript with native private fields
- Full TypeScript support with strict typing
- Flexible configuration with constructor or builder pattern
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
| `NVISY_API_KEY`     | API key for authentication       | Yes      |
| `NVISY_BASE_URL`    | Custom API endpoint URL          | No       |
| `NVISY_TIMEOUT`     | Request timeout in milliseconds  | No       |
| `NVISY_MAX_RETRIES` | Maximum number of retry attempts | No       |

## Requirements

- Node.js 20.0.0 or higher
- TypeScript 5.9.0 or higher (for development)

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
