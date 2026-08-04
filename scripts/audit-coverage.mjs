#!/usr/bin/env node
/**
 * API coverage audit.
 *
 * Compares every operation (METHOD + path) in the OpenAPI spec against the
 * request calls the SDK services actually make, and reports:
 *   - MISSING: a spec operation with no corresponding SDK call
 *   - EXTRA:   an SDK call whose path is not in the spec (stale route)
 *
 * Exits non-zero if either set is non-empty, so it can gate CI or a release.
 *
 * Usage:
 *   node scripts/audit-coverage.mjs [specUrl]
 *   NVISY_OPENAPI_URL=https://api.nvisy.com/openapi.json node scripts/audit-coverage.mjs
 *
 * Default spec URL matches `npm run generate:local`.
 */
import { readdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const HTTP_METHODS = ["get", "post", "put", "patch", "delete"];
const SPEC_URL =
	process.argv[2] ??
	process.env.NVISY_OPENAPI_URL ??
	"http://127.0.0.1:8080/api/openapi.json";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

/** Every "METHOD /path" operation declared in the spec. */
function specOperations(spec) {
	const ops = new Set();
	for (const [path, item] of Object.entries(spec.paths ?? {})) {
		for (const method of Object.keys(item)) {
			if (HTTP_METHODS.includes(method)) {
				ops.add(`${method.toUpperCase()} ${path}`);
			}
		}
	}
	return ops;
}

/** Every "METHOD /path" the SDK invokes via openapi-fetch, scraped from source. */
function sdkCalls() {
	const dirs = ["src/services", "src/auth"];
	const calls = new Set();
	// Matches `.GET("/path"`, `.POST(\n  "/path"`, etc. (multi-line aware).
	const re = /\.(GET|POST|PUT|PATCH|DELETE)\(\s*"([^"]+)"/g;
	for (const dir of dirs) {
		let entries;
		try {
			entries = readdirSync(join(root, dir));
		} catch {
			continue;
		}
		for (const file of entries) {
			if (!file.endsWith(".ts")) continue;
			const text = readFileSync(join(root, dir, file), "utf8");
			for (const match of text.matchAll(re)) {
				calls.add(`${match[1]} ${match[2]}`);
			}
		}
	}
	return calls;
}

async function main() {
	let spec;
	try {
		const res = await fetch(SPEC_URL);
		if (!res.ok) throw new Error(`HTTP ${res.status}`);
		spec = await res.json();
	} catch (err) {
		console.error(`Failed to fetch spec from ${SPEC_URL}: ${err.message}`);
		console.error("Pass a URL as an argument or set NVISY_OPENAPI_URL.");
		process.exit(2);
	}

	const ops = specOperations(spec);
	const calls = sdkCalls();

	const missing = [...ops].filter((op) => !calls.has(op)).sort();
	const extra = [...calls].filter((call) => !ops.has(call)).sort();

	console.log(`Spec operations: ${ops.size} | SDK calls: ${calls.size}\n`);

	console.log(`MISSING (spec operation with no SDK call): ${missing.length}`);
	for (const op of missing) console.log(`  ${op}`);

	console.log(`\nEXTRA (SDK call not in spec): ${extra.length}`);
	for (const call of extra) console.log(`  ${call}`);

	if (missing.length || extra.length) {
		console.log("\nCoverage audit FAILED.");
		process.exit(1);
	}
	console.log("\nCoverage audit PASSED — SDK covers the spec 1:1.");
}

main();
