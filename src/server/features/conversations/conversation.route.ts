import { RESPONSE_STATUS } from "@/constants/response-status";
import {
  ErrorResponseSchema,
  SuccessReponseSchema,
  ValidationErrorSchema,
} from "@/schemas/common.schemas";
import {
  ConversationSchema,
  PaginationConversationSchema,
} from "@/schemas/conversation.schema";
import { zValidator } from "@hono/zod-validator";

import { SUCCESS_RESPONSE } from "@/constants/success-response";
import { MessageSchema, UserMessageSchema } from "@/schemas/message.schema";
import { sessionMiddleware } from "@/server/common/middlewares/session.middleware";
import { Env } from "@/server/common/types/types";
import { createSuccessResponse } from "@/server/common/utils/response-utils";
import { zodValidationHook } from "@/server/common/utils/zod-validation-hook";
import { createRoute, OpenAPIHono, z } from "@hono/zod-openapi";
import { UIMessage } from "ai";
import {
  addFavoriteConversation,
  deleteFavoriteConversation,
  findAllConversations,
  findFavorites,
  removeConversation,
  updateConversation,
} from "./conversation.service";

const conversationRoute = new OpenAPIHono<Env>();

// Register session middleware
conversationRoute.use(sessionMiddleware);

// Get All conversations with pagination
const findAllRoute = createRoute({
  method: "get",
  path: "/",
  request: {
    query: z.object({
      cursor: z.string().optional(),
      limit: z.coerce.number().min(1),
    }),
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
    400: {
      content: {
        "application/json": {
          schema: ValidationErrorSchema,
        },
      },
      description: "요청 형식 오류",
    },
  },
});

conversationRoute.openapi(findAllRoute, async (c) => {
  const { cursor, limit } = c.req.valid("query");
  const user = c.get("user");
  const conversations = await findAllConversations(user.id, {
    cursor,
    limit: limit,
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
          schema: UserMessageSchema,
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
    400: {
      content: {
        "application/json": {
          schema: ValidationErrorSchema,
        },
      },
      description: "요청 형식 오류",
    },
  },
});

conversationRoute.post(
  "/",
  // zValidator("json", UserMessageSchema, zodValidationHook),
  async (c) => {
    // const createConversationDto = c.req.valid("json");
    const user = c.get("user");
    const {
      messages,
      modelProvider,
    }: { messages: UIMessage[]; modelProvider: string } = await c.req.json();
    console.log("🚀 ~ modelProvider:", modelProvider);
    console.log("🚀 ~ messages:", JSON.stringify(messages, null, 2));

    return c.json(
      {
        success: true,
      },
      200
    );
  }
);

const ParamsSchema = z.object({
  conversationId: z.uuid(),
});

conversationRoute.openAPIRegistry.registerPath({
  path: "/:conversationId",
  method: "post",
  request: {
    params: ParamsSchema,
  },
  responses: {
    200: {
      content: {
        "application/json": {
          schema: z.string(),
        },
      },
      description: "성공 응답 (Text stream)",
    },
  },
});

conversationRoute.post(
  "/:conversationId",
  zValidator("param", ParamsSchema, zodValidationHook),
  zValidator("json", z.array(MessageSchema), zodValidationHook),
  async (c) => {
    const { conversationId } = c.req.valid("param");
    const messages = c.req.valid("json");
    const user = c.get("user");

    return await updateConversation(user.id, conversationId, messages);
  }
);

const deleteConversationRoute = createRoute({
  method: "delete",
  path: "/:conversationId",
  request: {
    params: z.object({
      conversationId: z.uuid(),
    }),
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
    400: {
      content: {
        "application/json": {
          schema: ValidationErrorSchema,
        },
      },
      description: "요청 형식 오류",
    },
    404: {
      content: {
        "application/json": {
          schema: ErrorResponseSchema,
          example: {
            success: false,
            code: RESPONSE_STATUS.CONVERSATION_NOT_FOUND.code,
            message: RESPONSE_STATUS.CONVERSATION_NOT_FOUND.message,
          },
        },
      },
      description: "",
    },
  },
});

conversationRoute.openapi(
  deleteConversationRoute,
  async (c) => {
    const { conversationId } = c.req.valid("param");
    const user = c.get("user");

    const result = await removeConversation(user.id, conversationId);

    return c.json(createSuccessResponse(RESPONSE_STATUS.OK, result), 200);
  },
  zodValidationHook
);

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
    params: z.object({
      conversationId: z.uuid(),
    }),
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
    400: {
      content: {
        "application/json": {
          schema: ValidationErrorSchema,
        },
      },
      description: "요청 형식 오류",
    },
  },
});

conversationRoute.openapi(addFavoriteRoute, async (c) => {
  const { conversationId } = c.req.valid("param");
  const user = c.get("user");

  await addFavoriteConversation(user.id, conversationId);

  return c.json(SUCCESS_RESPONSE, 200);
});

// 즐겨찾기 제거
const deleteFavoriteRoute = createRoute({
  method: "delete",
  path: "/:conversationId/favorites",
  request: {
    params: z.object({
      conversationId: z.uuid(),
    }),
  },
  responses: {
    200: {
      content: {
        "application/json": {
          schema: SuccessReponseSchema,
        },
      },
      description: "",
    },
    400: {
      content: {
        "application/json": {
          schema: ValidationErrorSchema,
        },
      },
      description: "요청 형식 오류",
    },
  },
});

conversationRoute.openapi(deleteFavoriteRoute, async (c) => {
  const { conversationId } = c.req.valid("param");
  const user = c.get("user");

  await deleteFavoriteConversation(user.id, conversationId);

  return c.json(SUCCESS_RESPONSE, 200);
});

export default conversationRoute;
