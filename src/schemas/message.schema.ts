import { messageRoleEnum } from "@/db/schema/enums";
import z from "zod";

export const SendMessageSchema = z.object({
  message: z.unknown(),
  conversationId: z.uuid().nonempty(),
  modelProvider: z.string().nonempty(),
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

export type CreateMessageDto = z.infer<typeof UserSendMessageSchema>;
export type UpdateConversationDto = z.infer<typeof SendMessageSchema>[];
