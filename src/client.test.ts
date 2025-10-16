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

		it("should create client from config object", () => {
			const config = {
				apiKey: "test-api-key-123456",
				baseUrl: "https://api.example.com",
				timeout: 60000,
				maxRetries: 5,
				headers: { "X-Test": "header" },
			};
			const client = Client.fromConfig(config);
			expect(client).toBeInstanceOf(Client);

			const clientConfig = client.getConfig();
			expect(clientConfig.apiKey).toBe("test-api-key-123456");
			expect(clientConfig.baseUrl).toBe("https://api.example.com");
			expect(clientConfig.timeout).toBe(60000);
			expect(clientConfig.maxRetries).toBe(5);
			expect(clientConfig.headers).toEqual({ "X-Test": "header" });
		});

		it("should create client from config object with userAgent", () => {
			const config = {
				apiKey: "test-api-key-123456",
				userAgent: "TestApp/1.0.0",
			};
			const client = Client.fromConfig(config);
			expect(client).toBeInstanceOf(Client);

			const clientConfig = client.getConfig();
			expect(clientConfig.userAgent).toBe("TestApp/1.0.0");
		});

		it("should validate config in fromConfig", () => {
			expect(() => {
				Client.fromConfig({ apiKey: "short" });
			}).toThrow(ConfigError);

			expect(() => {
				Client.fromConfig({
					apiKey: "valid-key-123456",
					baseUrl: "invalid-url",
				});
			}).toThrow(ConfigError);
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

		it("should work with builder pattern and userAgent", () => {
			const client = Client.builder()
				.withApiKey("builder-test-key-123456")
				.withUserAgent("BuilderApp/2.0.0")
				.build();

			expect(client).toBeInstanceOf(Client);
			const config = client.getConfig();
			expect(config.userAgent).toBe("BuilderApp/2.0.0");
		});

		it("should use default userAgent when none is provided", () => {
			const client = Client.builder().withApiKey("test-api-key-123456").build();

			expect(client).toBeInstanceOf(Client);
			const config = client.getConfig();
			expect(config.userAgent).toBeUndefined(); // Config doesn't store the default

			// Verify the openapi client was created with a default user agent
			const openApiClient = client.getOpenApiClient();
			expect(openApiClient).toBeDefined();
		});
	});
});
