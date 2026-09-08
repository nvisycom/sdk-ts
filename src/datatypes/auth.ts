import type { components } from "@/schema/api.js";

type Schemas = components["schemas"];

// Authentication. Login and signup start a cookie-based browser session and
// return no body; programmatic clients use an API token from `apiTokens`.
export type Login = Schemas["Login"];
export type Signup = Schemas["Signup"];
