import type { components } from "@/schema/api.js";

type Schemas = components["schemas"];

export type Account = Schemas["Account"];
export type PublicAccount = Schemas["PublicAccount"];
export type UpdateAccount = Schemas["UpdateAccount"];
// Public reference to the account behind a resource (creator, trigger, etc.).
export type AccountRef = Schemas["AccountRef"];
