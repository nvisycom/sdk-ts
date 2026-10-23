import type { components } from "@/schema/api.js";

type Schemas = components["schemas"];

// Workspace resources.
/** Workspace response. */
export type Workspace = Schemas["Workspace"];
/** Request payload for creating a new workspace. */
export type CreateWorkspace = Schemas["CreateWorkspace"];
/** Request payload to update an existing workspace. */
export type UpdateWorkspace = Schemas["UpdateWorkspace"];
/** The role and permission level of a workspace member. */
export type WorkspaceRole = Schemas["WorkspaceRole"];
/** Generic paginated response wrapper. */
export type WorkspacePage = Schemas["WorkspacePage"];

// Workspace settings: default retention and raster policy.
/**
 * Typed workspace settings, the JSON stored in the `workspaces.settings`
 * column.
 */
export type WorkspaceSettings = Schemas["WorkspaceSettings"];
/**
 * How a workspace's document pages are rasterised to images for OCR during
 * detection.
 */
export type RasterPolicy = Schemas["RasterPolicy"];

// Retention: shared rule, workspace defaults, pipeline override.
/** How long a class of data is retained. */
export type Retention = Schemas["Retention"];
/**
 * Retention for every scope. Missing fields default to ephemeral retention,
 * so an empty settings blob deletes each class of data as soon as it has been
 * processed.
 */
export type RetentionSettings = Schemas["RetentionSettings"];
/**
 * A pipeline's optional per-scope override of the workspace retention. A
 * `None` field inherits the workspace value for that scope.
 */
export type RetentionOverride = Schemas["RetentionOverride"];
