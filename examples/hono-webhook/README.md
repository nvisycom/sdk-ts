# Nvisy webhook receiver (Hono)

A minimal [Hono](https://hono.dev) server that verifies incoming Nvisy webhooks
using [`@nvisy/sdk/webhooks`](../../README.md).

It uses `constructEventFromRequest`, which accepts the standard Fetch `Request`
(`c.req.raw`) — reading the raw body and `X-Webhook-*` headers, verifying the
HMAC-SHA256 signature, and returning the parsed event. The same approach works
in any web-standard runtime (Next.js App Router, Remix, SvelteKit, Deno, Bun,
Cloudflare Workers).

## Run

```bash
npm install
cp .env.example .env   # then set NVISY_WEBHOOK_SECRET
npm run dev
```

The endpoint is `POST http://localhost:3000/webhooks/nvisy`.

## Verify locally

Point a webhook at your machine (e.g. via a tunnel like `ngrok`) so Nvisy can
reach it, then trigger an event or use the webhook "test" action. Deliveries
with a bad or missing signature are rejected with `401`.

> The `Request`-based helpers ship in `@nvisy/sdk` 0.12.0+. To run against an
> unreleased local build, `npm link` the SDK from the repo root, or install the
> packed tarball.
