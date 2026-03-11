import { useNavigate, useParams } from "react-router"
import ChatWindow from "@/components/shared/chat-window"
import { useTyping } from "@/features/messaging/typing-context"
import { useConversationScreen } from "@/features/messaging/hooks/use-conversation-screen"

export default function ContactPreview() {
  const { contactId } = useParams<{ contactId: string }>()
  const navigate = useNavigate()
  const { getTypingLabel } = useTyping()
  const screen = useConversationScreen({
    mode: "contact",
    contactId: Number(contactId),
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
      onBack={() => navigate("/contacts")}
      onInputChange={screen.onInputChange}
      onSend={screen.onSend}
    />
  )
}