import { UIMessage } from "ai";
import z from "zod";

export const metadataSchema = z.object({
  conversationId: z.uuid().optional(),
  modelProvider: z.string().nonempty(),
});

export type MyMetadataPart = z.infer<typeof metadataSchema>;

export type MyUIMessage = UIMessage<MyMetadataPart>;
