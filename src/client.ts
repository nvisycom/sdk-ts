import { NvisyClientConfig } from "./types.js";

/**
 * Main client class for interacting with the Nvisy document redaction API
 */
export class NvisyClient {
  private readonly config: Required<NvisyClientConfig>;

  /**
   * Create a new Nvisy client instance
   */
  constructor(config: NvisyClientConfig) {
    if (!config.apiKey) {
      throw new Error("API key is required");
    }

    // Set default configuration
    this.config = {
      baseUrl: "https://api.nvisy.com",
      timeout: 30000,
      maxRetries: 3,
      headers: {},
      ...config,
    };
  }

  /**
   * Get the current configuration
   */
  getConfig(): Required<NvisyClientConfig> {
    return { ...this.config };
  }
}
