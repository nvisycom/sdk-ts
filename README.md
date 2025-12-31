# Nvisy.com SDK for TypeScript/JavaScript

[![npm version](https://img.shields.io/npm/v/@nvisy/sdk?color=000000&style=flat-square)](https://www.npmjs.com/package/@nvisy/sdk)
[![build](https://img.shields.io/github/actions/workflow/status/nvisycom/sdk-ts/build.yml?branch=main&color=000000&style=flat-square)](https://github.com/nvisycom/sdk-ts/actions/workflows/build.yml)

Official TypeScript SDK for the Nvisy AI-powered document processing platform.

## Features

- Modern ES2022+ JavaScript target
- Full TypeScript support with strict typing
- Debug logging for development
- Individual module exports for optimal bundling

## Installation

```bash
npm install @nvisy/sdk
```

## Usage

```typescript
import { Nvisy } from "@nvisy/sdk";

const nvisy = new Nvisy({
  apiToken: "your-api-token", // Required
  baseUrl: "https://api.nvisy.com", // Optional
  userAgent: "MyApp/1.0.0", // Optional
  withLogging: true, // Optional
  headers: { // Optional
    "X-Custom-Header": "value",
  },
});

const account = await nvisy.account.getAccount();
const workspaces = await nvisy.workspaces.listWorkspaces();
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
