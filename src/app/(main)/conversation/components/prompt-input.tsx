"use client";

import { Button } from "@/components/ui/button";
import { ChevronDown, Plus, Send } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface PromptInputProps {
  className?: string;
  placeholder?: string;
  disabled?: boolean;
  maxHeight?: number;
}

export function PromptInput({
  className = "",
  placeholder = "메시지를 입력하세요...",
  disabled = false,
  maxHeight = 200,
}: PromptInputProps) {
  const [value, setValue] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

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
      className={`flex flex-col border rounded-lg bg-background shadow-sm ${className}`}
    >
      {/* Textarea Section */}
      <div className="flex-1 p-3">
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => setValue(e.target.value)}
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
            variant="outline"
            size="sm"
            disabled={disabled}
            className="gap-1"
          >
            <span className="text-xs">GPT-4</span>
            <ChevronDown className="size-3" />
          </Button>

          {/* Send Button */}
          <Button
            variant="default"
            size="icon-sm"
            disabled={disabled || !value.trim()}
            className="shrink-0"
          >
            <Send className="size-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
