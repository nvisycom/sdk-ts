import type { components } from "@/schema/api.js";

type Schemas = components["schemas"];

export type Integration = Schemas["Integration"];
export type CreateIntegration = Schemas["CreateIntegration"];
export type UpdateIntegration = Schemas["UpdateIntegration"];
export type UpdateIntegrationCredentials =
	Schemas["UpdateIntegrationCredentials"];
export type IntegrationType = Schemas["IntegrationType"];
export type IntegrationStatus = Schemas["IntegrationStatus"];
