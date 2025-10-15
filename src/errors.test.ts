import { describe, expect, it } from "vitest";
import type { ErrorResponse } from "./errors.js";
import { ApiError, ConfigError, NetworkError } from "./errors.js";

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
	it("should create network errors with appropriate messages", () => {
		const timeoutError = NetworkError.timeout(5000);
		expect(timeoutError.message).toBe("Request timed out after 5000ms");

		const dnsError = NetworkError.dnsResolution("api.example.com");
		expect(dnsError.message).toBe(
			"Failed to resolve hostname: api.example.com",
		);
	});
});

describe("ApiError", () => {
	it("should handle rate limiting with retry information", () => {
		const withRetryAfter = ApiError.rateLimited(60, "req-789");
		expect(withRetryAfter.statusCode).toBe(429);
		expect(withRetryAfter.errorResponse?.name).toBe("RateLimitError");
		expect(withRetryAfter.errorResponse?.context).toBe("retryAfter: 60");

		const withoutRetryAfter = ApiError.rateLimited();
		expect(withoutRetryAfter.statusCode).toBe(429);
		expect(withoutRetryAfter.errorResponse?.context).toBe("");
	});

	it("should determine retry logic based on HTTP status", () => {
		const clientError = new ApiError("Bad Request", 400);
		const serverError = new ApiError("Server Error", 500);
		const timeoutError = new ApiError("Timeout", 408);
		const rateLimitError = new ApiError("Rate Limited", 429);

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
		const mockErrorResponse: ErrorResponse = {
			name: "ValidationError",
			message: "Field is required",
			context: "field: email",
		};

		const response = new Response(null, {
			status: 404,
			statusText: "Not Found",
		});
		const error = ApiError.fromResponse(response, mockErrorResponse, "req-123");

		expect(error.statusCode).toBe(404);
		expect(error.message).toBe("Field is required");
		expect(error.requestId).toBe("req-123");
	});
});
