import { ErrorResponse, SuccessResponse } from "@/schemas/common.schemas";
import {
  Conversation,
  PagenationConversation,
  UpdateConversationTitleDto,
} from "@/schemas/conversation.schema";
import { ApiResponse } from "@/types/types";

type DeleteConversationData = {
  conversationId: string;
};

const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function fetchHistoryMessages(): Promise<
  SuccessResponse<PagenationConversation>
> {
  const requestUrl = new URL(`${baseURL}/api/conversations`);
  requestUrl.searchParams.append("limit", String(20));
  const response = await fetch(requestUrl, {
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
}

export async function createNewConversation(message: string): Promise<string> {
  const response = await fetch("/api/conversations/new", {
    method: "post",
    body: JSON.stringify({ message }),
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    const errorData: ErrorResponse = await response.json();
    throw new Error(errorData.message);
  }

  const { data }: SuccessResponse<{ conversationId: string }> =
    await response.json();

  return data.conversationId;
}

export async function fetchFavoriteConversations(): Promise<
  SuccessResponse<Conversation[]>
> {
  const response = await fetch("/api/conversations/favorites", {
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
}

export async function updateConversationTitle(
  conversationId: string,
  updateConversationTitleDto: UpdateConversationTitleDto
): Promise<ApiResponse> {
  const response = await fetch(`/api/conversations/${conversationId}`, {
    method: "PATCH",
    body: JSON.stringify(updateConversationTitleDto),
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message);
  }

  return response.json();
}

/**
 * 대화를 삭제합니다.
 * @param conversationId - 삭제할 대화의 UUID
 * @returns 삭제된 대화 정보
 */
export async function deleteConversation(
  conversationId: string
): Promise<ApiResponse<DeleteConversationData>> {
  const response = await fetch(`/api/conversations/${conversationId}`, {
    method: "DELETE",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message);
  }

  return response.json();
}

/**
 * 대화를 즐겨찾기에 추가합니다.
 * @param conversationId - 즐겨찾기에 추가할 대화의 UUID
 * @returns 성공 응답
 */
export async function addConversationToFavorites(
  conversationId: string
): Promise<ApiResponse> {
  const response = await fetch(
    `/api/conversations/${conversationId}/favorites`,
    {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message);
  }

  return response.json();
}

/**
 * 대화를 즐겨찾기에서 제거합니다.
 * @param conversationId - 즐겨찾기에서 제거할 대화의 UUID
 * @returns 성공 응답
 */
export async function removeConversationFromFavorites(
  conversationId: string
): Promise<ApiResponse> {
  const response = await fetch(
    `/api/conversations/${conversationId}/favorites`,
    {
      method: "DELETE",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message);
  }

  return response.json();
}
