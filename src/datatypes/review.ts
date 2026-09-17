import type { components } from "@/schema/api.js";

type Schemas = components["schemas"];

// Document reviews: assigning a document to a reviewer and tracking the review
// through its lifecycle, with a timeline of events.

// Review resources.
export type WorkspaceReview = Schemas["WorkspaceReview"];
export type CreateWorkspaceReview = Schemas["CreateWorkspaceReview"];
export type RenameWorkspaceReview = Schemas["RenameWorkspaceReview"];
export type WorkspaceReviewPage = Schemas["WorkspaceReviewPage"];
export type WorkspaceReviewsQuery = Schemas["WorkspaceReviewsQuery"];

// Review timeline: comments interleaved with lifecycle events.
export type WorkspaceReviewEvent = Schemas["WorkspaceReviewEvent"];
export type WorkspaceReviewEventPage = Schemas["WorkspaceReviewEventPage"];
export type WorkspaceReviewEntry = Schemas["WorkspaceReviewEntry"];
export type WorkspaceReviewEntryPage = Schemas["WorkspaceReviewEntryPage"];

// The review status of a document.
export type ReviewStatus = Schemas["ReviewStatus"];

// Comments on a review.
export type WorkspaceComment = Schemas["WorkspaceComment"];
export type CreateWorkspaceComment = Schemas["CreateWorkspaceComment"];
export type UpdateWorkspaceComment = Schemas["UpdateWorkspaceComment"];
