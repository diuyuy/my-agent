import { ErrorResponse, SuccessResponse } from "@/schemas/common.schemas";
import { DeleteMessagesDto } from "@/schemas/message.schema";
import { MyUIMessage } from "@/server/features/ai/ai.schemas";
import { ApiResponse, PaginationInfo } from "@/types/types";

const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL;

export const fetchMessages = async (
  conversationId: string,
  limit: number,
  cursor?: string
): Promise<ApiResponse<PaginationInfo & { items: MyUIMessage[] }>> => {
  const requestUrl = new URL(`${baseURL}/api/conversations/${conversationId}`);
  if (cursor) {
    requestUrl.searchParams.append("cursor", cursor);
  }
  requestUrl.searchParams.append("limit", String(limit));

  const response = await fetch(requestUrl, {
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    const errorData: ErrorResponse = await response.json();
    throw Error(errorData.message);
  }

  return response.json();
};

export const deleteMessage = async ({
  userMessageId,
  aiMessageId,
}: DeleteMessagesDto): Promise<
  SuccessResponse<{
    messageId: string;
  }>
> => {
  const response = await fetch("/api/messages", {
    method: "DELETE",
    body: JSON.stringify({ userMessageId, aiMessageId }),
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
