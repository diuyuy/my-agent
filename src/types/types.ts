import { ErrorResponse, SuccessResponse } from "@/schemas/common.schemas";
import { createPaginationSchema } from "@/server/common/utils/schema-utils";
import { z } from "@hono/zod-openapi";
import { ContentfulStatusCode } from "hono/utils/http-status";
import { DOCS_LANGUAGE } from "../constants/docs-language";

export type PaginationInfo = Omit<
  z.infer<ReturnType<typeof createPaginationSchema>>,
  "items"
>;

export type PaginationOption = {
  cursor: string | undefined;
  limit: number;
  direction: "asc" | "desc";
};

export type ResponseStatus = {
  status: ContentfulStatusCode;
  code: string;
  message: string;
  description: string;
};

export type ApiResponse<T = undefined> = SuccessResponse<T> | ErrorResponse;

export type DocsLanguage = (typeof DOCS_LANGUAGE)[number];
