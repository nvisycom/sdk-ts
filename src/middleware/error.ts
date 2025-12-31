import type { Middleware } from "openapi-fetch";
import type { ErrorResponse } from "@/datatypes/index.js";
import { NvisyApiError, NvisyError } from "@/errors.js";

/**
 * Middleware that automatically throws NvisyApiError for error responses.
 * This replaces the need for manual checks in services.
 */
export const errorMiddleware: Middleware = {
	async onResponse({ response }) {
		if (!response.ok) {
			const error = (await response.clone().json()) as ErrorResponse;
			throw new NvisyApiError(error, response.status);
		}
		return response;
	},

	onError({ error }) {
		// Wrap fetch errors (network failures, CORS, etc.) in NvisyError
		if (error instanceof Error) {
			throw new NvisyError(error.message);
		}
		throw new NvisyError("An unknown network error occurred");
	},
};
