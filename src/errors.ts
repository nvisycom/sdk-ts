/**
 * @fileoverview Error types for the Nvisy SDK.
 *
 * This module defines the error hierarchy used throughout the SDK:
 * - {@link NvisyError} - Base error class for all SDK errors
 * - {@link NvisyApiError} - Errors returned by the Nvisy API (4xx/5xx responses)
 *
 * @module errors
 */

import type { ErrorResponse } from "@/datatypes/index.js";

// Re-export ErrorResponse type for convenience
export type { ErrorResponse } from "@/datatypes/index.js";

/**
 * Base error class for all Nvisy SDK errors.
 *
 * This class provides common functionality for all SDK errors.
 * It ensures proper error naming and stack traces.
 *
 * @example
 * ```typescript
 * try {
 *   const client = new Client({ apiToken: "" });
 * } catch (error) {
 *   if (error instanceof NvisyError) {
 *     console.log("SDK error:", error.message);
 *   }
 * }
 * ```
 */
export class NvisyError extends Error {
	/**
	 * The error class name.
	 */
	public readonly name: string;

	/**
	 * Creates a new NvisyError.
	 *
	 * @param message - The error message
	 */
	constructor(message: string) {
		super(message);
		this.name = this.constructor.name;

		if (Error.captureStackTrace) {
			Error.captureStackTrace(this, this.constructor);
		}
	}
}

/**
 * Error thrown when the Nvisy API returns an error response.
 *
 * This error class wraps the API's {@link ErrorResponse} format and adds
 * the HTTP status code. It provides helper methods to categorize errors
 * and determine if they are retryable.
 *
 * @example
 * ```typescript
 * try {
 *   await client.account.getAccount();
 * } catch (error) {
 *   if (error instanceof NvisyApiError) {
 *     console.log(`API Error: ${error.message}`);
 *     console.log(`Status: ${error.statusCode}`);
 *     if (error.isRetryable()) {
 *       // Implement retry logic
 *     }
 *   }
 * }
 * ```
 */
export class NvisyApiError extends NvisyError implements ErrorResponse {
	/**
	 * The error type identifier (e.g., "ValidationError", "NotFoundError").
	 */
	public readonly name: string;

	/**
	 * Human-readable error message safe for display to end users.
	 */
	public readonly message: string;

	/**
	 * The resource type that the error relates to (e.g., "account", "project").
	 * May be null if the error is not resource-specific.
	 */
	public readonly resource?: string | null;

	/**
	 * A helpful suggestion for resolving the error.
	 * May be null if no suggestion is available.
	 */
	public readonly suggestion?: string | null;

	/**
	 * Field-specific validation errors.
	 * Present when the error is due to invalid input data.
	 */
	public readonly validation?: ErrorResponse["validation"];

	/**
	 * HTTP status code of the response (e.g., 400, 404, 500).
	 */
	public readonly statusCode: number;

	/**
	 * Creates a new NvisyApiError from an API error response.
	 *
	 * @param response - The error response from the API
	 * @param statusCode - The HTTP status code of the response
	 */
	constructor(response: ErrorResponse, statusCode: number) {
		super(response.message);
		this.name = response.name;
		this.message = response.message;
		this.resource = response.resource;
		this.suggestion = response.suggestion;
		this.validation = response.validation;
		this.statusCode = statusCode;

		if (Error.captureStackTrace) {
			Error.captureStackTrace(this, this.constructor);
		}
	}

	/**
	 * Checks if this is a client error (4xx status code).
	 *
	 * Client errors indicate problems with the request itself, such as
	 * invalid input, missing authentication, or accessing non-existent resources.
	 *
	 * @returns True if the status code is in the 4xx range
	 */
	isClientError(): boolean {
		return this.statusCode >= 400 && this.statusCode < 500;
	}

	/**
	 * Checks if this is a server error (5xx status code).
	 *
	 * Server errors indicate problems on the API side. These are typically
	 * transient and may succeed if retried.
	 *
	 * @returns True if the status code is in the 5xx range
	 */
	isServerError(): boolean {
		return this.statusCode >= 500;
	}

	/**
	 * Determines if this error is safe to retry.
	 *
	 * An error is considered retryable if it's a server error (5xx),
	 * a request timeout (408), or rate limiting (429).
	 *
	 * @returns True if the request may succeed on retry
	 */
	isRetryable(): boolean {
		return (
			this.statusCode >= 500 || // Server errors
			this.statusCode === 408 || // Request timeout
			this.statusCode === 429 // Rate limited
		);
	}

	/**
	 * Converts the error to a plain {@link ErrorResponse} object.
	 *
	 * Useful for serialization or logging.
	 *
	 * @returns A plain object representation of the error
	 */
	toJSON(): ErrorResponse {
		return {
			name: this.name,
			message: this.message,
			resource: this.resource,
			suggestion: this.suggestion,
			validation: this.validation,
		};
	}
}
