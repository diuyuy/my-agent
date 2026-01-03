import { fetchHistoryMessages } from "@/client-services/conversation.api";
import { QUERY_KEYS } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";

export function useConversationsQuery() {
  return useQuery({
    queryKey: QUERY_KEYS.getConversationQueryKeys("history"),
    queryFn: fetchHistoryMessages,
    staleTime: Infinity,
  });
}
