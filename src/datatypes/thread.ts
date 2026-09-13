import type { components } from "@/schema/api.js";

type Schemas = components["schemas"];

// Discussion threads on a workspace and the comments within them.

// Thread resources.
export type WorkspaceThread = Schemas["WorkspaceThread"];
export type WorkspaceThreadPage = Schemas["WorkspaceThreadPage"];
export type WorkspaceThreadsQuery = Schemas["WorkspaceThreadsQuery"];
export type OpenWorkspaceThread = Schemas["OpenWorkspaceThread"];
export type RenameWorkspaceThread = Schemas["RenameWorkspaceThread"];

// A thread's timeline: comments interleaved with lifecycle events.
export type WorkspaceThreadEntry = Schemas["WorkspaceThreadEntry"];
export type WorkspaceThreadEntryPage = Schemas["WorkspaceThreadEntryPage"];
export type WorkspaceThreadEvent = Schemas["WorkspaceThreadEvent"];
export type ThreadEventKind = Schemas["ThreadEventKind"];

// Comment resources.
export type WorkspaceComment = Schemas["WorkspaceComment"];
export type CreateWorkspaceComment = Schemas["CreateWorkspaceComment"];
export type UpdateWorkspaceComment = Schemas["UpdateWorkspaceComment"];
