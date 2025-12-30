import { db } from "@/db/db";
import { messages } from "@/db/schema/schema";
import { createCursor } from "@/server/common/utils/create-cursor";
import { createPaginationResponse } from "@/server/common/utils/response-utils";
import { PaginationOption } from "@/types/types";
import { and, count, eq, lte } from "drizzle-orm/sql";
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

export const findAllMessages = async (
  conversationId: string,
  { cursor, limit }: PaginationOption
) => {
  let decodedCursor: Date | null;

  if (!cursor) {
    decodedCursor = null;
  } else {
    const decodedString = Buffer.from(cursor).toString();
    decodedCursor = new Date(decodedString);
  }

  const result = await db
    .select()
    .from(messages)
    .where(
      and(
        eq(messages.conversationId, conversationId),
        decodedCursor ? lte(messages.createdAt, decodedCursor) : undefined
      )
    )
    .orderBy(messages.createdAt)
    .limit(limit + 1);

  const [{ count: totalElements }] = await db
    .select({ count: count() })
    .from(messages)
    .where(eq(messages.conversationId, conversationId));

  const nextValue = result.length > limit ? result.pop()?.createdAt : null;
  const nextCursor = nextValue ? createCursor(nextValue.toISOString()) : null;

  return createPaginationResponse(result, {
    nextCursor,
    totalElements,
    hasNext: !!nextCursor,
  });
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
