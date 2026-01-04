# Makefile for Nvisy.com SDK for TypeScript/JavaScript

ifneq (,$(wildcard ./.env))
	include .env
	export
endif

# Make-level logger (evaluated by make; does not invoke the shell)
define make-log
$(info [$(shell date '+%Y-%m-%d %H:%M:%S')] [MAKE] [$(MAKECMDGOALS)] $(1))
endef

# Default target
.PHONY: help
help:
	$(call make-log,Available targets:)
	@echo "  clean   - Remove build artifacts and temporary files"
	@echo "  generate - Generate TypeScript types from OpenAPI specification"
	@echo "  generate-local - Generate TypeScript types from local API server"

# Clean build artifacts and temporary files
.PHONY: clean
clean:
	$(call make-log,Cleaning build artifacts...)
	@rm -rf dist/
	@rm -rf node_modules/.cache/
	@rm -rf coverage/
	@rm -rf .nyc_output/
	@rm -rf docs/
	$(call make-log,Clean complete)

# Generate TypeScript types from OpenAPI specification
.PHONY: generate
generate:
	$(call make-log,Cleaning existing schema...)
	@npm run generate:clean
	$(call make-log,Generating TypeScript types from OpenAPI specification...)
	@npm run generate
	$(call make-log,Formatting generated files...)
	@npm run format
	$(call make-log,Building project...)
	@npm run build
	$(call make-log,Type generation complete)

# Generate TypeScript types from local API server
.PHONY: generate-local
generate-local:
	$(call make-log,Cleaning existing schema...)
	@npm run generate:clean
	$(call make-log,Generating TypeScript types from local API server...)
	@npm run generate:local
	$(call make-log,Formatting generated files...)
	@npm run format
	$(call make-log,Building project...)
	@npm run build
	$(call make-log,Type generation complete)
