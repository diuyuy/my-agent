import { fetchConversationsByPagination } from "@/client-services/conversation.api";
import { useInfiniteQuery } from "@tanstack/react-query";

interface UseConversationInfiniteQueryProps {
  filter?: string;
}

export const useConversationInfiniteQuery = ({
  filter = "",
}: UseConversationInfiniteQueryProps = {}) => {
  return useInfiniteQuery({
    queryKey: ["conversations", "infinite", filter],
    queryFn: async ({ pageParam }) => {
      const response = await fetchConversationsByPagination(pageParam, filter);
      return response.data;
    },
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => {
      return lastPage.hasNext ? lastPage.nextCursor : undefined;
    },
  });
};
