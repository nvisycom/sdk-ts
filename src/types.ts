/**
 * Configuration options for the Nvisy client
 */
export interface NvisyClientConfig {
  /**
   * API key for authentication
   */
  apiKey: string;
  /**
   * Base URL for the Nvisy API
   * @default "https://api.nvisy.com"
   */
  baseUrl?: string;
  /**
   * Request timeout in milliseconds
   * @default 30000
   */
  timeout?: number;
  /**
   * Maximum number of retry attempts for failed requests
   * @default 3
   */
  maxRetries?: number;
  /**
   * Custom headers to include with requests
   */
  headers?: Record<string, string>;
}

/**
 * API response wrapper
 */
export interface ApiResponse<T = unknown> {
  /**
   * Indicates if the request was successful
   */
  success: boolean;
  /**
   * Response data
   */
  data: T;
  /**
   * Error message if request failed
   */
  message?: string;
  /**
   * Request ID for debugging
   */
  requestId?: string;
}
