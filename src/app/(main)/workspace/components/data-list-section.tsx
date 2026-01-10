"use client";

import { deleteResourceById } from "@/client-services/rag.api";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { QUERY_KEYS } from "@/constants/query-keys";
import { useResourcesQuery } from "@/hooks/use-resources-query";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { FileText, Trash2 } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

export function DataListSection() {
  const {
    data,
    isPending,
    isError,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useResourcesQuery();
  const observerTarget = useRef<HTMLDivElement>(null);
  const queryClient = useQueryClient();
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  const deleteMutation = useMutation({
    mutationFn: deleteResourceById,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.getRagQueryKeys() });
      toast.success("리소스가 삭제되었습니다");
      setDeleteTargetId(null);
    },
    onError: (error) => {
      toast.error(error.message || "리소스 삭제에 실패했습니다");
      setDeleteTargetId(null);
    },
  });

  const handleDeleteClick = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    e.stopPropagation();
    setDeleteTargetId(id);
  };

  const handleConfirmDelete = () => {
    if (deleteTargetId) {
      deleteMutation.mutate(deleteTargetId);
    }
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 1.0 }
    );

    const currentTarget = observerTarget.current;
    if (currentTarget) {
      observer.observe(currentTarget);
    }

    return () => {
      if (currentTarget) {
        observer.unobserve(currentTarget);
      }
    };
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  const resources = data?.pages.flatMap((page) => page.data.items) ?? [];

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Embedding 리소스 목록</CardTitle>
        </CardHeader>
        <CardContent>
          {isPending ? (
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex items-center gap-3 p-4">
                  <Skeleton className="size-5 shrink-0" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-3 w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          ) : isError ? (
            <div className="flex flex-col items-center justify-center h-50 text-destructive">
              <FileText className="size-12 mb-2" />
              <p className="text-sm">
                데이터를 불러오는 중 오류가 발생했습니다
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {error?.message}
              </p>
            </div>
          ) : resources.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-50 text-muted-foreground">
              <FileText className="size-12 mb-2" />
              <p className="text-sm">업로드된 리소스가 없습니다</p>
            </div>
          ) : (
            <ScrollArea className="h-100 pr-4">
              <div className="space-y-3">
                {resources.map((resource) => (
                  <Link
                    key={resource.id}
                    href={`/workspace/resource/${resource.id}`}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors"
                  >
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <FileText className="size-5 text-primary shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate">
                          {resource.name}
                        </p>
                        <div className="flex gap-2 text-xs text-muted-foreground mt-1">
                          <span>
                            {new Date(resource.createdAt).toLocaleDateString()}
                          </span>
                          <span>•</span>
                          <span>{resource.fileType}</span>
                        </div>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      onClick={(e) => handleDeleteClick(e, resource.id)}
                      disabled={deleteMutation.isPending}
                      className="hover:bg-destructive/10 hover:text-destructive shrink-0"
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  </Link>
                ))}
                {hasNextPage && (
                  <div
                    ref={observerTarget}
                    className="flex justify-center py-4"
                  >
                    {isFetchingNextPage && <Skeleton className="h-8 w-full" />}
                  </div>
                )}
              </div>
            </ScrollArea>
          )}
        </CardContent>
      </Card>

      <AlertDialog
        open={deleteTargetId !== null}
        onOpenChange={(open) => !open && setDeleteTargetId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>리소스 삭제</AlertDialogTitle>
            <AlertDialogDescription>
              정말로 이 리소스를 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleteMutation.isPending}>
              취소
            </AlertDialogCancel>
            <Button
              variant={"destructive"}
              onClick={handleConfirmDelete}
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? "삭제 중..." : "삭제"}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
