import type { components } from "@/schema/api.js";

type Schemas = components["schemas"];

export type Pipeline = Schemas["Pipeline"];
export type CreatePipeline = Schemas["CreatePipeline"];
export type UpdatePipeline = Schemas["UpdatePipeline"];
export type PipelineDefinition = Schemas["PipelineDefinition"];
export type PipelineFilter = Schemas["PipelineFilter"];
export type PipelineStatus = Schemas["PipelineStatus"];
export type PipelineTriggerType = Schemas["PipelineTriggerType"];
export type PipelineSummary = Schemas["PipelineSummary"];
export type PipelineSummariesPage = Schemas["PipelineSummarysPage"];
