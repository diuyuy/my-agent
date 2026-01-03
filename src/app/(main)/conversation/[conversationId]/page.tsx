import { findAllMessages } from "@/server/features/messages/message.service";
import ChatWindow from "../components/chat-window";

type Props = {
  params: Promise<{ conversationId: string }>;
};

export default async function ConversationPage({ params }: Props) {
  const { conversationId } = await params;
  const initialMessages = await findAllMessages(conversationId, {
    limit: 20,
    cursor: undefined,
    direction: "desc",
  });

  return (
    <div className="w-full min-h-screen">
      <ChatWindow
        conversationId={conversationId}
        initialMessages={initialMessages.items}
      />
    </div>
  );
}
