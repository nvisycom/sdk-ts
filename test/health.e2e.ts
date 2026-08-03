import { describe, expect, it } from "vitest";
import { Nvisy } from "@/index.js";

/**
 * End-to-end tests for the health endpoint.
 *
 * These hit a real running Nvisy server and are excluded from `npm test`/CI.
 * Run with `npm run test:e2e` against a reachable server. Override the target
 * with NVISY_BASE_URL (default http://127.0.0.1:8080).
 *
 * Health is unauthenticated, so no real token is needed — but the client
 * constructor requires a valid-format token, hence the dummy below.
 */
const BASE_URL = process.env.NVISY_BASE_URL ?? "http://127.0.0.1:8080";

function client(): Nvisy {
	return new Nvisy({ apiToken: "e2e-dummy-token", baseUrl: BASE_URL });
}

describe("health (e2e)", () => {
	it("checkHealth() completes a real GET without sending a body", async () => {
		// A GET carrying a request body throws `TypeError: Request with GET
		// method cannot have body` when a real fetch runs. If this resolves,
		// the SDK is not attaching a body to the health request.
		const health = await client().status.checkHealth();

		expect(health).toBeDefined();
		expect(typeof health.status).toBe("string");
		expect(["healthy", "degraded", "unhealthy"]).toContain(health.status);
		expect(Array.isArray(health.checks)).toBe(true);
	});

	it("checkHealth() takes no arguments", () => {
		// Guards the signature: passing options used to attach a body.
		expect(client().status.checkHealth.length).toBe(0);
	});
});
