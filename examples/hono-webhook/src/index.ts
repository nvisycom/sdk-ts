import { serve } from "@hono/node-server";
import {
	constructEventFromRequest,
	WebhookSignatureError,
} from "@nvisy/sdk/webhooks";
import { Hono } from "hono";

const app = new Hono();

// The webhook's signing secret, returned once from `webhooks.createWebhook()`
// as `WebhookCreated.secret`. Never hard-code it — read it from the environment.
const WEBHOOK_SECRET = process.env.NVISY_WEBHOOK_SECRET;
if (!WEBHOOK_SECRET) {
	throw new Error("NVISY_WEBHOOK_SECRET is not set");
}

app.post("/webhooks/nvisy", async (c) => {
	try {
		// `c.req.raw` is the standard Fetch `Request`. The helper reads the raw
		// body and X-Webhook-* headers, verifies the HMAC signature, and returns
		// the parsed delivery. It clones the request, so `c.req` stays readable.
		const delivery = await constructEventFromRequest(c.req.raw, {
			secret: WEBHOOK_SECRET,
		});

		switch (delivery.event) {
			case "file:created":
				console.log("file created:", delivery.payload);
				break;
			case "file:updated":
				console.log("file updated:", delivery.payload);
				break;
			case "file:deleted":
				console.log("file deleted:", delivery.payload);
				break;
			default:
				console.log(`unhandled event ${delivery.event}:`, delivery.payload);
		}

		// Acknowledge quickly; do heavy work asynchronously.
		return c.json({ received: true });
	} catch (error) {
		if (error instanceof WebhookSignatureError) {
			// Signature/timestamp verification failed — reject the delivery.
			return c.json({ error: error.message }, 401);
		}
		throw error;
	}
});

const port = Number(process.env.PORT ?? 3000);
serve({ fetch: app.fetch, port });
console.log(`Listening on http://localhost:${port}`);
console.log(`Webhook endpoint: POST http://localhost:${port}/webhooks/nvisy`);
