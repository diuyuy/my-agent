import z from "zod";

export const MessageSchema = z.object({
  message: z.unknown(),
  conversationId: z.uuid().nonempty().optional(),
  modelProvider: z.string().nonempty(),
});

export type SendMessageDto = z.infer<typeof MessageSchema>;

export const UserMessageSchema = MessageSchema;

export type CreateMessageDto = z.infer<typeof UserMessageSchema>;
export type UpdateConversationDto = z.infer<typeof MessageSchema>[];
