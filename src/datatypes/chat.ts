import type { components } from "@/schema/api.js";

type Schemas = components["schemas"];

// Assistant chat sessions and messages.
export type ChatSession = Schemas["ChatSession"];
export type ChatSessionPage = Schemas["ChatSessionPage"];
export type CreateChatSession = Schemas["CreateChatSession"];
export type ChatMessage = Schemas["ChatMessage"];
export type ChatRole = Schemas["ChatRole"];
export type SendChatMessage = Schemas["SendChatMessage"];

// One streamed token delta from the assistant's reply (`text/event-stream`).
export type ChatToken = Schemas["ChatToken"];
