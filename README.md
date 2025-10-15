# Nvisy.com JavaScript & TypeScript SDK

[![npm version](https://img.shields.io/npm/v/@nvisy/sdk?color=000000&style=flat-square)](https://www.npmjs.com/package/@nvisy/sdk)
[![build](https://img.shields.io/github/actions/workflow/status/nvisycom/sdk/build.yml?branch=main&color=000000&style=flat-square)](https://github.com/nvisycom/sdk/actions/workflows/build.yml)
[![license](https://img.shields.io/github/license/nvisycom/sdk?color=000000&style=flat-square)](https://github.com/nvisycom/sdk/blob/main/LICENSE)
[![typescript](https://img.shields.io/badge/TypeScript-5.9+-000000?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)

Official TypeScript SDK for the Nvisy document redaction platform.

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

```typescript
import { Client } from "@nvisy/sdk";

const client = new Client({
  apiKey: "your-api-key",
  baseUrl: "https://api.nvisy.com",
  timeout: 30000,
  maxRetries: 3,
});
```

### Builder Pattern

```typescript
import { ClientBuilder } from "@nvisy/sdk";

const client = ClientBuilder
  .withApiKey("your-api-key")
  .withBaseUrl("https://api.nvisy.com")
  .withTimeout(60000)
  .withMaxRetries(5)
  .withHeader("X-Custom-Header", "value")
  .build();
```

## Configuration

### Required

- `apiKey` - Your Nvisy API key (10+ characters, alphanumeric with `_` and `-`)

### Optional

- `baseUrl` - API endpoint URL (default: `https://api.nvisy.com`)
- `timeout` - Request timeout in milliseconds (1000-300000, default: 30000)
- `maxRetries` - Maximum retry attempts (0-10, default: 3)
- `headers` - Custom HTTP headers (cannot override `authorization`,
  `content-type`, `user-agent`)

### Environment Variables

| Variable            | Description                      |
| ------------------- | -------------------------------- |
| `NVISY_API_KEY`     | API key for authentication       |
| `NVISY_BASE_URL`    | Custom API endpoint URL          |
| `NVISY_TIMEOUT`     | Request timeout in milliseconds  |
| `NVISY_MAX_RETRIES` | Maximum number of retry attempts |

Load configuration from environment variables:

```typescript
const client = Client.fromEnvironment();
```

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
