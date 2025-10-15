# Contributing

Thank you for your interest in contributing to the Nvisy SDK.

## Requirements

- Node.js 20.0.0 or higher
- TypeScript 5.9.0 or higher
- npm

## Development Setup

```bash
git clone https://github.com/your-username/sdk.git
cd sdk
npm install
```

## Development

### Scripts

- `npm run build` - Build the package for production
- `npm run dev` - Build in watch mode for development
- `npm test` - Run test suite
- `npm run test:coverage` - Run tests with coverage report
- `npm run test:watch` - Run tests in watch mode
- `npm run lint` - Check code style and quality
- `npm run format` - Format code with Biome
- `npm run check` - Run all linting and formatting checks
- `npm run typecheck` - Verify TypeScript types
- `npm run clean` - Remove build artifacts

### Quality Checks

Before submitting changes:

```bash
npm run check    # Lint, format, and type check
npm test         # Run test suite
npm run build    # Verify build works
```

## Pull Request Process

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Run quality checks: `npm run check`
6. Submit a pull request

### Pull Request Checklist

- [ ] Tests pass
- [ ] Code follows project style
- [ ] TypeScript types are correct
- [ ] Documentation updated if needed
- [ ] No breaking changes (or documented)

## Code Standards

- Follow existing TypeScript patterns
- Use native JavaScript private fields (`#`)
- Write tests for new features
- Include JSDoc for public APIs
- Follow semantic versioning for changes

## License

By contributing, you agree your contributions will be licensed under the MIT
License.
