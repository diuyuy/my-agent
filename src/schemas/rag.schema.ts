import { DOCS_LANGUAGE } from "@/constants/docs-language";
import { resourceTypeEnum } from "@/db/schema/enums";
import { createPaginationSchema } from "@/server/common/utils/schema-utils";
import { z } from "@hono/zod-openapi";
import { SuccessReponseSchema } from "./common.schemas";

export const CreateEmbeddingSchema = z.object({
  content: z.string().nonempty().openapi({ example: "안녕하세요." }),
  resourceName: z.string().optional().openapi({ example: "embedding.txt" }),
  docsLanguage: z
    .enum(DOCS_LANGUAGE)
    .optional()
    .openapi({ example: "markdown" }),
});

export type CreateEmbeddingDto = z.infer<typeof CreateEmbeddingSchema>;

export const ResourceSchema = z.object({
  id: z.string(),
  userId: z.string(),
  name: z.string().openapi({ example: "embedding.txt" }),
  fileType: z.enum(resourceTypeEnum.enumValues),
  createdAt: z.coerce.date(),
});

export type EmbeddingResouce = z.infer<typeof ResourceSchema>;

export const PaginationQuerySchema = z.object({
  cursor: z.string().optional(),
  limit: z.coerce.number(),
  direction: z.enum(["asc", "desc"]).optional(),
});

export const ResourceParamsSchema = z.object({
  resourceId: z.uuid(),
});

export const DocumentChunckSchema = z.object({
  id: z.uuid(),
  content: z.string(),
  tag: z.string().nullable(),
  createdAt: z.coerce.date(),
});

export const ResourcePaginaitonSchema = SuccessReponseSchema.extend({
  data: createPaginationSchema(ResourceSchema),
});

export type ResourcePagination = z.infer<typeof ResourcePaginaitonSchema>;
