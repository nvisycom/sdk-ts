import { describe, expect, it, vi, beforeAll, afterAll } from "vitest";
import { ClientBuilder } from "./builder.js";
import { Client } from "./client.js";

import { ConfigError } from "./errors.js";

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
        Client.builder().withApiKey("valid-key-123456").withBaseUrl("invalid-url").build();
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
      const config = client.getConfig();
      expect(config.apiKey).toBe("builder-test-key-123456");
      expect(config.baseUrl).toBe("https://builder.test.com");
      expect(config.timeout).toBe(15000);
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
        Client.fromEnvironment();
      }).toThrow(ConfigError);
    });

    it("should create client from environment variables", () => {
      // Set up test environment variables
      process.env.NVISY_API_KEY = "env-test-key-123456";
      process.env.NVISY_BASE_URL = "https://api.test.nvisy.com";
      process.env.NVISY_TIMEOUT = "15000";
      process.env.NVISY_MAX_RETRIES = "5";

      const client = Client.fromEnvironment();
      const config = client.getConfig();

      expect(config.apiKey).toBe("env-test-key-123456");
      expect(config.baseUrl).toBe("https://api.test.nvisy.com");
      expect(config.timeout).toBe(15000);
      expect(config.maxRetries).toBe(5);
    });

    it("should prioritize explicit config over environment variables", () => {
      // Set environment variables
      process.env.NVISY_API_KEY = "env-key-123456";
      process.env.NVISY_TIMEOUT = "10000";

      // Create client with explicit config that should override env vars
      const client = Client.builder().withApiKey("explicit-key-123456").withTimeout(25000).build();

      const config = client.getConfig();

      expect(config.apiKey).toBe("explicit-key-123456"); // Explicit wins
      expect(config.timeout).toBe(25000); // Explicit wins
    });
  });

  describe("client modification methods", () => {
    it("should create new client with modified config", () => {
      const client = Client.builder().withApiKey("original-key-123456").withTimeout(30000).withMaxRetries(3).build();

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

      const modifiedClient = client.withHeaders({ "X-Custom": "value" }).withTimeout(20000).withMaxRetries(5);

      // Original unchanged
      expect(client.getConfig().headers).toEqual({});
      expect(client.getConfig().timeout).toBe(30000);
      expect(client.getConfig().maxRetries).toBe(3);

      // Modified has new values
      expect(modifiedClient.getConfig().headers).toEqual({ "X-Custom": "value" });
      expect(modifiedClient.getConfig().timeout).toBe(20000);
      expect(modifiedClient.getConfig().maxRetries).toBe(5);
    });
  });
});
