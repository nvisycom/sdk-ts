// Main client classes
export { Client } from "./client.js";
export { ClientBuilder } from "./builder.js";

// Configuration
export type { ClientConfig, ResolvedClientConfig } from "./config.js";
export {
	resolveConfig,
	loadConfigFromEnv,
	getEnvironmentVariables,
} from "./config.js";

// Error handling
export { ClientError, ConfigError, NetworkError, ApiError } from "./errors.js";
export type { ErrorResponse } from "./errors.js";

// Convenience aliases
export { Client as NvisyClient } from "./client.js";
