import { RESPONSE_STATUS } from "@/constants/response-status";
import { db } from "@/db/db";
import { ResouceType } from "@/db/schema/enums";
import { documentChunks, documentResources } from "@/db/schema/schema";
import { CreateEmbeddingDto } from "@/schemas/rag.schema";
import { CommonHttpException } from "@/server/common/errors/common-http-exception";
import { DBType } from "@/server/common/types/types";
import { createPaginationResponse } from "@/server/common/utils/response-utils";
import { PaginationOption } from "@/types/types";
import { sql } from "drizzle-orm";
import {
  and,
  asc,
  count,
  desc,
  eq,
  gte,
  innerProduct,
  lte,
} from "drizzle-orm/sql";
import path from "path";
import { createCursor } from "../../common/utils/create-cursor";
import { generateEmbedding, generateEmbeddings } from "../ai/ai.service";

export const createEmbedding = async (
  db: DBType,
  userId: string,
  { content, resourceName, docsLanguage }: CreateEmbeddingDto
) => {
  const fileType = resourceName
    ? (path.extname(resourceName).slice(1) as ResouceType)
    : "text";
  const result = await generateEmbeddings(content, docsLanguage);

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

export const findResources = async (
  userId: string,
  { cursor, limit, direction }: PaginationOption
) => {
  let decodedCursor: Date | undefined;

  if (cursor) {
    const decoded = Buffer.from(cursor, "base64").toString();
    decodedCursor = new Date(decoded);
  }

  const result = await db
    .select()
    .from(documentResources)
    .where(
      and(
        eq(documentResources.userId, userId),
        decodedCursor
          ? gte(documentResources.createdAt, decodedCursor)
          : undefined
      )
    )
    .orderBy(
      direction === "asc"
        ? asc(documentResources.createdAt)
        : desc(documentResources.createdAt)
    )
    .limit(limit + 1);

  const nextValue = result.length > limit ? result.pop()?.createdAt : null;

  const nextCursor = nextValue ? createCursor(nextValue.toISOString()) : null;

  const [{ count: totalElements }] = await db
    .select({ count: count() })
    .from(documentResources)
    .where(eq(documentResources.userId, userId));

  return createPaginationResponse(result, {
    nextCursor,
    totalElements,
    hasNext: !!nextCursor,
  });
};

export const findResourceById = async (userId: string, resourceId: string) => {
  await validateAccessability(userId, resourceId);

  const result = await db
    .select({
      resource: documentResources,
      chunk: {
        id: documentChunks.id,
        content: documentChunks.content,
        tag: documentChunks.tag,
        createdAt: documentChunks.createdAt,
      },
    })
    .from(documentResources)
    .innerJoin(
      documentChunks,
      eq(documentResources.id, documentChunks.resourceId)
    )
    .where(eq(documentResources.id, resourceId));

  const resource = result[0].resource;
  const embeddings = result.map(({ chunk }) => chunk);

  return { ...resource, embeddings };
};

export const deleteResourceById = async (
  userId: string,
  resourceId: string
) => {
  await validateAccessability(userId, resourceId);

  await db
    .delete(documentResources)
    .where(eq(documentResources.id, resourceId));
};

export const deleteChunkById = async (userId: string, chunckId: string) => {
  await validateChunkAccessability(userId, chunckId);

  await db.delete(documentChunks).where(eq(documentChunks.id, chunckId));
};

const validateAccessability = async (userId: string, resourceId: string) => {
  const [resource] = await db
    .select()
    .from(documentResources)
    .where(eq(documentResources.id, resourceId));

  if (!resource) {
    throw new CommonHttpException(RESPONSE_STATUS.RESOURCE_NOT_FOUND);
  }

  if (resource.userId !== userId) {
    throw new CommonHttpException(RESPONSE_STATUS.ACCESS_RESOURCE_DENIED);
  }
};

const validateChunkAccessability = async (userId: string, chunckId: string) => {
  const [chunck] = await db
    .select({
      userId: documentResources.userId,
    })
    .from(documentChunks)
    .innerJoin(
      documentResources,
      eq(documentChunks.resourceId, documentResources.id)
    )
    .where(eq(documentChunks.id, chunckId));

  if (!chunck) {
    throw new CommonHttpException(RESPONSE_STATUS.CHUNK_NOT_FOUND);
  }

  if (chunck.userId !== userId) {
    throw new CommonHttpException(RESPONSE_STATUS.ACCESS_CHUNK_DENIED);
  }
};
