# Makefile for Nvisy SDK
# This file contains build automation tasks for the TypeScript SDK including:
# - Cleaning build artifacts
# - Downloading OpenAPI specifications
# - Development workflow commands

.PHONY: clean download-openapi help

# Default target
help:
	@echo "Available targets:"
	@echo "  clean           - Remove build artifacts and temporary files"
	@echo "  download-openapi - Download OpenAPI specification from server"
	@echo "  help            - Show this help message"

# Clean build artifacts and temporary files
clean:
	@echo "🧹 Cleaning build artifacts..."
	@rm -rf dist/
	@rm -rf node_modules/.cache/
	@rm -rf coverage/
	@rm -rf .nyc_output/
	@echo "✅ Clean complete"

# Download OpenAPI specification
download-openapi:
	@echo "📥 Downloading OpenAPI specification..."
	@mkdir -p openapi/
	@curl -f -o openapi/nvisy-api.yaml https://api.nvisy.com/openapi.yaml || \
		(echo "❌ Failed to download OpenAPI spec" && exit 1)
	@echo "✅ OpenAPI specification downloaded to openapi/nvisy-api.yaml"
	@echo "📊 Generating TypeScript types..."
	@npx openapi-typescript openapi/nvisy-api.yaml --output src/generated/types.ts || \
		(echo "⚠️  Type generation failed, continuing..." && true)
	@echo "✅ OpenAPI download and type generation complete"
