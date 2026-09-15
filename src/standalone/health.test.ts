import createClient from "openapi-fetch";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { checkHealth } from "@/standalone/health.js";

// Hoisted so it's initialized before the hoisted `vi.mock` factory runs.
const { get } = vi.hoisted(() => ({
	get: vi.fn(async () => ({ data: { status: "healthy" } })),
}));

vi.mock("openapi-fetch", () => ({
	default: vi.fn(() => ({ use: vi.fn(), GET: get })),
}));

describe("checkHealth", () => {
	beforeEach(() => {
		vi.mocked(createClient).mockClear();
		get.mockClear();
	});

	it("calls the health route", async () => {
		const health = await checkHealth();
		expect(get).toHaveBeenCalledWith("/health");
		expect(health).toEqual({ status: "healthy" });
	});

	it("passes a custom fetch through to openapi-fetch", async () => {
		const customFetch = vi.fn();
		await checkHealth({ fetch: customFetch });
		expect(createClient).toHaveBeenCalledWith(
			expect.objectContaining({ fetch: customFetch }),
		);
	});

	it("sends no Authorization header by default", async () => {
		await checkHealth();
		const [{ headers }] = vi.mocked(createClient).mock.calls[0] as [
			{ headers: Record<string, string> },
		];
		expect(headers.Authorization).toBeUndefined();
	});
});
