/**
 * @fileoverview Standalone SDK functions that run before a {@link Nvisy}
 * client exists: authentication (starting a browser session) and the public
 * health check.
 *
 * @module standalone
 *
 * @example
 * ```typescript
 * import { login, checkHealth } from "@nvisy/sdk/standalone";
 *
 * if ((await checkHealth()).status === "healthy") {
 *   // Browser: start a cookie session
 *   await login(
 *     { identifier: "user@example.com", password: "..." },
 *     { credentials: "include" },
 *   );
 * }
 * ```
 */

export { login, signup, startOidcSignIn } from "@/standalone/auth.js";
export type { AuthConfig, HealthConfig } from "@/standalone/config.js";
export { checkHealth } from "@/standalone/health.js";
