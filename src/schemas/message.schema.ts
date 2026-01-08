import { messageRoleEnum } from "@/db/schema/enums";
import z from "zod";

export const SendMessageSchema = z.object({
  message: z.unknown(),
  conversationId: z.uuid().nonempty(),
  modelProvider: z.string().nonempty(),
  isRag: z.boolean().optional(),
});

export type SendMessageDto = z.infer<typeof SendMessageSchema>;

export const MessageSchema = z.object({
  id: z.string(),
  role: z.enum(messageRoleEnum.enumValues),
  metadata: z.object({
    modelProvider: z.string(),
    conversationId: z.uuid(),
  }),
  parts: z.unknown(),
});

export const UserSendMessageSchema = SendMessageSchema;

export const MessageParamsSchema = z.object({
  messageId: z.string().nonempty(),
});

export const DeleteMessagesSchema = z.object({
  userMessageId: z.string().nonempty(),
  aiMessageId: z.string().nonempty(),
});

export type DeleteMessagesDto = z.infer<typeof DeleteMessagesSchema>;

export type CreateMessageDto = z.infer<typeof UserSendMessageSchema>;
export type UpdateConversationDto = z.infer<typeof SendMessageSchema>[];
