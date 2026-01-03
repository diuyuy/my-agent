import { findAllMessages } from "@/server/features/messages/message.service";
import ChatWindow from "../components/chat-window";

type Props = {
  params: Promise<{ conversationId: string }>;
};

export default async function ConversationPage({ params }: Props) {
  const { conversationId } = await params;
  console.log("🚀 ~ ChatPage ~ conversationId:", conversationId);
  const initialMessages = await findAllMessages(conversationId, {
    limit: 20,
    cursor: undefined,
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
