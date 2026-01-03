import { useIsCreatingNewConversation } from "@/hooks/use-is-creating-new-conversation";
import { QUERY_KEYS } from "@/lib/utils";
import { MyUIMessage } from "@/server/features/ai/ai.schemas";
import { useChat } from "@ai-sdk/react";
import { useQueryClient } from "@tanstack/react-query";
import { DefaultChatTransport } from "ai";

export const useMyChat = (
  conversationId: string,
  initialMessages?: MyUIMessage[]
) => {
  const { isCreating, setIsCreated } = useIsCreatingNewConversation();
  const queryClient = useQueryClient();

  return useChat({
    messages: initialMessages,
    transport: new DefaultChatTransport({
      api: "/api/conversations",
      prepareSendMessagesRequest: ({ messages }) => {
        return {
          body: {
            message: messages[messages.length - 1],
            modelProvider: "gemini",
            conversationId,
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
  });
};
