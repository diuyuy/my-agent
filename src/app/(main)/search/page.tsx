"use client";

import { useConversationInfiniteQuery } from "@/app/(main)/search/hooks/use-conversation-infinite-query";
import { ConversationItem } from "@/app/(main)/search/components/conversation-item";
import { Input } from "@/components/ui/input";
import { debounce } from "@/lib/utils";
import { SearchIcon } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";

export default function SearchPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");

  // Debounce search query
  const debouncedSetQuery = useMemo(
    () =>
      debounce<string>((value: string) => {
        setDebouncedQuery(value);
      }, 500),
    []
  );

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    debouncedSetQuery(value);
  };

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useConversationInfiniteQuery({ filter: debouncedQuery });

  const loadMoreRef = useRef<HTMLDivElement>(null);

  // IntersectionObserver for infinite scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 0.1 }
    );

    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current);
    }

    const loadMore = loadMoreRef.current;

    return () => {
      if (loadMore) {
        observer.unobserve(loadMore);
      }
    };
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const conversations = useMemo(() => {
    return data?.pages.flatMap((page) => page.items) ?? [];
  }, [data]);

  return (
    <div className="container mx-auto max-w-4xl p-6">
      <h1 className="text-2xl font-bold mb-6">검색</h1>

      <div className="relative mb-6">
        <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          type="text"
          placeholder="대화 검색..."
          value={searchQuery}
          onChange={handleSearchChange}
          className="pl-10"
        />
      </div>

      <div className="space-y-2">
        {isLoading ? (
          <div className="text-center text-muted-foreground py-8">
            로딩 중...
          </div>
        ) : conversations.length === 0 ? (
          <div className="text-center text-muted-foreground py-8">
            {debouncedQuery ? "검색 결과가 없습니다." : "대화 내역이 없습니다."}
          </div>
        ) : (
          <>
            {conversations.map((conversation) => (
              <ConversationItem
                key={conversation.id}
                conversation={conversation}
              />
            ))}
            {hasNextPage && (
              <div ref={loadMoreRef} className="py-4 text-center">
                {isFetchingNextPage ? (
                  <span className="text-muted-foreground">로딩 중...</span>
                ) : null}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
