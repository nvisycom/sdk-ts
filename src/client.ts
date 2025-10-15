import createClient from "openapi-fetch";
import { ClientBuilder } from "@/builder.js";
import {
	type ClientConfig,
	type ResolvedClientConfig,
	resolveConfig,
} from "@/config.js";
import { ConfigError } from "@/errors.js";
import { StatusService } from "@/services/status.js";

/**
 * Main client class for interacting with the Nvisy document redaction API
 */
export class Client {
	#config: ResolvedClientConfig;
	#openApiClient: ReturnType<typeof createClient>;
	#status: StatusService;

	/**
	 * Create a new Nvisy client instance
	 */
	constructor(userConfig: ClientConfig) {
		try {
			// Validate configuration first
			this.#validateConfig(userConfig);
			// Resolve configuration with defaults
			this.#config = resolveConfig(userConfig);
		} catch (error) {
			if (error instanceof ConfigError) {
				throw error;
			}
			throw ConfigError.invalidField(
				"config",
				`Configuration error: ${String(error)}`,
			);
		}

		// Create openapi-fetch client with proper headers
		this.#openApiClient = createClient({
			baseUrl: this.#config.baseUrl,
			headers: {
				Authorization: `Bearer ${this.#config.apiKey}`,
				"Content-Type": "application/json",
				"User-Agent": this.#buildUserAgent(),
				...this.#config.headers,
			},
		});

		// Initialize services
		this.#status = new StatusService(this);
	}

	/**
	 * Create a new ClientBuilder for fluent configuration
	 */
	static builder(): ClientBuilder {
		return new ClientBuilder();
	}

	/**
	 * Create a client from environment variables
	 */
	static fromEnvironment(): Client {
		return ClientBuilder.fromEnvironment().build();
	}

	/**
	 * Get the current configuration (readonly copy)
	 */
	getConfig(): Readonly<ResolvedClientConfig> {
		return Object.freeze({ ...this.#config });
	}

	/**
	 * Get the underlying openapi-fetch client for advanced usage
	 */
	getOpenApiClient(): ReturnType<typeof createClient> {
		return this.#openApiClient;
	}

	/**
	 * Get the status service for health checks and API status
	 */
	get status(): StatusService {
		return this.#status;
	}

	/**
	 * Validate configuration by reusing ClientBuilder validation
	 */
	#validateConfig(config: ClientConfig): void {
		const builder = new ClientBuilder().withApiKey(config.apiKey);

		if (config.baseUrl !== undefined) {
			builder.withBaseUrl(config.baseUrl);
		}

		if (config.timeout !== undefined) {
			builder.withTimeout(config.timeout);
		}

		if (config.maxRetries !== undefined) {
			builder.withMaxRetries(config.maxRetries);
		}

		if (config.headers !== undefined) {
			builder.withHeaders(config.headers);
		}
	}

	/**
	 * Build user agent string
	 */
	#buildUserAgent(): string {
		// In a real implementation, this would import from package.json
		const sdkVersion = "1.0.0";
		const nodeVersion = process.version;
		const platform = process.platform;

		return `@nvisy/sdk/${sdkVersion} (${platform}; Node.js ${nodeVersion})`;
	}

	/**
	 * Create a new client with modified configuration
	 */
	withConfig(configChanges: Partial<ClientConfig>): Client {
		const newConfig: ClientConfig = {
			apiKey: this.#config.apiKey,
			baseUrl: this.#config.baseUrl,
			timeout: this.#config.timeout,
			maxRetries: this.#config.maxRetries,
			headers: this.#config.headers,
			...configChanges,
		};
		return new Client(newConfig);
	}

	/**
	 * Create a new client with additional headers
	 */
	withHeaders(additionalHeaders: Record<string, string>): Client {
		return this.withConfig({
			headers: { ...this.#config.headers, ...additionalHeaders },
		});
	}

	/**
	 * Create a new client with a different timeout
	 */
	withTimeout(timeoutMs: number): Client {
		return this.withConfig({ timeout: timeoutMs });
	}

	/**
	 * Create a new client with different retry settings
	 */
	withMaxRetries(maxRetries: number): Client {
		return this.withConfig({ maxRetries });
	}
}
