import type { components } from "@/schema/api.js";

type Schemas = components["schemas"];

// Document reviews: assigning a document to a reviewer and tracking the review
// through its lifecycle, with a timeline of events.

// Review resources.
export type WorkspaceReview = Schemas["WorkspaceReview"];
export type CreateWorkspaceReview = Schemas["CreateWorkspaceReview"];
export type WorkspaceReviewPage = Schemas["WorkspaceReviewPage"];
export type WorkspaceReviewsQuery = Schemas["WorkspaceReviewsQuery"];

// Review timeline: the events in a review's life.
export type WorkspaceReviewEvent = Schemas["WorkspaceReviewEvent"];
export type WorkspaceReviewEventPage = Schemas["WorkspaceReviewEventPage"];

// The review status of a document.
export type ReviewStatus = Schemas["ReviewStatus"];
