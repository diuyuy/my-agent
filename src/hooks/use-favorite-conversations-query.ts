import { fetchFavoriteConversations } from "@/client-services/conversation.api";
import { QUERY_KEYS } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";

export function useFavoriteConversationsQuery() {
  return useQuery({
    queryKey: QUERY_KEYS.getConversationQueryKeys("favorites"),
    queryFn: fetchFavoriteConversations,
    staleTime: Infinity,
  });
}
