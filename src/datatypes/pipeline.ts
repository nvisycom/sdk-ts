import type { components } from "@/schema/api.js";

type Schemas = components["schemas"];

// Pipeline resources.
export type WorkspacePipeline = Schemas["WorkspacePipeline"];
export type CreateWorkspacePipeline = Schemas["CreateWorkspacePipeline"];
export type UpdateWorkspacePipeline = Schemas["UpdateWorkspacePipeline"];
export type PipelineDefinition = Schemas["PipelineDefinition"];
export type WorkspacePipelineFilter = Schemas["WorkspacePipelineFilter"];
export type PipelineStatus = Schemas["PipelineStatus"];
export type PipelineTriggerType = Schemas["PipelineTriggerType"];
export type WorkspacePipelineSummary = Schemas["WorkspacePipelineSummary"];
export type WorkspacePipelineSummaryPage =
	Schemas["WorkspacePipelineSummaryPage"];
