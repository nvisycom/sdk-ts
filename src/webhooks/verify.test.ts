import { describe, expect, it } from "vitest";
import {
	constructEvent,
	verifyWebhook,
	WebhookSignatureError,
} from "@/webhooks/verify.js";

const SECRET = "whsec_test_secret";
const PAYLOAD = JSON.stringify({ id: "run_123", status: "completed" });
const TIMESTAMP = 1_700_000_000; // fixed unix seconds

/** Sign exactly as the server does: HMAC-SHA256 over `{timestamp}.{payload}`. */
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

describe("verifyWebhook", () => {
	it("accepts a valid signature", async () => {
		const signature = `sha256=${await sign(SECRET, TIMESTAMP, PAYLOAD)}`;
		await expect(
			verifyWebhook({
				secret: SECRET,
				payload: PAYLOAD,
				signature,
				timestamp: String(TIMESTAMP),
				now: TIMESTAMP,
			}),
		).resolves.toBe(true);
	});

	it("accepts a bare hex signature (no sha256= prefix)", async () => {
		const signature = await sign(SECRET, TIMESTAMP, PAYLOAD);
		await expect(
			verifyWebhook({
				secret: SECRET,
				payload: PAYLOAD,
				signature,
				timestamp: String(TIMESTAMP),
				now: TIMESTAMP,
			}),
		).resolves.toBe(true);
	});

	it("rejects a tampered payload", async () => {
		const signature = `sha256=${await sign(SECRET, TIMESTAMP, PAYLOAD)}`;
		await expect(
			verifyWebhook({
				secret: SECRET,
				payload: `${PAYLOAD} `, // one byte different
				signature,
				timestamp: String(TIMESTAMP),
				now: TIMESTAMP,
			}),
		).rejects.toBeInstanceOf(WebhookSignatureError);
	});

	it("rejects the wrong secret", async () => {
		const signature = `sha256=${await sign("other_secret", TIMESTAMP, PAYLOAD)}`;
		await expect(
			verifyWebhook({
				secret: SECRET,
				payload: PAYLOAD,
				signature,
				timestamp: String(TIMESTAMP),
				now: TIMESTAMP,
			}),
		).rejects.toBeInstanceOf(WebhookSignatureError);
	});

	it("rejects a stale timestamp outside the tolerance window", async () => {
		const signature = `sha256=${await sign(SECRET, TIMESTAMP, PAYLOAD)}`;
		await expect(
			verifyWebhook({
				secret: SECRET,
				payload: PAYLOAD,
				signature,
				timestamp: String(TIMESTAMP),
				now: TIMESTAMP + 10_000, // way past the 300s default
			}),
		).rejects.toBeInstanceOf(WebhookSignatureError);
	});

	it("skips the timestamp check when tolerance is 0", async () => {
		const signature = `sha256=${await sign(SECRET, TIMESTAMP, PAYLOAD)}`;
		await expect(
			verifyWebhook({
				secret: SECRET,
				payload: PAYLOAD,
				signature,
				timestamp: String(TIMESTAMP),
				now: TIMESTAMP + 10_000,
				toleranceSeconds: 0,
			}),
		).resolves.toBe(true);
	});

	it("rejects a missing signature", async () => {
		await expect(
			verifyWebhook({
				secret: SECRET,
				payload: PAYLOAD,
				signature: "",
				timestamp: String(TIMESTAMP),
				now: TIMESTAMP,
			}),
		).rejects.toBeInstanceOf(WebhookSignatureError);
	});

	it("rejects a non-numeric timestamp", async () => {
		const signature = `sha256=${await sign(SECRET, TIMESTAMP, PAYLOAD)}`;
		await expect(
			verifyWebhook({
				secret: SECRET,
				payload: PAYLOAD,
				signature,
				timestamp: "not-a-number",
				now: TIMESTAMP,
			}),
		).rejects.toBeInstanceOf(WebhookSignatureError);
	});
});

describe("constructEvent", () => {
	it("verifies and returns the parsed delivery", async () => {
		const signature = `sha256=${await sign(SECRET, TIMESTAMP, PAYLOAD)}`;
		const delivery = await constructEvent({
			secret: SECRET,
			payload: PAYLOAD,
			signature,
			timestamp: String(TIMESTAMP),
			event: "file:created",
			requestId: "req_abc",
			now: TIMESTAMP,
		});
		expect(delivery.event).toBe("file:created");
		expect(delivery.requestId).toBe("req_abc");
		expect(delivery.timestamp).toBe(TIMESTAMP);
		expect(delivery.payload).toEqual({ id: "run_123", status: "completed" });
	});

	it("throws before parsing when the signature is invalid", async () => {
		await expect(
			constructEvent({
				secret: SECRET,
				payload: PAYLOAD,
				signature: "sha256=deadbeef",
				timestamp: String(TIMESTAMP),
				event: "file:created",
				now: TIMESTAMP,
			}),
		).rejects.toBeInstanceOf(WebhookSignatureError);
	});
});
