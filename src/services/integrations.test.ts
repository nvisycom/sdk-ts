import { describe, expect, it, vi } from "vitest";
import { ClientBuilder } from "@/builder.js";
import { IntegrationsService } from "@/services/integrations.js";

// Mock openapi-fetch
vi.mock("openapi-fetch", () => ({
	default: vi.fn(() => ({})),
}));

describe("IntegrationsService", () => {
	const mockClient = ClientBuilder.fromTestingApiKey().build();

	describe("create", () => {
		it("should throw not implemented error", async () => {
			await expect(
				new IntegrationsService(mockClient).create({
					name: "Test Integration",
					provider: "webhook" as const,
					projectId: "project-123",
					config: { url: "https://example.com/webhook" },
				}),
			).rejects.toThrow("Not implemented");
		});
	});

	describe("get", () => {
		it("should throw not implemented error", async () => {
			await expect(
				new IntegrationsService(mockClient).get("integration-123"),
			).rejects.toThrow("Not implemented");
		});
	});

	describe("list", () => {
		it("should throw not implemented error with no params", async () => {
			await expect(new IntegrationsService(mockClient).list()).rejects.toThrow(
				"Not implemented",
			);
		});

		it("should throw not implemented error with params", async () => {
			await expect(
				new IntegrationsService(mockClient).list({
					projectId: "project-123",
					provider: "slack" as const,
				}),
			).rejects.toThrow("Not implemented");
		});
	});

	describe("update", () => {
		it("should throw not implemented error", async () => {
			await expect(
				new IntegrationsService(mockClient).update("integration-123", {
					name: "Updated Integration Name",
				}),
			).rejects.toThrow("Not implemented");
		});
	});

	describe("delete", () => {
		it("should throw not implemented error", async () => {
			await expect(
				new IntegrationsService(mockClient).delete("integration-123"),
			).rejects.toThrow("Not implemented");
		});
	});
});
