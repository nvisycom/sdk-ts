/**
 * @fileoverview Error types for the Nvisy SDK.
 *
 * This module defines the error hierarchy used throughout the SDK:
 * - {@link ApiError} - Errors returned by the Nvisy API (4xx/5xx responses)
 * - {@link ConfigError} - Client configuration validation errors
 * - {@link NetworkError} - Network connectivity and request failures
 *
 * All errors extend the built-in Error class and include additional context
 * to help with debugging and error handling.
 *
 * @module errors
 */

import type { ErrorResponse } from "@/datatypes/index.js";

// Re-export ErrorResponse type for convenience
export type { ErrorResponse } from "@/datatypes/index.js";

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
 *   await client.account.get();
 * } catch (error) {
 *   if (error instanceof ApiError) {
 *     console.log(`API Error: ${error.message}`);
 *     console.log(`Status: ${error.statusCode}`);
 *     if (error.isRetryable()) {
 *       // Implement retry logic
 *     }
 *   }
 * }
 * ```
 */
export class ApiError extends Error implements ErrorResponse {
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
	 * Creates a new ApiError from an API error response.
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

		// Maintains proper stack trace for where our error was thrown (only available on V8)
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

/**
 * Abstract base class for SDK-specific errors.
 *
 * This class provides common functionality for all client-side errors
 * (as opposed to API errors). It ensures proper error naming and stack traces.
 *
 * @internal
 */
export abstract class ClientError extends Error {
	/**
	 * The error class name (e.g., "ConfigError", "NetworkError").
	 */
	public readonly name: string;

	/**
	 * Creates a new ClientError.
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
 * Error thrown when client configuration is invalid.
 *
 * This error is thrown during client initialization if the provided
 * configuration is missing required fields or contains invalid values.
 *
 * @example
 * ```typescript
 * try {
 *   const client = new Client().withApiToken("short");
 * } catch (error) {
 *   if (error instanceof ConfigError) {
 *     console.log(`Config error in field '${error.field}': ${error.reason}`);
 *   }
 * }
 * ```
 */
export class ConfigError extends ClientError {
	/**
	 * The configuration field that caused the error.
	 * May be undefined for general configuration errors.
	 */
	public readonly field?: string;

	/**
	 * A description of why the configuration is invalid.
	 * May be undefined for simple errors.
	 */
	public readonly reason?: string;

	/**
	 * Creates a new ConfigError.
	 *
	 * @param message - The error message
	 * @param options - Additional error context
	 * @param options.field - The field that caused the error
	 * @param options.reason - Why the configuration is invalid
	 */
	constructor(
		message: string,
		options?: {
			field?: string;
			reason?: string;
		},
	) {
		super(message);
		this.field = options?.field;
		this.reason = options?.reason;
	}

	/**
	 * Creates a ConfigError for a missing API token.
	 *
	 * @returns A ConfigError indicating the API token is required
	 *
	 * @internal
	 */
	static missingApiToken(): ConfigError {
		return new ConfigError("API token is required", {
			field: "apiToken",
			reason: "API token must be provided in configuration",
		});
	}

	/**
	 * Creates a ConfigError for an invalid configuration field.
	 *
	 * @param field - The name of the invalid field
	 * @param reason - Why the field value is invalid
	 * @returns A ConfigError with field and reason context
	 *
	 * @internal
	 */
	static invalidField(field: string, reason: string): ConfigError {
		return new ConfigError(`Invalid configuration for ${field}: ${reason}`, {
			field,
			reason,
		});
	}

	/**
	 * Creates a ConfigError for a missing required field.
	 *
	 * @param field - The name of the missing field
	 * @returns A ConfigError indicating the field is required
	 *
	 * @internal
	 */
	static missingField(field: string): ConfigError {
		return new ConfigError(`Missing required configuration field: ${field}`, {
			field,
			reason: "This field is required",
		});
	}
}

/**
 * Error thrown when a network request fails.
 *
 * This error wraps underlying network errors (connection failures, timeouts,
 * aborted requests) and provides a consistent interface for handling them.
 *
 * @example
 * ```typescript
 * try {
 *   await client.account.get();
 * } catch (error) {
 *   if (error instanceof NetworkError) {
 *     console.log("Network error:", error.message);
 *     if (error.cause) {
 *       console.log("Caused by:", error.cause.message);
 *     }
 *   }
 * }
 * ```
 */
export class NetworkError extends ClientError {
	/**
	 * The underlying error that caused this network error.
	 * May be undefined if no underlying error is available.
	 */
	public readonly cause?: Error;

	/**
	 * Creates a new NetworkError.
	 *
	 * @param message - The error message
	 * @param cause - The underlying error that caused this failure
	 */
	constructor(message: string, cause?: Error) {
		super(message);
		this.cause = cause;
	}

	/**
	 * Creates a NetworkError for connection issues.
	 *
	 * @param message - Description of the connection problem
	 * @param cause - The underlying error
	 * @returns A NetworkError for connection failures
	 *
	 * @internal
	 */
	static connection(message: string, cause?: Error): NetworkError {
		return new NetworkError(message, cause);
	}

	/**
	 * Creates a NetworkError for aborted requests.
	 *
	 * @returns A NetworkError indicating the request was aborted
	 *
	 * @internal
	 */
	static aborted(): NetworkError {
		return new NetworkError("Request was aborted");
	}
}
