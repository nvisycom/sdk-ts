import { describe, expect, it } from "vitest";
import { ApiError, ConfigError, NetworkError } from "@/errors.js";

describe("ConfigError", () => {
	it("should create factory errors with proper context", () => {
		const missingError = ConfigError.missingApiToken();
		expect(missingError.field).toBe("apiToken");
		expect(missingError.message).toContain("API token is required");

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
		const connectionError = NetworkError.connection("Connection refused");
		expect(connectionError.message).toBe("Connection refused");

		const abortedError = NetworkError.aborted();
		expect(abortedError.message).toBe("Request was aborted");
	});
});

describe("ApiError", () => {
	it("should create ApiError from ErrorResponse", () => {
		const error = new ApiError(
			{
				name: "ValidationError",
				message: "Field is required",
				resource: "account",
				suggestion: "Please provide a valid email",
				validationErrors: [
					{ field: "email", code: "required", message: "Email is required" },
				],
			},
			400,
		);

		expect(error.name).toBe("ValidationError");
		expect(error.message).toBe("Field is required");
		expect(error.resource).toBe("account");
		expect(error.suggestion).toBe("Please provide a valid email");
		expect(error.validationErrors).toHaveLength(1);
		expect(error.statusCode).toBe(400);
	});

	it("should determine retry logic based on HTTP status", () => {
		const clientError = new ApiError(
			{ name: "BadRequest", message: "Bad Request" },
			400,
		);
		const serverError = new ApiError(
			{ name: "ServerError", message: "Server Error" },
			500,
		);
		const timeoutError = new ApiError(
			{ name: "Timeout", message: "Timeout" },
			408,
		);
		const rateLimitError = new ApiError(
			{ name: "RateLimit", message: "Rate Limited" },
			429,
		);

		expect(clientError.isRetryable()).toBe(false);
		expect(serverError.isRetryable()).toBe(true);
		expect(timeoutError.isRetryable()).toBe(true);
		expect(rateLimitError.isRetryable()).toBe(true);
	});

	it("should correctly identify client vs server errors", () => {
		const clientError = new ApiError(
			{ name: "NotFound", message: "Not Found" },
			404,
		);
		const serverError = new ApiError(
			{ name: "ServerError", message: "Internal Server Error" },
			500,
		);

		expect(clientError.isClientError()).toBe(true);
		expect(clientError.isServerError()).toBe(false);
		expect(serverError.isClientError()).toBe(false);
		expect(serverError.isServerError()).toBe(true);
	});

	it("should serialize to JSON matching ErrorResponse", () => {
		const error = new ApiError(
			{
				name: "ValidationError",
				message: "Invalid input",
				resource: "document",
				suggestion: "Check your input",
			},
			422,
		);

		const json = error.toJSON();
		expect(json.name).toBe("ValidationError");
		expect(json.message).toBe("Invalid input");
		expect(json.resource).toBe("document");
		expect(json.suggestion).toBe("Check your input");
	});
});
