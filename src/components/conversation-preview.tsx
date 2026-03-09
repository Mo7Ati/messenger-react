import { useNavigate } from "react-router"
import ChatWindow from "@/components/chat-window"
import { useTyping } from "@/contexts/typing-context"
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
  const { getTypingUsers } = useTyping()
  const screen = useConversationScreen({
    mode: "chat",
    chatId: conversationId,
  })
  const typingUsers = getTypingUsers(conversationId)

  return (
    <ChatWindow
      participants={screen.participants}
      title={screen.title}
      isGroupChat={screen.isGroupChat}
      messages={screen.messages}
      input={screen.input}
      isLoading={screen.isLoading}
      isSending={screen.isSending}
      typingUsers={typingUsers}
      onBack={() => navigate(backPath)}
      onInputChange={screen.onInputChange}
      onSend={screen.onSend}
    />
  )
}
