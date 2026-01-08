import { tavilySearch } from "@/server/common/utils/tavily-search";
import { tool, TypedToolCall, TypedToolResult } from "ai";
import z from "zod";
import { findRelevantContent } from "../rags/rag.service";

export const toolSet = {
  tavilySearch: tool({
    description: "Get the web search result by tavily search API",
    inputSchema: z.object({
      query: z.string(),
    }),
    execute: async ({ query }, { abortSignal }) => {
      const response = await tavilySearch(query, abortSignal);

      return response.results.map((result) => result.content).join("\n\n");
    },
  }),
  ragSearch: tool({
    description:
      "This is a tool that retrieves vectorized documents saved by the user. When a string-formatted content is input, it returns the associated context.",
    inputSchema: z.object({
      content: z.string().describe("the users question"),
    }),
    execute: async ({ content }) => findRelevantContent(content),
  }),
};

export type MyToolCall = TypedToolCall<typeof toolSet>;
export type MyToolResult = TypedToolResult<typeof toolSet>;
