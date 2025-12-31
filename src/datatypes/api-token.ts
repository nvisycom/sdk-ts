import type { components } from "@/schema/api.js";

type Schemas = components["schemas"];

export type ApiToken = Schemas["ApiToken"];
export type ApiTokenWithJWT = Schemas["ApiTokenWithJWT"];
export type ApiTokenType = Schemas["ApiTokenType"];
export type CreateApiToken = Schemas["CreateApiToken"];
export type UpdateApiToken = Schemas["UpdateApiToken"];
export type TokenExpiration = Schemas["TokenExpiration"];
