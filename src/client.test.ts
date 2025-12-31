import { describe, expect, it, vi } from "vitest";
import { Nvisy } from "@/client.js";
import { DEFAULTS } from "@/config.js";
import { NvisyError } from "@/errors.js";

vi.mock("openapi-fetch", () => ({
	default: vi.fn(() => ({
		use: vi.fn(),
		GET: vi.fn(),
		POST: vi.fn(),
		PUT: vi.fn(),
		PATCH: vi.fn(),
		DELETE: vi.fn(),
	})),
}));

describe("Nvisy", () => {
	describe("constructor", () => {
		it("should create client with valid API token", () => {
			const nvisy = new Nvisy({ apiToken: "valid-api-token-123" });
			expect(nvisy).toBeInstanceOf(Nvisy);
		});

		it("should use default base URL", () => {
			const nvisy = new Nvisy({ apiToken: "valid-api-token-123" });
			expect(nvisy.baseUrl).toBe(DEFAULTS.BASE_URL);
		});

		it("should use custom base URL", () => {
			const customUrl = "https://custom.api.nvisy.com";
			const nvisy = new Nvisy({
				apiToken: "valid-api-token-123",
				baseUrl: customUrl,
			});
			expect(nvisy.baseUrl).toBe(customUrl);
		});

		it("should throw for short API token", () => {
			expect(() => new Nvisy({ apiToken: "short" })).toThrow(NvisyError);
		});

		it("should throw for invalid characters in API token", () => {
			expect(() => new Nvisy({ apiToken: "invalid@token!" })).toThrow(
				NvisyError,
			);
		});

		it("should throw for empty API token", () => {
			expect(() => new Nvisy({ apiToken: "" })).toThrow(NvisyError);
		});
	});

	describe("service getters", () => {
		it("should provide access to all services", () => {
			const nvisy = new Nvisy({ apiToken: "valid-api-token-123" });

			expect(nvisy.auth).toBeDefined();
			expect(nvisy.status).toBeDefined();
			expect(nvisy.account).toBeDefined();
			expect(nvisy.apiTokens).toBeDefined();
			expect(nvisy.comments).toBeDefined();
			expect(nvisy.documents).toBeDefined();
			expect(nvisy.files).toBeDefined();
			expect(nvisy.integrations).toBeDefined();
			expect(nvisy.invites).toBeDefined();
			expect(nvisy.members).toBeDefined();
			expect(nvisy.webhooks).toBeDefined();
			expect(nvisy.workspaces).toBeDefined();
		});
	});

	describe("withApiToken", () => {
		it("should create new client with different token", () => {
			const nvisy = new Nvisy({ apiToken: "valid-api-token-123" });
			const newNvisy = nvisy.withApiToken("another-valid-token");

			expect(newNvisy).toBeInstanceOf(Nvisy);
			expect(newNvisy).not.toBe(nvisy);
		});

		it("should throw for invalid token", () => {
			const nvisy = new Nvisy({ apiToken: "valid-api-token-123" });
			expect(() => nvisy.withApiToken("short")).toThrow(NvisyError);
		});
	});
});
