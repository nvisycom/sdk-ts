import type { components } from "@/schema/api.js";

type Schemas = components["schemas"];

// URL-safe slug, unique within its scope.
export type Handle = Schemas["Handle"];

// Account resources.
export type Account = Schemas["Account"];
export type PublicAccount = Schemas["PublicAccount"];
export type UpdateAccount = Schemas["UpdateAccount"];
// Public reference to the account behind a resource (creator, trigger, etc.).
export type AccountRef = Schemas["AccountRef"];

// Sign-in methods: the account's password and any linked OIDC providers.
export type AccountIdentities = Schemas["AccountIdentities"];
export type AccountIdentity = Schemas["AccountIdentity"];
export type IdentityProvider = Schemas["IdentityProvider"];
export type SetPassword = Schemas["SetPassword"];
// The provider authorize URL an OIDC sign-in / reauth / link redirects to.
export type OidcStartResponse = Schemas["OidcStartResponse"];
