# Nvisy.com SDK for TypeScript/JavaScript

[![npm version](https://img.shields.io/npm/v/@nvisy/sdk?color=000000&style=flat-square)](https://www.npmjs.com/package/@nvisy/sdk)
[![build](https://img.shields.io/github/actions/workflow/status/nvisycom/sdk-ts/build.yml?branch=main&color=000000&style=flat-square)](https://github.com/nvisycom/sdk-ts/actions/workflows/build.yml)

Official TypeScript SDK for the Nvisy AI-powered document processing platform. Transform documents into usable data and apply intelligent edits with ease.

## Features

- Modern ES2022+ JavaScript target
- Full TypeScript support with strict typing
- Built-in environment variable support
- Individual module exports for optimal bundling

## Installation

```bash
npm install @nvisy/sdk
```

## Usage

### Basic Usage

Create a client with your API token:

```typescript
import { Client } from "@nvisy/sdk";

const client = new Client({ apiToken: "your-api-token" });

const account = await client.account.get();
const projects = await client.projects.list();
```

### Configuration Options

```typescript
import { Client } from "@nvisy/sdk";

const client = new Client({
  apiToken: "your-api-token", // Required
  baseUrl: "https://api.nvisy.com", // Optional: API endpoint (default shown)
  userAgent: "MyApp/1.0.0", // Optional: custom user agent
  headers: { // Optional: custom headers
    "X-Custom-Header": "value",
  },
});
```

### Environment Variables

Load configuration from environment variables using `Client.fromEnvironment()`:

| Variable           | Description                  | Required |
| ------------------ | ---------------------------- | -------- |
| `NVISY_API_TOKEN`  | API token for authentication | Yes      |
| `NVISY_BASE_URL`   | Custom API endpoint URL      | No       |
| `NVISY_USER_AGENT` | Custom user agent string     | No       |

```typescript
import { Client } from "@nvisy/sdk";

// Requires NVISY_API_TOKEN to be set
const client = Client.fromEnvironment();
```

## Services

The SDK provides full API coverage with services for all endpoints:

| Service        | Description                       |
| -------------- | --------------------------------- |
| `account`      | User account management           |
| `apiTokens`    | API token management              |
| `auth`         | Login, signup, and logout         |
| `comments`     | File comments                     |
| `documents`    | Document processing               |
| `files`        | File upload, download, delete     |
| `integrations` | External integrations             |
| `invites`      | Project invitation management     |
| `members`      | Project member management         |
| `pipelines`    | Processing pipeline configuration |
| `projects`     | Project operations                |
| `status`       | API health and status checks      |
| `templates`    | Processing template management    |
| `webhooks`     | Webhook configuration             |

## Error Handling

The SDK provides structured error types for different failure scenarios:

```typescript
import { Client, ApiError, ConfigError, NetworkError } from "@nvisy/sdk";

try {
  const client = Client.fromEnvironment();
  const account = await client.account.get();
} catch (error) {
  if (error instanceof ApiError) {
    // API returned an error response
    console.log(`API Error: ${error.message}`);
    console.log(`Status: ${error.statusCode}`);
    console.log(`Retryable: ${error.isRetryable()}`);
  } else if (error instanceof ConfigError) {
    // Configuration is invalid
    console.log(`Config Error: ${error.field} - ${error.reason}`);
  } else if (error instanceof NetworkError) {
    // Network request failed
    console.log(`Network Error: ${error.message}`);
  }
}
```

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
