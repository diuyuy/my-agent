import { RESPONSE_STATUS } from "@/constants/response-status";
import { db } from "@/db/db";
import { SuccessReponseSchema } from "@/schemas/common.schemas";
import {
  CreateEmbeddingSchema,
  DocumentChunckSchema,
  PaginationQuerySchema,
  ResourcePaginaitonSchema,
  ResourceParamsSchema,
  ResourceSchema,
} from "@/schemas/rag.schema";
import { Env } from "@/server/common/types/types";
import {
  createErrorResponseSignature,
  createSuccessResponse,
} from "@/server/common/utils/response-utils";
import { createRoute, OpenAPIHono, z } from "@hono/zod-openapi";
import {
  createEmbedding,
  deleteResourceById,
  findRelevantContent,
  findResourceById,
  findResources,
} from "./rag.service";

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

const findContentRoute = createRoute({
  method: "get",
  path: "/",
  responses: {
    200: {
      content: {
        "application/json": {
          schema: SuccessReponseSchema.extend({
            data: z.string(),
          }),
        },
      },
      description: "요청 성공 응답",
    },
  },
});

ragRoute.openapi(findContentRoute, async (c) => {
  const result = await findRelevantContent("What is Rag");

  return c.json(createSuccessResponse(RESPONSE_STATUS.OK, result), 200);
});

const findResourcesRoute = createRoute({
  method: "get",
  path: "/resources",
  request: {
    query: PaginationQuerySchema,
  },
  responses: {
    200: {
      content: {
        "application/json": {
          schema: ResourcePaginaitonSchema,
        },
      },
      description: "요청 성공 응답",
    },
    500: createErrorResponseSignature(RESPONSE_STATUS.INTERNAL_SERVER_ERROR),
  },
});

ragRoute.openapi(findResourcesRoute, async (c) => {
  const user = c.get("user");
  const { cursor, limit, direction } = c.req.valid("query");

  const result = await findResources(user.id, {
    cursor,
    limit,
    direction: direction ?? "desc",
  });

  return c.json(createSuccessResponse(RESPONSE_STATUS.OK, result), 200);
});

const findResourceByIdRoute = createRoute({
  method: "get",
  path: "/:resourceId",
  request: {
    params: ResourceParamsSchema,
  },
  responses: {
    200: {
      content: {
        "application/json": {
          schema: SuccessReponseSchema.extend({
            data: ResourceSchema.extend({
              embeddings: z.array(DocumentChunckSchema),
            }),
          }),
        },
      },
      description: "요청 성공 응답",
    },
    400: createErrorResponseSignature(RESPONSE_STATUS.INVALID_REQUEST_FORMAT),
    403: createErrorResponseSignature(RESPONSE_STATUS.ACCESS_RESOURCE_DENIED),
    404: createErrorResponseSignature(RESPONSE_STATUS.RESOURCE_NOT_FOUND),
    500: createErrorResponseSignature(RESPONSE_STATUS.INTERNAL_SERVER_ERROR),
  },
});

ragRoute.openapi(findResourceByIdRoute, async (c) => {
  const user = c.get("user");
  const { resourceId } = c.req.valid("param");

  const resource = await findResourceById(user.id, resourceId);

  return c.json(createSuccessResponse(RESPONSE_STATUS.OK, resource), 200);
});

const deleteResourceRoute = createRoute({
  method: "delete",
  path: "/resources/:resourceId",
  request: {
    params: ResourceParamsSchema,
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
    403: createErrorResponseSignature(RESPONSE_STATUS.ACCESS_RESOURCE_DENIED),
    404: createErrorResponseSignature(RESPONSE_STATUS.RESOURCE_NOT_FOUND),
    500: createErrorResponseSignature(RESPONSE_STATUS.INTERNAL_SERVER_ERROR),
  },
});

ragRoute.openapi(deleteResourceRoute, async (c) => {
  const user = c.get("user");
  const { resourceId } = c.req.valid("param");

  await deleteResourceById(user.id, resourceId);

  return c.json(createSuccessResponse(RESPONSE_STATUS.OK, null), 200);
});

export default ragRoute;
