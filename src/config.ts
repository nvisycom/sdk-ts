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
const ENV_VARS = {
  API_TOKEN: "NVISY_API_TOKEN",
  BASE_URL: "NVISY_BASE_URL",
  MAX_TIMEOUT: "NVISY_MAX_TIMEOUT",
  MAX_RETRIES: "NVISY_MAX_RETRIES",
  USER_AGENT: "NVISY_USER_AGENT",
} as const;

/**
 * Default configuration values
 */
const DEFAULTS = {
  baseUrl: "https://api.nvisy.com",
  timeout: 30_000,
  maxRetries: 3,
  headers: {},
  userAgent: buildUserAgent(),
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

  const timeout = process.env[ENV_VARS.MAX_TIMEOUT];
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

  const userAgent = process.env[ENV_VARS.USER_AGENT];
  if (userAgent) {
    config.userAgent = userAgent;
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
    userAgent: mergedConfig.userAgent || DEFAULTS.userAgent,
  };
}

/**
 * Get available environment variable names
 */
export function getEnvironmentVariables(): Record<string, string> {
  return { ...ENV_VARS };
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
