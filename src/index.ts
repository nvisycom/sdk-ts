// Main client classes
export { ClientBuilder } from "@/builder.js";
export { Client } from "@/client.js";
// Configuration
export type { ClientConfig, ResolvedClientConfig } from "@/config.js";
export {
	getEnvironmentVariables,
	loadConfigFromEnv,
	resolveConfig,
} from "@/config.js";
// Data types
export type {
	Document,
	DocumentListParams,
	DocumentListResponse,
	DocumentStatus,
	DocumentUploadRequest,
	HealthStatus,
	Integration,
	IntegrationCreateRequest,
	IntegrationListParams,
	IntegrationListResponse,
	IntegrationProvider,
	IntegrationStatus,
	Member,
	MemberInviteRequest,
	MemberListParams,
	MemberListResponse,
	MemberRole,
	MemberStatus,
} from "@/datatypes/index.js";
export type { ErrorResponse } from "@/errors.js";
// Error handling
export { ApiError, ClientError, ConfigError, NetworkError } from "@/errors.js";
// Services
export {
	DocumentsService,
	IntegrationsService,
	MembersService,
	StatusService,
} from "@/services/index.js";
