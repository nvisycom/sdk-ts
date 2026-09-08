import createClient from "openapi-fetch";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { login, signup } from "@/standalone/auth.js";

// Hoisted so it's initialized before the hoisted `vi.mock` factory runs.
// Login/signup return no body (a 204 that starts a cookie session).
const { post } = vi.hoisted(() => ({
	post: vi.fn(async () => ({ data: undefined })),
}));

vi.mock("openapi-fetch", () => ({
	default: vi.fn(() => ({ use: vi.fn(), POST: post })),
}));

describe("auth password helpers", () => {
	beforeEach(() => {
		vi.mocked(createClient).mockClear();
	});

	const credentials = {
		identifier: "a@b.com",
		password: "pw",
		rememberMe: false,
	};
	const details = {
		emailAddress: "a@b.com",
		password: "pw",
		username: "u",
		rememberMe: false,
	};

	it("login passes a custom fetch through to openapi-fetch", async () => {
		const customFetch = vi.fn();
		await login(credentials, { fetch: customFetch });
		expect(createClient).toHaveBeenCalledWith(
			expect.objectContaining({ fetch: customFetch }),
		);
	});

	it("signup passes a custom fetch through to openapi-fetch", async () => {
		const customFetch = vi.fn();
		await signup(details, { fetch: customFetch });
		expect(createClient).toHaveBeenCalledWith(
			expect.objectContaining({ fetch: customFetch }),
		);
	});

	it("passes fetch: undefined when no config is given", async () => {
		await login(credentials);
		expect(createClient).toHaveBeenCalledWith(
			expect.objectContaining({ fetch: undefined }),
		);
	});

	it("forwards credentials so login can establish a cookie session", async () => {
		await login(credentials, { credentials: "include" });
		expect(createClient).toHaveBeenCalledWith(
			expect.objectContaining({ credentials: "include" }),
		);
	});

	it("forwards credentials on signup too", async () => {
		await signup(details, { credentials: "include" });
		expect(createClient).toHaveBeenCalledWith(
			expect.objectContaining({ credentials: "include" }),
		);
	});
});
