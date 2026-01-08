import { ErrorResponse, SuccessResponse } from "@/schemas/common.schemas";
import { CreateEmbeddingDto } from "@/schemas/rag.schema";

export const createEmbedding = async (
  createEmbeddingDto: CreateEmbeddingDto
): Promise<SuccessResponse<null>> => {
  const response = await fetch("/api/rags", {
    method: "POST",
    body: JSON.stringify(createEmbeddingDto),
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    const errorData: ErrorResponse = await response.json();
    throw new Error(errorData.message);
  }

  return response.json();
};
