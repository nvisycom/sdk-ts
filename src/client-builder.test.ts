import { describe, it, expect } from "vitest";
import { ClientBuilder } from "./client-builder.js";
import { NvisyClient } from "./client.js";
import { NvisyClientError } from "./errors.js";

describe("ClientBuilder", () => {
	it("should create a new builder instance", () => {
		const builder = ClientBuilder.create();
		expect(builder).toBeInstanceOf(ClientBuilder);
	});

	it("should build client with required API key", () => {
		const client = ClientBuilder.create().apiKey("test-api-key").build();

		expect(client).toBeInstanceOf(NvisyClient);
	});

	it("should throw error when building without API key", () => {
		expect(() => {
			ClientBuilder.create().build();
		}).toThrow(NvisyClientError);
	});

	it("should set all configuration options via fluent API", () => {
		const client = ClientBuilder.create()
			.apiKey("test-key")
			.baseUrl("https://custom.api.com")
			.timeout(5000)
			.maxRetries(5)
			.headers({ "Custom-Header": "value" })
			.header("Another-Header", "another-value")
			.build();

		const config = client.getConfig();

		expect(config.apiKey).toBe("test-key");
		expect(config.baseUrl).toBe("https://custom.api.com");
		expect(config.timeout).toBe(5000);
		expect(config.maxRetries).toBe(5);
		expect(config.headers).toEqual({
			"Custom-Header": "value",
			"Another-Header": "another-value",
		});
	});

	it("should allow method chaining", () => {
		const builder = ClientBuilder.create();

		const result = builder
			.apiKey("test")
			.baseUrl("https://test.com")
			.timeout(1000)
			.maxRetries(2);

		expect(result).toBe(builder); // Should return same instance for chaining
	});

	it("should merge headers correctly", () => {
		const client = ClientBuilder.create()
			.apiKey("test-key")
			.headers({ Header1: "value1" })
			.header("Header2", "value2")
			.build();

		const config = client.getConfig();

		expect(config.headers).toEqual({
			Header1: "value1",
			Header2: "value2",
		});
	});

	it("should use default values for unset options", () => {
		const client = ClientBuilder.create().apiKey("test-key").build();

		const config = client.getConfig();

		expect(config.baseUrl).toBe("https://api.nvisy.com");
		expect(config.timeout).toBe(30000);
		expect(config.maxRetries).toBe(3);
		expect(config.headers).toEqual({});
	});
});
