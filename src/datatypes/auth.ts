import type { components } from "@/schema/api.js";

type Schemas = components["schemas"];

// Authentication.
export type Login = Schemas["Login"];
export type Signup = Schemas["Signup"];
export type AuthToken = Schemas["AuthToken"];
