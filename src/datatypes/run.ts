import type { components } from "@/schema/api.js";

type Schemas = components["schemas"];

export type PipelineRun = Schemas["PipelineRun"];
export type CreatePipelineRun = Schemas["CreatePipelineRun"];
export type PipelineRunStatus = Schemas["PipelineRunStatus"];
export type PipelineRunPage = Schemas["PipelineRunPage"];
export type Audit = Schemas["Audit"];
export type Artifact = Schemas["Artifact"];
export type ArtifactType = Schemas["ArtifactType"];
