/**
 * Configuration options for the Nvisy client
 */
export interface ClientConfig {
	/**
	 * API key for authentication
	 */
	apiKey: string;

	/**
	 * Base URL for the Nvisy API
	 * @default "https://api.nvisy.com"
	 */
	baseUrl?: string;

	/**
	 * Request timeout in milliseconds
	 * @default 30000
	 */
	timeout?: number;

	/**
	 * Maximum number of retry attempts for failed requests
	 * @default 3
	 */
	maxRetries?: number;

	/**
	 * Custom headers to include with requests
	 */
	headers?: Record<string, string>;
}

/**
 * Internal fully-resolved configuration
 */
export type ResolvedClientConfig = Required<ClientConfig>;

/**
 * Environment variable names for configuration
 */
const ENV_VARS = {
	API_KEY: "NVISY_API_KEY",
	BASE_URL: "NVISY_BASE_URL",
	TIMEOUT: "NVISY_TIMEOUT",
	MAX_RETRIES: "NVISY_MAX_RETRIES",
} as const;

/**
 * Default configuration values
 */
const DEFAULTS = {
	baseUrl: "https://api.nvisy.com",
	timeout: 30_000,
	maxRetries: 3,
	headers: {},
} as const;

/**
 * Load configuration from environment variables
 */
export function loadConfigFromEnv(): Partial<ClientConfig> {
	const config: Partial<ClientConfig> = {};

	const apiKey = process.env[ENV_VARS.API_KEY];
	if (apiKey) {
		config.apiKey = apiKey;
	}

	const baseUrl = process.env[ENV_VARS.BASE_URL];
	if (baseUrl) {
		config.baseUrl = baseUrl;
	}

	const timeout = process.env[ENV_VARS.TIMEOUT];
	if (timeout) {
		const timeoutMs = parseInt(timeout, 10);
		if (!Number.isNaN(timeoutMs)) {
			config.timeout = timeoutMs;
		}
	}

	const maxRetries = process.env[ENV_VARS.MAX_RETRIES];
	if (maxRetries) {
		const retries = parseInt(maxRetries, 10);
		if (!Number.isNaN(retries)) {
			config.maxRetries = retries;
		}
	}

	return config;
}

/**
 * Resolve configuration with defaults
 */
export function resolveConfig(userConfig: ClientConfig): ResolvedClientConfig {
	const envConfig = loadConfigFromEnv();
	const mergedConfig = { ...envConfig, ...userConfig };

	return {
		apiKey: mergedConfig.apiKey || "",
		baseUrl: mergedConfig.baseUrl || DEFAULTS.baseUrl,
		timeout: mergedConfig.timeout ?? DEFAULTS.timeout,
		maxRetries: mergedConfig.maxRetries ?? DEFAULTS.maxRetries,
		headers: { ...DEFAULTS.headers, ...mergedConfig.headers },
	};
}

/**
 * Get available environment variable names
 */
export function getEnvironmentVariables(): Record<string, string> {
	return { ...ENV_VARS };
}
