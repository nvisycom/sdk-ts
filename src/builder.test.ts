import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { ClientBuilder } from "./builder.js";
import { Client } from "./client.js";
import { ConfigError } from "./errors.js";

describe("ClientBuilder", () => {
	const validApiKey = "test-api-key-123456";

	// Environment variable backup for cleanup
	let originalEnv: Record<string, string | undefined>;

	beforeAll(() => {
		// Save original environment variables
		originalEnv = {
			NVISY_API_KEY: process.env.NVISY_API_KEY,
			NVISY_BASE_URL: process.env.NVISY_BASE_URL,
			NVISY_TIMEOUT: process.env.NVISY_TIMEOUT,
			NVISY_MAX_RETRIES: process.env.NVISY_MAX_RETRIES,
		};
	});

	afterAll(() => {
		// Restore original environment variables
		Object.entries(originalEnv).forEach(([key, value]) => {
			if (value !== undefined) {
				process.env[key] = value;
			} else {
				delete process.env[key];
			}
		});
	});

	describe("static factory methods", () => {
		it("should create builder with API key", () => {
			const builder = ClientBuilder.fromApiKey(validApiKey);
			expect(builder).toBeInstanceOf(ClientBuilder);
		});

		it("should validate API key in factory method", () => {
			expect(() => ClientBuilder.fromApiKey("short")).toThrow(ConfigError);
			expect(() => ClientBuilder.fromApiKey("invalid chars!")).toThrow(
				ConfigError,
			);
		});
	});

	describe("validation", () => {
		it("should validate configuration fields", () => {
			const builder = ClientBuilder.fromApiKey(validApiKey);

			// URL validation
			expect(() => builder.withBaseUrl("not-a-url")).toThrow(ConfigError);
			expect(() => builder.withBaseUrl("ftp://invalid-protocol.com")).toThrow(
				ConfigError,
			);

			// Range validations
			expect(() => builder.withTimeout(500)).toThrow(ConfigError);
			expect(() => builder.withTimeout(400_000)).toThrow(ConfigError);
			expect(() => builder.withMaxRetries(-1)).toThrow(ConfigError);
			expect(() => builder.withMaxRetries(15)).toThrow(ConfigError);

			// Header validation
			expect(() => builder.withHeaders({ "": "value" })).toThrow(ConfigError);
			expect(() =>
				builder.withHeaders({ authorization: "bearer token" }),
			).toThrow(ConfigError);
		});
	});

	describe("build", () => {
		it("should require API key to build", () => {
			const builder = new ClientBuilder();
			expect(() => builder.build()).toThrow(ConfigError);
		});

		it("should build client with valid configuration", () => {
			const client = ClientBuilder.fromApiKey(validApiKey)
				.withBaseUrl("https://custom.api.com")
				.withTimeout(15000)
				.build();

			expect(client).toBeInstanceOf(Client);
		});
	});

	describe("fluent interface", () => {
		it("should support method chaining", () => {
			const client = ClientBuilder.fromApiKey(validApiKey)
				.withBaseUrl("https://api.example.com")
				.withTimeout(20000)
				.withMaxRetries(5)
				.withHeaders({ "X-Custom": "test" })
				.withHeader("X-Another", "value")
				.withAdditionalHeaders({ "X-More": "data" })
				.build();

			expect(client).toBeInstanceOf(Client);
		});
	});

	describe("environment variable support", () => {
		it("should handle missing environment variable gracefully", () => {
			// Clear all relevant environment variables for this test
			delete process.env.NVISY_API_KEY;
			delete process.env.NVISY_BASE_URL;
			delete process.env.NVISY_TIMEOUT;
			delete process.env.NVISY_MAX_RETRIES;

			expect(() => {
				ClientBuilder.fromEnvironment();
			}).toThrow(ConfigError);
		});

		it("should create builder from environment variables", () => {
			// Set up test environment variables
			process.env.NVISY_API_KEY = "env-test-key-123456";
			process.env.NVISY_BASE_URL = "https://api.test.nvisy.com";
			process.env.NVISY_TIMEOUT = "15000";
			process.env.NVISY_MAX_RETRIES = "5";

			const client = ClientBuilder.fromEnvironment().build();
			const config = client.getConfig();

			expect(config.apiKey).toBe("env-test-key-123456");
			expect(config.baseUrl).toBe("https://api.test.nvisy.com");
			expect(config.timeout).toBe(15000);
			expect(config.maxRetries).toBe(5);
		});

		it("should support additional configuration after fromEnvironment", () => {
			// Set minimal environment
			process.env.NVISY_API_KEY = "env-key-123456";
			delete process.env.NVISY_BASE_URL;
			delete process.env.NVISY_TIMEOUT;

			const client = ClientBuilder.fromEnvironment()
				.withBaseUrl("https://override.example.com")
				.withTimeout(25000)
				.withHeaders({ "X-Custom": "test" })
				.build();

			const config = client.getConfig();
			expect(config.apiKey).toBe("env-key-123456");
			expect(config.baseUrl).toBe("https://override.example.com");
			expect(config.timeout).toBe(25000);
			expect(config.headers).toEqual({ "X-Custom": "test" });
		});
	});
});
