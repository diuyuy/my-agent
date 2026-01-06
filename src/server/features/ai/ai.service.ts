import { DocsLanguage } from "@/types/types";
import { google } from "@ai-sdk/google";
import { openai } from "@ai-sdk/openai";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import {
  convertToModelMessages,
  createIdGenerator,
  embedMany,
  smoothStream,
  streamText,
} from "ai";
import { MyUIMessage } from "./ai.schemas";

const getModel = (modelProvider: string) => {
  console.log("🚀 ~ getModel ~ modelProvider:", modelProvider);
  return google("gemini-2.0-flash");
};

export const generateUIMessageStreamResponse = async ({
  conversationId,
  messages,
  modelProvider,
  onFinish,
}: {
  conversationId: string;
  messages: MyUIMessage[];
  modelProvider: string;
  onFinish: (response: { messages: MyUIMessage[] }) => void;
}) => {
  return streamText({
    model: getModel(modelProvider),
    // prompt: "LLM에 대해서 500자 글자로 설명해줘.",
    messages: await convertToModelMessages(messages),
    experimental_transform: smoothStream(),
  }).toUIMessageStreamResponse({
    originalMessages: messages,
    generateMessageId: myIdGenerator,
    messageMetadata: () => ({
      modelProvider,
      conversationId,
    }),
    onFinish,
  });
};

export const generateTitle = (message: string) => {
  return message.length > 20 ? `${message.substring(0, 20)}...` : message;
  // const messagePart = message.parts[0];
  // switch (messagePart.type) {
  //   case "text":
  //     return messagePart.text.length > 20
  //       ? `${messagePart.text.substring(0, 20)}...`
  //       : messagePart.text;
  //   case "file":
  //     return `${
  //       messagePart.filename ? messagePart.filename : "파일"
  //     } 관련 질문`;
  //   default:
  //     return "알 수 없는 질문";
  // }
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
  const chunks = await generateChunks(value);

  const { embeddings, responses } = await embedMany({
    model: openai.embeddingModel("text-embedding-3-small"),
    values: chunks,
  });

  console.log(
    "🚀 ~ generateEmbeddings ~ responses:",
    JSON.stringify(responses, null, 2)
  );

  return embeddings.map((e, i) => ({ content: chunks[i], embedding: e }));
};

const generateChunks = async (value: string, docsLanguage?: DocsLanguage) => {
  if (docsLanguage) {
    const splitter = RecursiveCharacterTextSplitter.fromLanguage(docsLanguage);

    return splitter.splitText(value);
  }

  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 800,
    chunkOverlap: 80,
    separators: [
      "\n\n",
      "\n",
      " ",
      ".",
      ",",
      "\u200b", // Zero-width space
      "\uff0c", // Fullwidth comma
      "\u3001", // Ideographic comma
      "\uff0e", // Fullwidth full stop
      "\u3002", // Ideographic stop
      "",
    ],
  });
  return splitter.splitText(value);
};
