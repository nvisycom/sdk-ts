import type { components } from "@/schema/api.js";

type Schemas = components["schemas"];

export type PipelineRun = Schemas["PipelineRun"];
export type CreatePipelineRun = Schemas["CreatePipelineRun"];
export type PipelineRunStatus = Schemas["PipelineRunStatus"];
export type PipelineRunsPage = Schemas["PipelineRunsPage"];
export type AnalyzedDocument = Schemas["AnalyzedDocument"];
