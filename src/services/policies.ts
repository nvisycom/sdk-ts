import type { ApiClient } from "@/client.js";
import type {
	CreatePolicy,
	CursorPagination,
	Policy,
	PolicySummaryPage,
	PolicyTemplateSummary,
	Template,
	UpdatePolicy,
} from "@/datatypes/index.js";

/**
 * Service for handling policy operations
 */
export class Policies {
	#api: ApiClient;

	constructor(api: ApiClient) {
		this.#api = api;
	}

	/**
	 * List policies in a workspace
	 * @param workspaceSlug - Workspace slug
	 * @param query - Optional pagination parameters (limit, after)
	 * @returns Promise that resolves with a paginated list of policies
	 * @throws {ApiError} if the request fails
	 */
	async listPolicies(
		workspaceSlug: string,
		query?: CursorPagination,
	): Promise<PolicySummaryPage> {
		const { data } = await this.#api.GET(
			"/workspaces/{workspaceSlug}/policies/",
			{
				params: { path: { workspaceSlug }, query },
			},
		);
		return data!;
	}

	/**
	 * Create a policy in a workspace
	 * @param workspaceSlug - Workspace slug
	 * @param policy - Policy creation request
	 * @returns Promise that resolves with the created policy
	 * @throws {ApiError} if the request fails
	 */
	async createPolicy(
		workspaceSlug: string,
		policy: CreatePolicy,
	): Promise<Policy> {
		const { data } = await this.#api.POST(
			"/workspaces/{workspaceSlug}/policies/",
			{
				params: { path: { workspaceSlug } },
				body: policy,
			},
		);
		return data!;
	}

	/**
	 * Get policy details by slug
	 * @param workspaceSlug - Workspace slug
	 * @param policySlug - Policy slug
	 * @returns Promise that resolves with the policy details
	 * @throws {ApiError} if the request fails
	 */
	async getPolicy(workspaceSlug: string, policySlug: string): Promise<Policy> {
		const { data } = await this.#api.GET(
			"/workspaces/{workspaceSlug}/policies/{policySlug}/",
			{
				params: { path: { workspaceSlug, policySlug } },
			},
		);
		return data!;
	}

	/**
	 * Update a policy
	 * @param workspaceSlug - Workspace slug
	 * @param policySlug - Policy slug
	 * @param updates - Policy update request
	 * @returns Promise that resolves with the updated policy
	 * @throws {ApiError} if the request fails
	 */
	async updatePolicy(
		workspaceSlug: string,
		policySlug: string,
		updates: UpdatePolicy,
	): Promise<Policy> {
		const { data } = await this.#api.PATCH(
			"/workspaces/{workspaceSlug}/policies/{policySlug}/",
			{
				params: { path: { workspaceSlug, policySlug } },
				body: updates,
			},
		);
		return data!;
	}

	/**
	 * Delete a policy
	 * @param workspaceSlug - Workspace slug
	 * @param policySlug - Policy slug
	 * @returns Promise that resolves when the policy is deleted
	 * @throws {ApiError} if the request fails
	 */
	async deletePolicy(workspaceSlug: string, policySlug: string): Promise<void> {
		await this.#api.DELETE(
			"/workspaces/{workspaceSlug}/policies/{policySlug}/",
			{
				params: { path: { workspaceSlug, policySlug } },
			},
		);
	}

	/**
	 * List the built-in policy templates
	 * @returns Promise that resolves with the policy template summaries
	 * @throws {ApiError} if the request fails
	 */
	async listTemplates(): Promise<PolicyTemplateSummary[]> {
		const { data } = await this.#api.GET("/catalog/policy-templates/");
		return data!;
	}

	/**
	 * Get a built-in policy template by slug
	 * @param templateSlug - Template slug
	 * @returns Promise that resolves with the template
	 * @throws {ApiError} if the request fails
	 */
	async getTemplate(templateSlug: string): Promise<Template> {
		const { data } = await this.#api.GET(
			"/catalog/policy-templates/{templateSlug}/",
			{
				params: { path: { templateSlug } },
			},
		);
		return data!;
	}
}
