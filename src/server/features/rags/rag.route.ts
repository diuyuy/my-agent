import { RESPONSE_STATUS } from "@/constants/response-status";
import { db } from "@/db/db";
import { SuccessReponseSchema } from "@/schemas/common.schemas";
import { CreateEmbeddingSchema } from "@/schemas/rag.schema";
import { Env } from "@/server/common/types/types";
import {
  createErrorResponseSignature,
  createSuccessResponse,
} from "@/server/common/utils/response-utils";
import { createRoute, OpenAPIHono, z } from "@hono/zod-openapi";
import { createEmbedding } from "./rag.service";

const ragRoute = new OpenAPIHono<Env>();

const createEmbeddingRoute = createRoute({
  method: "post",
  path: "/",
  request: {
    body: {
      content: {
        "application/json": {
          schema: CreateEmbeddingSchema,
        },
      },
    },
  },
  responses: {
    200: {
      content: {
        "application/json": {
          schema: SuccessReponseSchema.extend({
            data: z.null(),
          }),
        },
      },
      description: "요청 성공 응답",
    },
    400: createErrorResponseSignature(RESPONSE_STATUS.INVALID_REQUEST_FORMAT),
    500: createErrorResponseSignature(RESPONSE_STATUS.INTERNAL_SERVER_ERROR),
  },
});

ragRoute.openapi(createEmbeddingRoute, async (c) => {
  const user = c.get("user");
  const createEmbeddingDto = c.req.valid("json");

  await createEmbedding(db, user.id, createEmbeddingDto);

  return c.json(
    createSuccessResponse(RESPONSE_STATUS.EMBEDDING_CREATED, null),
    200
  );
});

export default ragRoute;
