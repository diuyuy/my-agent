import { createPaginationSchema } from "@/server/common/utils/schema-utils";
import { z } from "@hono/zod-openapi";
import { UserSendMessageSchema } from "./message.schema";

export const ConversationSchema = z.object({
  id: z.string(),
  title: z.string().openapi({ example: "대화 1" }),
  createdAt: z.date(),
  updatedAt: z.date(),
  isFavorite: z.boolean(),
});

export type Conversation = z.infer<typeof ConversationSchema>;

export const PaginationConversationSchema =
  createPaginationSchema(ConversationSchema);

export type PagenationConversation = z.infer<
  typeof PaginationConversationSchema
>;

export const UpdateUserSendMessageSchema = z.object({
  messages: z.array(UserSendMessageSchema),
});

export const UpdateConversationTitleSchema = z.object({
  title: z.string().nonempty(),
});

export type UpdateConversationTitleDto = z.infer<
  typeof UpdateConversationTitleSchema
>;
