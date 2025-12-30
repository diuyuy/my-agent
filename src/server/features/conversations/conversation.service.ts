import { RESPONSE_STATUS } from "@/constants/response-status";
import { db } from "@/db/db";
import { conversations, favoriteConversations } from "@/db/schema/schema";
import { CommonHttpException } from "@/server/common/errors/common-http-exception";
import { createCursor } from "@/server/common/utils/create-cursor";
import { createPaginationResponse } from "@/server/common/utils/response-utils";
import { PaginationOption } from "@/types/types";
import {
  convertToModelMessages,
  streamText,
  TypeValidationError,
  validateUIMessages,
} from "ai";
import { and, count, eq, gte, isNull } from "drizzle-orm/sql";
import { MyUIMessage } from "../ai/ai.schemas";
import { generateTitle, getModel, myIdGenerator } from "../ai/ai.service";
import { insertMessages } from "../messages/message.service";

export const handleConversation = async (
  userId: string,
  message: MyUIMessage,
  modelProvider: string,
  conversationId?: string
) => {
  if (!conversationId) {
    return generateNewConversation(userId, message, modelProvider);
  }
};

const generateNewConversation = async (
  userId: string,
  message: MyUIMessage,
  modelProvider: string
) => {
  try {
    const serverSideUserId = myIdGenerator();
    const userMessageWithServerId = { ...message, id: serverSideUserId };
    const validatedMessages = await validateUIMessages<MyUIMessage>({
      messages: [userMessageWithServerId],
    });

    const newConversationId = await createConversation(userId);

    return streamText({
      model: getModel(modelProvider),
      messages: await convertToModelMessages(validatedMessages),
    }).toUIMessageStreamResponse({
      originalMessages: [message],
      generateMessageId: myIdGenerator,
      messageMetadata: () => ({
        modelProvider,
        conversationId: newConversationId,
      }),
      onFinish: async ({ messages }) => {
        const title = await generateTitle(messages);
        await Promise.all([
          updateConversationTitle(newConversationId, title),
          insertMessages(newConversationId, messages),
        ]);
      },
    });
  } catch (error) {
    if (error instanceof TypeValidationError) {
      throw new CommonHttpException(RESPONSE_STATUS.INVALID_REQUEST_FORMAT);
    } else {
      console.error(error);
      throw new CommonHttpException(RESPONSE_STATUS.INTERNAL_SERVER_ERROR);
    }
  }
};

const createConversation = async (userId: string) => {
  const [newConversation] = await db
    .insert(conversations)
    .values({ userId, title: "임시 타이틀" })
    .returning();

  return newConversation.id;
};

export const updateConversationTitle = async (
  conversationId: string,
  title: string,
  shouldValidate?: boolean,
  userId?: string
) => {
  if (shouldValidate && userId)
    await validateAccessability(userId, conversationId);

  await db
    .update(conversations)
    .set({ title })
    .where(eq(conversations.id, conversationId));
};

export const findAllConversations = async (
  userId: string,
  {
    cursor,
    limit,
    includeFavorite,
  }: PaginationOption & { includeFavorite?: boolean }
) => {
  console.log("🚀 ~ findAllConversations ~ includeFavorite:", includeFavorite);
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
      favoriteId: favoriteConversations.id,
    })
    .from(conversations)
    .leftJoin(
      favoriteConversations,
      eq(conversations.id, favoriteConversations.conversationId)
    )
    .where(
      and(
        eq(conversations.userId, userId),
        decodedCursor ? gte(conversations.updatedAt, decodedCursor) : undefined,
        !includeFavorite ? isNull(favoriteConversations.id) : undefined
      )
    )
    .orderBy(conversations.updatedAt)
    .limit(limit + 1);

  const nextValue = result.length > limit ? result.at(-1)?.updatedAt : null;
  const nextCursor = nextValue ? createCursor(nextValue.toISOString()) : null;

  const [{ count: totalElements }] = await db
    .select({ count: count() })
    .from(conversations)
    .where(eq(conversations.userId, userId));

  return createPaginationResponse(
    result.map(({ favoriteId, ...rest }) => ({
      ...rest,
      isFavorite: !!favoriteId,
    })),
    {
      nextCursor,
      totalElements,
      hasNext: !!nextCursor,
    }
  );
};

export const findFavorites = async (userId: string) => {
  const result = await db
    .select({
      id: conversations.id,
      title: conversations.title,
      createdAt: conversations.createdAt,
      updatedAt: conversations.updatedAt,
      favoriteId: favoriteConversations.id,
    })
    .from(conversations)
    .innerJoin(
      favoriteConversations,
      eq(conversations.id, favoriteConversations.conversationId)
    )
    .where(eq(conversations.userId, userId))
    .orderBy(favoriteConversations.createdAt);

  return result.map(({ id, title, createdAt, updatedAt }) => ({
    id,
    title,
    createdAt,
    updatedAt,
    isFavorite: true,
  }));
};

export const addFavoriteConversation = async (
  userId: string,
  conversationId: string
) => {
  await validateAccessability(userId, conversationId);

  await db
    .insert(favoriteConversations)
    .values({ userId, conversationId })
    .onConflictDoNothing({
      target: [
        favoriteConversations.userId,
        favoriteConversations.conversationId,
      ],
    });
};

export const deleteFavoriteConversation = async (
  userId: string,
  conversationId: string
) => {
  await db
    .delete(favoriteConversations)
    .where(
      and(
        eq(favoriteConversations.userId, userId),
        eq(favoriteConversations.conversationId, conversationId)
      )
    );
};

export const removeConversation = async (
  userId: string,
  conversationId: string
) => {
  // 권한 체크
  await validateAccessability(userId, conversationId);

  await db.delete(conversations).where(eq(conversations.id, conversationId));

  return {
    conversationId,
  };
};

export const validateAccessability = async (
  userId: string,
  conversationId: string
) => {
  const [conversation] = await db
    .select({ userId: conversations.userId })
    .from(conversations)
    .where(eq(conversations.id, conversationId));

  if (!conversation)
    throw new CommonHttpException(RESPONSE_STATUS.CONVERSATION_NOT_FOUND);

  if (conversation.userId !== userId)
    throw new CommonHttpException(RESPONSE_STATUS.ACCESS_CONVERSATION_DENIED);
};
