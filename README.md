# @nvisy/sdk

[![npm](https://img.shields.io/npm/v/@nvisy/sdk?style=flat-square)](https://www.npmjs.com/package/@nvisy/sdk)
[![Build](https://img.shields.io/github/actions/workflow/status/nvisycom/sdk-ts/build.yml?branch=main&label=build%20%26%20test&style=flat-square)](https://github.com/nvisycom/sdk-ts/actions/workflows/build.yml)

TypeScript client for the [Nvisy](https://nvisy.com/) multimodal redaction platform.

Nvisy detects and removes sensitive information across documents, images, and audio.
It combines deterministic patterns, NER, computer vision, and LLM-driven classification
into auditable, policy-driven pipelines built for regulated industries such as
healthcare, legal, government, and financial services.

## Installation

```bash
npm install @nvisy/sdk
```

## Quick Start

```typescript
import { Nvisy } from "@nvisy/sdk";

const client = new Nvisy({ apiToken: "your-api-token" });
const account = await client.account.getAccount();
const workspaces = await client.workspaces.listWorkspaces();
```

The client accepts additional options:

```typescript
const client = new Nvisy({
  apiToken: "your-api-token", // Required
  baseUrl: "https://api.nvisy.com", // Optional
  userAgent: "MyApp/1.0.0", // Optional
  withLogging: true, // Optional
  headers: { // Optional
    "X-Custom-Header": "value",
  },
  fetch: customFetch, // Optional, defaults to global fetch
});
```

## Features

- Modern ES2022+ JavaScript target
- Full TypeScript support with strict typing
- Debug logging for development
- Individual module exports for optimal bundling

## Deployment

The fastest way to get started is with [Nvisy Cloud](https://nvisy.com).

To run locally, see the [nvisycom/server](https://github.com/nvisycom/server) (self-hosted backend) and [nvisycom/studio](https://github.com/nvisycom/studio) (web and desktop app) repositories.

If you only need redaction and not the full platform, [nvisycom/elide](https://github.com/nvisycom/elide) is a standalone framework for building PII detection and removal pipelines over multimodal documents.

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for development setup and contribution guidelines.

## Changelog

See [CHANGELOG.md](CHANGELOG.md) for release notes and version history.

## License

MIT License, see [LICENSE.txt](LICENSE.txt)

## Support

- **Documentation**: [docs.nvisy.com](https://docs.nvisy.com)
- **Issues**: [github.com/nvisycom/sdk-ts/issues](https://github.com/nvisycom/sdk-ts/issues)
- **Email**: [support@nvisy.com](mailto:support@nvisy.com)
