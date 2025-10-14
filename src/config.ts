/**
 * Configuration options for the Nvisy client
 */
export interface NvisyClientConfig {
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
 * Get default configuration values
 */
export function getDefaultConfig(): Required<
	Omit<NvisyClientConfig, "apiKey">
> & { apiKey?: string } {
	return {
		apiKey: undefined,
		baseUrl: "https://api.nvisy.com",
		timeout: 30000,
		maxRetries: 3,
		headers: {},
	};
}

/**
 * Merge user configuration with defaults
 */
export function mergeConfig(
	userConfig: NvisyClientConfig,
): Required<NvisyClientConfig> {
	const defaults = getDefaultConfig();

	return {
		apiKey: userConfig.apiKey,
		baseUrl: userConfig.baseUrl ?? defaults.baseUrl,
		timeout: userConfig.timeout ?? defaults.timeout,
		maxRetries: userConfig.maxRetries ?? defaults.maxRetries,
		headers: { ...defaults.headers, ...userConfig.headers },
	};
}
