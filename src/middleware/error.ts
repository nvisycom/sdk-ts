import type { Middleware } from "openapi-fetch";
import type { ErrorResponse } from "@/datatypes/index.js";
import { ApiError, NetworkError } from "@/errors.js";

/**
 * Middleware that automatically throws ApiError for error responses.
 * This replaces the need for manual checks in services.
 */
export const errorMiddleware: Middleware = {
	async onResponse({ response }) {
		if (!response.ok) {
			const error = (await response.clone().json()) as ErrorResponse;
			throw new ApiError(error, response.status);
		}
		return response;
	},

	onError({ error }) {
		// Wrap fetch errors (network failures, CORS, etc.) in NetworkError
		if (error instanceof Error) {
			if (error.name === "AbortError") {
				throw NetworkError.aborted();
			}
			throw NetworkError.connection(error.message, error);
		}
		throw NetworkError.connection("An unknown network error occurred");
	},
};
