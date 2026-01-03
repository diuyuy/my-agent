import { RESPONSE_STATUS } from "@/constants/response-status";
import { db } from "@/db/db";
import { conversations, favoriteConversations } from "@/db/schema/schema";
import { CommonHttpException } from "@/server/common/errors/common-http-exception";
import { createCursor } from "@/server/common/utils/create-cursor";
import { createPaginationResponse } from "@/server/common/utils/response-utils";
import { PaginationOption } from "@/types/types";
import { TypeValidationError, validateUIMessages } from "ai";
import { and, count, desc, eq, gte, ilike, isNull } from "drizzle-orm/sql";
import { metadataSchema, MyUIMessage } from "../ai/ai.schemas";
import {
  generateTitle,
  generateUIMessageStreamResponse,
  myIdGenerator,
} from "../ai/ai.service";
import {
  findAllMessages,
  insertMessages,
  loadPreviousMessages,
} from "../messages/message.service";

export const handleSentMessage = async (
  userId: string,
  message: MyUIMessage,
  modelProvider: string,
  conversationId: string
) => {
  await validateAccessability(userId, conversationId);
  const serverSideUserId = myIdGenerator();
  const userMessageWithServerId = { ...message, id: serverSideUserId };

  // conversationId가 없을 경우 새로운 conversation 생성
  // if (!conversationId) {
  //   return generateNewConversationAndAIResponse(
  //     userId,
  //     userMessageWithServerId,
  //     modelProvider
  //   );
  // }

  return generateAIResponse(
    conversationId,
    userMessageWithServerId,
    modelProvider
  );
};

// const generateNewConversationAndAIResponse = async (
//   userId: string,
//   message: MyUIMessage,
//   modelProvider: string
// ) => {
//   try {
//     const validatedMessages = await validateUIMessages<MyUIMessage>({
//       messages: [message],
//     });

//     const title = generateTitle(message);
//     const newConversationId = await createConversation(userId, title);

//     return generateUIMessageStreamResponse({
//       conversationId: newConversationId,
//       messages: validatedMessages,
//       modelProvider,
//       onFinish: async ({ messages }) => {
//         await insertMessages(newConversationId, messages);
//       },
//     });
//   } catch (error) {
//     if (error instanceof TypeValidationError) {
//       throw new CommonHttpException(RESPONSE_STATUS.INVALID_REQUEST_FORMAT);
//     } else {
//       console.error(error);
//       throw new CommonHttpException(RESPONSE_STATUS.INTERNAL_SERVER_ERROR);
//     }
//   }
// };

const generateAIResponse = async (
  conversationId: string,
  message: MyUIMessage,
  modelProvider: string
) => {
  try {
    const previousMessages = await loadPreviousMessages(conversationId);
    console.log(
      "🚀 ~ generateAIResponse ~ previousMessages:",
      JSON.stringify(previousMessages, null, 2)
    );
    const validatedMessages = await validateUIMessages<MyUIMessage>({
      messages: [...previousMessages, message],
      metadataSchema,
    });

    return generateUIMessageStreamResponse({
      conversationId,
      messages: validatedMessages,
      modelProvider,
      onFinish: async ({ messages }) => {
        console.log(
          "🚀 ~ generateAIResponse ~ messages:",
          JSON.stringify(messages, null, 2)
        );
        await insertMessages(conversationId, messages);
      },
    });
  } catch (error) {
    if (error instanceof TypeValidationError) {
      console.log("TypeValidation Error Occured");
      throw new CommonHttpException(RESPONSE_STATUS.INVALID_REQUEST_FORMAT);
    } else {
      console.error(error);
      throw new CommonHttpException(RESPONSE_STATUS.INTERNAL_SERVER_ERROR);
    }
  }
};

export const createConversation = async (userId: string, message: string) => {
  const title = generateTitle(message);

  const [newConversation] = await db
    .insert(conversations)
    .values({ userId, title })
    .returning();

  return newConversation.id;
};

export const updateConversationTitle = async (
  conversationId: string,
  title: string,
  shouldValidate?: boolean,
  userId?: string
) => {
  console.log("sfsdf");
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
    filter,
  }: PaginationOption & { includeFavorite?: boolean; filter?: string }
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
        !includeFavorite ? isNull(favoriteConversations.id) : undefined,
        filter ? ilike(conversations.title, filter) : undefined
      )
    )
    .orderBy(desc(conversations.updatedAt))
    .limit(limit + 1);

  const nextValue = result.length > limit ? result.pop()?.updatedAt : null;
  const nextCursor = nextValue ? createCursor(nextValue.toISOString()) : null;

  const [{ count: totalElements }] = await db
    .select({ count: count() })
    .from(conversations)
    .leftJoin(
      favoriteConversations,
      eq(conversations.id, favoriteConversations.conversationId)
    )
    .where(
      and(
        eq(conversations.userId, userId),
        decodedCursor ? gte(conversations.updatedAt, decodedCursor) : undefined,
        !includeFavorite ? isNull(favoriteConversations.id) : undefined,
        filter ? ilike(conversations.title, filter) : undefined
      )
    );

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

export const findConversationById = async (
  userId: string,
  conversationId: string
) => {
  await validateAccessability(userId, conversationId);

  const [result] = await db
    .select()
    .from(conversations)
    .where(eq(conversations.id, conversationId));

  return result;
};

export const getMessagesInConversation = async (
  userId: string,
  conversationId: string,
  paginationOption: PaginationOption
) => {
  await validateAccessability(userId, conversationId);

  return findAllMessages(conversationId, paginationOption);
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
    .orderBy(desc(favoriteConversations.createdAt));

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
