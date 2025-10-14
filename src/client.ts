import createClient from "openapi-fetch";
import { NvisyClientConfig, mergeConfig } from "./config.js";
import { NvisyClientError } from "./errors.js";
import { ClientBuilder } from "./client-builder.js";

/**
 * Main client class for interacting with the Nvisy document redaction API
 */
export class NvisyClient {
	private readonly config: Required<NvisyClientConfig>;
	private readonly client: ReturnType<typeof createClient>;

	/**
	 * Create a new Nvisy client instance
	 */
	constructor(config: NvisyClientConfig) {
		if (!config.apiKey) {
			throw NvisyClientError.missingApiKey();
		}

		// Merge user config with defaults
		this.config = mergeConfig(config);

		// Create openapi-fetch client
		this.client = createClient({
			baseUrl: this.config.baseUrl,
			headers: {
				Authorization: `Bearer ${this.config.apiKey}`,
				"User-Agent": "@nvisy/sdk",
				...this.config.headers,
			},
		});
	}

	/**
	 * Get the current configuration
	 */
	getConfig(): Required<NvisyClientConfig> {
		return { ...this.config };
	}

	/**
	 * Get the underlying openapi-fetch client for direct access
	 */
	getClient() {
		return this.client;
	}

	/**
	 * Create a new ClientBuilder instance for fluent API construction
	 */
	static builder(): ClientBuilder {
		return ClientBuilder.create();
	}
}
