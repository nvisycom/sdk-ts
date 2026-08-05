/**
 * @fileoverview Utilities for receiving Nvisy webhooks.
 *
 * Verify the signature on an incoming webhook delivery and parse it into a
 * typed event. Uses the Web Crypto API, so it works in Node, browsers, edge
 * runtimes, and workers.
 *
 * @module webhooks
 *
 * @example Web-standard frameworks (Hono, Next.js, Remix, Deno, Bun, Workers)
 * ```typescript
 * import { constructEventFromRequest } from "@nvisy/sdk/webhooks";
 *
 * // `request` is a standard Fetch API Request. The helper reads the raw body
 * // and X-Webhook-* headers for you (and clones the request first).
 * const delivery = await constructEventFromRequest(request, {
 *   secret: process.env.NVISY_WEBHOOK_SECRET!,
 * });
 *
 * switch (delivery.event) {
 *   case "file:created":
 *     // handle it — narrow `delivery.payload` by event
 *     break;
 * }
 * ```
 *
 * @example Manual (any runtime — pass the RAW body, not a re-serialized one)
 * ```typescript
 * import { constructEvent, WEBHOOK_HEADERS } from "@nvisy/sdk/webhooks";
 *
 * const delivery = await constructEvent({
 *   secret: process.env.NVISY_WEBHOOK_SECRET!,
 *   payload: rawBody,
 *   signature: headers[WEBHOOK_HEADERS.signature.toLowerCase()],
 *   timestamp: headers[WEBHOOK_HEADERS.timestamp.toLowerCase()],
 *   event: headers[WEBHOOK_HEADERS.event.toLowerCase()],
 * });
 * ```
 */

export type { RequestVerifyOptions } from "@/webhooks/request.js";
export {
	constructEventFromRequest,
	verifyRequest,
} from "@/webhooks/request.js";
export type {
	ConstructEventOptions,
	VerifyWebhookOptions,
	WebhookDelivery,
} from "@/webhooks/verify.js";
export {
	constructEvent,
	verifyWebhook,
	WEBHOOK_HEADERS,
	WebhookSignatureError,
} from "@/webhooks/verify.js";
