#!/usr/bin/env node
/**
 * API coverage audit.
 *
 * Operation coverage (the hard gate): compares every operation (METHOD + path)
 * in the OpenAPI spec against the request calls the SDK services actually make:
 *   - MISSING: a spec operation with no corresponding SDK call
 *   - EXTRA:   an SDK call whose path is not in the spec (stale route)
 * Exits non-zero if either set is non-empty, so it can gate CI or a release.
 *
 * Type coverage (warning only): schema types reachable from request bodies
 * (Create/Update/Sync/... roots) that consumers must construct but the SDK
 * does not re-export as a datatype. Reported as UNEXPORTED TYPES; does not
 * fail.
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

/**
 * Operations intentionally not wrapped by an SDK method, so the audit doesn't
 * flag them as missing. Keep this list short and justified.
 *
 * - Avatar serve paths: content-addressed static asset URLs. Consumers use the
 *   `avatarUrl` field on the account/workspace directly, not an SDK call.
 */
const IGNORED_OPERATIONS = new Set([
	"GET /avatars/accounts/{id}/{version}/",
	"GET /avatars/workspaces/{id}/{version}/",
]);

/**
 * Schema types the type-coverage check should not expect to be exported.
 * These are opaque `string` newtypes (`type X = string`) — the SDK's methods
 * already take `string`, so a named alias would add noise without value.
 */
const IGNORED_TYPES = new Set([
	"Handle",
	"LabelRef",
	"ConnectionId",
	"RunId",
	"WebhookId",
]);

/** Schema names whose bodies define the request surface consumers construct. */
const REQUEST_ROOT = /^(Create|Update|Sync|Reply|Generate|Login|Signup|Test)/;

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

/** Every schema key the SDK re-exports, scraped from `Schemas["Name"]` usages. */
function exportedTypes() {
	const exported = new Set();
	const dir = join(root, "src/datatypes");
	const re = /Schemas\["([^"]+)"\]/g;
	let entries;
	try {
		entries = readdirSync(dir);
	} catch {
		return exported;
	}
	for (const file of entries) {
		if (!file.endsWith(".ts")) continue;
		const text = readFileSync(join(dir, file), "utf8");
		for (const match of text.matchAll(re)) exported.add(match[1]);
	}
	return exported;
}

/** All schema names transitively reachable (via `$ref`) from request bodies. */
function requestReachableTypes(spec) {
	const schemas = spec.components?.schemas ?? {};
	const reachable = new Set();

	function walk(name) {
		if (reachable.has(name) || !schemas[name]) return;
		reachable.add(name);
		const refs = [];
		(function collect(node) {
			if (!node || typeof node !== "object") return;
			if (typeof node.$ref === "string") refs.push(node.$ref.split("/").pop());
			for (const value of Object.values(node)) collect(value);
		})(schemas[name]);
		for (const ref of refs) walk(ref);
	}

	for (const name of Object.keys(schemas)) {
		if (REQUEST_ROOT.test(name)) walk(name);
	}
	return reachable;
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

	const missing = [...ops]
		.filter((op) => !calls.has(op) && !IGNORED_OPERATIONS.has(op))
		.sort();
	const extra = [...calls].filter((call) => !ops.has(call)).sort();
	const ignored = [...IGNORED_OPERATIONS].filter((op) => ops.has(op)).sort();

	console.log(`Spec operations: ${ops.size} | SDK calls: ${calls.size}\n`);

	console.log(`MISSING (spec operation with no SDK call): ${missing.length}`);
	for (const op of missing) console.log(`  ${op}`);

	console.log(`\nEXTRA (SDK call not in spec): ${extra.length}`);
	for (const call of extra) console.log(`  ${call}`);

	if (ignored.length) {
		console.log(`\nIGNORED (intentionally not wrapped): ${ignored.length}`);
		for (const op of ignored) console.log(`  ${op}`);
	}

	// Type coverage: request-reachable schema types the SDK does not re-export.
	// Warning only — it does not affect the audit's pass/fail.
	const exported = exportedTypes();
	const reachable = requestReachableTypes(spec);
	const unexportedTypes = [...reachable]
		.filter((name) => !exported.has(name) && !IGNORED_TYPES.has(name))
		.sort();

	console.log(
		`\nUNEXPORTED TYPES (request-reachable, not re-exported): ${unexportedTypes.length}`,
	);
	for (const name of unexportedTypes) console.log(`  ${name}`);
	if (unexportedTypes.length) {
		console.log("  (warning only — consider exporting these as datatypes)");
	}

	if (missing.length || extra.length) {
		console.log("\nCoverage audit FAILED.");
		process.exit(1);
	}
	console.log("\nCoverage audit PASSED — SDK covers the spec 1:1.");
}

main();
