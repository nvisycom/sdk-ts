# Nvisy Javascript/Typescript SDK

[![npm version](https://img.shields.io/npm/v/@nvisy/sdk?color=000000&style=flat-square)](https://www.npmjs.com/package/@nvisy/sdk)
[![build](https://img.shields.io/github/actions/workflow/status/nvisycom/sdk/build.yml?branch=main&color=000000&style=flat-square)](https://github.com/nvisycom/sdk/actions/workflows/build.yml)
[![license](https://img.shields.io/github/license/nvisycom/sdk?color=000000&style=flat-square)](https://github.com/nvisycom/sdk/blob/main/LICENSE)
[![typescript](https://img.shields.io/badge/TypeScript-000000?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)

Official TypeScript SDK for the Nvisy document redaction platform.

## Installation

```bash
npm install @nvisy/sdk
```

## Usage

```typescript
import { NvisyClient, ClientBuilder } from '@nvisy/sdk'

// Option 1: Direct constructor
const client = new NvisyClient({
  apiKey: 'your-api-key'
})

// Option 2: Builder pattern
const client = ClientBuilder.create()
  .apiKey('your-api-key')
  .baseUrl('https://api.nvisy.com')
  .timeout(30000)
  .maxRetries(3)
  .header('Custom-Header', 'value')
  .build()
```

## Configuration

The client accepts the following configuration options:

- `apiKey` (required): Your Nvisy API key
- `baseUrl` (optional): Custom API endpoint URL
- `timeout` (optional): Request timeout in milliseconds
- `maxRetries` (optional): Maximum number of retry attempts
- `headers` (optional): Custom HTTP headers

## Development

Install dependencies:

```bash
npm install
```

Build the package:

```bash
npm run build
```

Run tests:

```bash
npm test
```

Run linting and formatting:

```bash
npm run check
```

## Scripts

- `npm run build` - Build the package
- `npm run dev` - Build in watch mode
- `npm test` - Run tests
- `npm run test:coverage` - Run tests with coverage
- `npm run lint` - Run linting
- `npm run format` - Format code
- `npm run typecheck` - Run TypeScript type checking
- `npm run clean` - Clean build artifacts

## Requirements

- Node.js 16 or higher
- TypeScript 5.0 or higher (for development)

## License

MIT License - see [LICENSE](LICENSE) file for details.

## Support

- Documentation: [docs.nvisy.com](https://docs.nvisy.com)
- Issues: [GitHub Issues](https://github.com/nvisycom/sdk/issues)
- Email: [support@nvisy.com](mailto:support@nvisy.com)