import { ClientMessage } from "@/types/types";
import { google } from "@ai-sdk/google";
import { openai } from "@ai-sdk/openai";
import { embedMany, streamText } from "ai";

export const generateStreamText = async (messages: ClientMessage[]) => {
  return streamText({
    model: google("gemini-2.5-flash"),
    // prompt: "LLM에 대해서 500자 글자로 설명해줘.",
    messages: messages,
  });
};

export const generateEmbeddings = async (value: string) => {
  const chunks = generateChunks(value);

  const { embeddings } = await embedMany({
    model: openai.embeddingModel("text-embedding-3-small"),
    values: chunks,
  });

  return embeddings.map((e, i) => ({ content: chunks[i], embedding: e }));
};

export const generateChunks = (value: string) => {
  return value.split(".");
};
