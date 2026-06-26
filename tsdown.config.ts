import { defineConfig } from "tsdown";

export default defineConfig({
	// Entry and format configuration
	entry: [
		"src/index.ts",
		"src/auth/index.ts",
		"src/services/index.ts",
		"src/datatypes/index.ts",
	],
	format: ["esm"],

	// Output configuration
	outDir: "dist",
	dts: true,
	sourcemap: true,
	clean: true,

	// Build behavior
	minify: false,
	treeshake: true,

	// Platform and target
	platform: "neutral",
	target: "es2022",

	// External dependencies
	external: ["openapi-fetch"],
});
