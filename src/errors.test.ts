import { describe, it, expect } from "vitest";
import {
	NvisyError,
	NvisyClientError,
	NvisyRequestError,
	NvisyResponseError,
	isNvisyError,
	getErrorMessage,
	createNvisyError,
} from "./errors.js";

describe("NvisyError (Abstract Base)", () => {
	// Create concrete implementation for testing
	class TestNvisyError extends NvisyError {
		constructor(message: string) {
			super(message);
		}
	}

	it("should create error with message", () => {
		const error = new TestNvisyError("Test error");

		expect(error.message).toBe("Test error");
		expect(error.name).toBe("TestNvisyError");
		expect(error).toBeInstanceOf(Error);
		expect(error).toBeInstanceOf(NvisyError);
	});

	it("should convert to JSON", () => {
		const error = new TestNvisyError("Test error");
		const json = error.toJSON();

		expect(json).toEqual({
			name: "TestNvisyError",
			message: "Test error",
			stack: expect.any(String),
		});
	});
});

describe("NvisyClientError", () => {
	it("should create client error with message only", () => {
		const error = new NvisyClientError("Client error");

		expect(error.message).toBe("Client error");
		expect(error.name).toBe("NvisyClientError");
		expect(error.field).toBeUndefined();
		expect(error.context).toBeUndefined();
		expect(error).toBeInstanceOf(NvisyError);
		expect(error).toBeInstanceOf(NvisyClientError);
	});

	it("should create client error with field and context", () => {
		const error = new NvisyClientError("Invalid timeout", {
			field: "timeout",
			context: "must be a positive number",
		});

		expect(error.message).toBe("Invalid timeout");
		expect(error.field).toBe("timeout");
		expect(error.context).toBe("must be a positive number");
	});

	it("should create missing API key error", () => {
		const error = NvisyClientError.missingApiKey();

		expect(error.message).toBe("API key is required");
		expect(error.field).toBe("apiKey");
		expect(error.context).toBe("API key must be provided in configuration");
		expect(error).toBeInstanceOf(NvisyClientError);
	});

	it("should create invalid config error", () => {
		const error = NvisyClientError.invalidConfig(
			"baseUrl",
			"must be a valid URL",
		);

		expect(error.message).toBe(
			"Invalid configuration for baseUrl: must be a valid URL",
		);
		expect(error.field).toBe("baseUrl");
		expect(error.context).toBe("must be a valid URL");
		expect(error).toBeInstanceOf(NvisyClientError);
	});

	it("should convert to JSON with field and context", () => {
		const error = new NvisyClientError("Test error", {
			field: "testField",
			context: "test context",
		});

		const json = error.toJSON();

		expect(json).toEqual({
			name: "NvisyClientError",
			message: "Test error",
			stack: expect.any(String),
			field: "testField",
			context: "test context",
		});
	});

	it("should convert to JSON without field and context", () => {
		const error = new NvisyClientError("Test error");
		const json = error.toJSON();

		expect(json).toEqual({
			name: "NvisyClientError",
			message: "Test error",
			stack: expect.any(String),
			field: undefined,
			context: undefined,
		});
	});
});

describe("NvisyRequestError", () => {
	it("should create request error with message only", () => {
		const error = new NvisyRequestError("Request failed");

		expect(error.message).toBe("Request failed");
		expect(error.name).toBe("NvisyRequestError");
		expect(error.cause).toBeUndefined();
		expect(error).toBeInstanceOf(NvisyError);
		expect(error).toBeInstanceOf(NvisyRequestError);
	});

	it("should create request error with cause", () => {
		const originalError = new Error("Connection failed");
		const error = new NvisyRequestError("Request failed", originalError);

		expect(error.message).toBe("Request failed");
		expect(error.cause).toBe(originalError);
	});

	it("should create network error", () => {
		const cause = new Error("Connection refused");
		const error = NvisyRequestError.network("Network connection failed", cause);

		expect(error.message).toBe("Network connection failed");
		expect(error.cause).toBe(cause);
		expect(error).toBeInstanceOf(NvisyRequestError);
	});

	it("should create network error without cause", () => {
		const error = NvisyRequestError.network("Network connection failed");

		expect(error.message).toBe("Network connection failed");
		expect(error.cause).toBeUndefined();
	});

	it("should create timeout error", () => {
		const error = NvisyRequestError.timeout(5000);

		expect(error.message).toBe("Request timed out after 5000ms");
		expect(error.cause).toBeUndefined();
		expect(error).toBeInstanceOf(NvisyRequestError);
	});

	it("should create aborted error", () => {
		const error = NvisyRequestError.aborted();

		expect(error.message).toBe("Request was aborted");
		expect(error.cause).toBeUndefined();
		expect(error).toBeInstanceOf(NvisyRequestError);
	});

	it("should convert to JSON with cause", () => {
		const cause = new Error("Original error");
		const error = new NvisyRequestError("Request failed", cause);
		const json = error.toJSON();

		expect(json).toEqual({
			name: "NvisyRequestError",
			message: "Request failed",
			stack: expect.any(String),
			cause: "Original error",
		});
	});

	it("should convert to JSON without cause", () => {
		const error = new NvisyRequestError("Request failed");
		const json = error.toJSON();

		expect(json).toEqual({
			name: "NvisyRequestError",
			message: "Request failed",
			stack: expect.any(String),
			cause: undefined,
		});
	});
});

describe("NvisyResponseError", () => {
	it("should create response error with message only", () => {
		const error = new NvisyResponseError("Response error");

		expect(error.message).toBe("Response error");
		expect(error.name).toBe("NvisyResponseError");
		expect(error.errName).toBeUndefined();
		expect(error.errMessage).toBeUndefined();
		expect(error.statusCode).toBeUndefined();
		expect(error.requestId).toBeUndefined();
		expect(error.response).toBeUndefined();
		expect(error).toBeInstanceOf(NvisyError);
		expect(error).toBeInstanceOf(NvisyResponseError);
	});

	it("should create response error with all options", () => {
		const response = new Response(null, { status: 400 });
		const error = new NvisyResponseError("Bad Request", {
			errName: "ValidationError",
			errMessage: "Field is required",
			statusCode: 400,
			requestId: "req-123",
			response,
		});

		expect(error.message).toBe("Bad Request");
		expect(error.errName).toBe("ValidationError");
		expect(error.errMessage).toBe("Field is required");
		expect(error.statusCode).toBe(400);
		expect(error.requestId).toBe("req-123");
		expect(error.response).toBe(response);
	});

	it("should create error from response with default message", () => {
		const response = new Response(null, {
			status: 404,
			statusText: "Not Found",
		});

		const error = NvisyResponseError.fromResponse(response);

		expect(error.message).toBe("HTTP 404: Not Found");
		expect(error.statusCode).toBe(404);
		expect(error.response).toBe(response);
		expect(error.errName).toBeUndefined();
		expect(error.errMessage).toBeUndefined();
	});

	it("should create error from response with custom message and server error", () => {
		const response = new Response(null, {
			status: 500,
			statusText: "Internal Server Error",
		});

		const error = NvisyResponseError.fromResponse(
			response,
			"Custom error message",
			"req-456",
			{
				name: "DatabaseError",
				message: "Connection failed",
			},
		);

		expect(error.message).toBe("Custom error message");
		expect(error.statusCode).toBe(500);
		expect(error.requestId).toBe("req-456");
		expect(error.errName).toBe("DatabaseError");
		expect(error.errMessage).toBe("Connection failed");
		expect(error.response).toBe(response);
	});

	it("should identify client errors correctly", () => {
		const clientError400 = new NvisyResponseError("Bad Request", {
			statusCode: 400,
		});
		const clientError404 = new NvisyResponseError("Not Found", {
			statusCode: 404,
		});
		const clientError499 = new NvisyResponseError("Client Error", {
			statusCode: 499,
		});
		const serverError500 = new NvisyResponseError("Server Error", {
			statusCode: 500,
		});
		const noStatusError = new NvisyResponseError("No status");

		expect(clientError400.isClientError()).toBe(true);
		expect(clientError404.isClientError()).toBe(true);
		expect(clientError499.isClientError()).toBe(true);
		expect(serverError500.isClientError()).toBe(false);
		expect(noStatusError.isClientError()).toBe(false);
	});

	it("should identify server errors correctly", () => {
		const clientError400 = new NvisyResponseError("Bad Request", {
			statusCode: 400,
		});
		const serverError500 = new NvisyResponseError("Server Error", {
			statusCode: 500,
		});
		const serverError599 = new NvisyResponseError("Server Error", {
			statusCode: 599,
		});
		const noStatusError = new NvisyResponseError("No status");

		expect(clientError400.isServerError()).toBe(false);
		expect(serverError500.isServerError()).toBe(true);
		expect(serverError599.isServerError()).toBe(true);
		expect(noStatusError.isServerError()).toBe(false);
	});

	it("should identify retryable errors correctly", () => {
		const badRequest = new NvisyResponseError("Bad Request", {
			statusCode: 400,
		});
		const unauthorized = new NvisyResponseError("Unauthorized", {
			statusCode: 401,
		});
		const timeout = new NvisyResponseError("Timeout", { statusCode: 408 });
		const rateLimited = new NvisyResponseError("Rate Limited", {
			statusCode: 429,
		});
		const serverError = new NvisyResponseError("Server Error", {
			statusCode: 500,
		});
		const badGateway = new NvisyResponseError("Bad Gateway", {
			statusCode: 502,
		});
		const noStatusError = new NvisyResponseError("No status");

		expect(badRequest.isRetryable()).toBe(false);
		expect(unauthorized.isRetryable()).toBe(false);
		expect(timeout.isRetryable()).toBe(true);
		expect(rateLimited.isRetryable()).toBe(true);
		expect(serverError.isRetryable()).toBe(true);
		expect(badGateway.isRetryable()).toBe(true);
		expect(noStatusError.isRetryable()).toBe(false);
	});

	it("should convert to JSON with all fields", () => {
		const error = new NvisyResponseError("Server Error", {
			errName: "DatabaseError",
			errMessage: "Connection timeout",
			statusCode: 500,
			requestId: "req-789",
		});

		const json = error.toJSON();

		expect(json).toEqual({
			name: "NvisyResponseError",
			message: "Server Error",
			stack: expect.any(String),
			errName: "DatabaseError",
			errMessage: "Connection timeout",
			statusCode: 500,
			requestId: "req-789",
		});
	});
});

describe("Utility functions", () => {
	describe("isNvisyError", () => {
		it("should identify Nvisy errors correctly", () => {
			const clientError = new NvisyClientError("Client error");
			const requestError = new NvisyRequestError("Request error");
			const responseError = new NvisyResponseError("Response error");
			const regularError = new Error("Regular");
			const string = "Not an error";
			const number = 123;

			expect(isNvisyError(clientError)).toBe(true);
			expect(isNvisyError(requestError)).toBe(true);
			expect(isNvisyError(responseError)).toBe(true);
			expect(isNvisyError(regularError)).toBe(false);
			expect(isNvisyError(string)).toBe(false);
			expect(isNvisyError(number)).toBe(false);
		});
	});

	describe("getErrorMessage", () => {
		it("should extract message from Error objects", () => {
			const error = new Error("Test error message");
			expect(getErrorMessage(error)).toBe("Test error message");
		});

		it("should extract message from NvisyError objects", () => {
			const error = new NvisyClientError("Nvisy error message");
			expect(getErrorMessage(error)).toBe("Nvisy error message");
		});

		it("should return string as-is", () => {
			expect(getErrorMessage("String error")).toBe("String error");
		});

		it("should return default message for unknown types", () => {
			expect(getErrorMessage(123)).toBe("An unknown error occurred");
			expect(getErrorMessage(null)).toBe("An unknown error occurred");
			expect(getErrorMessage(undefined)).toBe("An unknown error occurred");
			expect(getErrorMessage({})).toBe("An unknown error occurred");
			expect(getErrorMessage([])).toBe("An unknown error occurred");
		});
	});

	describe("createNvisyError", () => {
		it("should return NvisyError subclass as-is", () => {
			const error = new NvisyClientError("Original");
			const result = createNvisyError(error);

			expect(result).toBe(error);
		});

		it("should wrap Error in NvisyRequestError", () => {
			const originalError = new Error("Original error");
			const result = createNvisyError(originalError);

			expect(result).toBeInstanceOf(NvisyRequestError);
			expect(result.message).toBe("Original error");
			expect((result as NvisyRequestError).cause).toBe(originalError);
		});

		it("should create NvisyRequestError with custom message", () => {
			const originalError = new Error("Original error");
			const result = createNvisyError(originalError, "Custom message");

			expect(result).toBeInstanceOf(NvisyRequestError);
			expect(result.message).toBe("Custom message");
			expect((result as NvisyRequestError).cause).toBe(originalError);
		});

		it("should handle non-Error values", () => {
			const result = createNvisyError("String error");

			expect(result).toBeInstanceOf(NvisyRequestError);
			expect(result.message).toBe("String error");
			expect((result as NvisyRequestError).cause).toBeUndefined();
		});

		it("should handle non-Error values with custom message", () => {
			const result = createNvisyError(123, "Custom message");

			expect(result).toBeInstanceOf(NvisyRequestError);
			expect(result.message).toBe("Custom message");
			expect((result as NvisyRequestError).cause).toBeUndefined();
		});
	});
});
