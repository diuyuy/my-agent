"use client";

import { MarkdownRenderer } from "@/components/markdown-renderer";

export const testMarkdown = `
# Heading 1
## Heading 2
### Heading 3
#### Heading 4
##### Heading 5
###### Heading 6

## Paragraphs and Text Formatting

This is a normal paragraph with **bold text**, *italic text*, and ***bold italic text***.

You can also use ~~strikethrough~~ text (GFM).

## Code Blocks

Inline code: \`const greeting = "Hello World"\`

### JavaScript Code Block
\`\`\`javascript
function fibonacci(n) {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}

console.log(fibonacci(10));
\`\`\`

### TypeScript Code Block
\`\`\`typescript
interface User {
  id: number;
  name: string;
  email: string;
}

const user: User = {
  id: 1,
  name: "John Doe",
  email: "john@example.com"
};
\`\`\`

### Python Code Block
\`\`\`python
def quicksort(arr):
    if len(arr) <= 1:
        return arr
    pivot = arr[len(arr) // 2]
    left = [x for x in arr if x < pivot]
    middle = [x for x in arr if x == pivot]
    right = [x for x in arr if x > pivot]
    return quicksort(left) + middle + quicksort(right)
\`\`\`

## Lists

### Unordered List
- First item
- Second item
  - Nested item 1
  - Nested item 2
- Third item

### Ordered List
1. First step
2. Second step
3. Third step
   1. Sub-step A
   2. Sub-step B

### Task List (GFM)
- [x] Completed task
- [x] Another completed task
- [ ] Incomplete task
- [ ] Another incomplete task

## Links

[Visit Google](https://www.google.com)

[Visit GitHub](https://github.com)

## Blockquote

> This is a blockquote.
>
> It can span multiple lines and paragraphs.
>
> > Nested blockquotes are also possible.

## Horizontal Rule

---

## Tables (GFM)

| Feature | Supported | Notes |
|---------|-----------|-------|
| Code blocks | ✅ | Multiple languages |
| Tables | ✅ | GitHub Flavored Markdown |
| Math | ✅ | KaTeX rendering |
| Task lists | ✅ | Interactive checkboxes |
| Images | ✅ | Next.js Image component |



## Combined Example

Here's a **complex example** combining *multiple features*:

1. First, install the package: \`npm install react-markdown\`
2. Then, import it:
   \`\`\`typescript
   import ReactMarkdown from 'react-markdown';
   \`\`\`
3. Use it in your component ✨

> **Note**: Don't forget to add the necessary plugins!

| Plugin | Purpose |
|--------|---------|
| remark-gfm | GitHub Flavored Markdown |
| remark-math | Math notation |
| rehype-katex | KaTeX rendering |

---

**Test completed!** 🎉
`;

export default function RenderTest() {
  return (
    <div className="container mx-auto max-w-4xl p-8">
      <div className="mb-8">
        <h1 className="mb-2 text-4xl font-bold">Markdown Renderer Test</h1>
        <p className="text-muted-foreground">
          Testing all features of the MarkdownRenderer component
        </p>
      </div>
      <div className="rounded-lg border bg-card p-6">
        <MarkdownRenderer>{testMarkdown}</MarkdownRenderer>
      </div>
    </div>
  );
}
