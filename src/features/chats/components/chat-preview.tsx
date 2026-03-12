import ChatWindow from "@/features/messaging/components/chat/chat-window"
import useChatScreen from "../hooks/use-chat-screen";

export default function ChatPreview() {
  const screen = useChatScreen();

  return (
    <ChatWindow
      participants={screen.participants}
      title={screen.title}
      messages={screen.messages}
      isPending={screen.isPending}
      isSending={screen.isSending}
      onBack={screen.onBack}
      onSend={screen.handleSend}
    />
  )
}