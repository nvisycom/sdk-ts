import type { ApiClient } from "@/client.js";
import type { Audit } from "@/datatypes/index.js";

/**
 * Service for workspace redactions, independent of the detection they came
 * from.
 */
export class Redactions {
	#api: ApiClient;

	constructor(api: ApiClient) {
		this.#api = api;
	}

	/**
	 * Get a redaction's review audit
	 * @param workspaceId - Workspace id
	 * @param redactionId - Redaction ID
	 * @returns Promise that resolves with the audit
	 * @throws {ApiError} if the request fails
	 */
	async getReview(workspaceId: string, redactionId: string): Promise<Audit> {
		const { data } = await this.#api.GET(
			"/workspaces/{workspaceId}/redactions/{redactionId}/review",
			{
				params: { path: { workspaceId, redactionId } },
			},
		);
		return data!;
	}
}
