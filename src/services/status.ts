import type { ApiClient } from "@/client.js";
import type { MonitorStatus, CheckHealth } from "@/datatypes/index.js";

/**
 * Service for handling status and health check operations
 */
export class StatusService {
  #api: ApiClient;

  constructor(api: ApiClient) {
    this.#api = api;
  }

  /**
   * Check the health status of the API
   * @param options - Health check options
   * @returns Promise that resolves with the API health status
   */
  async health(options?: CheckHealth): Promise<MonitorStatus> {
    const result = await this.#api.GET("/health", {
      params: { path: { version: "v1" } },
      body: options ?? {},
    });
    // Health endpoint returns MonitorStatus for both 200 and 503
    return (result.data ?? result.error) as MonitorStatus;
  }
}
