import { describe, expect, it, vi } from "vitest";
import { ClientBuilder } from "@/builder.js";
import { Client } from "@/client.js";
import { ConfigError } from "@/errors.js";
import { StatusService } from "@/services/status.js";

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
	describe("constructor", () => {
		it("should create client with valid config", () => {
			const client = Client.builder().withApiKey("test-api-key-123456").build();
			expect(client).toBeInstanceOf(Client);
		});

		it("should throw ConfigError when API key is missing", () => {
			expect(() => {
				Client.builder().build();
			}).toThrow(ConfigError);
		});

		it("should validate configuration through builder", () => {
			expect(() => {
				Client.builder().withApiKey("short").build();
			}).toThrow(ConfigError);

			expect(() => {
				Client.builder()
					.withApiKey("valid-key-123456")
					.withBaseUrl("invalid-url")
					.build();
			}).toThrow(ConfigError);
		});
	});

	describe("static factory methods", () => {
		it("should create builder instance", () => {
			const builder = Client.builder();
			expect(builder).toBeInstanceOf(ClientBuilder);
		});
	});

	describe("service getters", () => {
		it("should provide access to status service", () => {
			const client = Client.builder().withApiKey("test-api-key-123456").build();

			expect(client.status).toBeInstanceOf(StatusService);
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
			const config = client.getConfig();
			expect(config.apiKey).toBe("builder-test-key-123456");
			expect(config.baseUrl).toBe("https://builder.test.com");
			expect(config.timeout).toBe(15000);
		});
	});

	describe("client modification methods", () => {
		it("should create new client with modified config", () => {
			const client = Client.builder()
				.withApiKey("original-key-123456")
				.withTimeout(30000)
				.withMaxRetries(3)
				.build();

			const modifiedClient = client.withConfig({
				timeout: 15000,
				maxRetries: 5,
			});

			// Original should be unchanged
			expect(client.getConfig().timeout).toBe(30000);
			expect(client.getConfig().maxRetries).toBe(3);

			// Modified should have new values
			expect(modifiedClient.getConfig().timeout).toBe(15000);
			expect(modifiedClient.getConfig().maxRetries).toBe(5);
			expect(modifiedClient.getConfig().apiKey).toBe("original-key-123456");
		});

		it("should create new clients with fluent interface", () => {
			const client = Client.builder()
				.withApiKey("test-api-key-123456")
				.withTimeout(30000)
				.withMaxRetries(3)
				.withHeaders({})
				.build();

			const modifiedClient = client
				.withHeaders({ "X-Custom": "value" })
				.withTimeout(20000)
				.withMaxRetries(5);

			// Original unchanged
			expect(client.getConfig().headers).toEqual({});
			expect(client.getConfig().timeout).toBe(30000);
			expect(client.getConfig().maxRetries).toBe(3);

			// Modified has new values
			expect(modifiedClient.getConfig().headers).toEqual({
				"X-Custom": "value",
			});
			expect(modifiedClient.getConfig().timeout).toBe(20000);
			expect(modifiedClient.getConfig().maxRetries).toBe(5);
		});
	});
});
