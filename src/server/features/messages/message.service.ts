import { db } from "@/db/db";
import { messages } from "@/db/schema/schema";
import { createCursor } from "@/server/common/utils/create-cursor";
import { createPaginationResponse } from "@/server/common/utils/response-utils";
import { PaginationOption } from "@/types/types";
import { and, count, desc, eq, lte } from "drizzle-orm/sql";
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
  const msgs = uiMessages.map((message) => ({ conversationId, ...message }));

  await db.insert(messages).values(msgs).onConflictDoNothing();
  for (const { role, parts, metadata } of uiMessages) {
    console.log(JSON.stringify({ role, parts, metadata }, null, 2));
  }
};

export const findAllMessages = async (
  conversationId: string,
  { cursor, limit }: PaginationOption
) => {
  let decodedCursor: Date | null;

  if (!cursor) {
    decodedCursor = null;
  } else {
    const decodedString = Buffer.from(cursor, "base64").toString();
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
    .orderBy(desc(messages.createdAt))
    .limit(limit + 1);

  const [{ count: totalElements }] = await db
    .select({ count: count() })
    .from(messages)
    .where(eq(messages.conversationId, conversationId));

  const nextValue = result.length > limit ? result.pop()?.createdAt : null;
  const nextCursor = nextValue ? createCursor(nextValue.toISOString()) : null;
  result.sort((a, b) => {
    if (a.createdAt < b.createdAt) {
      return -1;
    }

    /* createdAt이 같을 경우, 하나의 요청 - 응답 주기에서 생성된 메시지
      이때 사용자 가 생성한 답이 맨 처음에 오도록 설정.
    */
    if (a.createdAt === b.createdAt) {
      if (a.role === "user") {
        return -1;
      }

      return 1;
    }

    return 1;
  });

  return createPaginationResponse(
    result.map(({ id, role, parts, metadata }) => ({
      id,
      role,
      parts,
      metadata: metadata ?? undefined,
    })),
    {
      nextCursor,
      totalElements,
      hasNext: !!nextCursor,
    }
  );
};

export const loadPreviousMessages = async (conversationId: string) => {
  const result = await db
    .select({
      id: messages.id,
      role: messages.role,
      parts: messages.parts,
      metadata: messages.metadata,
    })
    .from(messages)
    .where(eq(messages.conversationId, conversationId));

  return result.map(({ metadata, ...rest }) => ({
    ...rest,
    metadata: metadata === null ? undefined : metadata,
  }));
};
