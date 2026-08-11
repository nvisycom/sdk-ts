import { describe, expect, it } from "vitest";
import { parseSseStream } from "@/services/sse.js";

/** Build a ReadableStream that emits the given UTF-8 string chunks in order. */
function streamOf(...chunks: string[]): ReadableStream<Uint8Array> {
	const enc = new TextEncoder();
	return new ReadableStream({
		start(controller) {
			for (const chunk of chunks) controller.enqueue(enc.encode(chunk));
			controller.close();
		},
	});
}

async function collect(
	stream: ReadableStream<Uint8Array>,
): Promise<{ event: string; data: string }[]> {
	const out = [];
	for await (const event of parseSseStream(stream)) out.push(event);
	return out;
}

describe("parseSseStream", () => {
	it("parses a single event with an explicit event name", async () => {
		const events = await collect(
			streamOf('event: status\ndata: {"status":"queued"}\n\n'),
		);
		expect(events).toEqual([
			{ event: "status", data: '{"status":"queued"}' },
		]);
	});

	it("defaults the event name to 'message' when omitted", async () => {
		const events = await collect(streamOf("data: hello\n\n"));
		expect(events).toEqual([{ event: "message", data: "hello" }]);
	});

	it("parses multiple events in one chunk", async () => {
		const events = await collect(
			streamOf("event: status\ndata: a\n\nevent: status\ndata: b\n\n"),
		);
		expect(events.map((e) => e.data)).toEqual(["a", "b"]);
	});

	it("reassembles an event split across chunk boundaries", async () => {
		// The frame separator itself is split between two chunks.
		const events = await collect(
			streamOf("event: sta", "tus\ndata: {\"x\":1}\n", "\nevent: status\ndata: {\"x\":2}\n\n"),
		);
		expect(events.map((e) => e.data)).toEqual(['{"x":1}', '{"x":2}']);
	});

	it("joins multiple data lines with a newline", async () => {
		const events = await collect(streamOf("data: line1\ndata: line2\n\n"));
		expect(events).toEqual([{ event: "message", data: "line1\nline2" }]);
	});

	it("strips only a single leading space after the colon", async () => {
		const events = await collect(streamOf("data:  two-spaces\n\n"));
		expect(events[0].data).toBe(" two-spaces");
	});

	it("ignores comment lines", async () => {
		const events = await collect(streamOf(": keep-alive\ndata: real\n\n"));
		expect(events).toEqual([{ event: "message", data: "real" }]);
	});

	it("normalizes CRLF line endings", async () => {
		const events = await collect(
			streamOf("event: status\r\ndata: crlf\r\n\r\n"),
		);
		expect(events).toEqual([{ event: "status", data: "crlf" }]);
	});

	it("flushes a trailing frame with no terminating blank line", async () => {
		const events = await collect(streamOf("data: last\n"));
		expect(events).toEqual([{ event: "message", data: "last" }]);
	});

	it("yields nothing for an empty stream", async () => {
		expect(await collect(streamOf())).toEqual([]);
	});
});
