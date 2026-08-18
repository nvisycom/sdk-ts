import createClient from "openapi-fetch";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { login, signup } from "@/auth/password.js";

const post = vi.fn(async () => ({ data: { accessToken: "tok" } }));

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
});
