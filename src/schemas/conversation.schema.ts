import { createPaginationSchema } from "@/server/common/utils/schema-utils";
import { z } from "@hono/zod-openapi";
import { UserMessageSchema } from "./message.schema";

export const ConversationSchema = z.object({
  id: z.string(),
  title: z.string().openapi({ example: "대화 1" }),
  createdAt: z.date(),
  updatedAt: z.date(),
  isFavorite: z.boolean(),
});

export const PaginationConversationSchema =
  createPaginationSchema(ConversationSchema);

export const UpdateUserMessageSchema = z.object({
  messages: z.array(UserMessageSchema),
});
