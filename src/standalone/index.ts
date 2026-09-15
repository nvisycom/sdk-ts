/**
 * @fileoverview Standalone SDK functions that run before a {@link Nvisy}
 * client exists: authentication (starting a browser session), the public
 * health check, and reading the deployment's auth capabilities.
 *
 * @module standalone
 *
 * @example
 * ```typescript
 * import { getAuthCapabilities, login } from "@nvisy/sdk/standalone";
 *
 * // Pre-auth: render the login screen for the methods this deployment offers
 * const auth = await getAuthCapabilities();
 *
 * // Browser: start a cookie session
 * await login(
 *   { identifier: "user@example.com", password: "..." },
 *   { credentials: "include" },
 * );
 * ```
 */

export { login, signup, startOidcSignIn } from "@/standalone/auth.js";
export { getAuthCapabilities } from "@/standalone/capabilities.js";
export type { AuthConfig, HealthConfig } from "@/standalone/config.js";
export { checkHealth } from "@/standalone/health.js";
