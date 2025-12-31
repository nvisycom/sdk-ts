import type { Middleware } from "openapi-fetch";

/**
 * Creates a logging middleware for debugging requests and responses.
 *
 * Logs request method, URL, response status, and timing to console.
 */
export function createLoggingMiddleware(): Middleware {
	return {
		async onRequest({ request }) {
			const start = performance.now();
			(request as Request & { _startTime?: number })._startTime = start;
			return request;
		},

		async onResponse({ request, response }) {
			const start =
				(request as Request & { _startTime?: number })._startTime ??
				performance.now();
			const duration = Math.round(performance.now() - start);
			const url = new URL(request.url);

			console.log(
				`[nvisy] ${request.method} ${url.pathname} ${response.status} (${duration}ms)`,
			);

			return response;
		},

		onError({ request, error }) {
			const start =
				(request as Request & { _startTime?: number })._startTime ??
				performance.now();
			const duration = Math.round(performance.now() - start);
			const url = new URL(request.url);

			console.error(
				`[nvisy] ${request.method} ${url.pathname} ERROR (${duration}ms):`,
				error instanceof Error ? error.message : error,
			);
		},
	};
}
