import { ResouceType } from "@/db/schema/enums";
import { documentChunks, documentResources } from "@/db/schema/schema";
import { CreateEmbeddingDto } from "@/schemas/rag.schema";
import { DBType } from "@/server/common/types/types";
import path from "path";
import { generateEmbeddings } from "../ai/ai.service";

export const createEmbedding = async (
  db: DBType,
  userId: string,
  { content, resourceName }: CreateEmbeddingDto
) => {
  const result = await generateEmbeddings(content);
  const fileType = resourceName
    ? (path.extname(resourceName) as ResouceType)
    : "text";

  await db.transaction(async (tx) => {
    const resourceId = await createResouce(
      tx,
      userId,
      resourceName ?? `${content.substring(0, 25)}...`,
      fileType
    );

    await tx.insert(documentChunks).values(
      result.map((chunk) => ({
        userId,
        resourceId,
        ...chunk,
      }))
    );
  });
};

const createResouce = async (
  db: DBType,
  userId: string,
  resourceName: string,
  fileType: ResouceType
) => {
  const [newResouce] = await db
    .insert(documentResources)
    .values({ userId, name: resourceName, fileType })
    .returning();

  return newResouce.id;
};
