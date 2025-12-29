import createClient, { type Client as OpenApiClient } from "openapi-fetch";
import { ClientBuilder } from "@/builder.js";
import {
	type ClientConfig,
	type ResolvedClientConfig,
	resolveConfig,
} from "@/config.js";
import { ConfigError } from "@/errors.js";
import type { paths } from "@/schema/api.js";
import {
	AccountService,
	ApiTokensService,
	CommentsService,
	DocumentsService,
	FilesService,
	IntegrationsService,
	InvitesService,
	MembersService,
	PipelinesService,
	ProjectsService,
	StatusService,
	TemplatesService,
	WebhooksService,
} from "@/services/index.js";

/** Typed openapi-fetch client for the Nvisy API */
export type ApiClient = OpenApiClient<paths>;

/**
 * Main client class for interacting with the Nvisy document redaction API
 */
export class Client {
	#config: ResolvedClientConfig;
	#api: ApiClient;

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
		this.#api = createClient<paths>({
			baseUrl: this.#config.baseUrl,
			headers: {
				Authorization: `Bearer ${this.#config.apiKey}`,
				"Content-Type": "application/json",
				"User-Agent": this.#config.userAgent,
				...this.#config.headers,
			},
		});
	}

	/**
	 * Create a new ClientBuilder for fluent configuration
	 */
	static builder(apiKey?: string): ClientBuilder {
		if (apiKey) {
			return new ClientBuilder().withApiKey(apiKey);
		}
		return new ClientBuilder();
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
	 * Get the typed openapi-fetch client for API calls
	 */
	get api(): ApiClient {
		return this.#api;
	}

	/**
	 * Account service for managing the authenticated user's account
	 */
	get account(): AccountService {
		return new AccountService(this.#api);
	}

	/**
	 * API tokens service for managing API tokens
	 */
	get apiTokens(): ApiTokensService {
		return new ApiTokensService(this.#api);
	}

	/**
	 * Comments service for managing file comments
	 */
	get comments(): CommentsService {
		return new CommentsService(this.#api);
	}

	/**
	 * Documents service for document operations
	 */
	get documents(): DocumentsService {
		return new DocumentsService(this.#api);
	}

	/**
	 * Files service for file operations
	 */
	get files(): FilesService {
		return new FilesService(this.#api);
	}

	/**
	 * Integrations service for integration operations
	 */
	get integrations(): IntegrationsService {
		return new IntegrationsService(this.#api);
	}

	/**
	 * Invites service for managing project invitations
	 */
	get invites(): InvitesService {
		return new InvitesService(this.#api);
	}

	/**
	 * Members service for member operations
	 */
	get members(): MembersService {
		return new MembersService(this.#api);
	}

	/**
	 * Pipelines service for pipeline operations
	 */
	get pipelines(): PipelinesService {
		return new PipelinesService(this.#api);
	}

	/**
	 * Projects service for project operations
	 */
	get projects(): ProjectsService {
		return new ProjectsService(this.#api);
	}

	/**
	 * Status service for health checks and API status
	 */
	get status(): StatusService {
		return new StatusService(this.#api);
	}

	/**
	 * Templates service for template operations
	 */
	get templates(): TemplatesService {
		return new TemplatesService(this.#api);
	}

	/**
	 * Webhooks service for webhook operations
	 */
	get webhooks(): WebhooksService {
		return new WebhooksService(this.#api);
	}
}
