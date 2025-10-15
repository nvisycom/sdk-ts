import { describe, it, expect } from "vitest";
import { ClientBuilder } from "./builder.js";
import { Client } from "./client.js";
import { ConfigError } from "./errors.js";

describe("ClientBuilder", () => {
	const validApiKey = "test-api-key-123456";

	describe("static factory methods", () => {
		it("should create builder with API key", () => {
			const builder = ClientBuilder.withApiKey(validApiKey);
			expect(builder).toBeInstanceOf(ClientBuilder);

			const config = builder.getConfig();
			expect(config.apiKey).toBe(validApiKey);
		});

		it("should validate API key in factory method", () => {
			expect(() => {
				ClientBuilder.withApiKey("");
			}).toThrow(ConfigError);

			expect(() => {
				ClientBuilder.withApiKey("   ");
			}).toThrow(ConfigError);

			expect(() => {
				ClientBuilder.withApiKey("invalid chars!");
			}).toThrow(ConfigError);

			expect(() => {
				ClientBuilder.withApiKey("short");
			}).toThrow(ConfigError);
		});
	});

	describe("validation tests", () => {
		it("should validate API key format", () => {
			const builder = new ClientBuilder();

			expect(() => builder.withApiKey("")).toThrow(ConfigError);
			expect(() => builder.withApiKey("short")).toThrow(ConfigError);
			expect(() => builder.withApiKey("invalid-chars@#$")).toThrow(ConfigError);
			expect(() => builder.withApiKey("   ")).toThrow(ConfigError);
		});

		it("should validate URL format", () => {
			const builder = ClientBuilder.withApiKey(validApiKey);

			expect(() => builder.withBaseUrl("not-a-url")).toThrow(ConfigError);
			expect(() => builder.withBaseUrl("")).toThrow(ConfigError);
			expect(() => builder.withBaseUrl("ftp://invalid-protocol.com")).toThrow(
				ConfigError,
			);
		});

		it("should validate timeout range", () => {
			const builder = ClientBuilder.withApiKey(validApiKey);

			expect(() => builder.withTimeout(0)).toThrow(ConfigError);
			expect(() => builder.withTimeout(-1000)).toThrow(ConfigError);
			expect(() => builder.withTimeout(400_000)).toThrow(ConfigError);
			expect(() => builder.withTimeout(1.5)).toThrow(ConfigError);
		});

		it("should validate max retries range", () => {
			const builder = ClientBuilder.withApiKey(validApiKey);

			expect(() => builder.withMaxRetries(-1)).toThrow(ConfigError);
			expect(() => builder.withMaxRetries(15)).toThrow(ConfigError);
			expect(() => builder.withMaxRetries(3.5)).toThrow(ConfigError);
		});

		it("should validate headers object", () => {
			const builder = ClientBuilder.withApiKey(validApiKey);

			expect(() =>
				builder.withHeaders(null as unknown as Record<string, string>),
			).toThrow(ConfigError);
			expect(() =>
				builder.withHeaders([] as unknown as Record<string, string>),
			).toThrow(ConfigError);
			expect(() => builder.withHeaders({ "": "value" })).toThrow(ConfigError);
			expect(() => builder.withHeaders({ "invalid chars!": "value" })).toThrow(
				ConfigError,
			);
			expect(() =>
				builder.withHeaders({ valid: 123 as unknown as string }),
			).toThrow(ConfigError);
		});

		it("should reject reserved headers", () => {
			const builder = ClientBuilder.withApiKey(validApiKey);

			expect(() =>
				builder.withHeaders({ authorization: "bearer token" }),
			).toThrow(ConfigError);
			expect(() =>
				builder.withHeaders({ "content-type": "application/json" }),
			).toThrow(ConfigError);
			expect(() =>
				builder.withHeaders({ "user-agent": "custom-agent" }),
			).toThrow(ConfigError);
		});

		it("should validate header name and value", () => {
			const builder = ClientBuilder.withApiKey(validApiKey);

			expect(() => builder.withHeader("", "value")).toThrow(ConfigError);
			expect(() => builder.withHeader("invalid chars!", "value")).toThrow(
				ConfigError,
			);
			expect(() =>
				builder.withHeader("valid", 123 as unknown as string),
			).toThrow(ConfigError);
			expect(() => builder.withHeader("   ", "value")).toThrow(ConfigError);
		});
	});

	describe("build()", () => {
		it("should require API key to build", () => {
			const builder = new ClientBuilder();
			expect(() => builder.build()).toThrow(ConfigError);
		});

		it("should build client with valid configuration", () => {
			const client = ClientBuilder.withApiKey(validApiKey)
				.withBaseUrl("https://custom.api.com")
				.withTimeout(15000)
				.build();

			expect(client).toBeInstanceOf(Client);
			expect(client.getConfig().apiKey).toBe(validApiKey);
		});
	});

	describe("error handling", () => {
		it("should validate configuration before building", () => {
			expect(() => ClientBuilder.withApiKey("short")).toThrow(ConfigError);
		});

		it("should handle validation errors for additional headers", () => {
			const builder = ClientBuilder.withApiKey(validApiKey);
			expect(() =>
				builder.withAdditionalHeaders(
					null as unknown as Record<string, string>,
				),
			).toThrow(ConfigError);
		});
	});
});
