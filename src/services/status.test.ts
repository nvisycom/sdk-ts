import { beforeEach, describe, expect, it, vi } from "vitest";
import { Client } from "@/client.js";
import { StatusService } from "@/services/status.js";

// Mock openapi-fetch since Client depends on it
vi.mock("openapi-fetch", () => ({
	default: vi.fn(() => ({
		GET: vi.fn(),
		POST: vi.fn(),
		PUT: vi.fn(),
		DELETE: vi.fn(),
		PATCH: vi.fn(),
	})),
}));

describe("StatusService", () => {
	let mockClient: Client;
	let statusService: StatusService;

	beforeEach(() => {
		mockClient = new Client({ apiKey: "test-key-123456" });
		statusService = new StatusService(mockClient);
	});

	describe("constructor", () => {
		it("should create StatusService with client", () => {
			expect(statusService).toBeInstanceOf(StatusService);
		});
	});

	describe("health", () => {
		it("should throw not implemented error", async () => {
			await expect(statusService.health()).rejects.toThrow("Not implemented");
		});
	});
});
