import ChatWindow from "@/features/messaging/components/chat/chat-window";
import useContactScreen from "../hooks/use-contact-screen";

export default function ContactPreview() {
  const screen = useContactScreen();

  return (
    <ChatWindow
      participants={screen.participants}
      title={screen.title}
      messages={screen.messages}
      typingLabel={screen.typingLabel || undefined}
      chatId={screen.chatId}
      isFetching={screen.isFetching}
      isSending={screen.isSending}
      onBack={screen.onBack}
      onSend={screen.handleSend}
    />
  )
}