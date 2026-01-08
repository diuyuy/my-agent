import { BASE_URL } from "@/constants/base-url";
import { ErrorResponse, SuccessResponse } from "@/schemas/common.schemas";
import { CreateEmbeddingDto, ResourcePagination } from "@/schemas/rag.schema";

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

export const findResources = async (
  direction: "asc" | "desc" = "desc",
  cursor?: string
): Promise<ResourcePagination> => {
  const requestUrl = new URL(`${BASE_URL}/api/rags/resources`);

  if (cursor) {
    requestUrl.searchParams.append("cursor", cursor);
  }
  requestUrl.searchParams.append("limit", String(10));
  requestUrl.searchParams.append("direction", direction);

  const response = await fetch(requestUrl, {
    method: "get",
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

export const deleteResourceById = async (
  resourceId: string
): Promise<SuccessResponse<null>> => {
  const response = await fetch(`/api/rags/resources/${resourceId}`, {
    method: "DELETE",
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
