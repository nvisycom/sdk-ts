/**
 * Base error class for all Nvisy SDK errors
 */
export class NvisyError extends Error {
  public readonly name: string;
  public readonly statusCode?: number;
  public readonly requestId?: string;

  constructor(message: string, statusCode?: number, requestId?: string) {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCode;
    this.requestId = requestId;

    // Maintains proper stack trace for where our error was thrown (only available on V8)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

/**
 * Authentication error - thrown when API key is invalid or missing
 */
export class AuthenticationError extends NvisyError {
  constructor(message = "Invalid or missing API key", requestId?: string) {
    super(message, 401, requestId);
  }
}

/**
 * Authorization error - thrown when user lacks permission for requested resource
 */
export class AuthorizationError extends NvisyError {
  constructor(message = "Insufficient permissions", requestId?: string) {
    super(message, 403, requestId);
  }
}

/**
 * Validation error - thrown when request parameters are invalid
 */
export class ValidationError extends NvisyError {
  constructor(message = "Invalid request parameters", requestId?: string) {
    super(message, 400, requestId);
  }
}

/**
 * Not found error - thrown when requested resource doesn't exist
 */
export class NotFoundError extends NvisyError {
  constructor(message = "Resource not found", requestId?: string) {
    super(message, 404, requestId);
  }
}

/**
 * Rate limit error - thrown when API rate limits are exceeded
 */
export class RateLimitError extends NvisyError {
  constructor(message = "Rate limit exceeded", requestId?: string) {
    super(message, 429, requestId);
  }
}

/**
 * Server error - thrown when server returns 5xx status codes
 */
export class ServerError extends NvisyError {
  constructor(message = "Internal server error", statusCode = 500, requestId?: string) {
    super(message, statusCode, requestId);
  }
}

/**
 * Network error - thrown when network/connection issues occur
 */
export class NetworkError extends NvisyError {
  public readonly code?: string;

  constructor(message = "Network error occurred", code?: string) {
    super(message);
    this.code = code;
  }
}

/**
 * Timeout error - thrown when request times out
 */
export class TimeoutError extends NvisyError {
  public readonly timeout: number;

  constructor(timeout: number, message = `Request timed out after ${timeout}ms`) {
    super(message);
    this.timeout = timeout;
  }
}

/**
 * Factory function to create appropriate error from HTTP response
 */
export function createErrorFromResponse(status: number, data: any, requestId?: string): NvisyError {
  const message = data?.message || data?.error || "An error occurred";

  switch (status) {
    case 400:
      return new ValidationError(message, requestId);
    case 401:
      return new AuthenticationError(message, requestId);
    case 403:
      return new AuthorizationError(message, requestId);
    case 404:
      return new NotFoundError(message, requestId);
    case 429:
      return new RateLimitError(message, requestId);
    default:
      if (status >= 500) {
        return new ServerError(message, status, requestId);
      }
      return new NvisyError(message, status, requestId);
  }
}
