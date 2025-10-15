# Contributing to Nvisy SDK

Thank you for your interest in contributing to the Nvisy SDK. This document
provides guidelines and instructions for contributing to the project.

## Getting Started

### Prerequisites

- Node.js 16 or higher
- npm 7 or higher
- Git

### Development Setup

1. Fork the repository and clone your fork:
   ```bash
   git clone https://github.com/your-username/sdk.git
   cd sdk
   ```

2. Set up the development environment:
   ```bash
   make setup
   ```

   This will install dependencies and download the OpenAPI specification.

## Development Workflow

### Available Make Targets

Use the Makefile for all development tasks:

```bash
make help          # Show all available targets
make install       # Install dependencies
make clean         # Clean build artifacts
make openapi       # Download OpenAPI spec and generate types
make build         # Build the package
make test          # Run tests
make lint          # Run linting
make format        # Format code
make typecheck     # Run TypeScript type checking
make dev           # Start development mode (watch build)
make check         # Run all checks (lint + typecheck + test)
make prepare       # Prepare for release
```

### Development Process

1. Create a feature branch:
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. Make your changes and ensure code quality:
   ```bash
   make check
   ```

3. Run the full test suite:
   ```bash
   make test
   make coverage
   ```

4. Validate your changes:
   ```bash
   make validate
   ```

### Code Standards

- Follow TypeScript best practices
- Use Biome.js for linting and formatting (configured via `biome.json`)
- Write comprehensive type definitions
- Include JSDoc comments for public APIs
- Follow the existing code structure and patterns

### Testing

- Write unit tests for all new functionality
- Use Vitest for testing framework
- Maintain test coverage above 80%
- Run tests with: `make test`
- Generate coverage report with: `make coverage`

### Code Quality Checks

Before submitting a pull request, ensure all quality checks pass:

```bash
make check      # Runs lint, typecheck, and test
make validate   # Additional validation checks
```

## Pull Request Process

1. Ensure your branch is up to date with the main branch
2. Run all quality checks: `make check`
3. Update documentation if needed
4. Create a pull request with:
   - Clear description of changes
   - Reference to any related issues
   - Test coverage information
   - Breaking changes (if any)

### Pull Request Checklist

- [ ] Code follows project conventions
- [ ] Tests pass (`make test`)
- [ ] Linting passes (`make lint`)
- [ ] Type checking passes (`make typecheck`)
- [ ] Build succeeds (`make build`)
- [ ] Documentation updated (if applicable)
- [ ] No breaking changes (or properly documented)

## Working with OpenAPI

The project uses OpenAPI specifications to generate TypeScript types:

```bash
make openapi    # Download spec and generate types
```

Generated types will be placed in `src/generated/types.ts`.

### Environment Configuration

Create a `.env` file from `.env.example` to customize:

- `OPENAPI_ENDPOINT` - URL for OpenAPI specification
- `OPENAPI_OUTPUT_DIR` - Directory for downloaded spec
- `GENERATED_TYPES_DIR` - Directory for generated types

## Release Process

For maintainers preparing releases:

```bash
make prepare    # Full preparation including clean, build, and tests
make pack       # Create package tarball for testing
make publish    # Publish to npm (requires proper permissions)
```

## Security

- Never commit API keys or sensitive credentials
- Use `.env` files for local configuration (ignored by git)
- Report security vulnerabilities privately to security@nvisy.com

## Getting Help

- Create an issue for bugs or feature requests
- Use discussions for questions and general help
- Check existing issues and documentation first

## License

By contributing to this project, you agree that your contributions will be
licensed under the MIT License.
