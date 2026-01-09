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
	@echo "  clean          - Remove build artifacts and temporary files"
	@echo "  check-remote   - Check connection to production API"
	@echo "  check-local    - Check connection to local API server"
	@echo "  generate       - Generate TypeScript types from OpenAPI specification"
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

# Check connection to production API
.PHONY: check-remote
check-remote:
	$(call make-log,Checking connection to production API...)
	@npm run generate:check || (echo "Error: Cannot connect to https://api.nvisy.com/openapi.json" && exit 1)
	$(call make-log,Connection successful)

# Check connection to local API server
.PHONY: check-local
check-local:
	$(call make-log,Checking connection to local API server...)
	@npm run generate:check:local || (echo "Error: Cannot connect to http://127.0.0.1:8080/api/openapi.json" && exit 1)
	$(call make-log,Connection successful)

# Generate TypeScript types from OpenAPI specification
.PHONY: generate
generate: check-remote
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
generate-local: check-local
	$(call make-log,Cleaning existing schema...)
	@npm run generate:clean
	$(call make-log,Generating TypeScript types from local API server...)
	@npm run generate:local
	$(call make-log,Formatting generated files...)
	@npm run format
	$(call make-log,Building project...)
	@npm run build
	$(call make-log,Type generation complete)
