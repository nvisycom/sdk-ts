import { describe, expect, it } from "vitest";
import {
	constructEventFromRequest,
	verifyRequest,
} from "@/webhooks/request.js";
import { WebhookSignatureError } from "@/webhooks/verify.js";

const SECRET = "whsec_test_secret";
const TIMESTAMP = 1_700_000_000;

/** Sign as the server does: HMAC-SHA256 over `{timestamp}.{payload}`. */
async function sign(
	secret: string,
	timestamp: number,
	payload: string,
): Promise<string> {
	const enc = new TextEncoder();
	const key = await crypto.subtle.importKey(
		"raw",
		enc.encode(secret),
		{ name: "HMAC", hash: "SHA-256" },
		false,
		["sign"],
	);
	const mac = await crypto.subtle.sign(
		"HMAC",
		key,
		enc.encode(`${timestamp}.${payload}`),
	);
	return [...new Uint8Array(mac)]
		.map((b) => b.toString(16).padStart(2, "0"))
		.join("");
}

/** Build a signed webhook Request like the server would send. */
async function signedRequest(
	payload: string,
	overrides: { secret?: string; event?: string; requestId?: string } = {},
): Promise<Request> {
	const signature = `sha256=${await sign(overrides.secret ?? SECRET, TIMESTAMP, payload)}`;
	return new Request("https://app.example.com/webhooks/nvisy", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			"X-Webhook-Signature": signature,
			"X-Webhook-Timestamp": String(TIMESTAMP),
			"X-Webhook-Event": overrides.event ?? "file:created",
			"X-Webhook-Request-Id": overrides.requestId ?? "req_abc",
		},
		body: payload,
	});
}

describe("verifyRequest", () => {
	it("accepts a valid signed Request", async () => {
		const payload = JSON.stringify({ id: "run_1" });
		const request = await signedRequest(payload);
		await expect(
			verifyRequest(request, { secret: SECRET, now: TIMESTAMP }),
		).resolves.toBe(true);
	});

	it("rejects a wrong secret", async () => {
		const payload = JSON.stringify({ id: "run_1" });
		const request = await signedRequest(payload, { secret: "other" });
		await expect(
			verifyRequest(request, { secret: SECRET, now: TIMESTAMP }),
		).rejects.toBeInstanceOf(WebhookSignatureError);
	});

	it("rejects with a header-specific error when the signature is absent", async () => {
		const request = new Request("https://app.example.com/webhooks/nvisy", {
			method: "POST",
			headers: { "X-Webhook-Timestamp": String(TIMESTAMP) },
			body: "{}",
		});
		await expect(
			verifyRequest(request, { secret: SECRET, now: TIMESTAMP }),
		).rejects.toThrow(/X-Webhook-Signature/);
	});

	it("does not consume the caller's request body", async () => {
		const payload = JSON.stringify({ id: "run_1" });
		const request = await signedRequest(payload);
		await verifyRequest(request, { secret: SECRET, now: TIMESTAMP });
		// The original request is still readable because we clone internally.
		expect(request.bodyUsed).toBe(false);
		await expect(request.text()).resolves.toBe(payload);
	});
});

describe("constructEventFromRequest", () => {
	it("verifies and parses headers + body from a Request", async () => {
		const payload = JSON.stringify({ id: "run_1", status: "completed" });
		const request = await signedRequest(payload, {
			event: "file:updated",
			requestId: "req_xyz",
		});
		const delivery = await constructEventFromRequest(request, {
			secret: SECRET,
			now: TIMESTAMP,
		});
		expect(delivery.event).toBe("file:updated");
		expect(delivery.requestId).toBe("req_xyz");
		expect(delivery.timestamp).toBe(TIMESTAMP);
		expect(delivery.payload).toEqual({ id: "run_1", status: "completed" });
	});

	it("throws on an invalid signature", async () => {
		const payload = JSON.stringify({ id: "run_1" });
		const request = await signedRequest(payload, { secret: "other" });
		await expect(
			constructEventFromRequest(request, { secret: SECRET, now: TIMESTAMP }),
		).rejects.toBeInstanceOf(WebhookSignatureError);
	});
});
