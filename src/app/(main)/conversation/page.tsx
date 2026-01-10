"use client";

import { createNewConversation } from "@/client-services/conversation.api";
import { QUERY_KEYS } from "@/constants/query-keys";
import { ROUTER_PATH } from "@/constants/router-path";
import { useIsCreatingNewConversation } from "@/hooks/use-is-creating-new-conversation";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { toast } from "sonner";
import { PromptInput } from "./components/prompt-input";

export default function NewChatPage() {
  const [input, setInput] = useState("");
  const { modelProvider, setModelProvider, isRag, setIsRag } =
    useIsCreatingNewConversation();
  const router = useRouter();
  const { setIsCreating } = useIsCreatingNewConversation();

  const mutation = useMutation({
    mutationKey: QUERY_KEYS.getConversationQueryKeys(),
    mutationFn: createNewConversation,
    onSuccess: (conversationId) => {
      setIsCreating({ message: input.trim(), modelProvider, isRag });
      setInput("");
      router.push(`${ROUTER_PATH.CONVERSATION}/${conversationId}`);
    },
    onError: (error) => {
      console.error(error);
      toast.error("예상치 못한 오류가 발생했습니다. 다시 시도해주세요.");
    },
  });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (input.trim()) {
      mutation.mutate(input.trim());
    }
  };

  return (
    <div className="w-full min-h-screen">
      <div className="h-full flex flex-col">
        <div className="flex-1 flex flex-col justify-center text-center text-3xl font-bold">
          채팅을 입력해보세요!
        </div>
        <form onSubmit={handleSubmit}>
          <PromptInput
            value={input}
            setValue={setInput}
            modelProvider={modelProvider}
            setModelProvider={setModelProvider}
            isRag={isRag}
            setIsRag={setIsRag}
            isSending={false}
          />
        </form>
      </div>
    </div>
  );
}
