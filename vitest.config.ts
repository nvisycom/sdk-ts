import { resolve } from "node:path";
import { defineConfig } from "vitest/config";

export default defineConfig({
	test: {
		// Test environment configuration
		globals: true, // Enable global test functions (describe, it, expect)
		environment: "node", // Use Node.js environment for testing

		// Test file patterns
		include: ["src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"],
		exclude: ["node_modules", "dist", "build", "**/*.d.ts"],

		// Coverage configuration
		coverage: {
			provider: "v8", // Use V8 coverage provider for accurate results
			reporter: ["text", "json", "html", "lcov"],

			// Files to exclude from coverage
			exclude: [
				"node_modules/",
				"dist/",
				"build/",
				"coverage/",
				"**/*.d.ts",
				"**/*.config.*",
				"**/types.ts",
				"**/index.ts", // Entry points typically just re-export
				"src/generated/**", // Exclude generated files
			],

			// Coverage thresholds - fail if below these percentages
			thresholds: {
				global: {
					branches: 80,
					functions: 80,
					lines: 80,
					statements: 80,
				},
			},
		},

		// Test execution configuration (Vitest 4+)
		maxWorkers: 4,

		// Test timeout configuration
		testTimeout: 10000, // 10 seconds per test
		hookTimeout: 10000, // 10 seconds per hook
	},

	// Path resolution
	resolve: {
		alias: {
			"@": resolve(__dirname, "./src"),
		},
	},

	// Build configuration for test files
	esbuild: {
		target: "es2022",
	},
});
