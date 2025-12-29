// Main client classes
export { ClientBuilder } from "@/builder.js";
export type { ApiClient } from "@/client.js";
export { Client } from "@/client.js";

// Configuration
export type { ClientConfig, ResolvedClientConfig } from "@/config.js";
export { DEFAULTS, ENV_VARS, loadConfigFromEnv, resolveConfig } from "@/config.js";

// Data types - re-export all from datatypes
export type * from "@/datatypes/index.js";

// Error handling
export type { ErrorResponse } from "@/errors.js";
export { ApiError, ClientError, ConfigError, NetworkError } from "@/errors.js";

// Services
export {
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
