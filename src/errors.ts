/**
 * Error response structure from server
 */
export interface ErrorResponse {
	/** Error type/name */
	name: string;
	/** Human-readable error message */
	message: string;
	/** Additional error context */
	context: string;
}

/**
 * Abstract base error class for all Nvisy SDK errors
 */
export abstract class ClientError extends Error {
	public readonly name: string;

	constructor(message: string) {
		super(message);
		this.name = this.constructor.name;

		// Maintains proper stack trace for where our error was thrown (only available on V8)
		if (Error.captureStackTrace) {
			Error.captureStackTrace(this, this.constructor);
		}
	}

	/**
	 * Convert error to JSON representation
	 */
	toJSON(): ErrorResponse {
		return {
			name: this.name,
			message: this.message,
			context: "",
		};
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

	/**
	 * Convert error to JSON representation
	 */
	toJSON(): ErrorResponse {
		return {
			name: this.name,
			message: this.message,
			context:
				this.field || this.reason
					? `field: ${this.field}, reason: ${this.reason}`
					: "",
		};
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

	/**
	 * Convert error to JSON representation
	 */
	toJSON(): ErrorResponse {
		return {
			name: this.name,
			message: this.message,
			context: this.cause ? `cause: ${this.cause.message}` : "",
		};
	}
}

/**
 * API error - thrown when server responds with an error
 */
export class ApiError extends ClientError {
	/** Error response from server */
	public readonly errorResponse?: ErrorResponse;
	/** HTTP status code */
	public readonly statusCode: number;
	/** Request ID for debugging */
	public readonly requestId?: string;

	constructor(
		message: string,
		statusCode: number,
		options?: {
			errorResponse?: ErrorResponse;
			requestId?: string;
		},
	) {
		super(message);
		this.statusCode = statusCode;
		this.errorResponse = options?.errorResponse;
		this.requestId = options?.requestId;
	}

	/**
	 * Create error from HTTP response
	 */
	static fromResponse(
		response: Response,
		errorData?: ErrorResponse,
		requestId?: string,
	): ApiError {
		const message =
			errorData?.message || `HTTP ${response.status}: ${response.statusText}`;

		return new ApiError(message, response.status, {
			errorResponse: errorData,
			requestId,
		});
	}

	/**
	 * Create error for rate limiting
	 */
	static rateLimited(retryAfter?: number, requestId?: string): ApiError {
		const message = retryAfter
			? `Rate limited. Retry after ${retryAfter} seconds`
			: "Rate limited";

		return new ApiError(message, 429, {
			requestId,
			errorResponse: {
				name: "RateLimitError",
				message,
				context: retryAfter ? `retryAfter: ${retryAfter}` : "",
			},
		});
	}

	/**
	 * Check if error is a client error (4xx)
	 */
	isClientError(): boolean {
		return this.statusCode
			? this.statusCode >= 400 && this.statusCode < 500
			: false;
	}

	/**
	 * Check if error is a server error (5xx)
	 */
	isServerError(): boolean {
		return this.statusCode ? this.statusCode >= 500 : false;
	}

	/**
	 * Check if error is retryable based on HTTP status
	 */
	isRetryable(): boolean {
		if (!this.statusCode) return false;

		// Retry on server errors and specific client errors
		return (
			this.statusCode >= 500 || // Server errors
			this.statusCode === 408 || // Request timeout
			this.statusCode === 429 // Rate limited
		);
	}

	/**
	 * Get retry delay in milliseconds (returns null if not retryable)
	 */
	getRetryDelay(): number | null {
		if (!this.isRetryable()) return null;

		// For rate limiting, check if we have retry-after info
		if (this.statusCode === 429 && this.errorResponse?.context) {
			const match = this.errorResponse.context.match(/retryAfter: (\d+)/);
			if (match) {
				const retryAfter = parseInt(match[1], 10);
				return retryAfter * 1000; // Convert seconds to milliseconds
			}
		}

		// Default delays based on error type
		if (this.statusCode >= 500) {
			return 1000; // 1 second for server errors
		}

		return 1000; // Default 1 second
	}

	/**
	 * Convert error to JSON representation
	 */
	toJSON(): ErrorResponse {
		return {
			name: this.name,
			message: this.message,
			context: `statusCode: ${this.statusCode}${this.requestId ? `, requestId: ${this.requestId}` : ""}${this.errorResponse ? `, errorResponse: ${JSON.stringify(this.errorResponse)}` : ""}`,
		};
	}
}
