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
import { createSuccessResponse } from "@/server/common/utils/create-response";

import { sessionMiddleware } from "@/server/common/middlewares/session.middleware";
import { Env } from "@/server/common/types/types";
import { zodValidationHook } from "@/server/common/utils/zod-validation-hook";
import { createRoute, OpenAPIHono, z } from "@hono/zod-openapi";
import { findAllConversations } from "./conversation.service";

const conversationRoute = new OpenAPIHono<Env>();

conversationRoute.use(sessionMiddleware);

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
    404: {
      content: {
        "application/json": {
          schema: ErrorResponseSchema,
          example: {
            success: false,
            code: RESPONSE_STATUS.NOT_FOUND.code,
            message: RESPONSE_STATUS.NOT_FOUND.message,
          },
        },
      },
      description: "",
    },
  },
});

conversationRoute.openapi(
  findAllRoute,
  async (c) => {
    const { cursor, limit } = c.req.query();
    const user = c.get("user");
    const conversations = await findAllConversations(user.id, {
      cursor,
      limit: +limit,
    });

    return c.json(
      createSuccessResponse(RESPONSE_STATUS.OK, conversations),
      200
    );
  },
  zodValidationHook
);

const findByIdRoute = createRoute({
  method: "get",
  path: "/:id",
  request: {
    params: z.object({
      id: z.uuid(),
    }),
  },
  responses: {
    200: {
      content: {
        "application/json": {
          schema: ConversationSchema,
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

export default conversationRoute;
