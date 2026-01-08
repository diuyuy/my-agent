import { db } from "@/db/db";
import { ResouceType } from "@/db/schema/enums";
import { documentChunks, documentResources } from "@/db/schema/schema";
import { CreateEmbeddingDto } from "@/schemas/rag.schema";
import { DBType } from "@/server/common/types/types";
import { sql } from "drizzle-orm";
import { innerProduct, lte } from "drizzle-orm/sql";
import path from "path";
import { generateEmbedding, generateEmbeddings } from "../ai/ai.service";

export const createEmbedding = async (
  db: DBType,
  userId: string,
  { content, resourceName, docsLanguage }: CreateEmbeddingDto
) => {
  const result = await generateEmbeddings(content, docsLanguage);
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

export const findRelevantContent = async (content: string) => {
  const useQueryEmbedded = await generateEmbedding(content);
  const similarity = sql<number>`${innerProduct(
    documentChunks.embedding,
    useQueryEmbedded
  )}`;

  const result = await db
    .select({
      content: documentChunks.content,
      similarity: sql<number>`${innerProduct(
        documentChunks.embedding,
        useQueryEmbedded
      )}`,
    })
    .from(documentChunks)
    .where(lte(similarity, -0.5))
    .orderBy(similarity);
  console.log("🚀 ~ findRelevantContent ~ result:", result);

  return result.map(({ content }) => content).join("\n");
};
