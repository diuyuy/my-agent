"use client";

import { Check, Copy } from "lucide-react";
import mermaid from "mermaid";
import { useEffect, useRef, useState } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import { Button } from "./ui/button";

interface CodeBlockProps {
  language?: string;
  children: string;
  inline?: boolean;
}

// Initialize mermaid
mermaid.initialize({
  startOnLoad: true,
  theme: "dark",
  securityLevel: "loose",
});

export function CodeBlock({ language, children, inline }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);
  const [mermaidSvg, setMermaidSvg] = useState<string>("");
  const mermaidRef = useRef<HTMLDivElement>(null);

  // Handle mermaid diagram rendering
  useEffect(() => {
    if (language === "mermaid" && children && !inline) {
      const renderMermaid = async () => {
        try {
          const id = `mermaid-${Math.random().toString(36).substr(2, 9)}`;
          const { svg } = await mermaid.render(id, children);
          setMermaidSvg(svg);
        } catch (error) {
          console.error("Mermaid rendering error:", error);
        }
      };
      renderMermaid();
    }
  }, [language, children, inline]);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(children);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Render mermaid diagram
  if (language === "mermaid" && !inline && mermaidSvg) {
    return (
      <div className="relative my-4 overflow-auto rounded-lg border bg-muted p-4">
        <div
          ref={mermaidRef}
          dangerouslySetInnerHTML={{ __html: mermaidSvg }}
          className="flex justify-center"
        />
      </div>
    );
  }

  // Render inline code
  if (inline) {
    return (
      <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-sm">
        {children}
      </code>
    );
  }

  // Render code block with syntax highlighting
  return (
    <div className="group relative my-4">
      <div className="flex items-center justify-between rounded-t-lg bg-muted px-4 py-2">
        <span className="text-xs font-medium text-muted-foreground">
          {language || "text"}
        </span>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleCopy}
          className="h-6 w-6 p-0 opacity-0 transition-opacity group-hover:opacity-100"
        >
          {copied ? (
            <Check className="h-3 w-3" />
          ) : (
            <Copy className="h-3 w-3" />
          )}
          <span className="sr-only">Copy code</span>
        </Button>
      </div>
      <SyntaxHighlighter
        language={language || "text"}
        style={vscDarkPlus}
        customStyle={{
          margin: 0,
          borderTopLeftRadius: 0,
          borderTopRightRadius: 0,
          borderBottomLeftRadius: "0.5rem",
          borderBottomRightRadius: "0.5rem",
          overflow: "auto",
        }}
        codeTagProps={{
          className: "text-sm",
        }}
      >
        {children}
      </SyntaxHighlighter>
    </div>
  );
}
