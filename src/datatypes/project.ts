import type { components } from "@/schema/api.js";

type Schemas = components["schemas"];

export type Project = Schemas["Project"];
export type CreateProject = Schemas["CreateProject"];
export type UpdateProject = Schemas["UpdateProject"];
export type ProjectRole = Schemas["ProjectRole"];
