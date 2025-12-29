import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const packageJson = require("../package.json") as { version: string };

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
	 * Custom headers to include with requests
	 */
	headers?: Record<string, string>;

	/**
	 * Custom user agent string
	 * @default Generated automatically
	 */
	userAgent?: string;
}

/**
 * Internal fully-resolved configuration
 */
export type ResolvedClientConfig = Required<ClientConfig>;

/**
 * Environment variable names for configuration
 */
export const ENV_VARS = {
	API_TOKEN: "NVISY_API_TOKEN",
	BASE_URL: "NVISY_BASE_URL",
	USER_AGENT: "NVISY_USER_AGENT",
} as const;

/**
 * Default configuration values
 */
export const DEFAULTS = {
	baseUrl: "https://api.nvisy.com",
} as const;

/**
 * Load configuration from environment variables
 */
export function loadConfigFromEnv(): Partial<ClientConfig> {
	const config: Partial<ClientConfig> = {};

	const apiKey = process.env[ENV_VARS.API_TOKEN];
	if (apiKey) {
		config.apiKey = apiKey;
	}

	const baseUrl = process.env[ENV_VARS.BASE_URL];
	if (baseUrl) {
		config.baseUrl = baseUrl;
	}

	const userAgent = process.env[ENV_VARS.USER_AGENT];
	if (userAgent) {
		config.userAgent = userAgent;
	}

	return config;
}

/**
 * Resolve configuration with defaults
 */
export function resolveConfig(config: ClientConfig): ResolvedClientConfig {
	return {
		apiKey: config.apiKey,
		baseUrl: config.baseUrl || DEFAULTS.baseUrl,
		headers: config.headers || {},
		userAgent: config.userAgent || buildUserAgent(),
	};
}

/**
 * Build user agent string
 */
export function buildUserAgent(): string {
	const sdkVersion = packageJson.version;
	const nodeVersion = process.version || "unknown";
	const platform = process.platform || "unknown";
	return `@nvisy/sdk v. ${sdkVersion} (${platform}; Node.js ${nodeVersion})`;
}
