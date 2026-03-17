import ChatWindow from "@/features/messaging/components/chat/chat-window"
import useChatScreen from "@/hooks/use-chat-screen";

export default function ChatPreview({ onBack }: { onBack: () => void }) {
  const screen = useChatScreen();

  return (
    <ChatWindow
      participants={screen.participants}
      title={screen.title}
      messages={screen.messages}
      typingLabel={screen.typingLabel || undefined}
      chatId={screen.chatId}
      isFetching={screen.isFetching}
      isSending={screen.isSending}
      onBack={onBack}
      onSend={screen.handleSend}
      onInputFocus={screen.handleInputFocus}
      asGroup={screen.chatType === "group"}
    />
  )
}