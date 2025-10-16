import { describe, expect, it, vi } from "vitest";
import { ClientBuilder } from "@/builder.js";
import { StatusService } from "@/services/status.js";

// Mock openapi-fetch
vi.mock("openapi-fetch", () => ({
	default: vi.fn(() => ({})),
}));

describe("StatusService", () => {
	const mockClient = ClientBuilder.fromTestingApiKey().build();

	describe("health", () => {
		it("should throw not implemented error", async () => {
			await expect(new StatusService(mockClient).health()).rejects.toThrow(
				"Not implemented",
			);
		});
	});
});
