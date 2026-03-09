import { useNavigate } from "react-router"
import ChatWindow from "@/components/chat-window"
import { useConversationScreen } from "@/hooks/use-conversation-screen"

type ConversationPreviewProps = {
  conversationId: number
  backPath: string
}

export function ConversationPreview({
  conversationId,
  backPath,
}: ConversationPreviewProps) {
  const navigate = useNavigate()
  const screen = useConversationScreen({
    mode: "chat",
    chatId: conversationId,
  })

  return (
    <ChatWindow
      participants={screen.participants}
      title={screen.title}
      messages={screen.messages}
      input={screen.input}
      isLoading={screen.isLoading}
      isSending={screen.isSending}
      onBack={() => navigate(backPath)}
      onInputChange={screen.onInputChange}
      onSend={screen.onSend}
    />
  )
}
