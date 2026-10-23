import type { components } from "@/schema/api.js";

type Schemas = components["schemas"];

// Document reviews: assigning a document to a reviewer and tracking the review
// through its lifecycle, with a timeline of events.

// Review resources.
/**
 * Response type for a review: a named discussion on a document with a manual
 * sign-off lifecycle (0..N per document), opened explicitly. It carries a
 * `reviewStatus`, a `displayName`, and its `assignees` (0..N reviewers); its
 * stream is a `WorkspaceReviewEntry` timeline.
 */
export type WorkspaceReview = Schemas["WorkspaceReview"];
/** Request payload to open a review on a document. */
export type CreateWorkspaceReview = Schemas["CreateWorkspaceReview"];
/** Request payload to rename a review (set its title). */
export type RenameWorkspaceReview = Schemas["RenameWorkspaceReview"];
/** Generic paginated response wrapper. */
export type WorkspaceReviewPage = Schemas["WorkspaceReviewPage"];
/** Query parameters for listing a workspace's reviews (the review queue). */
export type WorkspaceReviewsQuery = Schemas["WorkspaceReviewsQuery"];

// Review timeline: comments interleaved with lifecycle events.
/**
 * One non-message entry in a review timeline (opened, renamed, a detection
 * or redaction linked, an assignment change, verified, or reopened).
 */
export type WorkspaceReviewEvent = Schemas["WorkspaceReviewEvent"];
/** The kind of a non-message entry in a review's timeline. */
export type ReviewEventKind = Schemas["ReviewEventKind"];
/** Generic paginated response wrapper. */
export type WorkspaceReviewEventPage = Schemas["WorkspaceReviewEventPage"];
/**
 * One entry in a review's timeline: either a message or a lifecycle event,
 * tagged so a client renders them interleaved in order.
 */
export type WorkspaceReviewEntry = Schemas["WorkspaceReviewEntry"];
/** Generic paginated response wrapper. */
export type WorkspaceReviewEntryPage = Schemas["WorkspaceReviewEntryPage"];

/**
 * The review state of a file thread (a file thread is the review of its
 * file). `None` on the thread means a workspace thread, which has no review.
 */
export type ReviewStatus = Schemas["ReviewStatus"];

// Comments on a review.
/** Response type for a comment: one message within a review's discussion. */
export type WorkspaceComment = Schemas["WorkspaceComment"];
/** Request payload to post a comment (message) in a review. */
export type CreateWorkspaceComment = Schemas["CreateWorkspaceComment"];
/** Request payload to edit a comment's body. */
export type UpdateWorkspaceComment = Schemas["UpdateWorkspaceComment"];
