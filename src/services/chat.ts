import type { ApiClient } from "@/client.js";
import type {
	ChatMessage,
	ChatSession,
	ChatSessionPage,
	ChatToken,
	CreateChatSession,
	OffsetPagination,
	SendChatMessage,
} from "@/datatypes/index.js";
import { NvisyError } from "@/errors.js";
import { parseSseStream } from "@/services/sse.js";

/**
 * Service for the workspace assistant chat: sessions and streamed messages.
 */
export class Chat {
	#api: ApiClient;

	constructor(api: ApiClient) {
		this.#api = api;
	}

	/**
	 * List the workspace's chat sessions, most recently active first.
	 * @param workspaceSlug - Workspace slug
	 * @param query - Optional pagination (limit, offset)
	 * @returns Promise that resolves with a paginated list of chat sessions
	 * @throws {ApiError} if the request fails
	 */
	async listSessions(
		workspaceSlug: string,
		query?: OffsetPagination,
	): Promise<ChatSessionPage> {
		const { data } = await this.#api.GET(
			"/workspaces/{workspaceSlug}/chat/sessions/",
			{
				params: { path: { workspaceSlug }, query },
			},
		);
		return data!;
	}

	/**
	 * Open a new assistant chat session in the workspace.
	 * @param workspaceSlug - Workspace slug
	 * @param session - Session creation request
	 * @returns Promise that resolves with the created chat session
	 * @throws {ApiError} if the request fails
	 */
	async createSession(
		workspaceSlug: string,
		session: CreateChatSession,
	): Promise<ChatSession> {
		const { data } = await this.#api.POST(
			"/workspaces/{workspaceSlug}/chat/sessions/",
			{
				params: { path: { workspaceSlug } },
				body: session,
			},
		);
		return data!;
	}

	/**
	 * Soft-delete a chat session.
	 * @param workspaceSlug - Workspace slug
	 * @param sessionId - Session ID
	 * @throws {ApiError} if the request fails
	 */
	async deleteSession(workspaceSlug: string, sessionId: string): Promise<void> {
		await this.#api.DELETE(
			"/workspaces/{workspaceSlug}/chat/sessions/{sessionId}/",
			{
				params: { path: { workspaceSlug, sessionId } },
			},
		);
	}

	/**
	 * List a session's messages in chronological order.
	 * @param workspaceSlug - Workspace slug
	 * @param sessionId - Session ID
	 * @returns Promise that resolves with the session's messages
	 * @throws {ApiError} if the request fails
	 */
	async listMessages(
		workspaceSlug: string,
		sessionId: string,
	): Promise<ChatMessage[]> {
		const { data } = await this.#api.GET(
			"/workspaces/{workspaceSlug}/chat/sessions/{sessionId}/messages/",
			{
				params: { path: { workspaceSlug, sessionId } },
			},
		);
		return data!;
	}

	/**
	 * Open the raw Server-Sent Events stream of the assistant's reply.
	 *
	 * Returns the underlying `Response` so callers can handle the
	 * `text/event-stream` body themselves. Most callers want
	 * {@link streamMessage}, which parses each frame into a typed
	 * {@link ChatToken}.
	 *
	 * @param workspaceSlug - Workspace slug
	 * @param sessionId - Session ID
	 * @param message - The message to send
	 * @returns Promise that resolves with the event-stream response
	 * @throws {ApiError} if the request fails
	 */
	async sendMessage(
		workspaceSlug: string,
		sessionId: string,
		message: SendChatMessage,
	): Promise<Response> {
		const { response } = await this.#api.POST(
			"/workspaces/{workspaceSlug}/chat/sessions/{sessionId}/messages/",
			{
				params: { path: { workspaceSlug, sessionId } },
				body: message,
				parseAs: "stream",
			},
		);
		return response;
	}

	/**
	 * Send a message and stream the assistant's reply as Server-Sent Events.
	 *
	 * Yields each {@link ChatToken} delta as it arrives, until the reply ends.
	 * Break out of the loop to stop reading. For the raw response, use
	 * {@link sendMessage}.
	 *
	 * @param workspaceSlug - Workspace slug
	 * @param sessionId - Session ID
	 * @param message - The message to send
	 * @yields each {@link ChatToken} delta as it arrives
	 * @throws {ApiError} if the request fails to open
	 * @throws {NvisyError} if the response has no readable body
	 */
	async *streamMessage(
		workspaceSlug: string,
		sessionId: string,
		message: SendChatMessage,
	): AsyncGenerator<ChatToken> {
		const response = await this.sendMessage(workspaceSlug, sessionId, message);
		if (!response.body) {
			throw new NvisyError("Chat stream response has no body");
		}
		for await (const event of parseSseStream(response.body)) {
			// The server names delta frames `token` and failures `error`.
			if (event.event === "token") {
				yield JSON.parse(event.data) as ChatToken;
			} else if (event.event === "error") {
				throw new NvisyError(event.data);
			}
		}
	}
}
