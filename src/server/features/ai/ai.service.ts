import { ClientMessage } from "@/types/types";
import { google } from "@ai-sdk/google";
import { openai } from "@ai-sdk/openai";
import { createIdGenerator, embedMany, streamText } from "ai";
import { MyUIMessage } from "./ai.schemas";

export const getModel = (modelProvider: string) => {
  console.log("🚀 ~ getModel ~ modelProvider:", modelProvider);
  return google("gemini-2.5-flash");
};

export const generateStreamText = async (messages: ClientMessage[]) => {
  return streamText({
    model: google("gemini-2.5-flash"),
    // prompt: "LLM에 대해서 500자 글자로 설명해줘.",
    messages: messages,
  });
};

export const generateTitle = (message: MyUIMessage) => {
  const messagePart = message.parts[0];
  switch (messagePart.type) {
    case "text":
      return messagePart.text.length > 20
        ? `${messagePart.text.substring(0, 20)}...`
        : messagePart.text;
    case "file":
      return `${
        messagePart.filename ? messagePart.filename : "파일"
      } 관련 질문`;
    default:
      return "알 수 없는 질문";
  }
};

// export const generateTitle = async (messages: MyUIMessage[]) => {
//   const { text } = await generateText({
//     model: google("gemini-2.5-flash"),
//     system: SYSTEM_PROMPTS.GENERATE_TITLE,
//     prompt: JSON.stringify(messages),
//   });

//   return text;
// };

export const myIdGenerator = createIdGenerator({
  prefix: "msg",
  size: 16,
});

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
