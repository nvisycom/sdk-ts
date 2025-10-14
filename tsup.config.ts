import { defineConfig } from "tsup";

export default defineConfig({
	// Entry and format configuration
	entry: ["src/index.ts"],
	format: ["esm"],

	// Output configuration
	outDir: "dist",
	dts: true,
	sourcemap: true,
	clean: true,

	// Build behavior
	minify: false,
	splitting: false,
	treeshake: true,
	bundle: true,
	skipNodeModulesBundle: true,

	// Platform and target
	platform: "neutral",
	target: "es2022",

	// External dependencies
	external: ["openapi-fetch"],
});
