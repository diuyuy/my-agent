"use client";

import { MyUIMessage } from "@/server/features/ai/ai.schemas";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

export default function TestPage() {
  const pathname = usePathname();
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { messages, sendMessage, error, setMessages } = useChat<MyUIMessage>({
    transport: new DefaultChatTransport({
      api: "/api/conversations",
      prepareSendMessagesRequest: ({ messages, id }) => {
        return {
          body: {
            message: messages[messages.length - 1],
            id,
            modelProvider: "gemini",
          },
        };
      },
    }),

    onFinish: ({ message }) => {
      const conversationId = message.metadata?.conversationId;
      console.log("🚀 ~ TestPage ~ conversationId:", conversationId);
      window.history.pushState(null, "", `tests/${conversationId}`);
    },
  });

  // 새 메시지가 추가되면 자동으로 스크롤
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (pathname === "/tests") {
      setMessages([]);
    }
  }, [pathname, setMessages]);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isLoading) return;

    setIsLoading(true);
    sendMessage({ text: inputValue });
    setIsLoading(false);
    setInputValue("");
  };

  return (
    <div className="flex flex-col h-screen max-w-3xl mx-auto p-4">
      {/* Header */}
      <div className="mb-4">
        <h1 className="text-3xl font-bold">AI Chat Test</h1>
        <p className="text-gray-600 text-sm mt-1">
          Vercel AI SDK - Stream Response Test
        </p>
      </div>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto mb-4 space-y-3 border rounded-lg p-4 bg-linear-to-b from-gray-50 to-white">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-400 text-center">
              메시지를 입력하고 AI의 스트리밍 응답을 확인해보세요
            </p>
          </div>
        ) : (
          <>
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[75%] px-4 py-3 rounded-2xl ${
                    message.role === "user"
                      ? "bg-blue-500 text-white"
                      : "bg-white border border-gray-200 shadow-sm"
                  }`}
                >
                  <div className="text-xs font-semibold mb-1 opacity-70">
                    {message.role === "user" ? "You" : "AI"}
                  </div>
                  <div className="whitespace-pre-wrap text-sm leading-relaxed">
                    {message.parts.map((part, index) =>
                      part.type === "text" ? (
                        <span key={index}>{part.text}</span>
                      ) : null
                    )}
                  </div>
                </div>
              </div>
            ))}

            {/* Loading Indicator */}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 px-4 py-3 rounded-2xl">
                  <div className="flex items-center gap-2 text-gray-500 text-sm">
                    <div className="flex gap-1">
                      <span
                        className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                        style={{ animationDelay: "0ms" }}
                      ></span>
                      <span
                        className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                        style={{ animationDelay: "150ms" }}
                      ></span>
                      <span
                        className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                        style={{ animationDelay: "300ms" }}
                      ></span>
                    </div>
                    <span>AI is thinking...</span>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-3 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600 text-sm">
            <span className="font-semibold">Error:</span> {error.message}
          </p>
        </div>
      )}

      {/* Input Form */}
      <form onSubmit={onSubmit} className="flex gap-2">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="메시지를 입력하세요..."
          className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          disabled={isLoading}
        />
        <button
          type="submit"
          disabled={isLoading || !inputValue.trim()}
          className="px-6 py-3 bg-blue-500 text-white rounded-xl font-medium hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
        >
          {isLoading ? "전송 중..." : "전송"}
        </button>
      </form>
    </div>
  );
}
