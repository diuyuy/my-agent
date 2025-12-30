import { ApiResponse } from "@/types/types";

interface DeleteConversationData {
  conversationId: string;
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

  return response.json();
}
