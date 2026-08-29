import { createRequire } from "node:module";
import { defineConfig } from "tsdown";

const { version } = createRequire(import.meta.url)("./package.json");

export default defineConfig({
	// Inject the package version at build time so it never drifts from
	// package.json (used for the default user agent).
	define: {
		__SDK_VERSION__: JSON.stringify(version),
	},

	// Entry and format configuration
	entry: [
		"src/index.ts",
		"src/standalone/index.ts",
		"src/services/index.ts",
		"src/datatypes/index.ts",
		"src/webhooks/index.ts",
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

	// External dependencies (not bundled)
	deps: {
		neverBundle: ["openapi-fetch"],
	},
});
