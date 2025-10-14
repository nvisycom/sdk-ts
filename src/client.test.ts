import { describe, it, expect, vi } from "vitest";
import { NvisyClient } from "./client.js";
import { ClientBuilder } from "./client-builder.js";
import { NvisyClientError } from "./errors.js";
import type { NvisyClientConfig } from "./config.js";

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

describe("NvisyClient", () => {
	const validConfig: NvisyClientConfig = {
		apiKey: "test-api-key",
	};

	describe("constructor", () => {
		it("should create client with valid config", () => {
			const client = new NvisyClient(validConfig);
			expect(client).toBeInstanceOf(NvisyClient);
		});

		it("should throw NvisyClientError when API key is missing", () => {
			expect(() => {
				new NvisyClient({} as NvisyClientConfig);
			}).toThrow(NvisyClientError);

			expect(() => {
				new NvisyClient({ apiKey: "" });
			}).toThrow(NvisyClientError);
		});

		it("should merge config with defaults", () => {
			const client = new NvisyClient(validConfig);
			const config = client.getConfig();

			expect(config.apiKey).toBe("test-api-key");
			expect(config.baseUrl).toBe("https://api.nvisy.com");
			expect(config.timeout).toBe(30000);
			expect(config.maxRetries).toBe(3);
			expect(config.headers).toEqual({});
		});

		it("should use custom config values", () => {
			const customConfig: NvisyClientConfig = {
				apiKey: "custom-key",
				baseUrl: "https://custom.api.com",
				timeout: 5000,
				maxRetries: 1,
				headers: { "Custom-Header": "value" },
			};

			const client = new NvisyClient(customConfig);
			const config = client.getConfig();

			expect(config.apiKey).toBe("custom-key");
			expect(config.baseUrl).toBe("https://custom.api.com");
			expect(config.timeout).toBe(5000);
			expect(config.maxRetries).toBe(1);
			expect(config.headers).toEqual({ "Custom-Header": "value" });
		});

		it("should merge custom headers with defaults", () => {
			const customConfig: NvisyClientConfig = {
				apiKey: "test-key",
				headers: { "Custom-Header": "value" },
			};

			const client = new NvisyClient(customConfig);
			const config = client.getConfig();

			expect(config.headers).toEqual({ "Custom-Header": "value" });
		});
	});

	describe("static builder()", () => {
		it("should return ClientBuilder instance", () => {
			const builder = NvisyClient.builder();
			expect(builder).toBeInstanceOf(ClientBuilder);
		});

		it("should create different builder instances", () => {
			const builder1 = NvisyClient.builder();
			const builder2 = NvisyClient.builder();
			expect(builder1).not.toBe(builder2);
		});
	});

	describe("getConfig()", () => {
		it("should return copy of config", () => {
			const client = new NvisyClient(validConfig);
			const config1 = client.getConfig();
			const config2 = client.getConfig();

			expect(config1).toEqual(config2);
			expect(config1).not.toBe(config2); // Should be different objects
		});

		it("should return all required config fields", () => {
			const client = new NvisyClient(validConfig);
			const config = client.getConfig();

			expect(config).toHaveProperty("apiKey");
			expect(config).toHaveProperty("baseUrl");
			expect(config).toHaveProperty("timeout");
			expect(config).toHaveProperty("maxRetries");
			expect(config).toHaveProperty("headers");

			// All fields should be defined
			expect(config.apiKey).toBeDefined();
			expect(config.baseUrl).toBeDefined();
			expect(config.timeout).toBeDefined();
			expect(config.maxRetries).toBeDefined();
			expect(config.headers).toBeDefined();
		});
	});

	describe("getClient()", () => {
		it("should return openapi-fetch client", () => {
			const client = new NvisyClient(validConfig);
			const fetchClient = client.getClient();

			expect(fetchClient).toBeDefined();
			expect(typeof fetchClient).toBe("object");
		});

		it("should return same client instance on multiple calls", () => {
			const client = new NvisyClient(validConfig);
			const fetchClient1 = client.getClient();
			const fetchClient2 = client.getClient();

			expect(fetchClient1).toBe(fetchClient2);
		});
	});

	describe("integration with ClientBuilder", () => {
		it("should work with builder pattern", () => {
			const client = NvisyClient.builder()
				.apiKey("builder-test-key")
				.baseUrl("https://builder.test.com")
				.timeout(15000)
				.build();

			expect(client).toBeInstanceOf(NvisyClient);

			const config = client.getConfig();
			expect(config.apiKey).toBe("builder-test-key");
			expect(config.baseUrl).toBe("https://builder.test.com");
			expect(config.timeout).toBe(15000);
		});
	});

	describe("error handling", () => {
		it("should throw specific error for missing API key", () => {
			expect(() => {
				new NvisyClient({} as NvisyClientConfig);
			}).toThrow(NvisyClientError);

			try {
				new NvisyClient({} as NvisyClientConfig);
			} catch (error) {
				expect(error).toBeInstanceOf(NvisyClientError);
				if (error instanceof NvisyClientError) {
					expect(error.field).toBe("apiKey");
					expect(error.context).toBe(
						"API key must be provided in configuration",
					);
				}
			}
		});

		it("should throw specific error for empty API key", () => {
			expect(() => {
				new NvisyClient({ apiKey: "" });
			}).toThrow(NvisyClientError);
		});
	});
});
