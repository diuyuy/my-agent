import { ErrorResponse, SuccessResponse } from "@/schemas/common.schemas";
import { createPaginationSchema } from "@/server/common/utils/schema-utils";
import { z } from "@hono/zod-openapi";
import { AssistantModelMessage, ModelMessage, UserModelMessage } from "ai";
import { ContentfulStatusCode } from "hono/utils/http-status";

export type PaginationInfo = Omit<
  z.infer<ReturnType<typeof createPaginationSchema>>,
  "items"
>;

export type PaginationOption = {
  cursor: string | undefined;
  limit: number;
};

export type ResponseStatus = {
  status: ContentfulStatusCode;
  code: string;
  message: string;
  description: string;
};

export type ClientMessage = Extract<
  ModelMessage,
  UserModelMessage | AssistantModelMessage
>;

export type ApiResponse<T = undefined> = SuccessResponse<T> | ErrorResponse;
