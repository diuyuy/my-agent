import { QUERY_KEYS } from "@/constants/query-keys";
import { useIsCreatingNewConversation } from "@/hooks/use-is-creating-new-conversation";
import { MyUIMessage } from "@/server/features/ai/ai.schemas";
import { useChat } from "@ai-sdk/react";
import { useQueryClient } from "@tanstack/react-query";
import { createIdGenerator, DefaultChatTransport } from "ai";
import { toast } from "sonner";

export const useMyChat = (
  conversationId: string,
  initialMessages?: MyUIMessage[]
) => {
  const { isCreating, setIsCreated } = useIsCreatingNewConversation();
  const queryClient = useQueryClient();

  return useChat({
    generateId: createIdGenerator({
      prefix: "msg",
      size: 16,
    }),
    messages: initialMessages,
    transport: new DefaultChatTransport({
      api: "/api/conversations",
      prepareSendMessagesRequest: ({ messages, body }) => {
        return {
          body: {
            message: messages[messages.length - 1],
            conversationId,
            ...body,
          },
        };
      },
    }),
    onFinish: () => {
      if (isCreating) {
        queryClient.invalidateQueries({
          queryKey: QUERY_KEYS.getConversationQueryKeys("history"),
        });
        setIsCreated();
      }
    },
    onError: () => {
      toast.error("예상치 못한 오류가 발생했습니다. 다시 시도해주세요.");
    },
  });
};
