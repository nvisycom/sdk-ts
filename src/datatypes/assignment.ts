import type { components } from "@/schema/api.js";

type Schemas = components["schemas"];

// Reviewing files: assigning a file to a reviewer and tracking its status.

// Assignment resources.
export type Assignment = Schemas["Assignment"];
export type CreateAssignment = Schemas["CreateAssignment"];
export type UpdateAssignment = Schemas["UpdateAssignment"];
export type AssignmentPage = Schemas["AssignmentPage"];
export type WorkspaceAssignmentsQuery = Schemas["WorkspaceAssignmentsQuery"];

// The review status of an assignment.
export type AssignmentStatus = Schemas["AssignmentStatus"];
