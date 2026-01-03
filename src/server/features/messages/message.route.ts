import { RESPONSE_STATUS } from "@/constants/response-status";
import { SuccessReponseSchema } from "@/schemas/common.schemas";
import { DeleteMessagesSchema } from "@/schemas/message.schema";
import { sessionMiddleware } from "@/server/common/middlewares/session.middleware";
import { Env } from "@/server/common/types/types";
import {
  createErrorResponseSignature,
  createSuccessResponse,
} from "@/server/common/utils/response-utils";
import { createRoute, OpenAPIHono, z } from "@hono/zod-openapi";
import { deleteMessageById } from "./message.service";

const messageRoute = new OpenAPIHono<Env>();
messageRoute.use(sessionMiddleware);

const deleteMessageRoute = createRoute({
  method: "delete",
  path: "/",
  request: {
    body: {
      content: {
        "application/json": {
          schema: DeleteMessagesSchema,
        },
      },
    },
  },
  responses: {
    200: {
      content: {
        "application/json": {
          schema: SuccessReponseSchema.extend({
            data: z.literal(null),
          }),
        },
      },
      description: "요청 성공 응답",
    },
    400: createErrorResponseSignature(RESPONSE_STATUS.INVALID_REQUEST_FORMAT),
    500: createErrorResponseSignature(RESPONSE_STATUS.INTERNAL_SERVER_ERROR),
  },
});

messageRoute.openapi(deleteMessageRoute, async (c) => {
  const user = c.get("user");
  const deleteMessagesDto = c.req.valid("json");

  await deleteMessageById(user.id, deleteMessagesDto);

  return c.json(createSuccessResponse(RESPONSE_STATUS.OK, null), 200);
});

export default messageRoute;
