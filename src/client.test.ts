import { describe, expect, it, vi } from "vitest";
import { Client } from "@/client.js";
import { DEFAULTS } from "@/config.js";
import { ConfigError } from "@/errors.js";

vi.mock("openapi-fetch", () => ({
  default: vi.fn(() => ({
    use: vi.fn(),
  })),
}));

describe("Client", () => {
  describe("constructor", () => {
    it("should create client with API token", () => {
      const client = new Client({ apiToken: "valid-api-key-123" });
      expect(client).toBeInstanceOf(Client);
    });

    it("should use default baseUrl when not provided", () => {
      const client = new Client({ apiToken: "valid-api-key-123" });
      expect(client.baseUrl).toBe(DEFAULTS.BASE_URL);
    });

    it("should use custom baseUrl when provided", () => {
      const client = new Client({
        apiToken: "valid-api-key-123",
        baseUrl: "https://custom.api.com",
      });
      expect(client.baseUrl).toBe("https://custom.api.com");
    });

    it("should accept custom headers", () => {
      const client = new Client({
        apiToken: "valid-api-key-123",
        headers: { "X-Custom": "value" },
      });
      expect(client).toBeInstanceOf(Client);
    });

    it("should throw for short API token", () => {
      expect(() => new Client({ apiToken: "short" })).toThrow(ConfigError);
    });

    it("should throw for invalid characters in API token", () => {
      expect(() => new Client({ apiToken: "invalid@token!" })).toThrow(ConfigError);
    });

    it("should throw for empty API token", () => {
      expect(() => new Client({ apiToken: "" })).toThrow(ConfigError);
    });
  });

  describe("services", () => {
    it("should expose all services", () => {
      const client = new Client({ apiToken: "valid-api-token-123" });
      expect(client.auth).toBeDefined();
      expect(client.status).toBeDefined();
      expect(client.account).toBeDefined();
      expect(client.projects).toBeDefined();
      expect(client.apiTokens).toBeDefined();
      expect(client.documents).toBeDefined();
      expect(client.files).toBeDefined();
      expect(client.comments).toBeDefined();
      expect(client.integrations).toBeDefined();
      expect(client.invites).toBeDefined();
      expect(client.members).toBeDefined();
      expect(client.pipelines).toBeDefined();
      expect(client.templates).toBeDefined();
      expect(client.webhooks).toBeDefined();
    });
  });

  describe("api", () => {
    it("should expose raw API client", () => {
      const client = new Client({ apiToken: "valid-api-token-123" });
      expect(client.api).toBeDefined();
    });
  });

  describe("withApiToken", () => {
    it("should create new client with different token", () => {
      const client = new Client({ apiToken: "original-token-123" });
      const newClient = client.withApiToken("new-token-456789");
      expect(newClient).toBeInstanceOf(Client);
      expect(newClient).not.toBe(client);
    });

    it("should preserve config in new client", () => {
      const client = new Client({
        apiToken: "original-token-123",
        baseUrl: "https://custom.api.com",
      });
      const newClient = client.withApiToken("new-token-456789");
      expect(newClient.baseUrl).toBe("https://custom.api.com");
    });

    it("should throw for invalid token", () => {
      const client = new Client({ apiToken: "valid-api-token-123" });
      expect(() => client.withApiToken("short")).toThrow(ConfigError);
    });
  });
});
