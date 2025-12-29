import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { ClientBuilder } from "@/builder.js";
import { Client } from "@/client.js";
import { ConfigError } from "@/errors.js";

describe("ClientBuilder", () => {
	const validApiKey = "test-api-key-123456";

	// Environment variable backup for cleanup
	let originalEnv: Record<string, string | undefined>;

	beforeAll(() => {
		// Save original environment variables
		originalEnv = {
			NVISY_API_TOKEN: process.env.NVISY_API_TOKEN,
			NVISY_BASE_URL: process.env.NVISY_BASE_URL,
			NVISY_USER_AGENT: process.env.NVISY_USER_AGENT,
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

		it("should create builder from config object", () => {
			const config = {
				apiKey: validApiKey,
				baseUrl: "https://api.example.com",
				headers: { "X-Test": "header" },
			};
			const builder = ClientBuilder.fromConfig(config);
			expect(builder).toBeInstanceOf(ClientBuilder);

			const clientConfig = builder.getConfig();
			expect(clientConfig.apiKey).toBe(validApiKey);
			expect(clientConfig.baseUrl).toBe("https://api.example.com");
			expect(clientConfig.headers).toEqual({ "X-Test": "header" });
		});

		it("should create builder from config object with userAgent", () => {
			const config = {
				apiKey: validApiKey,
				userAgent: "TestApp/1.0.0",
			};
			const builder = ClientBuilder.fromConfig(config);
			expect(builder).toBeInstanceOf(ClientBuilder);

			const clientConfig = builder.getConfig();
			expect(clientConfig.userAgent).toBe("TestApp/1.0.0");
		});

		it("should validate API key in fromConfig method", () => {
			expect(() => ClientBuilder.fromConfig({ apiKey: "short" })).toThrow(
				ConfigError,
			);
			expect(() =>
				ClientBuilder.fromConfig({ apiKey: "invalid chars!" }),
			).toThrow(ConfigError);
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
				.build();

			expect(client).toBeInstanceOf(Client);
		});
	});

	describe("fluent interface", () => {
		it("should support method chaining", () => {
			const client = ClientBuilder.fromApiKey(validApiKey)
				.withBaseUrl("https://api.example.com")
				.withHeaders({ "X-Custom": "test" })
				.withHeader("X-Another", "value")
				.withHeaders({ "X-More": "data" })
				.build();

			expect(client).toBeInstanceOf(Client);
		});

		it("should support withUserAgent method", () => {
			const builder =
				ClientBuilder.fromApiKey(validApiKey).withUserAgent(
					"MyCustomApp/2.0.0",
				);

			const config = builder.getConfig();
			expect(config.userAgent).toBe("MyCustomApp/2.0.0");
		});

		it("should validate userAgent string", () => {
			const builder = ClientBuilder.fromApiKey(validApiKey);

			expect(() => builder.withUserAgent("")).toThrow(ConfigError);
			expect(() => builder.withUserAgent("   ")).toThrow(ConfigError);
		});
	});

	describe("environment variable support", () => {
		it("should handle missing environment variable gracefully", () => {
			// Clear all relevant environment variables for this test
			delete process.env.NVISY_API_TOKEN;
			delete process.env.NVISY_BASE_URL;
			delete process.env.NVISY_USER_AGENT;

			expect(() => {
				ClientBuilder.fromEnvironment();
			}).toThrow(ConfigError);
		});

		it("should create builder from environment variables", () => {
			// Set up test environment variables
			process.env.NVISY_API_TOKEN = "env-test-key-123456";
			process.env.NVISY_BASE_URL = "https://api.test.nvisy.com";
			process.env.NVISY_USER_AGENT = "EnvApp/1.0.0";

			const client = ClientBuilder.fromEnvironment().build();
			const config = client.getConfig();

			expect(config.apiKey).toBe("env-test-key-123456");
			expect(config.baseUrl).toBe("https://api.test.nvisy.com");
			expect(config.userAgent).toBe("EnvApp/1.0.0");
		});

		it("should support additional configuration after fromEnvironment", () => {
			// Set minimal environment
			process.env.NVISY_API_TOKEN = "env-key-123456";
			delete process.env.NVISY_BASE_URL;
			delete process.env.NVISY_USER_AGENT;

			const client = ClientBuilder.fromEnvironment()
				.withBaseUrl("https://override.example.com")
				.withHeaders({ "X-Custom": "test" })
				.build();

			const config = client.getConfig();
			expect(config.apiKey).toBe("env-key-123456");
			expect(config.baseUrl).toBe("https://override.example.com");
			expect(config.headers).toEqual({ "X-Custom": "test" });
		});
	});
});
