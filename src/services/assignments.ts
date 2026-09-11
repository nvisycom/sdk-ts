import type { ApiClient } from "@/client.js";
import type {
	Assignment,
	AssignmentPage,
	CreateAssignment,
	CursorPagination,
	UpdateAssignment,
	WorkspaceAssignmentsQuery,
} from "@/datatypes/index.js";

/**
 * Service for file assignments: assigning a file to a reviewer and tracking its
 * review status (`assigned` → `in_review` → `done`).
 */
export class Assignments {
	#api: ApiClient;

	constructor(api: ApiClient) {
		this.#api = api;
	}

	/**
	 * List the assignments on a file, most recent first.
	 * @param workspaceSlug - Workspace slug
	 * @param fileId - File ID
	 * @returns Promise that resolves with the file's assignments
	 * @throws {ApiError} if the request fails
	 */
	async listFileAssignments(
		workspaceSlug: string,
		fileId: string,
	): Promise<Assignment[]> {
		const { data } = await this.#api.GET(
			"/workspaces/{workspaceSlug}/files/{fileId}/assignments/",
			{
				params: { path: { workspaceSlug, fileId } },
			},
		);
		return data!;
	}

	/**
	 * Assign a file to a reviewer.
	 * @param workspaceSlug - Workspace slug
	 * @param fileId - File ID
	 * @param assignment - Assignment creation request
	 * @returns Promise that resolves with the created assignment
	 * @throws {ApiError} if the request fails
	 */
	async createAssignment(
		workspaceSlug: string,
		fileId: string,
		assignment: CreateAssignment,
	): Promise<Assignment> {
		const { data } = await this.#api.POST(
			"/workspaces/{workspaceSlug}/files/{fileId}/assignments/",
			{
				params: { path: { workspaceSlug, fileId } },
				body: assignment,
			},
		);
		return data!;
	}

	/**
	 * List a workspace's assignments, most recent first.
	 * @param workspaceSlug - Workspace slug
	 * @param query - Optional pagination and filters (assignee, status, fileId,
	 *   limit, after)
	 * @returns Promise that resolves with a paginated list of assignments
	 * @throws {ApiError} if the request fails
	 */
	async listAssignments(
		workspaceSlug: string,
		query?: CursorPagination & WorkspaceAssignmentsQuery,
	): Promise<AssignmentPage> {
		const { data } = await this.#api.GET(
			"/workspaces/{workspaceSlug}/assignments/",
			{
				params: { path: { workspaceSlug }, query },
			},
		);
		return data!;
	}

	/**
	 * Update an assignment (e.g. change its review status).
	 * @param workspaceSlug - Workspace slug
	 * @param assignmentId - Assignment ID
	 * @param updates - Assignment update request
	 * @returns Promise that resolves with the updated assignment
	 * @throws {ApiError} if the request fails
	 */
	async updateAssignment(
		workspaceSlug: string,
		assignmentId: string,
		updates: UpdateAssignment,
	): Promise<Assignment> {
		const { data } = await this.#api.PATCH(
			"/workspaces/{workspaceSlug}/assignments/{assignmentId}/",
			{
				params: { path: { workspaceSlug, assignmentId } },
				body: updates,
			},
		);
		return data!;
	}

	/**
	 * Delete an assignment.
	 * @param workspaceSlug - Workspace slug
	 * @param assignmentId - Assignment ID
	 * @returns Promise that resolves when the assignment is deleted
	 * @throws {ApiError} if the request fails
	 */
	async deleteAssignment(
		workspaceSlug: string,
		assignmentId: string,
	): Promise<void> {
		await this.#api.DELETE(
			"/workspaces/{workspaceSlug}/assignments/{assignmentId}/",
			{
				params: { path: { workspaceSlug, assignmentId } },
			},
		);
	}
}
