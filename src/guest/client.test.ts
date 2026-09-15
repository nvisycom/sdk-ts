import createClient from "openapi-fetch";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { DEFAULTS } from "@/config.js";
import { NvisyGuest } from "@/guest/client.js";

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

describe("NvisyGuest", () => {
	beforeEach(() => {
		vi.mocked(createClient).mockClear();
	});

	describe("constructor", () => {
		it("builds with no config", () => {
			expect(() => new NvisyGuest()).not.toThrow();
		});

		it("uses the default base URL", () => {
			expect(new NvisyGuest().baseUrl).toBe(DEFAULTS.BASE_URL);
		});

		it("uses a custom base URL", () => {
			const url = "https://custom.api.nvisy.com";
			expect(new NvisyGuest({ baseUrl: url }).baseUrl).toBe(url);
		});
	});

	describe("no authentication", () => {
		it("never sends an Authorization header", () => {
			new NvisyGuest({ credentials: "include" });
			const headers = vi.mocked(createClient).mock.calls[0][0]?.headers as
				| Record<string, string>
				| undefined;
			expect(headers?.Authorization).toBeUndefined();
		});

		it("forwards credentials so login can establish a cookie session", () => {
			new NvisyGuest({ credentials: "include" });
			expect(createClient).toHaveBeenCalledWith(
				expect.objectContaining({ credentials: "include" }),
			);
		});

		it("passes a custom fetch through to openapi-fetch", () => {
			const customFetch = vi.fn();
			new NvisyGuest({ fetch: customFetch });
			expect(createClient).toHaveBeenCalledWith(
				expect.objectContaining({ fetch: customFetch }),
			);
		});
	});

	describe("service getters", () => {
		it("exposes the pre-auth services", () => {
			const guest = new NvisyGuest();
			expect(guest.auth).toBeDefined();
			expect(guest.capabilities).toBeDefined();
			expect(guest.health).toBeDefined();
			expect(guest.api).toBeDefined();
		});
	});
});
