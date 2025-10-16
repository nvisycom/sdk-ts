/**
 * Integration provider enumeration
 */
export type IntegrationProvider = "zapier" | "webhook" | "slack" | "email";

/**
 * Integration status enumeration
 */
export type IntegrationStatus = "active" | "inactive" | "error";

/**
 * Integration interface representing an integration in the system
 */
export interface Integration {
	/** Unique integration identifier */
	id: string;
	/** Integration name */
	name: string;
	/** Integration provider */
	provider: IntegrationProvider;
	/** Current integration status */
	status: IntegrationStatus;
	/** Timestamp when integration was created */
	createdAt: string;
	/** Project ID this integration belongs to */
	projectId: string;
}

/**
 * Integration creation request interface
 */
export interface IntegrationCreateRequest {
	/** Integration name */
	name: string;
	/** Integration provider */
	provider: IntegrationProvider;
	/** Project ID to create the integration in */
	projectId: string;
	/** Provider-specific configuration */
	config: Record<string, unknown>;
}

/**
 * Integration list query parameters
 */
export interface IntegrationListParams {
	/** Project ID to filter by */
	projectId?: string;
	/** Provider to filter by */
	provider?: IntegrationProvider;
	/** Status to filter by */
	status?: IntegrationStatus;
	/** Maximum number of results to return */
	limit?: number;
	/** Offset for pagination */
	offset?: number;
}

/**
 * Integration list response interface
 */
export interface IntegrationListResponse {
	/** List of integrations */
	integrations: Integration[];
	/** Total count of integrations matching criteria */
	totalCount: number;
}
