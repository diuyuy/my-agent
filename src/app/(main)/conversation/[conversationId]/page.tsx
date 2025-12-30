type Props = {
  params: Promise<{ conversationId: string }>;
};

export default async function ConversationPage({ params }: Props) {
  const { conversationId } = await params;
  console.log("🚀 ~ ChatPage ~ conversationId:", conversationId);

  return <div>Hello</div>;
}
