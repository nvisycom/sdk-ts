import type { components } from "@/schema/api.js";

type Schemas = components["schemas"];

// API token resources.
export type AccountApiToken = Schemas["AccountApiToken"];
export type AccountApiTokenWithJwt = Schemas["AccountApiTokenWithJwt"];
export type ApiTokenType = Schemas["ApiTokenType"];
export type CreateAccountApiToken = Schemas["CreateAccountApiToken"];
export type UpdateAccountApiToken = Schemas["UpdateAccountApiToken"];
export type TokenExpiration = Schemas["TokenExpiration"];
export type AccountApiTokenPage = Schemas["AccountApiTokenPage"];
