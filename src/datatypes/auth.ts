import type { components } from "@/schema/api.js";

type Schemas = components["schemas"];

// Authentication. Login and signup start a cookie-based browser session and
// return no body; programmatic clients use an API token from `apiTokens`.
/** Request payload for login. */
export type Login = Schemas["Login"];
/** Request payload for signup. */
export type Signup = Schemas["Signup"];

// Minting a long-lived native-app token from a browser session for a desktop app.
/** Request payload to mint a native-app (desktop) session token. */
export type DesktopTokenRequest = Schemas["DesktopTokenRequest"];
/** The result of minting a native-app (desktop) session token. */
export type AccountDesktopToken = Schemas["AccountDesktopToken"];
