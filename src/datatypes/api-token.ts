import type { components } from "@/schema/api.js";

type Schemas = components["schemas"];

// API token resources.
/** API token response structure. */
export type AccountApiToken = Schemas["AccountApiToken"];
/** API token with JWT token string (only returned on creation). */
export type AccountApiTokenWithJwt = Schemas["AccountApiTokenWithJwt"];
/** Request to create a new API token. */
export type CreateAccountApiToken = Schemas["CreateAccountApiToken"];
/** Request to update an existing API token. */
export type UpdateAccountApiToken = Schemas["UpdateAccountApiToken"];
/** Generic paginated response wrapper. */
export type AccountApiTokenPage = Schemas["AccountApiTokenPage"];
/** The type of API token, for authentication and tracking. */
export type ApiTokenType = Schemas["ApiTokenType"];
/** Expiration options for API tokens. */
export type TokenExpiration = Schemas["TokenExpiration"];
