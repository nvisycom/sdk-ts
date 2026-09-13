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
	 * @param workspaceSlug - Workspace slug
	 * @param query - Optional pagination and filters (status, limit, after)
	 * @returns Promise that resolves with a paginated list of threads
	 * @throws {ApiError} if the request fails
	 */
	async listThreads(
		workspaceSlug: string,
		query?: CursorPagination & WorkspaceThreadsQuery,
	): Promise<WorkspaceThreadPage> {
		const { data } = await this.#api.GET(
			"/workspaces/{workspaceSlug}/threads/",
			{
				params: { path: { workspaceSlug }, query },
			},
		);
		return data!;
	}

	/**
	 * Open a new thread in a workspace
	 * @param workspaceSlug - Workspace slug
	 * @param thread - Thread creation request
	 * @returns Promise that resolves with the created thread
	 * @throws {ApiError} if the request fails
	 */
	async openThread(
		workspaceSlug: string,
		thread: OpenWorkspaceThread,
	): Promise<WorkspaceThread> {
		const { data } = await this.#api.POST(
			"/workspaces/{workspaceSlug}/threads/",
			{
				params: { path: { workspaceSlug } },
				body: thread,
			},
		);
		return data!;
	}

	/**
	 * Rename a thread
	 * @param workspaceSlug - Workspace slug
	 * @param threadId - Thread ID
	 * @param updates - Thread rename request
	 * @returns Promise that resolves with the updated thread
	 * @throws {ApiError} if the request fails
	 */
	async renameThread(
		workspaceSlug: string,
		threadId: string,
		updates: RenameWorkspaceThread,
	): Promise<WorkspaceThread> {
		const { data } = await this.#api.PATCH(
			"/workspaces/{workspaceSlug}/threads/{threadId}/",
			{
				params: { path: { workspaceSlug, threadId } },
				body: updates,
			},
		);
		return data!;
	}

	/**
	 * Delete a thread
	 * @param workspaceSlug - Workspace slug
	 * @param threadId - Thread ID
	 * @returns Promise that resolves when the thread is deleted
	 * @throws {ApiError} if the request fails
	 */
	async deleteThread(workspaceSlug: string, threadId: string): Promise<void> {
		await this.#api.DELETE("/workspaces/{workspaceSlug}/threads/{threadId}/", {
			params: { path: { workspaceSlug, threadId } },
		});
	}

	/**
	 * Close a thread, ending the discussion.
	 * @param workspaceSlug - Workspace slug
	 * @param threadId - Thread ID
	 * @returns Promise that resolves with the closed thread
	 * @throws {ApiError} if the request fails
	 */
	async closeThread(
		workspaceSlug: string,
		threadId: string,
	): Promise<WorkspaceThread> {
		const { data } = await this.#api.POST(
			"/workspaces/{workspaceSlug}/threads/{threadId}/close/",
			{
				params: { path: { workspaceSlug, threadId } },
			},
		);
		return data!;
	}

	/**
	 * Reopen a closed thread.
	 * @param workspaceSlug - Workspace slug
	 * @param threadId - Thread ID
	 * @returns Promise that resolves with the reopened thread
	 * @throws {ApiError} if the request fails
	 */
	async reopenThread(
		workspaceSlug: string,
		threadId: string,
	): Promise<WorkspaceThread> {
		const { data } = await this.#api.DELETE(
			"/workspaces/{workspaceSlug}/threads/{threadId}/close/",
			{
				params: { path: { workspaceSlug, threadId } },
			},
		);
		return data!;
	}

	/**
	 * List a thread's timeline: comments interleaved with lifecycle events.
	 * @param workspaceSlug - Workspace slug
	 * @param threadId - Thread ID
	 * @param query - Optional pagination parameters (limit, after)
	 * @returns Promise that resolves with a paginated timeline
	 * @throws {ApiError} if the request fails
	 */
	async listTimeline(
		workspaceSlug: string,
		threadId: string,
		query?: CursorPagination,
	): Promise<WorkspaceThreadEntryPage> {
		const { data } = await this.#api.GET(
			"/workspaces/{workspaceSlug}/threads/{threadId}/timeline/",
			{
				params: { path: { workspaceSlug, threadId }, query },
			},
		);
		return data!;
	}

	/**
	 * Post a comment to a thread
	 * @param workspaceSlug - Workspace slug
	 * @param threadId - Thread ID
	 * @param comment - Comment creation request
	 * @returns Promise that resolves with the created comment
	 * @throws {ApiError} if the request fails
	 */
	async createComment(
		workspaceSlug: string,
		threadId: string,
		comment: CreateWorkspaceComment,
	): Promise<WorkspaceComment> {
		const { data } = await this.#api.POST(
			"/workspaces/{workspaceSlug}/threads/{threadId}/comments/",
			{
				params: { path: { workspaceSlug, threadId } },
				body: comment,
			},
		);
		return data!;
	}

	/**
	 * Edit a comment
	 * @param workspaceSlug - Workspace slug
	 * @param commentId - Comment ID
	 * @param updates - Comment update request
	 * @returns Promise that resolves with the updated comment
	 * @throws {ApiError} if the request fails
	 */
	async updateComment(
		workspaceSlug: string,
		commentId: string,
		updates: UpdateWorkspaceComment,
	): Promise<WorkspaceComment> {
		const { data } = await this.#api.PATCH(
			"/workspaces/{workspaceSlug}/comments/{commentId}/",
			{
				params: { path: { workspaceSlug, commentId } },
				body: updates,
			},
		);
		return data!;
	}

	/**
	 * Delete a comment
	 * @param workspaceSlug - Workspace slug
	 * @param commentId - Comment ID
	 * @returns Promise that resolves when the comment is deleted
	 * @throws {ApiError} if the request fails
	 */
	async deleteComment(workspaceSlug: string, commentId: string): Promise<void> {
		await this.#api.DELETE(
			"/workspaces/{workspaceSlug}/comments/{commentId}/",
			{
				params: { path: { workspaceSlug, commentId } },
			},
		);
	}
}
