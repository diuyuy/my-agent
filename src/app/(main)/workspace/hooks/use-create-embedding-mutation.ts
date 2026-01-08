"use client";

import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { createEmbedding } from "@/client-services/rag.api";
import { QUERY_KEYS } from "@/constants/query-keys";
import { CreateEmbeddingDto } from "@/schemas/rag.schema";

export function useCreateEmbeddingMutation() {
  return useMutation({
    mutationKey: QUERY_KEYS.getRagQueryKeys(),
    mutationFn: (data: CreateEmbeddingDto) => createEmbedding(data),
    onSuccess: () => {
      toast.success("임베딩이 성공적으로 생성되었습니다.");
    },
    onError: (error: Error) => {
      toast.error(`임베딩 생성 실패: ${error.message}`);
    },
  });
}
