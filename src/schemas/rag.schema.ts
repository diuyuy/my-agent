import { DOCS_LANGUAGE } from "@/constants/docs-language";
import z from "zod";

export const CreateEmbeddingSchema = z.object({
  content: z.string().nonempty(),
  resourceName: z.string().optional(),
  docsLanguage: z.enum(DOCS_LANGUAGE).optional(),
});

export type CreateEmbeddingDto = z.infer<typeof CreateEmbeddingSchema>;
