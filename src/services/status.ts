import type { Client } from "@/client.js";
import type { HealthStatus } from "@/datatypes/status.js";

/**
 * Service for handling status and health check operations
 */
export class StatusService {
	#client: Client;

	constructor(client: Client) {
		this.#client = client;
	}

	/**
	 * Get the underlying client instance
	 * @internal
	 */
	get client(): Client {
		return this.#client;
	}

	/**
	 * Check the health status of the API
	 * @returns Promise that resolves with the API health status
	 */
	async health(): Promise<HealthStatus> {
		throw new Error("Not implemented");
	}
}
