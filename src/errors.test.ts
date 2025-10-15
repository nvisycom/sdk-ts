import { describe, it, expect } from "vitest";
import { ClientError, ConfigError, NetworkError, ApiError } from "./errors.js";
import type { ErrorResponse } from "./errors.js";

describe("ClientError (Abstract Base)", () => {
	// Create concrete implementation for testing
	class TestClientError extends ClientError {}

	it("should create error with proper inheritance", () => {
		const error = new TestClientError("Test error");
		expect(error).toBeInstanceOf(Error);
		expect(error).toBeInstanceOf(ClientError);
		expect(error.name).toBe("TestClientError");
	});
});

describe("ConfigError", () => {
	it("should create factory errors with proper context", () => {
		const missingError = ConfigError.missingApiKey();
		expect(missingError.field).toBe("apiKey");
		expect(missingError.message).toContain("API key is required");

		const invalidError = ConfigError.invalidField(
			"baseUrl",
			"must be a valid URL",
		);
		expect(invalidError.field).toBe("baseUrl");
		expect(invalidError.reason).toBe("must be a valid URL");

		const missingFieldError = ConfigError.missingField("timeout");
		expect(missingFieldError.field).toBe("timeout");
		expect(missingFieldError.reason).toBe("This field is required");
	});
});

describe("NetworkError", () => {
	it("should create specific network errors with factory methods", () => {
		const timeoutError = NetworkError.timeout(5000);
		expect(timeoutError.message).toBe("Request timed out after 5000ms");

		const abortedError = NetworkError.aborted();
		expect(abortedError.message).toBe("Request was aborted");

		const dnsError = NetworkError.dnsResolution("api.example.com");
		expect(dnsError.message).toBe(
			"Failed to resolve hostname: api.example.com",
		);

		const connectionError = NetworkError.connection(
			"Network connection failed",
		);
		expect(connectionError.message).toBe("Network connection failed");
	});
});

describe("ApiError", () => {
	const mockErrorResponse: ErrorResponse = {
		code: "VALIDATION_ERROR",
		name: "ValidationError",
		message: "Field is required",
		details: { field: "email" },
	};

	it("should create rate limited error with proper retry information", () => {
		const withRetryAfter = ApiError.rateLimited(60, "req-789");
		expect(withRetryAfter.statusCode).toBe(429);
		expect(withRetryAfter.errorResponse?.code).toBe("RATE_LIMIT_EXCEEDED");
		expect(withRetryAfter.errorResponse?.details).toEqual({ retryAfter: 60 });

		const withoutRetryAfter = ApiError.rateLimited();
		expect(withoutRetryAfter.statusCode).toBe(429);
		expect(withoutRetryAfter.errorResponse?.details).toBeUndefined();
	});

	it("should classify HTTP errors correctly", () => {
		const clientError = new ApiError("Bad Request", 400);
		const serverError = new ApiError("Server Error", 500);
		const timeoutError = new ApiError("Timeout", 408);
		const rateLimitError = new ApiError("Rate Limited", 429);

		// Client vs Server classification
		expect(clientError.isClientError()).toBe(true);
		expect(clientError.isServerError()).toBe(false);
		expect(serverError.isClientError()).toBe(false);
		expect(serverError.isServerError()).toBe(true);

		// Retry logic
		expect(clientError.isRetryable()).toBe(false);
		expect(serverError.isRetryable()).toBe(true);
		expect(timeoutError.isRetryable()).toBe(true);
		expect(rateLimitError.isRetryable()).toBe(true);
	});

	it("should calculate retry delays with business logic", () => {
		const nonRetryable = new ApiError("Bad Request", 400);
		const rateLimited = ApiError.rateLimited(30);
		const serverError = new ApiError("Server Error", 500);

		expect(nonRetryable.getRetryDelay()).toBe(null);
		expect(rateLimited.getRetryDelay()).toBe(30000); // Rate limit specific delay
		expect(serverError.getRetryDelay()).toBe(1000); // Default server error delay
	});

	it("should create errors from HTTP responses", () => {
		const response = new Response(null, {
			status: 404,
			statusText: "Not Found",
		});
		const error = ApiError.fromResponse(response, mockErrorResponse, "req-123");

		expect(error.statusCode).toBe(404);
		expect(error.message).toBe("Field is required"); // From error response
		expect(error.requestId).toBe("req-123");
	});
});
