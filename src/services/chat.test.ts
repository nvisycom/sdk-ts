import { describe, expect, it } from "vitest";
import { Chat } from "@/services/chat.js";
import { NvisyError } from "@/errors.js";

/** Build a Response whose body streams the given SSE text as one chunk. */
function sseResponse(text: string): Response {
	const enc = new TextEncoder();
	const body = new ReadableStream<Uint8Array>({
		start(controller) {
			controller.enqueue(enc.encode(text));
			controller.close();
		},
	});
	return new Response(body);
}

/** A minimal ApiClient stub whose POST returns the given event-stream body. */
function chatWithStream(text: string): Chat {
	const api = {
		POST: async () => ({ response: sseResponse(text) }),
	};
	// biome-ignore lint/suspicious/noExplicitAny: test stub of ApiClient
	return new Chat(api as any);
}

const send = { content: "hi", parentId: "m0" };

describe("Chat.streamMessage", () => {
	it("yields ChatToken deltas from `token` frames", async () => {
		const chat = chatWithStream(
			'event: token\ndata: {"delta":"Hel"}\n\n' +
				'event: token\ndata: {"delta":"lo"}\n\n',
		);
		const deltas: string[] = [];
		for await (const t of chat.streamMessage("ws", "s1", send)) {
			deltas.push(t.delta);
		}
		expect(deltas).toEqual(["Hel", "lo"]);
	});

	it("ignores non-token frames", async () => {
		const chat = chatWithStream(
			": keep-alive\n\nevent: token\ndata: {\"delta\":\"x\"}\n\n",
		);
		const deltas: string[] = [];
		for await (const t of chat.streamMessage("ws", "s1", send)) {
			deltas.push(t.delta);
		}
		expect(deltas).toEqual(["x"]);
	});

	it("throws NvisyError on an `error` frame", async () => {
		const chat = chatWithStream(
			'event: token\ndata: {"delta":"a"}\n\nevent: error\ndata: model unavailable\n\n',
		);
		const deltas: string[] = [];
		await expect(async () => {
			for await (const t of chat.streamMessage("ws", "s1", send)) {
				deltas.push(t.delta);
			}
		}).rejects.toThrow(NvisyError);
		// The token before the error still arrived.
		expect(deltas).toEqual(["a"]);
	});

	it("throws when the response has no body", async () => {
		const api = { POST: async () => ({ response: new Response(null) }) };
		// biome-ignore lint/suspicious/noExplicitAny: test stub of ApiClient
		const chat = new Chat(api as any);
		await expect(async () => {
			for await (const _ of chat.streamMessage("ws", "s1", send)) {
				// no-op
			}
		}).rejects.toThrow(NvisyError);
	});
});
