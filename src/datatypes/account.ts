import type { components } from "@/schema/api.js";

type Schemas = components["schemas"];

/**
 * Lowercase, dash-separated identifier used in URLs and as account handles.
 */
export type Handle = Schemas["Handle"];

// Account resources.
/** Represents an account. */
export type Account = Schemas["Account"];
/**
 * Public view of an account, returned when looking up someone other than the
 * authenticated caller. Carries only the fields safe to share with a
 * workspace peer; private details (email, account flags) are omitted and
 * remain available solely through the caller's own `/account/` view.
 */
export type PublicAccount = Schemas["PublicAccount"];
/** Request payload to update an account's profile. */
export type UpdateAccount = Schemas["UpdateAccount"];
/**
 * Public reference to the account behind a resource — whoever created it,
 * uploaded it, triggered it, or performed it.
 */
export type AccountRef = Schemas["AccountRef"];

// Sign-in methods: the account's password and any linked OIDC providers.
/** The account's sign-in methods. */
export type AccountIdentities = Schemas["AccountIdentities"];
/** One of an account's sign-in methods, for the identities listing. */
export type AccountIdentity = Schemas["AccountIdentity"];
/** How an account authenticates. */
export type IdentityProvider = Schemas["IdentityProvider"];
/** A password set or change. */
export type SetPassword = Schemas["SetPassword"];
/** The response to a successful sign-in start: where to send the user. */
export type OidcStartResponse = Schemas["OidcStartResponse"];
