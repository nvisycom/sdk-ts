import { describe, expect, it } from "vitest";
import { NvisyApiError, NvisyError } from "@/errors.js";

describe("NvisyError", () => {
	it("should create error with message", () => {
		const error = new NvisyError("Something went wrong");
		expect(error.message).toBe("Something went wrong");
		expect(error.name).toBe("NvisyError");
		expect(error).toBeInstanceOf(Error);
	});
});

describe("NvisyApiError", () => {
	it("should create NvisyApiError from ErrorResponse", () => {
		const error = new NvisyApiError(
			{
				name: "ValidationError",
				message: "Field is required",
				resource: "account",
				suggestion: "Please provide a valid email",
				validation: [
					{ field: "email", code: "required", message: "Email is required" },
				],
			},
			400,
		);

		expect(error.name).toBe("ValidationError");
		expect(error.message).toBe("Field is required");
		expect(error.resource).toBe("account");
		expect(error.suggestion).toBe("Please provide a valid email");
		expect(error.validation).toHaveLength(1);
		expect(error.statusCode).toBe(400);
		expect(error).toBeInstanceOf(NvisyError);
	});

	it("should determine retry logic based on HTTP status", () => {
		const clientError = new NvisyApiError(
			{ name: "BadRequest", message: "Bad Request" },
			400,
		);
		const serverError = new NvisyApiError(
			{ name: "ServerError", message: "Server Error" },
			500,
		);
		const timeoutError = new NvisyApiError(
			{ name: "Timeout", message: "Timeout" },
			408,
		);
		const rateLimitError = new NvisyApiError(
			{ name: "RateLimit", message: "Rate Limited" },
			429,
		);

		expect(clientError.isRetryable()).toBe(false);
		expect(serverError.isRetryable()).toBe(true);
		expect(timeoutError.isRetryable()).toBe(true);
		expect(rateLimitError.isRetryable()).toBe(true);
	});

	it("should correctly identify client vs server errors", () => {
		const clientError = new NvisyApiError(
			{ name: "NotFound", message: "Not Found" },
			404,
		);
		const serverError = new NvisyApiError(
			{ name: "ServerError", message: "Internal Server Error" },
			500,
		);

		expect(clientError.isClientError()).toBe(true);
		expect(clientError.isServerError()).toBe(false);
		expect(serverError.isClientError()).toBe(false);
		expect(serverError.isServerError()).toBe(true);
	});

	it("should serialize to JSON matching ErrorResponse", () => {
		const error = new NvisyApiError(
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
