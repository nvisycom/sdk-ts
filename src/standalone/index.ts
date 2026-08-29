/**
 * @fileoverview Standalone SDK functions that run before a {@link Nvisy}
 * client exists: authentication (to obtain a token) and the public health
 * check.
 *
 * @module standalone
 *
 * @example
 * ```typescript
 * import { login, checkHealth } from "@nvisy/sdk/standalone";
 * import { Nvisy } from "@nvisy/sdk";
 *
 * if ((await checkHealth()).status === "healthy") {
 *   const token = await login({ identifier: "user@example.com", password: "..." });
 *   const nvisy = new Nvisy({ apiToken: token.accessToken });
 * }
 * ```
 */

export { login, signup } from "@/standalone/auth.js";
export type { AuthConfig, HealthConfig } from "@/standalone/config.js";
export { checkHealth } from "@/standalone/health.js";
