import { findResources } from "@/client-services/rag.api";
import { QUERY_KEYS } from "@/constants/query-keys";
import { useInfiniteQuery } from "@tanstack/react-query";

export function useResourcesQuery() {
  return useInfiniteQuery({
    queryKey: QUERY_KEYS.getRagQueryKeys(),
    queryFn: ({ pageParam }) => findResources("desc", pageParam),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => {
      if (lastPage.data.hasNext) {
        return lastPage.data.nextCursor ?? undefined;
      }
      return undefined;
    },
  });
}
