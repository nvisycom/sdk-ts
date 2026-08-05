import {
	constructEvent,
	verifyWebhook,
	WEBHOOK_HEADERS,
	type WebhookDelivery,
	WebhookSignatureError,
} from "@/webhooks/verify.js";

/** Read a required header, rejecting (with its name) when it is absent. */
function requireHeader(request: Request, name: string): string {
	const value = request.headers.get(name);
	if (value === null) {
		throw new WebhookSignatureError(`Missing ${name} header`);
	}
	return value;
}

/**
 * Pull the signing headers off a delivery `Request`. The signature and
 * timestamp are required; a missing one is rejected here (rather than being
 * coerced to an empty string) so the error names the offending header.
 */
function deliveryHeaders(request: Request): {
	signature: string;
	timestamp: string;
	event?: string;
	requestId?: string;
} {
	return {
		signature: requireHeader(request, WEBHOOK_HEADERS.signature),
		timestamp: requireHeader(request, WEBHOOK_HEADERS.timestamp),
		event: request.headers.get(WEBHOOK_HEADERS.event) ?? undefined,
		requestId: request.headers.get(WEBHOOK_HEADERS.requestId) ?? undefined,
	};
}

/** Options for the `Request`-based webhook helpers. */
export interface RequestVerifyOptions {
	/** The webhook's signing secret (`WebhookCreated.secret`). */
	secret: string;
	/**
	 * Replay tolerance in seconds; see `VerifyWebhookOptions.toleranceSeconds`.
	 */
	toleranceSeconds?: number;
	/** Current unix time in seconds, for the timestamp check (testing). */
	now?: number;
}

/**
 * Verify a webhook delivery from a standard `Request` (Fetch API).
 *
 * Reads the raw body and the `X-Webhook-*` headers off the request — so it
 * works out of the box with web-standard frameworks (Hono, Next.js App Router,
 * Remix, SvelteKit, Deno, Bun, Cloudflare Workers). The request is cloned
 * before its body is read, so the caller can still consume the original.
 *
 * @returns `true` if the delivery is authentic.
 * @throws {WebhookSignatureError} if verification fails.
 */
export async function verifyRequest(
	request: Request,
	options: RequestVerifyOptions,
): Promise<true> {
	const { signature, timestamp } = deliveryHeaders(request);
	const payload = await request.clone().text();
	return verifyWebhook({
		secret: options.secret,
		payload,
		signature,
		timestamp,
		toleranceSeconds: options.toleranceSeconds,
		now: options.now,
	});
}

/**
 * Verify a webhook delivery from a standard `Request` and return the parsed
 * event in one step. See {@link verifyRequest} for framework compatibility.
 *
 * The request is cloned before its body is read, so the caller can still
 * consume the original.
 *
 * @throws {WebhookSignatureError} if verification fails.
 */
export async function constructEventFromRequest(
	request: Request,
	options: RequestVerifyOptions,
): Promise<WebhookDelivery> {
	const { signature, timestamp, event, requestId } = deliveryHeaders(request);
	const payload = await request.clone().text();
	return constructEvent({
		secret: options.secret,
		payload,
		signature,
		timestamp,
		event,
		requestId,
		toleranceSeconds: options.toleranceSeconds,
		now: options.now,
	});
}
