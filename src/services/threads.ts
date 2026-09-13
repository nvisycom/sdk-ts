import type { ApiClient } from "@/client.js";
import type {
	CreateWorkspaceComment,
	CursorPagination,
	OpenWorkspaceThread,
	RenameWorkspaceThread,
	UpdateWorkspaceComment,
	WorkspaceComment,
	WorkspaceThread,
	WorkspaceThreadEntryPage,
	WorkspaceThreadPage,
	WorkspaceThreadsQuery,
} from "@/datatypes/index.js";

/**
 * Service for discussion threads and the comments within them.
 */
export class Threads {
	#api: ApiClient;

	constructor(api: ApiClient) {
		this.#api = api;
	}

	/**
	 * List a workspace's threads
	 * @param workspaceId - Workspace id
	 * @param query - Optional pagination and filters (status, limit, after)
	 * @returns Promise that resolves with a paginated list of threads
	 * @throws {ApiError} if the request fails
	 */
	async listThreads(
		workspaceId: string,
		query?: CursorPagination & WorkspaceThreadsQuery,
	): Promise<WorkspaceThreadPage> {
		const { data } = await this.#api.GET("/workspaces/{workspaceId}/threads/", {
			params: { path: { workspaceId }, query },
		});
		return data!;
	}

	/**
	 * Open a new thread in a workspace
	 * @param workspaceId - Workspace id
	 * @param thread - Thread creation request
	 * @returns Promise that resolves with the created thread
	 * @throws {ApiError} if the request fails
	 */
	async openThread(
		workspaceId: string,
		thread: OpenWorkspaceThread,
	): Promise<WorkspaceThread> {
		const { data } = await this.#api.POST(
			"/workspaces/{workspaceId}/threads/",
			{
				params: { path: { workspaceId } },
				body: thread,
			},
		);
		return data!;
	}

	/**
	 * Rename a thread
	 * @param workspaceId - Workspace id
	 * @param threadId - Thread ID
	 * @param updates - Thread rename request
	 * @returns Promise that resolves with the updated thread
	 * @throws {ApiError} if the request fails
	 */
	async renameThread(
		workspaceId: string,
		threadId: string,
		updates: RenameWorkspaceThread,
	): Promise<WorkspaceThread> {
		const { data } = await this.#api.PATCH(
			"/workspaces/{workspaceId}/threads/{threadId}/",
			{
				params: { path: { workspaceId, threadId } },
				body: updates,
			},
		);
		return data!;
	}

	/**
	 * Delete a thread
	 * @param workspaceId - Workspace id
	 * @param threadId - Thread ID
	 * @returns Promise that resolves when the thread is deleted
	 * @throws {ApiError} if the request fails
	 */
	async deleteThread(workspaceId: string, threadId: string): Promise<void> {
		await this.#api.DELETE("/workspaces/{workspaceId}/threads/{threadId}/", {
			params: { path: { workspaceId, threadId } },
		});
	}

	/**
	 * Close a thread, ending the discussion.
	 * @param workspaceId - Workspace id
	 * @param threadId - Thread ID
	 * @returns Promise that resolves with the closed thread
	 * @throws {ApiError} if the request fails
	 */
	async closeThread(
		workspaceId: string,
		threadId: string,
	): Promise<WorkspaceThread> {
		const { data } = await this.#api.POST(
			"/workspaces/{workspaceId}/threads/{threadId}/close/",
			{
				params: { path: { workspaceId, threadId } },
			},
		);
		return data!;
	}

	/**
	 * Reopen a closed thread.
	 * @param workspaceId - Workspace id
	 * @param threadId - Thread ID
	 * @returns Promise that resolves with the reopened thread
	 * @throws {ApiError} if the request fails
	 */
	async reopenThread(
		workspaceId: string,
		threadId: string,
	): Promise<WorkspaceThread> {
		const { data } = await this.#api.DELETE(
			"/workspaces/{workspaceId}/threads/{threadId}/close/",
			{
				params: { path: { workspaceId, threadId } },
			},
		);
		return data!;
	}

	/**
	 * List a thread's timeline: comments interleaved with lifecycle events.
	 * @param workspaceId - Workspace id
	 * @param threadId - Thread ID
	 * @param query - Optional pagination parameters (limit, after)
	 * @returns Promise that resolves with a paginated timeline
	 * @throws {ApiError} if the request fails
	 */
	async listTimeline(
		workspaceId: string,
		threadId: string,
		query?: CursorPagination,
	): Promise<WorkspaceThreadEntryPage> {
		const { data } = await this.#api.GET(
			"/workspaces/{workspaceId}/threads/{threadId}/timeline/",
			{
				params: { path: { workspaceId, threadId }, query },
			},
		);
		return data!;
	}

	/**
	 * Post a comment to a thread
	 * @param workspaceId - Workspace id
	 * @param threadId - Thread ID
	 * @param comment - Comment creation request
	 * @returns Promise that resolves with the created comment
	 * @throws {ApiError} if the request fails
	 */
	async createComment(
		workspaceId: string,
		threadId: string,
		comment: CreateWorkspaceComment,
	): Promise<WorkspaceComment> {
		const { data } = await this.#api.POST(
			"/workspaces/{workspaceId}/threads/{threadId}/comments/",
			{
				params: { path: { workspaceId, threadId } },
				body: comment,
			},
		);
		return data!;
	}

	/**
	 * Edit a comment
	 * @param workspaceId - Workspace id
	 * @param commentId - Comment ID
	 * @param updates - Comment update request
	 * @returns Promise that resolves with the updated comment
	 * @throws {ApiError} if the request fails
	 */
	async updateComment(
		workspaceId: string,
		commentId: string,
		updates: UpdateWorkspaceComment,
	): Promise<WorkspaceComment> {
		const { data } = await this.#api.PATCH(
			"/workspaces/{workspaceId}/comments/{commentId}/",
			{
				params: { path: { workspaceId, commentId } },
				body: updates,
			},
		);
		return data!;
	}

	/**
	 * Delete a comment
	 * @param workspaceId - Workspace id
	 * @param commentId - Comment ID
	 * @returns Promise that resolves when the comment is deleted
	 * @throws {ApiError} if the request fails
	 */
	async deleteComment(workspaceId: string, commentId: string): Promise<void> {
		await this.#api.DELETE("/workspaces/{workspaceId}/comments/{commentId}/", {
			params: { path: { workspaceId, commentId } },
		});
	}
}
