/**
 * Minimal Server-Sent Events parser.
 *
 * SSE is a line protocol, not a JSON body, so it can't be read with a single
 * `response.json()`. This turns a raw byte stream into parsed events, handling
 * the two things that make a naive split unsafe: frames delimited by a blank
 * line (`\n\n`), and frames that straddle network chunk boundaries.
 *
 * Only the fields the SDK needs are surfaced (`event`, `data`); `id` and
 * `retry` are ignored. `data` may span multiple `data:` lines per the spec and
 * is rejoined with `\n`.
 */

/** One parsed SSE event. */
export interface SseEvent {
	/** The `event:` field, or `"message"` when the frame omits it. */
	event: string;
	/** The `data:` payload, with multiple `data:` lines joined by `\n`. */
	data: string;
}

/** Parse one already-split frame (its lines) into an event, or null if empty. */
function parseFrame(frame: string): SseEvent | null {
	let event = "message";
	const data: string[] = [];
	for (const line of frame.split("\n")) {
		if (line === "" || line.startsWith(":")) continue; // blank / comment
		const colon = line.indexOf(":");
		const field = colon === -1 ? line : line.slice(0, colon);
		// A single leading space after the colon is stripped, per the spec.
		let value = colon === -1 ? "" : line.slice(colon + 1);
		if (value.startsWith(" ")) value = value.slice(1);
		if (field === "event") event = value;
		else if (field === "data") data.push(value);
	}
	if (data.length === 0) return null;
	return { event, data: data.join("\n") };
}

/**
 * Decode a byte stream into SSE events.
 *
 * @param stream - the response body, a stream of UTF-8 bytes
 * @yields each complete SSE event as it arrives
 */
export async function* parseSseStream(
	stream: ReadableStream<Uint8Array>,
): AsyncGenerator<SseEvent> {
	const decoder = new TextDecoder();
	let buffer = "";
	// A ReadableStream is async-iterable in modern runtimes; fall back to a
	// reader where it isn't (e.g. some Safari versions).
	const reader = stream.getReader();
	try {
		while (true) {
			const { done, value } = await reader.read();
			if (done) break;
			buffer += decoder.decode(value, { stream: true });
			// Normalize CRLF/CR to LF so frame splitting is uniform.
			buffer = buffer.replace(/\r\n|\r/g, "\n");
			let sep = buffer.indexOf("\n\n");
			while (sep !== -1) {
				const frame = buffer.slice(0, sep);
				buffer = buffer.slice(sep + 2);
				const parsed = parseFrame(frame);
				if (parsed) yield parsed;
				sep = buffer.indexOf("\n\n");
			}
		}
		// Flush a trailing frame with no terminating blank line.
		buffer += decoder.decode();
		const parsed = parseFrame(buffer.replace(/\r\n|\r/g, "\n"));
		if (parsed) yield parsed;
	} finally {
		reader.releaseLock();
	}
}
