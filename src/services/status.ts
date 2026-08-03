import type { ApiClient } from "@/client.js";
import type { Health } from "@/datatypes/index.js";

/**
 * Service for handling status and health check operations
 */
export class Status {
	#api: ApiClient;

	constructor(api: ApiClient) {
		this.#api = api;
	}

	/**
	 * Check the health status of the API
	 * @returns Promise that resolves with the API health status
	 */
	async checkHealth(): Promise<Health> {
		const { data, error } = await this.#api.GET("/health/", {
			params: { path: { version: "v1" } },
		});
		// Health endpoint returns Health for both 200 and 503
		return (data ?? error) as Health;
	}
}
