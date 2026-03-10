import { useNavigate, useParams } from "react-router"
import ChatWindow from "@/components/chat-window"
import { useTyping } from "@/features/messaging/typing-context"
import { useConversationScreen } from "@/features/messaging/hooks/use-conversation-screen"

export default function ContactPreview() {
  const { contactId } = useParams<{ contactId: string }>()
  const navigate = useNavigate()
  const { getTypingUsers } = useTyping()
  const screen = useConversationScreen({
    mode: "contact",
    contactId: Number(contactId),
  })
  const typingUsers = screen.chatId ? getTypingUsers(screen.chatId) : []

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
      onBack={() => navigate("/contacts")}
      onInputChange={screen.onInputChange}
      onSend={screen.onSend}
    />
  )
}