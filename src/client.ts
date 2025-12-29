import createClient from "openapi-fetch";
import { ClientBuilder } from "@/builder.js";
import {
	type ClientConfig,
	resolveConfig,
	type ResolvedClientConfig,
} from "@/config.js";
import { ConfigError } from "@/errors.js";
import { DocumentsService } from "@/services/documents.js";
import { IntegrationsService } from "@/services/integrations.js";
import { MembersService } from "@/services/members.js";
import { StatusService } from "@/services/status.js";

/**
 * Main client class for interacting with the Nvisy document redaction API
 */
export class Client {
	#config: ResolvedClientConfig;
	#openApiClient: ReturnType<typeof createClient>;
	#status: StatusService;
	#documents: DocumentsService;
	#integrations: IntegrationsService;
	#members: MembersService;

	/**
	 * Create a new Nvisy client instance
	 */
	constructor(userConfig: ClientConfig) {
		try {
			// Validate and resolve configuration
			ClientBuilder.fromConfig(userConfig);
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
				"User-Agent": this.#config.userAgent,
				...this.#config.headers,
			},
		});

		// Initialize services
		this.#status = new StatusService(this);
		this.#documents = new DocumentsService(this);
		this.#integrations = new IntegrationsService(this);
		this.#members = new MembersService(this);
	}

	/**
	 * Create a new ClientBuilder for fluent configuration
	 */
	static builder(apiKey?: string): ClientBuilder {
		if (apiKey) {
			return new ClientBuilder().withApiKey(apiKey);
		} else {
			return new ClientBuilder();
		}
	}

	/**
	 * Create a client from environment variables
	 */
	static fromEnvironment(): Client {
		return ClientBuilder.fromEnvironment().build();
	}

	/**
	 * Create a client from a configuration object
	 */
	static fromConfig(config: ClientConfig): Client {
		return ClientBuilder.fromConfig(config).build();
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
	 * Get the documents service for document operations
	 */
	get documents(): DocumentsService {
		return this.#documents;
	}

	/**
	 * Get the integrations service for integration operations
	 */
	get integrations(): IntegrationsService {
		return this.#integrations;
	}

	/**
	 * Get the members service for member operations
	 */
	get members(): MembersService {
		return this.#members;
	}
}
