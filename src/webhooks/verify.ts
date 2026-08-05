import type { WebhookEvent } from "@/datatypes/index.js";
import { NvisyError } from "@/errors.js";

/**
 * A webhook event type: any of the known {@link WebhookEvent} values (which
 * autocomplete), plus any other string — the server may emit an event type the
 * installed SDK version doesn't yet know about, so always handle the default
 * case.
 */
// `string & {}` preserves the literal-union autocomplete while widening to string.
export type WebhookEventType = WebhookEvent | (string & {});

/**
 * Header names the Nvisy webhook delivery sends. Use these to pull values off
 * an incoming request before verifying.
 */
export const WEBHOOK_HEADERS = {
	signature: "X-Webhook-Signature",
	timestamp: "X-Webhook-Timestamp",
	event: "X-Webhook-Event",
	requestId: "X-Webhook-Request-Id",
} as const;

/** Default replay-protection window: reject deliveries older than 5 minutes. */
const DEFAULT_TOLERANCE_SECONDS = 300;

/**
 * Thrown when a webhook delivery fails verification (bad or missing signature,
 * or a timestamp outside the tolerance window).
 */
export class WebhookSignatureError extends NvisyError {}

/**
 * Options for verifying a webhook delivery.
 */
export interface VerifyWebhookOptions {
	/**
	 * The webhook's signing secret, returned once from `webhooks.createWebhook()`
	 * as `WebhookCreated.secret`.
	 */
	secret: string;
	/**
	 * The **raw** request body, exactly as received. Do not parse and
	 * re-serialize it — the signature is computed over the raw bytes, so any
	 * reformatting (key reordering, whitespace) will fail verification.
	 */
	payload: string;
	/** The `X-Webhook-Signature` header value (e.g. `sha256=...`). */
	signature: string;
	/** The `X-Webhook-Timestamp` header value (unix seconds). */
	timestamp: string;
	/**
	 * How many seconds of clock skew to tolerate between the delivery timestamp
	 * and now. Deliveries outside this window are rejected as possible replays.
	 * Set to `0` to disable the timestamp check. Defaults to 300 (5 minutes).
	 */
	toleranceSeconds?: number;
	/**
	 * Current unix time in seconds, for the timestamp check. Defaults to
	 * `Date.now() / 1000`. Exposed for testing.
	 */
	now?: number;
}

const encoder = new TextEncoder();

/** Compute the lowercase hex HMAC-SHA256 of `data` keyed by `secret`. */
async function hmacSha256Hex(secret: string, data: string): Promise<string> {
	const key = await crypto.subtle.importKey(
		"raw",
		encoder.encode(secret),
		{ name: "HMAC", hash: "SHA-256" },
		false,
		["sign"],
	);
	const mac = await crypto.subtle.sign("HMAC", key, encoder.encode(data));
	return [...new Uint8Array(mac)]
		.map((b) => b.toString(16).padStart(2, "0"))
		.join("");
}

/** Constant-time comparison of two equal-purpose hex strings. */
function timingSafeEqual(a: string, b: string): boolean {
	if (a.length !== b.length) return false;
	let mismatch = 0;
	for (let i = 0; i < a.length; i++) {
		mismatch |= a.charCodeAt(i) ^ b.charCodeAt(i);
	}
	return mismatch === 0;
}

/**
 * Verify the signature and timestamp of a webhook delivery.
 *
 * The signature is an HMAC-SHA256, keyed by the webhook secret, computed over
 * `` `${timestamp}.${payload}` ``. Comparison is constant-time, and (unless
 * disabled) the timestamp must be within `toleranceSeconds` of now.
 *
 * @returns `true` if the delivery is authentic.
 * @throws {WebhookSignatureError} if the signature is missing/invalid or the
 *   timestamp is outside the tolerance window.
 */
export async function verifyWebhook(
	options: VerifyWebhookOptions,
): Promise<true> {
	const {
		secret,
		payload,
		signature,
		timestamp,
		toleranceSeconds = DEFAULT_TOLERANCE_SECONDS,
		now = Date.now() / 1000,
	} = options;

	if (!signature) {
		throw new WebhookSignatureError("Missing webhook signature");
	}

	// Signatures are sent as `sha256=<hex>`; accept a bare hex too.
	const provided = signature.startsWith("sha256=")
		? signature.slice("sha256=".length)
		: signature;

	const ts = Number(timestamp);
	if (!Number.isFinite(ts)) {
		throw new WebhookSignatureError("Invalid webhook timestamp");
	}

	if (toleranceSeconds > 0 && Math.abs(now - ts) > toleranceSeconds) {
		throw new WebhookSignatureError(
			"Webhook timestamp is outside the tolerance window",
		);
	}

	const expected = await hmacSha256Hex(secret, `${timestamp}.${payload}`);

	if (!timingSafeEqual(provided, expected)) {
		throw new WebhookSignatureError("Webhook signature mismatch");
	}

	return true;
}

/**
 * A verified webhook delivery: the parsed payload plus its envelope metadata.
 *
 * The payload body varies by `event`, so it is typed as `unknown` — narrow it
 * based on the `event` field.
 */
export interface WebhookDelivery {
	/**
	 * The event type, from the `X-Webhook-Event` header. `undefined` if the
	 * delivery carried no event header.
	 */
	event?: WebhookEventType;
	/** The delivery's request id (from `X-Webhook-Request-Id`). */
	requestId?: string;
	/** The delivery timestamp in unix seconds. */
	timestamp: number;
	/** The parsed JSON payload. Narrow by `event`. */
	payload: unknown;
}

/**
 * Options for {@link constructEvent}: everything {@link verifyWebhook} needs,
 * plus the delivery headers used to populate the envelope.
 */
export interface ConstructEventOptions extends VerifyWebhookOptions {
	/** The `X-Webhook-Event` header value. */
	event?: string;
	/** The `X-Webhook-Request-Id` header value. */
	requestId?: string;
}

/**
 * Verify a webhook delivery and return the parsed event in one step.
 *
 * Verifies the signature (see {@link verifyWebhook}), then JSON-parses the raw
 * payload and returns it alongside the envelope metadata.
 *
 * @throws {WebhookSignatureError} if verification fails.
 */
export async function constructEvent(
	options: ConstructEventOptions,
): Promise<WebhookDelivery> {
	// verifyWebhook validates the signature and the timestamp, so by here
	// `options.timestamp` is known to be finite.
	await verifyWebhook(options);
	return {
		event: options.event,
		requestId: options.requestId,
		timestamp: Number(options.timestamp),
		payload: JSON.parse(options.payload),
	};
}
