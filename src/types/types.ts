import { z } from "@hono/zod-openapi";
import { ContentfulStatusCode } from "hono/utils/http-status";
import { createPaginationSchema } from "../server/common/utils/create-schema";

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
};
