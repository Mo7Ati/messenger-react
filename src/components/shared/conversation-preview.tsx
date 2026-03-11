import { useNavigate } from "react-router"
import { useTyping } from "@/features/messaging/typing-context"
import { useConversationScreen } from "@/features/messaging/hooks/use-conversation-screen"
import ChatWindow from "./chat-window"

type ConversationPreviewProps = {
  conversationId: number
  backPath: string
}

export function ConversationPreview({
  conversationId,
  backPath,
}: ConversationPreviewProps) {
  const navigate = useNavigate()
  const { getTypingLabel } = useTyping()

  const screen = useConversationScreen({
    mode: "chat",
    chatId: conversationId,
  })

  const typingLabel = screen.chatId ? getTypingLabel(screen.chatId, screen.isGroupChat ? "group" : "peer") : ""

  return (
    <ChatWindow
      participants={screen.participants}
      title={screen.title}
      isGroupChat={screen.isGroupChat}
      messages={screen.messages}
      input={screen.input}
      isLoading={screen.isLoading}
      isSending={screen.isSending}
      typingLabel={typingLabel}
      onBack={() => navigate(backPath)}
      onInputChange={screen.onInputChange}
      onSend={screen.onSend}
    />
  )
}
