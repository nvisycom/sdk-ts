import { NvisyClient } from "./client.js";
import { NvisyClientConfig } from "./config.js";
import { NvisyClientError } from "./errors.js";

/**
 * Builder class for constructing NvisyClient instances with a fluent API
 */
export class ClientBuilder {
	readonly #config: NvisyClientConfig;

	constructor(apiKey: string) {
		this.#config = { apiKey };
	}

	/**
	 * Set the API key for authentication
	 */
	apiKey(key: string): this {
		this.#config.apiKey = key;
		return this;
	}

	/**
	 * Set the base URL for the API
	 */
	baseUrl(url: string): this {
		this.#config.baseUrl = url;
		return this;
	}

	/**
	 * Set the request timeout in milliseconds
	 */
	timeout(ms: number): this {
		this.#config.timeout = ms;
		return this;
	}

	/**
	 * Set the maximum number of retry attempts
	 */
	maxRetries(retries: number): this {
		this.#config.maxRetries = retries;
		return this;
	}

	/**
	 * Set custom headers
	 */
	headers(headers: Record<string, string>): this {
		this.#config.headers = headers;
		return this;
	}

	/**
	 * Add a single custom header
	 */
	header(name: string, value: string): this {
		if (!this.#config.headers) {
			this.#config.headers = {};
		}
		this.#config.headers[name] = value;
		return this;
	}

	/**
	 * Build and return the configured NvisyClient instance
	 */
	build(): NvisyClient {
		return new NvisyClient(this.#config);
	}
}
