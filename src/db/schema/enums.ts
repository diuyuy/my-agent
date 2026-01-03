import { pgEnum } from "drizzle-orm/pg-core";

// Enums
export const messageRoleEnum = pgEnum("message_role", [
  "user",
  "assistant",
  "system",
]);

export type MessageRole = (typeof messageRoleEnum.enumValues)[number];

export const fileTypeEnum = pgEnum("file_type", ["image", "audio", "pdf"]);
