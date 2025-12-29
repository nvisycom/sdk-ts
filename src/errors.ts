import type { ErrorResponse } from "@/datatypes/index.js";

// Re-export ErrorResponse type for convenience
export type { ErrorResponse } from "@/datatypes/index.js";

/**
 * Helper to unwrap openapi-fetch response and throw ApiError on error
 */
export function unwrap<T>(result: {
	data?: T;
	error?: ErrorResponse;
	response: Response;
}): T {
	if (result.error) {
		throw new ApiError(result.error, result.response.status);
	}
	return result.data as T;
}

/**
 * API error - thrown when server responds with an error
 * Extends the schema's ErrorResponse with additional context
 */
export class ApiError extends Error implements ErrorResponse {
	/** The error name/type identifier */
	public readonly name: string;
	/** User-friendly error message safe for client display */
	public readonly message: string;
	/** The resource that the error relates to */
	public readonly resource?: string | null;
	/** Helpful suggestion for resolving the error */
	public readonly suggestion?: string | null;
	/** Validation error details for field-specific errors */
	public readonly validationErrors?: ErrorResponse["validationErrors"];
	/** HTTP status code */
	public readonly statusCode: number;

	constructor(response: ErrorResponse, statusCode: number) {
		super(response.message);
		this.name = response.name;
		this.message = response.message;
		this.resource = response.resource;
		this.suggestion = response.suggestion;
		this.validationErrors = response.validationErrors;
		this.statusCode = statusCode;

		// Maintains proper stack trace for where our error was thrown (only available on V8)
		if (Error.captureStackTrace) {
			Error.captureStackTrace(this, this.constructor);
		}
	}

	/**
	 * Check if error is a client error (4xx)
	 */
	isClientError(): boolean {
		return this.statusCode >= 400 && this.statusCode < 500;
	}

	/**
	 * Check if error is a server error (5xx)
	 */
	isServerError(): boolean {
		return this.statusCode >= 500;
	}

	/**
	 * Check if error is retryable based on HTTP status
	 */
	isRetryable(): boolean {
		return (
			this.statusCode >= 500 || // Server errors
			this.statusCode === 408 || // Request timeout
			this.statusCode === 429 // Rate limited
		);
	}

	/**
	 * Convert error to ErrorResponse
	 */
	toJSON(): ErrorResponse {
		return {
			name: this.name,
			message: this.message,
			resource: this.resource,
			suggestion: this.suggestion,
			validationErrors: this.validationErrors,
		};
	}
}

/**
 * Abstract base error class for SDK configuration errors
 */
export abstract class ClientError extends Error {
	public readonly name: string;

	constructor(message: string) {
		super(message);
		this.name = this.constructor.name;

		if (Error.captureStackTrace) {
			Error.captureStackTrace(this, this.constructor);
		}
	}
}

/**
 * Configuration error - thrown when client configuration is invalid
 */
export class ConfigError extends ClientError {
	/** Field that caused the error (for validation errors) */
	public readonly field?: string;
	/** Reason why the configuration is invalid */
	public readonly reason?: string;

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
	 * Create error for missing API key
	 */
	static missingApiKey(): ConfigError {
		return new ConfigError("API key is required", {
			field: "apiKey",
			reason: "API key must be provided in configuration",
		});
	}

	/**
	 * Create error for invalid configuration field
	 */
	static invalidField(field: string, reason: string): ConfigError {
		return new ConfigError(`Invalid configuration for ${field}: ${reason}`, {
			field,
			reason,
		});
	}

	/**
	 * Create error for missing required field
	 */
	static missingField(field: string): ConfigError {
		return new ConfigError(`Missing required configuration field: ${field}`, {
			field,
			reason: "This field is required",
		});
	}
}

/**
 * Network error - thrown when network requests fail
 */
export class NetworkError extends ClientError {
	/** Original error that caused this network error */
	public readonly cause?: Error;

	constructor(message: string, cause?: Error) {
		super(message);
		this.cause = cause;
	}

	/**
	 * Create error for network/connection issues
	 */
	static connection(message: string, cause?: Error): NetworkError {
		return new NetworkError(message, cause);
	}

	/**
	 * Create error for request timeout
	 */
	static timeout(timeoutMs: number): NetworkError {
		return new NetworkError(`Request timed out after ${timeoutMs}ms`);
	}

	/**
	 * Create error for aborted request
	 */
	static aborted(): NetworkError {
		return new NetworkError("Request was aborted");
	}

	/**
	 * Create error for DNS resolution failure
	 */
	static dnsResolution(hostname: string): NetworkError {
		return new NetworkError(`Failed to resolve hostname: ${hostname}`);
	}
}
