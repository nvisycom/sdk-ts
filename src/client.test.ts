import { describe, expect, it, vi } from "vitest";
import { ClientBuilder } from "@/builder.js";
import { Client } from "@/client.js";
import { ConfigError } from "@/errors.js";

// Mock openapi-fetch
vi.mock("openapi-fetch", () => ({
  default: vi.fn(() => ({})),
}));

describe("Client", () => {
  describe("constructor", () => {
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
        ClientBuilder.fromTestingApiKey().withBaseUrl("invalid-url").build();
      }).toThrow(ConfigError);
    });
  });

  describe("static factory methods", () => {
    it("should create client from config object", () => {
      const config = {
        apiKey: "test-api-key-123456",
        baseUrl: "https://api.example.com",
        timeout: 60000,
        maxRetries: 5,
        headers: { "X-Test": "header" },
      };
      const client = Client.fromConfig(config);
      const clientConfig = client.getConfig();
      expect(clientConfig.apiKey).toBe("test-api-key-123456");
      expect(clientConfig.baseUrl).toBe("https://api.example.com");
      expect(clientConfig.timeout).toBe(60000);
      expect(clientConfig.maxRetries).toBe(5);
      expect(clientConfig.headers).toEqual({ "X-Test": "header" });
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

  describe("integration with ClientBuilder", () => {
    it("should work with builder pattern", () => {
      const client = ClientBuilder.fromTestingApiKey()
        .withBaseUrl("https://builder.test.com")
        .withTimeout(15000)
        .build();

      const config = client.getConfig();
      expect(config.apiKey).toBe("test-key-123");
      expect(config.baseUrl).toBe("https://builder.test.com");
      expect(config.timeout).toBe(15000);
    });

    it("should use default userAgent when none is provided", () => {
      const client = ClientBuilder.fromTestingApiKey().build();
      const config = client.getConfig();
      expect(config.userAgent).toMatch(/^@nvisy\/sdk v\. \d+\.\d+\.\d+ \(.+; Node\.js .+\)$/);
    });
  });
});
