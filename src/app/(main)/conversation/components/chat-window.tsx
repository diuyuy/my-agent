"use client";

import { MarkdownRenderer } from "@/components/markdown-renderer";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { useIsCreatingNewConversation } from "@/hooks/use-is-creating-new-conversation";
import { MyUIMessage } from "@/server/features/ai/ai.schemas";
import { Copy, RefreshCw } from "lucide-react";
import { FormEvent, useEffect, useState } from "react";
import { toast } from "sonner";
import { useMyChat } from "../hooks/use-my-chat";
import { PromptInput } from "./prompt-input";

type Props = {
  conversationId: string;
  initialMessages?: MyUIMessage[];
};
export default function ChatWindow({ conversationId, initialMessages }: Props) {
  const { consumeMessage } = useIsCreatingNewConversation();
  const [input, setInput] = useState("");
  const { messages, sendMessage, status } = useMyChat(
    conversationId,
    initialMessages
  );

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (input.trim()) {
      sendMessage({ text: input.trim() });
      setInput("");
    }
  };

  const handleRetry = (messageId: string) => {
    console.log("재시도 버튼 클릭됨. 메시지 ID:", messageId);
  };

  const handleCopy = async (text: string) => {
    try {
      await window.navigator.clipboard.writeText(text);
      toast.success("클립보드에 복사되었습니다.", {
        duration: 1000,
      });
    } catch {
      toast.error("복사에 실패했습니다.");
    }
  };

  useEffect(() => {
    const msg = consumeMessage();
    if (msg) {
      sendMessage({ text: msg });
    }
  }, [consumeMessage, sendMessage]);

  return (
    <div className="w-full mx-auto h-screen px-2 flex flex-col">
      <div className="flex-1 w-72 md:w-3xl mx-auto overflow-y-auto no-scrollbar p-6 space-y-8">
        {messages.map((message, index) => {
          // 3. 현재 메시지가 마지막인지 확인
          const isLastMessage = index === messages.length - 1;
          // 4. 로딩 상태 조건 정의 (마지막 메시지이고, 상태가 ready가 아닐 때)
          const isAiLoading =
            message.role !== "user" && isLastMessage && status !== "ready";

          return (
            <div key={message.id}>
              {message.role === "user" ? (
                <div className="flex justify-end">
                  <div className="max-w-md py-3 px-4 bg-card rounded-md">
                    {message.parts
                      .map((part) => (part.type === "text" ? part.text : ""))
                      .join("")}
                  </div>
                </div>
              ) : (
                <>
                  <div>
                    <MarkdownRenderer>
                      {message.parts
                        .map((part) => (part.type === "text" ? part.text : ""))
                        .join("")}
                    </MarkdownRenderer>

                    {/* 5. 로딩 중일 때 스피너 표시 */}
                    {isAiLoading && (
                      <div className="mt-2 flex items-center gap-2 text-muted-foreground">
                        <Spinner />
                        <span className="text-xs">답변 생성 중...</span>
                      </div>
                    )}

                    {/* 6. 완료되었을 때만 버튼 표시 (기존 로직 유지) */}
                    {!isAiLoading && status === "ready" && (
                      <div className="flex gap-1 mt-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRetry(message.id)}
                          className="h-8 px-2"
                        >
                          <RefreshCw className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            handleCopy(
                              message.parts
                                .map((part) =>
                                  part.type === "text" ? part.text : ""
                                )
                                .join("")
                            )
                          }
                          className="h-8 px-2"
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>
      <form onSubmit={handleSubmit}>
        <PromptInput value={input} setValue={setInput} />
      </form>
    </div>
  );
}
