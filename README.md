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
