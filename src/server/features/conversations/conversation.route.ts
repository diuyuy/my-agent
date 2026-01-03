import { RESPONSE_STATUS } from "@/constants/response-status";
import { SuccessReponseSchema } from "@/schemas/common.schemas";
import {
  ConversationPaginationQuerySchema,
  ConversationParamSchema,
  ConversationSchema,
  PaginationConversationSchema,
  UpdateConversationTitleSchema,
} from "@/schemas/conversation.schema";

import { CACHE_TAG } from "@/constants/cache-tag";
import { SUCCESS_RESPONSE } from "@/constants/success-response";
import { SendMessageSchema } from "@/schemas/message.schema";
import { sessionMiddleware } from "@/server/common/middlewares/session.middleware";
import { Env } from "@/server/common/types/types";
import {
  createErrorResponseSignature,
  createSuccessResponse,
} from "@/server/common/utils/response-utils";
import { createPaginationSchema } from "@/server/common/utils/schema-utils";
import { zodValidationHook } from "@/server/common/utils/zod-validation-hook";
import { createRoute, OpenAPIHono, z } from "@hono/zod-openapi";
import { zValidator } from "@hono/zod-validator";
import { revalidateTag } from "next/cache";
import { MyUIMessage } from "../ai/ai.schemas";
import {
  addFavoriteConversation,
  createConversation,
  deleteFavoriteConversation,
  findAllConversations,
  findFavorites,
  getMessagesInConversation,
  handleSentMessage,
  removeConversation,
  updateConversationTitle,
} from "./conversation.service";

const conversationRoute = new OpenAPIHono<Env>();

// Register session middleware
conversationRoute.use(sessionMiddleware);

// Get All conversations with pagination
const findAllRoute = createRoute({
  method: "get",
  path: "/",
  request: {
    query: ConversationPaginationQuerySchema,
  },
  responses: {
    200: {
      content: {
        "application/json": {
          schema: SuccessReponseSchema.extend({
            data: PaginationConversationSchema,
          }),
        },
      },
      description: "Get all conversations",
    },
    400: createErrorResponseSignature(RESPONSE_STATUS.INVALID_REQUEST_FORMAT),
    500: createErrorResponseSignature(RESPONSE_STATUS.INTERNAL_SERVER_ERROR),
  },
});

conversationRoute.openapi(findAllRoute, async (c) => {
  const { cursor, limit, direction, includeFavorite, filter } =
    c.req.valid("query");
  const user = c.get("user");
  const conversations = await findAllConversations(user.id, {
    cursor,
    limit,
    direction,
    includeFavorite,
    filter,
  });

  return c.json(createSuccessResponse(RESPONSE_STATUS.OK, conversations), 200);
});

// Receive Message from Client
conversationRoute.openAPIRegistry.registerPath({
  path: "/",
  method: "post",
  request: {
    body: {
      content: {
        "application/json": {
          schema: SendMessageSchema,
          example: {
            UIMessage: "UIMessage Type from ai sdk",
            modelProvider: "gemini",
          },
        },
      },
    },
  },
  responses: {
    200: {
      content: {
        "text/event-stream": {
          schema: z.string(),
        },
      },
      description: "성공 응답(텍스트 스트림)",
    },
    400: createErrorResponseSignature(RESPONSE_STATUS.INVALID_REQUEST_FORMAT),
  },
});

conversationRoute.post(
  "/",
  zValidator("json", SendMessageSchema, zodValidationHook),
  async (c) => {
    const { message, modelProvider, conversationId } = c.req.valid("json");
    console.log("🚀 ~ modelProvider:", modelProvider);
    const user = c.get("user");
    revalidateTag(CACHE_TAG.getHistoryCacheTag(user.id), { expire: 0 });

    return handleSentMessage(
      user.id,
      message as MyUIMessage,
      modelProvider,
      conversationId
    );
  }
);

const createConversationRoute = createRoute({
  method: "post",
  path: "/new",
  request: {
    body: {
      content: {
        "application/json": {
          schema: z.object({
            message: z.string().nonempty(),
          }),
        },
      },
    },
  },
  responses: {
    200: {
      content: {
        "application/json": {
          schema: SuccessReponseSchema.extend({
            data: z.object({
              conversationId: z.string(),
            }),
          }),
        },
      },
      description: "요청 성공 응답",
    },
  },
});

conversationRoute.openapi(createConversationRoute, async (c) => {
  const { message } = c.req.valid("json");
  const user = c.get("user");

  const newConversationId = await createConversation(user.id, message);

  return c.json(
    createSuccessResponse(RESPONSE_STATUS.OK, {
      conversationId: newConversationId,
    })
  );
});

const deleteConversationRoute = createRoute({
  method: "delete",
  path: "/:conversationId",
  request: {
    params: ConversationParamSchema,
  },
  responses: {
    200: {
      content: {
        "application/json": {
          schema: SuccessReponseSchema.extend({
            data: z.object({
              conversationId: z.string(),
            }),
          }),
        },
      },
      description: "",
    },
    400: createErrorResponseSignature(RESPONSE_STATUS.INVALID_REQUEST_FORMAT),
    404: createErrorResponseSignature(RESPONSE_STATUS.CONVERSATION_NOT_FOUND),
  },
});

conversationRoute.openapi(
  deleteConversationRoute,
  async (c) => {
    const { conversationId } = c.req.valid("param");
    const user = c.get("user");

    const result = await removeConversation(user.id, conversationId);
    revalidateTag(CACHE_TAG.getFavoriteCacheTag(user.id), { expire: 0 });
    revalidateTag(CACHE_TAG.getHistoryCacheTag(user.id), { expire: 0 });

    return c.json(createSuccessResponse(RESPONSE_STATUS.OK, result), 200);
  },
  zodValidationHook
);

// Update Conversation title
const updateConversationRoute = createRoute({
  method: "patch",
  path: "/:conversationId",
  request: {
    params: ConversationParamSchema,
    body: {
      content: {
        "application/json": {
          schema: UpdateConversationTitleSchema,
        },
      },
    },
  },
  responses: {
    200: {
      content: {
        "application/json": {
          schema: SuccessReponseSchema,
        },
      },
      description: "요청 성공 응답",
    },
    400: createErrorResponseSignature(RESPONSE_STATUS.INVALID_REQUEST_FORMAT),
    404: createErrorResponseSignature(RESPONSE_STATUS.CONVERSATION_NOT_FOUND),
    500: createErrorResponseSignature(RESPONSE_STATUS.INTERNAL_SERVER_ERROR),
  },
});

conversationRoute.openapi(updateConversationRoute, async (c) => {
  const { conversationId } = c.req.valid("param");
  const { title } = c.req.valid("json");
  const user = c.get("user");

  await updateConversationTitle(conversationId, title, true, user.id);
  revalidateTag(CACHE_TAG.getFavoriteCacheTag(user.id), { expire: 0 });
  revalidateTag(CACHE_TAG.getHistoryCacheTag(user.id), { expire: 0 });

  return c.json(SUCCESS_RESPONSE, 200);
});
/*Favorite Routes */

// Find favorite conversations
const findFavoritesRoute = createRoute({
  method: "get",
  path: "/favorites",
  responses: {
    200: {
      content: {
        "application/json": {
          schema: SuccessReponseSchema.extend({
            data: z.array(
              ConversationSchema.extend({
                isFavorite: z.boolean().openapi({ example: true }),
              })
            ),
          }),
        },
      },
      description: "요청 성공 응답",
    },
  },
});

conversationRoute.openapi(findFavoritesRoute, async (c) => {
  const user = c.get("user");

  const conversations = await findFavorites(user.id);

  return c.json(createSuccessResponse(RESPONSE_STATUS.OK, conversations), 200);
});

// 즐겨찾기 추가
const addFavoriteRoute = createRoute({
  method: "post",
  path: "/:conversationId/favorites",
  request: {
    params: ConversationParamSchema,
  },
  responses: {
    200: {
      content: {
        "application/json": {
          schema: SuccessReponseSchema,
        },
      },
      description: "요청 성공 응답",
    },
    400: createErrorResponseSignature(RESPONSE_STATUS.INVALID_REQUEST_FORMAT),
    404: createErrorResponseSignature(RESPONSE_STATUS.CONVERSATION_NOT_FOUND),
  },
});

conversationRoute.openapi(addFavoriteRoute, async (c) => {
  const { conversationId } = c.req.valid("param");
  const user = c.get("user");

  await addFavoriteConversation(user.id, conversationId);
  revalidateTag(CACHE_TAG.getFavoriteCacheTag(user.id), { expire: 0 });
  revalidateTag(CACHE_TAG.getHistoryCacheTag(user.id), { expire: 0 });

  return c.json(SUCCESS_RESPONSE, 200);
});

// 즐겨찾기 제거
const deleteFavoriteRoute = createRoute({
  method: "delete",
  path: "/:conversationId/favorites",
  request: {
    params: ConversationParamSchema,
  },
  responses: {
    200: {
      content: {
        "application/json": {
          schema: SuccessReponseSchema,
        },
      },
      description: "요청 성공",
    },
    400: createErrorResponseSignature(RESPONSE_STATUS.INVALID_REQUEST_FORMAT),
    500: createErrorResponseSignature(RESPONSE_STATUS.INTERNAL_SERVER_ERROR),
  },
});

conversationRoute.openapi(deleteFavoriteRoute, async (c) => {
  const { conversationId } = c.req.valid("param");
  const user = c.get("user");

  await deleteFavoriteConversation(user.id, conversationId);
  revalidateTag(CACHE_TAG.getFavoriteCacheTag(user.id), { expire: 0 });
  revalidateTag(CACHE_TAG.getHistoryCacheTag(user.id), { expire: 0 });

  return c.json(SUCCESS_RESPONSE, 200);
});

// Get Messages
const ParamSchema = z.object({
  conversationId: z.uuid(),
});

const QuerySchema = z.object({
  cursor: z.string().optional(),
  limit: z.coerce.number().min(1),
  direction: z.union([z.literal("asc"), z.literal("desc")]),
});

conversationRoute.openAPIRegistry.registerPath({
  method: "get",
  path: "/:conversationId/messages",
  request: {
    params: ConversationParamSchema,
    query: ConversationPaginationQuerySchema,
  },
  responses: {
    200: {
      content: {
        "application/json": {
          schema: SuccessReponseSchema.extend({
            data: createPaginationSchema(SendMessageSchema),
          }),
        },
      },
      description: "성공 요청 응답",
    },
    400: createErrorResponseSignature(RESPONSE_STATUS.INVALID_REQUEST_FORMAT),
    403: createErrorResponseSignature(
      RESPONSE_STATUS.ACCESS_CONVERSATION_DENIED
    ),
    404: createErrorResponseSignature(RESPONSE_STATUS.CONVERSATION_NOT_FOUND),
    500: createErrorResponseSignature(RESPONSE_STATUS.INTERNAL_SERVER_ERROR),
  },
});

conversationRoute.get(
  "/:conversationId/messages",
  zValidator("param", ParamSchema),
  zValidator("query", QuerySchema),
  async (c) => {
    const { conversationId } = c.req.valid("param");
    const { cursor, limit } = c.req.valid("query");
    const user = c.get("user");

    const messages = await getMessagesInConversation(user.id, conversationId, {
      cursor,
      limit,
      direction: "desc",
    });

    return c.json(createSuccessResponse(RESPONSE_STATUS.OK, messages), 200);
  }
);

export default conversationRoute;
