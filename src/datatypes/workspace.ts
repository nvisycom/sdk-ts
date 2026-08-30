import type { components } from "@/schema/api.js";

type Schemas = components["schemas"];

export type Workspace = Schemas["Workspace"];
export type CreateWorkspace = Schemas["CreateWorkspace"];
export type UpdateWorkspace = Schemas["UpdateWorkspace"];
export type WorkspaceRole = Schemas["WorkspaceRole"];
export type WorkspacePage = Schemas["WorkspacePage"];

// Workspace settings: default retention and raster policy.
export type WorkspaceSettings = Schemas["WorkspaceSettings"];
export type RasterPolicy = Schemas["RasterPolicy"];

// Retention: shared rule, workspace defaults, pipeline override.
export type Retention = Schemas["Retention"];
export type RetentionSettings = Schemas["RetentionSettings"];
export type RetentionOverride = Schemas["RetentionOverride"];
