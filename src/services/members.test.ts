import { describe, expect, it, vi } from "vitest";
import { ClientBuilder } from "@/builder.js";
import { MembersService } from "@/services/members.js";

// Mock openapi-fetch
vi.mock("openapi-fetch", () => ({
	default: vi.fn(() => ({})),
}));

describe("MembersService", () => {
	const mockClient = ClientBuilder.fromTestingApiKey().build();

	describe("invite", () => {
		it("should throw not implemented error", async () => {
			await expect(
				new MembersService(mockClient).invite({
					email: "test@example.com",
					role: "editor" as const,
					projectId: "project-123",
				}),
			).rejects.toThrow("Not implemented");
		});
	});

	describe("get", () => {
		it("should throw not implemented error", async () => {
			await expect(
				new MembersService(mockClient).get("member-123"),
			).rejects.toThrow("Not implemented");
		});
	});

	describe("list", () => {
		it("should throw not implemented error with no params", async () => {
			await expect(new MembersService(mockClient).list()).rejects.toThrow(
				"Not implemented",
			);
		});

		it("should throw not implemented error with params", async () => {
			await expect(
				new MembersService(mockClient).list({
					projectId: "project-123",
					role: "admin" as const,
				}),
			).rejects.toThrow("Not implemented");
		});
	});

	describe("update", () => {
		it("should throw not implemented error", async () => {
			await expect(
				new MembersService(mockClient).update("member-123", {
					role: "viewer" as const,
				}),
			).rejects.toThrow("Not implemented");
		});
	});

	describe("remove", () => {
		it("should throw not implemented error", async () => {
			await expect(
				new MembersService(mockClient).remove("member-123"),
			).rejects.toThrow("Not implemented");
		});
	});

	describe("resendInvitation", () => {
		it("should throw not implemented error", async () => {
			await expect(
				new MembersService(mockClient).resendInvitation("member-123"),
			).rejects.toThrow("Not implemented");
		});
	});
});
