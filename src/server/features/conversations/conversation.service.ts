import { db } from "@/db/db";
import { conversations } from "@/db/schema/schema";
import { createCursor } from "@/server/common/utils/create-cursor";
import { createPaginationResponse } from "@/server/common/utils/create-response";
import { PaginationOption } from "@/types/types";
import { and, count, eq, gte } from "drizzle-orm/sql";

export const createConversation = async (userId: string, title: string) => {
  const [newConversation] = await db
    .insert(conversations)
    .values({ userId, title })
    .returning();

  return newConversation;
};

export const findAllConversations = async (
  userId: string,
  { cursor, limit }: PaginationOption
) => {
  let decodedCursor: Date | null;

  if (!cursor) {
    decodedCursor = null;
  } else {
    const decodedString = Buffer.from(cursor, "base64").toString("utf-8");
    decodedCursor = new Date(decodedString);
  }

  const result = await db
    .select({
      id: conversations.id,
      title: conversations.title,
      createdAt: conversations.createdAt,
      updatedAt: conversations.updatedAt,
    })
    .from(conversations)
    .where(
      and(
        eq(conversations.userId, userId),
        decodedCursor ? gte(conversations.updatedAt, decodedCursor) : undefined
      )
    )
    .orderBy(conversations.updatedAt)
    .limit(limit + 1);

  const nextValue = result.at(-1)?.updatedAt;
  const nextCursor = nextValue ? createCursor(nextValue.toISOString()) : null;

  const [{ count: totalElements }] = await db
    .select({ count: count() })
    .from(conversations);

  return createPaginationResponse(result, {
    nextCursor,
    totalElements,
    hasNext: !!nextCursor,
  });
};
