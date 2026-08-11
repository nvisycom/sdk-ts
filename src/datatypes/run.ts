import type { components } from "@/schema/api.js";

type Schemas = components["schemas"];

export type PipelineRun = Schemas["PipelineRun"];
export type CreatePipelineRun = Schemas["CreatePipelineRun"];
export type PipelineRunStatus = Schemas["PipelineRunStatus"];
export type PipelineRunPage = Schemas["PipelineRunPage"];
export type PipelineRunsQuery = Schemas["PipelineRunsQuery"];
export type RunStatusEvent = Schemas["RunStatusEvent"];
export type Audit = Schemas["Audit"];
