import { describe, it, expect, vi } from "vitest";
import { Client } from "./client.js";
import { ClientBuilder } from "./builder.js";
import { ConfigError } from "./errors.js";
import type { ClientConfig } from "./config.js";

// Mock openapi-fetch
vi.mock("openapi-fetch", () => ({
	default: vi.fn(() => ({
		GET: vi.fn(),
		POST: vi.fn(),
		PUT: vi.fn(),
		DELETE: vi.fn(),
		PATCH: vi.fn(),
	})),
}));

describe("Client", () => {
	const validConfig: ClientConfig = {
		apiKey: "test-api-key-123",
	};

	describe("constructor", () => {
		it("should create client with valid config", () => {
			const client = new Client(validConfig);
			expect(client).toBeInstanceOf(Client);
		});

		it("should throw ConfigError when API key is missing", () => {
			expect(() => {
				new Client({} as ClientConfig);
			}).toThrow(ConfigError);

			expect(() => {
				new Client({ apiKey: "" });
			}).toThrow(ConfigError);
		});

		it("should throw ConfigError for invalid API key", () => {
			expect(() => {
				new Client({ apiKey: "short" }); // Too short
			}).toThrow(ConfigError);

			expect(() => {
				new Client({ apiKey: "invalid characters!" }); // Invalid chars
			}).toThrow(ConfigError);
		});

		it("should merge config with defaults", () => {
			const client = new Client(validConfig);
			const config = client.getConfig();

			expect(config.apiKey).toBe("test-api-key-123");
			expect(config.baseUrl).toBe("https://api.nvisy.com");
			expect(config.timeout).toBe(30000);
			expect(config.maxRetries).toBe(3);
			expect(config.headers).toEqual({});
		});

		it("should validate base URL format", () => {
			expect(() => {
				new Client({
					apiKey: "valid-key-123",
					baseUrl: "not-a-url",
				});
			}).toThrow(ConfigError);

			expect(() => {
				new Client({
					apiKey: "valid-key-123",
					baseUrl: "ftp://invalid-protocol.com",
				});
			}).toThrow(ConfigError);
		});

		it("should validate timeout range", () => {
			expect(() => {
				new Client({
					apiKey: "valid-key-123",
					timeout: 500, // Too low
				});
			}).toThrow(ConfigError);

			expect(() => {
				new Client({
					apiKey: "valid-key-123",
					timeout: 400_000, // Too high
				});
			}).toThrow(ConfigError);
		});

		it("should validate max retries range", () => {
			expect(() => {
				new Client({
					apiKey: "valid-key-123",
					maxRetries: -1, // Negative
				});
			}).toThrow(ConfigError);

			expect(() => {
				new Client({
					apiKey: "valid-key-123",
					maxRetries: 15, // Too high
				});
			}).toThrow(ConfigError);
		});

		it("should validate headers", () => {
			expect(() => {
				new Client({
					apiKey: "valid-key-123",
					headers: { "": "value" }, // Empty header name
				});
			}).toThrow(ConfigError);

			expect(() => {
				new Client({
					apiKey: "valid-key-123",
					headers: { authorization: "bearer token" }, // Reserved header
				});
			}).toThrow(ConfigError);
		});
	});

	describe("static factory methods", () => {
		it("should create builder instance", () => {
			const builder = Client.builder();
			expect(builder).toBeInstanceOf(ClientBuilder);
		});
	});

	describe("integration with ClientBuilder", () => {
		it("should work with builder pattern", () => {
			const client = Client.builder()
				.withApiKey("builder-test-key-123456")
				.withBaseUrl("https://builder.test.com")
				.withTimeout(15000)
				.build();

			expect(client).toBeInstanceOf(Client);
			expect(client.getConfig().apiKey).toBe("builder-test-key-123456");
			expect(client.getConfig().baseUrl).toBe("https://builder.test.com");
			expect(client.getConfig().timeout).toBe(15000);
		});
	});

	describe("environment variable support", () => {
		it("should handle missing environment variable gracefully", () => {
			const originalEnv = process.env.NVISY_API_KEY;
			delete process.env.NVISY_API_KEY;

			expect(() => {
				Client.fromEnvironment();
			}).toThrow(ConfigError);

			if (originalEnv) {
				process.env.NVISY_API_KEY = originalEnv;
			}
		});
	});
});
