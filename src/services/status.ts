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
	 * Check the health status of the API.
	 *
	 * Reports the server's health and that of its dependencies. Returns `Health`
	 * for both the healthy/degraded (200) and unhealthy (503) cases.
	 *
	 * @returns Promise that resolves with the API health status
	 */
	async checkHealth(): Promise<Health> {
		const { data, error } = await this.#api.GET("/health");
		// Health endpoint returns Health for both 200 and 503
		return (data ?? error) as Health;
	}

	/**
	 * Liveness probe: resolves if the process is running. Probes no dependencies.
	 *
	 * Returns the raw `Response` (the endpoint has no body); a non-2xx status
	 * throws via the error middleware.
	 *
	 * @returns Promise that resolves with the probe response
	 * @throws {ApiError} if the process is not live
	 */
	async checkLiveness(): Promise<Response> {
		const { response } = await this.#api.GET("/health/live");
		return response;
	}

	/**
	 * Readiness probe: reports the server's health and that of its dependencies,
	 * served from a short-lived cache. Returns `Health` for both the
	 * healthy/degraded (200) and unhealthy (503) cases. Safe to poll frequently.
	 *
	 * @returns Promise that resolves with the API health status
	 */
	async checkReadiness(): Promise<Health> {
		const { data, error } = await this.#api.GET("/health/ready");
		return (data ?? error) as Health;
	}
}
