import type { components } from "@/schema/api.js";

type Schemas = components["schemas"];

// Pipeline resources.
/** `WorkspacePipeline` response. */
export type WorkspacePipeline = Schemas["WorkspacePipeline"];
/** Request payload for creating a new pipeline. */
export type CreateWorkspacePipeline = Schemas["CreateWorkspacePipeline"];
/** Request payload to update an existing pipeline. */
export type UpdateWorkspacePipeline = Schemas["UpdateWorkspacePipeline"];
/** A pipeline's detection + governance intent. */
export type PipelineDefinition = Schemas["PipelineDefinition"];
/** Query parameters for filtering pipelines. */
export type WorkspacePipelineFilter = Schemas["WorkspacePipelineFilter"];
/** The lifecycle status of a pipeline definition. */
export type PipelineStatus = Schemas["PipelineStatus"];
/** How a pipeline run was initiated. */
export type PipelineTriggerType = Schemas["PipelineTriggerType"];
/** Summary response for pipeline (used in lists). */
export type WorkspacePipelineSummary = Schemas["WorkspacePipelineSummary"];
/** Generic paginated response wrapper. */
export type WorkspacePipelineSummaryPage =
	Schemas["WorkspacePipelineSummaryPage"];
