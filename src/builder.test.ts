import { describe, expect, it } from "vitest";
import { ClientBuilder } from "./builder.js";
import { Client } from "./client.js";
import { ConfigError } from "./errors.js";

describe("ClientBuilder", () => {
  const validApiKey = "test-api-key-123456";

  describe("static factory methods", () => {
    it("should create builder with API key", () => {
      const builder = ClientBuilder.withApiKey(validApiKey);
      expect(builder).toBeInstanceOf(ClientBuilder);
    });

    it("should validate API key in factory method", () => {
      expect(() => ClientBuilder.withApiKey("short")).toThrow(ConfigError);
      expect(() => ClientBuilder.withApiKey("invalid chars!")).toThrow(ConfigError);
    });
  });

  describe("validation", () => {
    it("should validate configuration fields", () => {
      const builder = ClientBuilder.withApiKey(validApiKey);

      // URL validation
      expect(() => builder.withBaseUrl("not-a-url")).toThrow(ConfigError);
      expect(() => builder.withBaseUrl("ftp://invalid-protocol.com")).toThrow(ConfigError);

      // Range validations
      expect(() => builder.withTimeout(500)).toThrow(ConfigError);
      expect(() => builder.withTimeout(400_000)).toThrow(ConfigError);
      expect(() => builder.withMaxRetries(-1)).toThrow(ConfigError);
      expect(() => builder.withMaxRetries(15)).toThrow(ConfigError);

      // Header validation
      expect(() => builder.withHeaders({ "": "value" })).toThrow(ConfigError);
      expect(() => builder.withHeaders({ authorization: "bearer token" })).toThrow(ConfigError);
    });
  });

  describe("build", () => {
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
    });
  });

  describe("fluent interface", () => {
    it("should support method chaining", () => {
      const client = ClientBuilder.withApiKey(validApiKey)
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
});
