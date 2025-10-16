import { describe, expect, it, vi } from "vitest";
import { ClientBuilder } from "@/builder.js";
import { DocumentsService } from "@/services/documents.js";

// Mock openapi-fetch
vi.mock("openapi-fetch", () => ({
	default: vi.fn(() => ({})),
}));

describe("DocumentsService", () => {
	const mockClient = ClientBuilder.fromTestingApiKey().build();

	describe("upload", () => {
		it("should throw not implemented error", async () => {
			await expect(
				new DocumentsService(mockClient).upload({
					projectId: "project-123",
					file: new File(["content"], "test.pdf", { type: "application/pdf" }),
				}),
			).rejects.toThrow("Not implemented");
		});
	});

	describe("get", () => {
		it("should throw not implemented error", async () => {
			await expect(
				new DocumentsService(mockClient).get("doc-123"),
			).rejects.toThrow("Not implemented");
		});
	});

	describe("list", () => {
		it("should throw not implemented error with no params", async () => {
			await expect(new DocumentsService(mockClient).list()).rejects.toThrow(
				"Not implemented",
			);
		});

		it("should throw not implemented error with params", async () => {
			await expect(
				new DocumentsService(mockClient).list({
					projectId: "project-123",
					status: "completed" as const,
				}),
			).rejects.toThrow("Not implemented");
		});
	});

	describe("delete", () => {
		it("should throw not implemented error", async () => {
			await expect(
				new DocumentsService(mockClient).delete("doc-123"),
			).rejects.toThrow("Not implemented");
		});
	});

	describe("download", () => {
		it("should throw not implemented error", async () => {
			await expect(
				new DocumentsService(mockClient).download("doc-123"),
			).rejects.toThrow("Not implemented");
		});
	});
});
