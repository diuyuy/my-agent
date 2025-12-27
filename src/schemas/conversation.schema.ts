import { createPaginationSchema } from "@/server/common/utils/create-schema";
import { z } from "@hono/zod-openapi";

export const ConversationSchema = z.object({
  id: z.string(),
  title: z.string().openapi({ example: "대화 1" }),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const PaginationConversationSchema =
  createPaginationSchema(ConversationSchema);
