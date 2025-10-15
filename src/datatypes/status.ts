/**
 * Health status response interface
 */
export interface HealthStatus {
	/** Current health status of the service */
	status: "healthy" | "unhealthy" | "degraded";
	/** Timestamp when the health check was performed */
	timestamp: string;
}
