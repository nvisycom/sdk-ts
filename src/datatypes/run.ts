import type { components } from "@/schema/api.js";

type Schemas = components["schemas"];

// Opaque pipeline-run identifier.
export type RunId = Schemas["RunId"];

// Pipeline run resources.
export type PipelineRun = Schemas["PipelineRun"];
export type RunMetadata = Schemas["RunMetadata"];
export type CreatePipelineRun = Schemas["CreatePipelineRun"];
export type PipelineRunStatus = Schemas["PipelineRunStatus"];
export type PipelineRunPage = Schemas["PipelineRunPage"];
export type PipelineRunsQuery = Schemas["PipelineRunsQuery"];
export type RunStatusEvent = Schemas["RunStatusEvent"];
