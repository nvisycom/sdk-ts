import createClient from "openapi-fetch";
import { beforeEach, describe, expect, it, vi } from "vitest";
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

		it("should throw when neither apiToken nor session is given", () => {
			// @ts-expect-error must provide either apiToken or session
			expect(() => new Nvisy({})).toThrow(NvisyError);
		});

		it("should create a session-mode client", () => {
			expect(() => new Nvisy({ session: true })).not.toThrow();
		});
	});

	describe("authentication", () => {
		beforeEach(() => {
			vi.mocked(createClient).mockClear();
		});

		it("should send a bearer token when an API token is given", () => {
			new Nvisy({ apiToken: "valid-api-token-123" });
			expect(createClient).toHaveBeenCalledWith(
				expect.objectContaining({
					headers: expect.objectContaining({
						Authorization: "Bearer valid-api-token-123",
					}),
				}),
			);
		});

		it("should forward credentials to openapi-fetch", () => {
			new Nvisy({ apiToken: "valid-api-token-123", credentials: "include" });
			expect(createClient).toHaveBeenCalledWith(
				expect.objectContaining({ credentials: "include" }),
			);
		});

		it("should omit Authorization and default credentials to include for a session", () => {
			new Nvisy({ session: true });
			const [call] = vi.mocked(createClient).mock.calls[0] as [
				{ headers: Record<string, string>; credentials?: string },
			];
			expect(call.headers.Authorization).toBeUndefined();
			expect(call.credentials).toBe("include");
		});
	});

	describe("service getters", () => {
		it("should provide access to all services", () => {
			const nvisy = new Nvisy({ apiToken: "valid-api-token-123" });

			expect(nvisy.auth).toBeDefined();
			expect(nvisy.status).toBeDefined();
			expect(nvisy.account).toBeDefined();
			expect(nvisy.activities).toBeDefined();
			expect(nvisy.apiTokens).toBeDefined();
			expect(nvisy.capabilities).toBeDefined();
			expect(nvisy.connections).toBeDefined();
			expect(nvisy.documents).toBeDefined();
			expect(nvisy.invites).toBeDefined();
			expect(nvisy.members).toBeDefined();
			expect(nvisy.notifications).toBeDefined();
			expect(nvisy.pipelines).toBeDefined();
			expect(nvisy.policies).toBeDefined();
			expect(nvisy.providers).toBeDefined();
			expect(nvisy.detections).toBeDefined();
			expect(nvisy.redactions).toBeDefined();
			expect(nvisy.reviews).toBeDefined();
			expect(nvisy.syncs).toBeDefined();
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

	describe("custom fetch", () => {
		beforeEach(() => {
			vi.mocked(createClient).mockClear();
		});

		it("should pass a custom fetch through to openapi-fetch", () => {
			const customFetch = vi.fn();
			new Nvisy({ apiToken: "valid-api-token-123", fetch: customFetch });
			expect(createClient).toHaveBeenCalledWith(
				expect.objectContaining({ fetch: customFetch }),
			);
		});

		it("should pass fetch: undefined when none is provided", () => {
			new Nvisy({ apiToken: "valid-api-token-123" });
			expect(createClient).toHaveBeenCalledWith(
				expect.objectContaining({ fetch: undefined }),
			);
		});
	});
});
