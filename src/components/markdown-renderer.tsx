"use client";

import Image from "next/image";
import ReactMarkdown, { Components } from "react-markdown";
import rehypeKatex from "rehype-katex";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import { CodeBlock } from "./code-block";

interface MarkdownRendererProps {
  children: string;
  className?: string;
}

export function MarkdownRenderer({
  children,
  className = "",
}: MarkdownRendererProps) {
  const components: Components = {
    // Code blocks and inline code
    code({ className, children, ...props }) {
      const match = /language-(\w+)/.exec(className || "");
      const language = match ? match[1] : undefined;
      const codeContent = String(children).replace(/\n$/, "");

      if (match) {
        return (
          <CodeBlock language={language} inline={false}>
            {codeContent}
          </CodeBlock>
        );
      }

      // 3. match가 없으면 -> 인라인 코드 (일반 code 태그 사용)
      return (
        <code
          className="bg-muted text-muted-foreground rounded-md px-1.5 py-0.5 font-mono text-sm"
          {...props}
        >
          {children}
        </code>
      );
    },

    // Headings
    h1: ({ children }) => (
      <h1 className="mb-4 mt-6 text-3xl font-bold">{children}</h1>
    ),
    h2: ({ children }) => (
      <h2 className="mb-3 mt-5 text-2xl font-bold">{children}</h2>
    ),
    h3: ({ children }) => (
      <h3 className="mb-2 mt-4 text-xl font-bold">{children}</h3>
    ),
    h4: ({ children }) => (
      <h4 className="mb-2 mt-3 text-lg font-semibold">{children}</h4>
    ),
    h5: ({ children }) => (
      <h5 className="mb-1 mt-2 text-base font-semibold">{children}</h5>
    ),
    h6: ({ children }) => (
      <h6 className="mb-1 mt-2 text-sm font-semibold">{children}</h6>
    ),

    // Paragraphs
    p: ({ children }) => <div className="mb-4 leading-7">{children}</div>,

    // Lists
    ul: ({ children }) => (
      <ul className="mb-4 ml-6 list-disc space-y-2">{children}</ul>
    ),
    ol: ({ children }) => (
      <ol className="mb-4 ml-6 list-decimal space-y-2">{children}</ol>
    ),
    li: ({ children }) => <li className="leading-7">{children}</li>,

    // Links
    a: ({ href, children }) => (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="text-primary underline underline-offset-4 hover:text-primary/80"
      >
        {children}
      </a>
    ),

    // Blockquotes
    blockquote: ({ children }) => (
      <blockquote className="my-4 border-l-4 border-primary/50 pl-4 italic text-muted-foreground">
        {children}
      </blockquote>
    ),

    // Horizontal rule
    hr: () => <hr className="my-6 border-t border-border" />,

    // Tables
    table: ({ children }) => (
      <div className="my-4 overflow-auto">
        <table className="w-full border-collapse">{children}</table>
      </div>
    ),
    thead: ({ children }) => (
      <thead className="border-b bg-muted">{children}</thead>
    ),
    tbody: ({ children }) => <tbody className="divide-y">{children}</tbody>,
    tr: ({ children }) => <tr className="border-b">{children}</tr>,
    th: ({ children }) => (
      <th className="px-4 py-2 text-left font-semibold">{children}</th>
    ),
    td: ({ children }) => <td className="px-4 py-2">{children}</td>,

    // Strong and emphasis
    strong: ({ children }) => <strong className="font-bold">{children}</strong>,
    em: ({ children }) => <em className="italic">{children}</em>,

    // Images
    img: ({ src, alt }: { src?: string | Blob; alt?: string }) => {
      if (!src) {
        return null; // src가 undefined 또는 falsy일 경우 렌더링 skip
      }
      const srcString =
        typeof src === "string" ? src : URL.createObjectURL(src); // Blob 처리 (필요 시)
      return (
        <Image
          src={srcString}
          alt={alt ?? "image"} // alt가 undefined일 경우 기본값
          className="my-4 max-w-full rounded-lg"
          loading="lazy"
        />
      );
    },

    // Task lists (GFM)
    input: ({ type, checked, disabled }) => {
      if (type === "checkbox") {
        return (
          <input
            type="checkbox"
            checked={checked}
            disabled={disabled}
            className="mr-2"
          />
        );
      }
      return <input type={type} />;
    },

    // Strikethrough (GFM)
    del: ({ children }) => (
      <del className="text-muted-foreground line-through">{children}</del>
    ),
  };

  return (
    <div
      className={`prose prose-neutral dark:prose-invert w-72 md:w-3xl px-3 ${className}`}
    >
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkMath]}
        rehypePlugins={[rehypeKatex]}
        components={components}
      >
        {children}
      </ReactMarkdown>
    </div>
  );
}
