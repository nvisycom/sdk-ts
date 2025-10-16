/**
 * Member role enumeration
 */
export type MemberRole = "owner" | "admin" | "editor" | "viewer";

/**
 * Member status enumeration
 */
export type MemberStatus = "active" | "pending" | "suspended";

/**
 * Member interface representing a member in the system
 */
export interface Member {
	/** Unique member identifier */
	id: string;
	/** Member email address */
	email: string;
	/** Member role */
	role: MemberRole;
	/** Current member status */
	status: MemberStatus;
	/** Timestamp when member was invited */
	invitedAt: string;
	/** Project ID this member belongs to */
	projectId: string;
}

/**
 * Member invite request interface
 */
export interface MemberInviteRequest {
	/** Email address to invite */
	email: string;
	/** Role to assign */
	role: MemberRole;
	/** Project ID to invite to */
	projectId: string;
}

/**
 * Member list query parameters
 */
export interface MemberListParams {
	/** Project ID to filter by */
	projectId?: string;
	/** Role to filter by */
	role?: MemberRole;
	/** Status to filter by */
	status?: MemberStatus;
	/** Maximum number of results to return */
	limit?: number;
	/** Offset for pagination */
	offset?: number;
}

/**
 * Member list response interface
 */
export interface MemberListResponse {
	/** List of members */
	members: Member[];
	/** Total count of members matching criteria */
	totalCount: number;
}
