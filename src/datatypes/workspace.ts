import type { components } from "@/schema/api.js";

type Schemas = components["schemas"];

export type Workspace = Schemas["Workspace"];
export type CreateWorkspace = Schemas["CreateWorkspace"];
export type UpdateWorkspace = Schemas["UpdateWorkspace"];
export type WorkspaceRole = Schemas["WorkspaceRole"];
