import { resolve } from "node:path";
import { defineConfig } from "vitest/config";

/**
 * End-to-end test configuration.
 *
 * These tests make real HTTP requests against a running Nvisy server and are
 * intentionally NOT part of `npm test` or CI. Run them locally with
 * `npm run test:e2e` against a reachable server. Point the SDK at the target
 * with NVISY_BASE_URL (default http://127.0.0.1:8080/api).
 */
export default defineConfig({
	test: {
		globals: true,
		environment: "node",
		include: ["test/**/*.e2e.{js,mjs,cjs,ts,mts,cts}"],
		// No coverage/thresholds — e2e is about real-request behavior, not coverage.
		maxWorkers: 1,
		testTimeout: 15000,
		hookTimeout: 15000,
	},

	resolve: {
		alias: {
			"@": resolve(__dirname, "./src"),
		},
	},

	oxc: {
		target: "es2022",
	},
});
