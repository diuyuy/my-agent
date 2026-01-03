"use client";

import { Button } from "@/components/ui/button";
import { ChevronDown, Plus, Send, SquareIcon } from "lucide-react";
import { useEffect, useRef } from "react";

interface PromptInputProps {
  value: string;
  setValue: (value: string) => void;
  stop: () => void;
  isSending: boolean;
  className?: string;
  placeholder?: string;
  disabled?: boolean;
  maxHeight?: number;
}

export function PromptInput({
  value,
  setValue,
  isSending,
  className = "",
  placeholder = "메시지를 입력하세요...",
  disabled = false,
  maxHeight = 200,
}: PromptInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      // form의 submit 이벤트를 트리거
      const form = e.currentTarget.form;
      if (form && value.trim()) {
        form.requestSubmit();
      }
    }
  };

  // Auto-sizing textarea logic
  useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    // Reset height to auto to get the correct scrollHeight
    textarea.style.height = "auto";

    // Calculate new height
    const newHeight = Math.min(textarea.scrollHeight, maxHeight);
    textarea.style.height = `${newHeight}px`;
  }, [value, maxHeight]);

  return (
    <div
      className={`mx-4 mb-8 mt-4 flex flex-col border rounded-lg bg-background shadow-sm max-w-3xl mx-auto${className}`}
    >
      {/* Textarea Section */}
      <div className="flex-1 p-3">
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled}
          className="w-full resize-none border-none outline-none bg-transparent text-sm placeholder:text-muted-foreground disabled:opacity-50 disabled:cursor-not-allowed"
          style={{
            minHeight: "24px",
            maxHeight: `${maxHeight}px`,
            overflowY: "auto",
          }}
          rows={1}
        />
      </div>

      {/* Button Section */}
      <div className="flex items-center justify-between gap-2 px-3 pb-3 pt-0">
        {/* Left: Plus button */}
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          disabled={disabled}
          className="shrink-0"
        >
          <Plus className="size-4" />
        </Button>

        {/* Center & Right: Model selector and Send button */}
        <div className="flex items-center gap-2">
          {/* Model Selector Button */}
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={disabled}
            className="gap-1"
          >
            <span className="text-xs">GPT-4</span>
            <ChevronDown className="size-3" />
          </Button>

          {/* Send Button */}
          {isSending ? (
            <Button type="button" onClick={stop}>
              <SquareIcon className="size-4" />
            </Button>
          ) : (
            <Button
              type="submit"
              variant="default"
              size="icon-sm"
              disabled={disabled || !value.trim()}
              className="shrink-0"
            >
              <Send className="size-4" />
            </Button>
          )}
          {/* <Button
            type="submit"
            variant="default"
            size="icon-sm"
            disabled={disabled || !value.trim()}
            className="shrink-0"
          >
            <Send className="size-4" />
          </Button> */}
        </div>
      </div>
    </div>
  );
}
