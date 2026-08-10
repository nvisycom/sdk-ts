import type { components } from "@/schema/api.js";

type Schemas = components["schemas"];

export type Workspace = Schemas["Workspace"];
export type CreateWorkspace = Schemas["CreateWorkspace"];
export type UpdateWorkspace = Schemas["UpdateWorkspace"];
export type WorkspaceRole = Schemas["WorkspaceRole"];
export type WorkspacePage = Schemas["WorkspacePage"];

// Typed workspace settings: default retention and OCR rasterization policy.
export type WorkspaceSettings = Schemas["WorkspaceSettings"];
export type OcrPolicy = Schemas["OcrPolicy"];
export type OcrMode = Schemas["OcrMode"];
export type Dpi = Schemas["Dpi"];
