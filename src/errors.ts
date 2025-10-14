/**
 * Abstract base error class for all Nvisy SDK errors
 */
export abstract class NvisyError extends Error {
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
	toJSON() {
		return {
			name: this.name,
			message: this.message,
			stack: this.stack,
		};
	}
}

/**
 * Client-side error - thrown when client configuration or setup is invalid
 */
export class NvisyClientError extends NvisyError {
	/** Field that caused the error (for validation errors) */
	public readonly field?: string;
	/** Additional context about what's wrong */
	public readonly context?: string;

	constructor(message: string, options?: { field?: string; context?: string }) {
		super(message);
		this.field = options?.field;
		this.context = options?.context;
	}

	/**
	 * Create error for missing API key
	 */
	static missingApiKey(): NvisyClientError {
		return new NvisyClientError("API key is required", {
			field: "apiKey",
			context: "API key must be provided in configuration",
		});
	}

	/**
	 * Create error for invalid configuration field
	 */
	static invalidConfig(field: string, reason: string): NvisyClientError {
		return new NvisyClientError(
			`Invalid configuration for ${field}: ${reason}`,
			{
				field,
				context: reason,
			},
		);
	}

	/**
	 * Convert error to JSON representation
	 */
	toJSON() {
		return {
			...super.toJSON(),
			field: this.field,
			context: this.context,
		};
	}
}

/**
 * Request error - thrown when request cannot be made or fails
 */
export class NvisyRequestError extends NvisyError {
	/** Original error that caused this request error */
	public readonly cause?: Error;

	constructor(message: string, cause?: Error) {
		super(message);
		this.cause = cause;
	}

	/**
	 * Create error for network/connection issues
	 */
	static network(message: string, cause?: Error): NvisyRequestError {
		return new NvisyRequestError(message, cause);
	}

	/**
	 * Create error for request timeout
	 */
	static timeout(timeout: number): NvisyRequestError {
		return new NvisyRequestError(`Request timed out after ${timeout}ms`);
	}

	/**
	 * Create error for aborted request
	 */
	static aborted(): NvisyRequestError {
		return new NvisyRequestError("Request was aborted");
	}

	/**
	 * Convert error to JSON representation
	 */
	toJSON() {
		return {
			...super.toJSON(),
			cause: this.cause?.message,
		};
	}
}

/**
 * Response error - thrown when server responds with an error
 */
export class NvisyResponseError extends NvisyError {
	/** Error name from server response */
	public readonly errName?: string;
	/** Error message from server response */
	public readonly errMessage?: string;
	/** HTTP status code */
	public readonly statusCode?: number;
	/** Request ID for debugging */
	public readonly requestId?: string;
	/** Original HTTP response */
	public readonly response?: Response;

	constructor(
		message: string,
		options?: {
			errName?: string;
			errMessage?: string;
			statusCode?: number;
			requestId?: string;
			response?: Response;
		},
	) {
		super(message);
		this.errName = options?.errName;
		this.errMessage = options?.errMessage;
		this.statusCode = options?.statusCode;
		this.requestId = options?.requestId;
		this.response = options?.response;
	}

	/**
	 * Create error from HTTP response
	 */
	static fromResponse(
		response: Response,
		message?: string,
		requestId?: string,
		serverError?: { name?: string; message?: string },
	): NvisyResponseError {
		const errorMessage =
			message || `HTTP ${response.status}: ${response.statusText}`;

		return new NvisyResponseError(errorMessage, {
			errName: serverError?.name,
			errMessage: serverError?.message,
			statusCode: response.status,
			requestId,
			response,
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
	 * Convert error to JSON representation
	 */
	toJSON() {
		return {
			...super.toJSON(),
			errName: this.errName,
			errMessage: this.errMessage,
			statusCode: this.statusCode,
			requestId: this.requestId,
		};
	}
}

/**
 * Utility functions
 */

/**
 * Check if an error is a Nvisy SDK error
 */
export function isNvisyError(error: unknown): error is NvisyError {
	return error instanceof NvisyError;
}

/**
 * Extract error message from unknown error
 */
export function getErrorMessage(error: unknown): string {
	if (error instanceof Error) {
		return error.message;
	}
	if (typeof error === "string") {
		return error;
	}
	return "An unknown error occurred";
}

/**
 * Create a NvisyError from an unknown error
 */
export function createNvisyError(error: unknown, message?: string): NvisyError {
	if (error instanceof NvisyError) {
		return error;
	}

	const errorMessage = message || getErrorMessage(error);
	const cause = error instanceof Error ? error : undefined;

	return new NvisyRequestError(errorMessage, cause);
}
