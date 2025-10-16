import { Client } from "@/client.js";
import type { ClientConfig } from "@/config.js";
import { loadConfigFromEnv } from "@/config.js";
import { ConfigError } from "@/errors.js";

/**
 * Reserved headers that cannot be overridden
 */
const RESERVED_HEADERS = ["authorization", "content-type", "user-agent"];

/**
 * Builder class for constructing client instances with a fluent API
 */
export class ClientBuilder {
	#config: Partial<ClientConfig> = {};

	/**
	 * Create a ClientBuilder instance with an API key
	 */
	static fromApiKey(apiKey: string): ClientBuilder {
		return new ClientBuilder().withApiKey(apiKey);
	}

	/**
	 * Create a ClientBuilder instance from environment variables
	 */
	static fromEnvironment(): ClientBuilder {
		const envConfig = loadConfigFromEnv();

		if (!envConfig.apiKey) {
			throw ConfigError.missingApiKey();
		}

		const builder = new ClientBuilder().withApiKey(envConfig.apiKey);

		if (envConfig.baseUrl) {
			builder.withBaseUrl(envConfig.baseUrl);
		}
		if (envConfig.timeout) {
			builder.withTimeout(envConfig.timeout);
		}
		if (envConfig.maxRetries !== undefined) {
			builder.withMaxRetries(envConfig.maxRetries);
		}
		if (envConfig.headers) {
			builder.withHeaders(envConfig.headers);
		}
		if (envConfig.userAgent) {
			builder.withUserAgent(envConfig.userAgent);
		}

		return builder;
	}

	/**
	 * Create a ClientBuilder instance from a configuration object
	 */
	static fromConfig(config: ClientConfig): ClientBuilder {
		const builder = new ClientBuilder().withApiKey(config.apiKey);

		if (config.baseUrl) {
			builder.withBaseUrl(config.baseUrl);
		}
		if (config.timeout !== undefined) {
			builder.withTimeout(config.timeout);
		}
		if (config.maxRetries !== undefined) {
			builder.withMaxRetries(config.maxRetries);
		}
		if (config.headers) {
			builder.withHeaders(config.headers);
		}
		if (config.userAgent) {
			builder.withUserAgent(config.userAgent);
		}

		return builder;
	}

	/**
	 * Set a custom user agent string
	 */
	withUserAgent(userAgent: string): this {
		this.#validateString("userAgent", userAgent);
		this.#config.userAgent = userAgent;
		return this;
	}

	/**
	 * Set the API key for authentication
	 */
	withApiKey(apiKey: string): this {
		this.#validateString("apiKey", apiKey);

		const trimmedKey = apiKey.trim();
		if (trimmedKey.length < 10) {
			throw ConfigError.invalidField(
				"apiKey",
				"must be at least 10 characters",
			);
		}

		if (!/^[a-zA-Z0-9_-]+$/.test(trimmedKey)) {
			throw ConfigError.invalidField("apiKey", "contains invalid characters");
		}

		this.#config.apiKey = trimmedKey;
		return this;
	}

	/**
	 * Set the base URL for the API
	 */
	withBaseUrl(baseUrl: string): this {
		this.#validateString("baseUrl", baseUrl);
		this.#validateUrl(baseUrl);
		this.#config.baseUrl = baseUrl;
		return this;
	}

	/**
	 * Set the request timeout in milliseconds
	 */
	withTimeout(timeoutMs: number): this {
		this.#validateInteger("timeout", timeoutMs, 1000, 300_000);
		this.#config.timeout = timeoutMs;
		return this;
	}

	/**
	 * Set the maximum number of retry attempts
	 */
	withMaxRetries(maxRetries: number): this {
		this.#validateInteger("maxRetries", maxRetries, 0, 5);
		this.#config.maxRetries = maxRetries;
		return this;
	}

	/**
	 * Add a single custom header (merges with existing headers)
	 */
	withHeader(name: string, value: string): this {
		this.#validateSingleHeader(name, value);

		if (!this.#config.headers) {
			this.#config.headers = {};
		}

		this.#config.headers[name] = value;
		return this;
	}

	/**
	 * Set custom headers (merges with existing headers)
	 */
	withHeaders(headers: Record<string, string>): this {
		if (!headers || typeof headers !== "object" || Array.isArray(headers)) {
			throw ConfigError.invalidField("headers", "must be a valid object");
		}

		for (const [name, value] of Object.entries(headers)) {
			this.withHeader(name, value);
		}

		return this;
	}

	/**
	 * Build and return the configured client instance
	 */
	build(): Client {
		if (!this.#config.apiKey) {
			throw ConfigError.missingApiKey();
		}

		return new Client(this.#config as ClientConfig);
	}

	/**
	 * Get the current configuration (for debugging/testing)
	 */
	getConfig(): Readonly<Partial<ClientConfig>> {
		return { ...this.#config };
	}

	/**
	 * Validate string field
	 */
	#validateString(fieldName: string, value: string): void {
		if (!value || typeof value !== "string" || value.trim().length === 0) {
			throw ConfigError.invalidField(fieldName, "must be a non-empty string");
		}
	}

	/**
	 * Validate integer field with range
	 */
	#validateInteger(
		fieldName: string,
		value: number,
		min: number,
		max: number,
	): void {
		if (!Number.isInteger(value) || value < min) {
			throw ConfigError.invalidField(fieldName, `must be an integer >= ${min}`);
		}

		if (value > max) {
			throw ConfigError.invalidField(fieldName, `must not exceed ${max}`);
		}
	}

	/**
	 * Validate URL format
	 */
	#validateUrl(baseUrl: string): void {
		let url: URL;
		try {
			url = new URL(baseUrl);
		} catch {
			throw ConfigError.invalidField("baseUrl", "must be a valid URL");
		}

		const allowedProtocols = ["https:", "http:"];
		if (!allowedProtocols.includes(url.protocol)) {
			throw ConfigError.invalidField(
				"baseUrl",
				`protocol must be one of: ${allowedProtocols.join(", ")}`,
			);
		}
	}

	/**
	 * Validate single header name and value
	 */
	#validateSingleHeader(name: string, value: string): void {
		if (!name || typeof name !== "string" || name.trim().length === 0) {
			throw ConfigError.invalidField(
				"header name",
				"must be a non-empty string",
			);
		}
		if (typeof value !== "string") {
			throw ConfigError.invalidField("header value", "must be a string");
		}

		// Check for invalid header names (RFC 7230)
		if (!/^[a-zA-Z0-9!#$%&'*+\-.^_`|~]+$/.test(name)) {
			throw ConfigError.invalidField(
				"header name",
				`invalid header name: ${name}`,
			);
		}

		// Check for reserved headers
		if (RESERVED_HEADERS.includes(name.toLowerCase())) {
			throw ConfigError.invalidField(
				"header name",
				`header "${name}" is reserved and cannot be overridden`,
			);
		}
	}
}
