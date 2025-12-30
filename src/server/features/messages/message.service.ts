import { db } from "@/db/db";
import { messages } from "@/db/schema/schema";
import { eq } from "drizzle-orm/sql";
import { MyUIMessage } from "../ai/ai.schemas";

export const createMessage = async (
  conversationId: string,
  createMessageDto: MyUIMessage
) => {
  const [newMessage] = await db
    .insert(messages)
    .values({
      ...createMessageDto,
      conversationId,
    })
    .returning();

  return newMessage;
};

export const insertMessages = async (
  conversationId: string,
  uiMessages: MyUIMessage[]
) => {
  await db
    .insert(messages)
    .values(uiMessages.map((msg) => ({ conversationId, ...msg })));
};

export const loadPreviousMessages = async (conversationId: string) => {
  const result = await db
    .select()
    .from(messages)
    .where(eq(messages.conversationId, conversationId));

  return result.map(({ metadata, ...rest }) => ({
    ...rest,
    metadata: metadata === null ? undefined : metadata,
  }));
};
