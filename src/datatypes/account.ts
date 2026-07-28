import type { components } from "@/schema/api.js";

type Schemas = components["schemas"];

export type Account = Schemas["Account"];
export type PublicAccount = Schemas["PublicAccount"];
export type UpdateAccount = Schemas["UpdateAccount"];
