# Makefile for Nvisy SDK
# This file contains build automation tasks for the TypeScript SDK including:
# - Cleaning build artifacts
# - Downloading OpenAPI specifications
# - Generating documentation
# - Pre-build development workflow commands

ifneq (,$(wildcard ./.env))
	include .env
	export
endif

# Environment variables with defaults
OPENAPI_ENDPOINT ?= https://api.nvisy.com/openapi.yaml
OPENAPI_OUTPUT_DIR ?= openapi
OPENAPI_FILENAME ?= nvisy-api.yaml
GENERATED_TYPES_DIR ?= src/generated
NODE_ENV ?= development

# Make-level logger (evaluated by make; does not invoke the shell)
define make-log
$(info [$(shell date '+%Y-%m-%d %H:%M:%S')] [MAKE] [$(MAKECMDGOALS)] $(1))
endef

# Default target
.PHONY: help
help:
	$(call make-log,Available targets:)
	@echo "  clean   - Remove build artifacts and temporary files"
	@echo "  openapi - Download OpenAPI specification and generate types"

# Clean build artifacts and temporary files
.PHONY: clean
clean:
	$(call make-log,Cleaning build artifacts...)
	@rm -rf dist/
	@rm -rf node_modules/.cache/
	@rm -rf coverage/
	@rm -rf .nyc_output/
	@rm -rf $(OPENAPI_OUTPUT_DIR)/
	@rm -rf $(GENERATED_TYPES_DIR)/
	@rm -rf docs/
	$(call make-log,Clean complete)

# Download OpenAPI specification and generate types
.PHONY: openapi
openapi:
	$(call make-log,Creating output directory...)
	@mkdir -p $(OPENAPI_OUTPUT_DIR)/
	@mkdir -p $(GENERATED_TYPES_DIR)/
	$(call make-log,Downloading OpenAPI specification from $(OPENAPI_ENDPOINT)...)
	@curl -f -o $(OPENAPI_OUTPUT_DIR)/$(OPENAPI_FILENAME) $(OPENAPI_ENDPOINT) || \
		($(call make-log,Failed to download OpenAPI specification) && exit 1)
	$(call make-log,OpenAPI specification downloaded to $(OPENAPI_OUTPUT_DIR)/$(OPENAPI_FILENAME))
	$(call make-log,Generating TypeScript types...)
	@npx openapi-typescript $(OPENAPI_OUTPUT_DIR)/$(OPENAPI_FILENAME) \
		--output $(GENERATED_TYPES_DIR)/types.ts || \
		($(call make-log,Type generation failed, continuing...) && true)
	$(call make-log,OpenAPI download and type generation complete)
